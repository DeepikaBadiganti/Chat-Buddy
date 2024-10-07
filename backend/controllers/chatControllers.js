const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const accessChat = asyncHandler(async (req,res) => {
    // console.log("access chat called");
    const {userId} = req.body;
    if(!userId){
        res.status(400);
        res.json({message:'User ID is required'});
    }
    
    var isChat = await Chat.find({
        isGroupChat: false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ],
    }).populate('users',"-password")
    .populate('latestMessage'); 

    isChat = await User.populate(isChat, {path: "latestMessage.sender", select: "name pic email"});

    if(isChat.length > 0){
        res.send(isChat[0]);
    }else{
        var chatData ={
            chatName : "sender",
            isGroupChat : false,
            users : [req.user._id,userId],
        };
        try{
            const createChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id:createChat._id}).populate('users',"-password");
            res.status(200).send(FullChat);
        }
        catch(error){
            res.status(400);
            res.json({message:error.message});  
    }
}});

const getChats = asyncHandler(async (req,res) => {
//    console.log("get chatts called
    try{
        Chat.find({users:{$elemMatch : {$eq:req.user._id}}})
        .populate('users',"-password")
        .populate('groupAdmin',"-password")
        .populate('latestMessage')
        .sort({updatedAt:-1})
        .then(async (chats)=>{
            chats = await User.populate(chats, {path: "latestMessage.sender", select: "name profilePic email"});
            res.status(200).send(chats);
        });
        
    }
    catch(error){
        res.status(400);
        res.json({message:"Error: "+error.message});
    }
})

const createGroupChat = asyncHandler(async (req,res) => {
    if(!req.body.users || !req.body.name){
        res.status(400);
        res.json({message:"PLease Fill all the fields"});
    }

    var users = JSON.parse(req.body.users);
    if(users.length < 2){
        res.status(400);
        res.json({message:"Please add atleast 2 users"});
    }

    users.push(req.user._id);

    try{
        const groupChat = await Chat.create({
            chatName : req.body.name,
            isGroupChat : true,
            users : users,
            groupAdmin : req.user._id
        });
        
        const FullChat = await Chat.findOne({_id:groupChat._id})
        .populate('users',"-password")
        .populate('groupAdmin',"-password");

        res.status(200).send(FullChat);
    }
    catch(error){
        res.status(400);
        res.json({message:"Error: "+error.message});
    }
})

const renameGroup =  asyncHandler(async(req,res) => {
    const {chatId, chatName} = req.body;
    if(!chatId || !chatName){
        res.status(400);
        res.json({message:"Please fill all the fields"});
    }

    const updateChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName
        },
        {
            new: true
        },
    ).populate('users',"-password")
    .populate('groupAdmin',"-password");

    if(!updateChat){
        res.status(400);
        res.json({message:"Chat not found"});
    }else{
        res.json(updateChat);
    }

})

const addToGroup = asyncHandler(async(req,res) => {
    const {chatId, userId} = req.body;
    if(!chatId || !userId){
        res.status(400);
        res.json({message:"Please fill all the fields"});
    }

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: userId}
        },
        {
            new: true
        }
    )
    .populate('users',"-password")
    .populate('groupAdmin',"-password");

    if(!added){
        res.status(400);
        res.json({message:"Chat not found"});
    }else{
        res.json(added);
    }
})

const removeFromGroup = asyncHandler(async(req,res) => {
    const {chatId, userId} = req.body;
    if(!chatId || !userId){
        res.status(400);
        res.json({message:"Please fill all the fields"});
    }

   const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
        $pull: {users: userId}
    },
    {
        new: true
    }
   )
    .populate('users',"-password")
    .populate('groupAdmin',"-password");
    
    if(!removed){
        res.status(400);
        res.json({message:"Chat not found"});
    }    
    else{
        res.json(removed);
    }        
}
)

const deleteSingleChat = asyncHandler(async(req,res) => {
    const chatId = req.params.chatId;
    if(!chatId){
        res.status(400);
        res.json({message:"Chat ID is required"});
    }

    const deleted = await Chat.findByIdAndDelete(chatId);
    if(!deleted){
        res.status(400);
        res.json({message:"Chat not found"});
    }
    else{
        res.json({message:"Chat Deleted"});
    }
})

module.exports = {
  accessChat,
  getChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteSingleChat,
};