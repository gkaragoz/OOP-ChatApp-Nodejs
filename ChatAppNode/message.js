function Message(senderName, receiverName, text, messageType) {
    this.senderName = senderName;
    this.receiverName = receiverName;
    this.text = text;
    this.messageType = messageType;
}

module.exports = Message;