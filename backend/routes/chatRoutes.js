const express = require('express');
const {protect} = require('../middlewares/authMiddleware');
const {
  accessChat,
  getChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  deleteSingleChat,
} = require("../controllers/chatControllers");

const router = express.Router();


router.route('/').post(protect,accessChat);
router.route("/").get(protect,getChats);
router.route('/group').post(protect,createGroupChat);
router.route('/rename').put(protect,renameGroup);
router.route('/groupadd').put(protect,addToGroup);
router.route('/groupremove').put(protect,removeFromGroup);
router.route("/:chatId").delete(protect, deleteSingleChat);


module.exports = router;