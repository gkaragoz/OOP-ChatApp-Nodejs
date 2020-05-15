const User = require('./user');
const Log = require('./Log')

let logger = new Log("UserManager");

function UserManager() {
    this.users = [];

    this.addMessage = function(message) {
        var sender = this.getUserByName(message.senderName);

        if (sender == undefined) {
            logger.print(message.senderName + " named sender user not found.");
            return;
        }

        sender.addMessage(message);
    }

    this.addMessageBoth = function(message) {
        var sender = this.getUserByName(message.senderName);
        var receiver = this.getUserByName(message.receiverName);

        if (sender == undefined) {
            logger.print(message.senderName + " named sender user not found.");
            return;
        }
        if (receiver == undefined) {
            logger.print(message.receiverName + " named receiver user not found.");
            return;
        }

        sender.addMessage(message);
        receiver.addMessage(message);
    }

    this.addUser = function (id, name, rooms) {
        if (this.isUserExists(id)) {
            logger.print(name + " named user already exists in list.");
            return undefined;
        }

        let user;
        let newName = name;

        if (name === undefined) {
            newName = "guest(" + Math.floor(Math.random() * 25) + ")";
        }
        
        user = new User(id, newName, rooms);

        this.users.push(user);

        return user;
    }

    this.removeUser = function (id) {
        if (this.isUserExists(id) === false) {
            logger.print(id + " id user not exists in list.");
            return undefined;
        }

        let user = this.getUserById(id);

        index = this.users.indexOf(user);

        this.users.splice(index, 1);

        return user;
    }

    this.isUserExists = function(id) {
        return this.getUserById(id) === undefined ? false : true;
    }

    this.getUserById = function (id) {
        return this.users.find(user => user.id === id);
    }

    this.getUserByName = function(name) {
        return this.users.find(user => user.name === name);
    }

    this.getPrettyUserPrint = function (user) {
        return JSON.stringify(user, null, ' ');
    }

    this.setUsername = function(id, newName) {
        let user = this.getUserById(id);
        user.name = newName;

        return user;
    }

    this.tellUsersInfo = function () {
        this.users.forEach(user => {
            logger.print(JSON.stringify(user));
        });
    }

}

module.exports = UserManager;