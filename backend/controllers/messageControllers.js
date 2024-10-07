const asyncHandler = require('express-async-handler'); 
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');


const sendMessage = asyncHandler(async (req,res)=>{
    const {content, chatId} = req.body;
    if(!content || !chatId){
        console.log('Invalid data');
        return res.status(400);
    }


    var newMessage = {
        sender : req.user._id,
        content : content,
        chat : chatId,
    }
 
    try{
        var message = await Message.create(newMessage);

        message = await message.populate("sender","name profilePic");
        message = await message.populate("chat");
        message = await User.populate(message,{path : "chat.users",select: "name email profilePic"});
      
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage : message,
        })

        res.json(message)
        
    }
    catch(error)
    {
        res.status(400);
        throw new Error(error.message);
    }   

})

const getAllMessages = asyncHandler(async (req,res) => {
   
    try{
        const messages = await Message.find({chat:req.params.chatId})
        .populate("sender","name email profilePic")
        .populate("chat");

        res.json(messages)
    }
    catch(error){
        res.status(400)
        throw new Error(error.message);
    }

})

const deleteAllMessages = asyncHandler(async (req,res) => {
    try{
        await Message.deleteMany({chat:req.params.chatId});
        res.json({message:"Messages Deleted"});
    }
    catch(error){
        res.status(400);
        throw new Error(error.message);
    }    
})


module.exports = { sendMessage, getAllMessages, deleteAllMessages };