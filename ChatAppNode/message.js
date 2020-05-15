const { v4: uuidv4 } = require('uuid');

function Message(senderName, receiverName, text, messageType) {
    this.id = uuidv4();
    this.senderName = senderName;
    this.receiverName = receiverName;
    this.text = text;
    this.messageType = messageType;
    this.dateTime = Date.now().toLocaleString();
}

module.exports = Message;