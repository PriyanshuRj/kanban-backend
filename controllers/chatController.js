const Chat = require("../models/message");

async function findAllConversations(req, res) {
  try {
    const messages = await Chat.find({
      $or: [
        { sender: req.user._id },
        { reciepent: req.user._id }
      ]
    }).populate(['sender', 'reciepent']);
    var userCoversations = {};
    messages.forEach((message) => {
      if (message.sender._id.toString() === req.user._id.toString()) {
        if (!userCoversations[message.reciepent._id])
          userCoversations[message.reciepent._id] = { name: message.reciepent.name };

      }
      else {
        if (!userCoversations[message.sender._id])
          userCoversations[message.sender._id] = { name: message.sender.name };

      }
    })

    res.status(201).json({ conversations: userCoversations });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error in adding comment" });
  }

}

async function findConversations(req, res) {
  try {
    const { userId } = req.query;
    const userCoversations = await Chat.find({
      $or: [
        { sender: req.user._id, reciepent: userId },
        { sender: userId, reciepent: req.user._id }
      ]
    })
    res.status(201).json({ conversations: userCoversations });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error in adding comment" });
  }
}
module.exports = { findAllConversations, findConversations };