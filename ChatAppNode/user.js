const Message = require("./message");

function User(id, name) {
    this.id = id;
    this.name = name;
    this.messages = [];

    this.addMessage = function (data) {
        var message = new Message(data.senderName, data.receiverName, data.message);

        this.messages.push(message);
    }
}

module.exports = User;