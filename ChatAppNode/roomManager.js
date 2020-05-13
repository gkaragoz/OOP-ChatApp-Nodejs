const Room = require('./room');
const Log = require('./Log')

let logger = new Log("RoomManager");

function RoomManager() {
    this.rooms = [];

    this.addUser = function(socket, user, roomName) {
        socket.join(roomName, () => {
            if (this.isRoomExists(roomName)) {
                logger.print("target room has been found.");
                let targetRoom = getRoomByName(roomName);
                targetRoom.addUser(user);
            } else {
                logger.print(roomName + " named room not found");
                let targetRoom = new Room(roomName);
                logger.print(roomName + " named room is created succesfully");
                targetRoom.addUser(user);
                this.rooms.push(targetRoom);
            }
            logger.print(user.name + " has been joined to room " + roomName);
        });
    }

    this.removeUser = function(socket, user, roomName) {
    }

    this.addRoom = function(roomName) {
        let room = new Room(roomName);

        this.rooms.push(room);

        return room;
    }

    this.removeRoom = function(roomName) {

    }

    this.getRoomsCount = function() {
        return this.rooms.length;
    }

    this.getRoomByName = function(roomName) {
        return this.rooms.find(room => room.name === roomName);
    }

    this.isRoomExists = function(roomName) {
        let isExists = false;

        this.rooms.forEach(room => {
            room.name === roomName ? isExists = true : isExists = false;
        });

        return isExists;
    }

    this.isRoomEmpty = function(roomName) {
        if (this.isRoomExists(roomName) === false) {
            throw "Room does not exists";
        }

        let room = this.getRoomByName(roomName);
        return room.getIsEmpty();
    }

}

module.exports = RoomManager;