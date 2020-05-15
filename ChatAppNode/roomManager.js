const Room = require('./room');
const Log = require('./Log')

let logger = new Log("RoomManager");

function RoomManager() {
    this.rooms = [];

    this.addUser = function(socket, user, roomName, callback) {
        let targetRoom;
        if (this.isRoomExists(roomName) === false) {
            logger.print(roomName + " named room not found");

            targetRoom = this.addRoom(roomName);
            targetRoom.imageThumbnail = 'https://www.seekpng.com/png/detail/43-432878_select-template-instagram-story-circle-png.png';

            logger.print(roomName + " named room is created succesfully");
        } else {
            logger.print("target room has been found.");

            targetRoom = this.getRoomByName(roomName);
        }
            
        if (targetRoom.addUser(user)) {
            socket.join(roomName, () => {
                logger.print(user.name + " has been joined to room " + roomName);
                callback(true);
            });
        } else {
            logger.print(user.name + " could not joined to room " + roomName);
            callback(false);
        }

        this.tellRoomInfo(roomName);
    }

    this.removeUser = function(socket, user, roomName, callback) {
        if (this.isRoomExists(roomName) === false) {
            logger.print(roomName + " room not found!");
            callback(false);
            return;
        }
        
        let targetRoom = this.getRoomByName(roomName);
        if (targetRoom.removeUser(user)) {
            socket.leave(roomName, () => {
                logger.print(user.name + " successfully left from room " + roomName);
            });
            callback(true);
        } else {
            logger.print(user.name + " not in the room!");
            callback(false);
        }

        this.tellRoomInfo(roomName);
    }

    this.addRoom = function(roomName) {
        let room = new Room(roomName);

        this.rooms.push(room);

        return room;
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
            if (room.name === roomName) {
                isExists = true;
                return;
            }
        });

        return isExists;
    }

    this.isRoomEmpty = function(roomName) {
        if (this.isRoomExists(roomName) === false) {
            logger.print("Room does not exists");
            return;
        }

        let room = this.getRoomByName(roomName);
        return room.getIsEmpty();
    }

    this.tellRoomInfo = function(roomName) {
        if (this.isRoomExists(roomName) === false) {
            logger.print("Room does not exists");
            return;
        }

        this.rooms.forEach(room => {
            logger.print(JSON.stringify(room));
        });
    }

}

module.exports = RoomManager;