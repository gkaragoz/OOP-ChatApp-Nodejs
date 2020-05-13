const RoomManager = require('../roomManager');
const Room = require('../room');

var assert = require('assert');

describe('Array', function () {

    describe('#getRoomsCount()', function () {
        it('checking rooms count', function () {
            var roomManager = new RoomManager();
            roomManager.rooms.push(new Room("gürkanodasi"));

            assert.equal(roomManager.getRoomsCount(), 1);
        });
    });

    describe('#addRoom(roomName)', function () {
        it('adding a room', function () {
            var roomManager = new RoomManager();

            roomManager.addRoom("gürkanodasi");
            assert.equal(roomManager.getRoomsCount(), 1);
        });
    });

    describe('#isRoomExists(roomName)', function () {
        it('checking existance of a room', function () {
            var roomManager = new RoomManager();

            var addedRoom = roomManager.addRoom("gürkanodasi");
            
            assert.equal(roomManager.isRoomExists(addedRoom.name), true);
        });
    });

    describe('#isRoomEmpty(roomName)', function () {
        it('is target room empty or not', function () {
            var roomManager = new RoomManager();

            var addedRoom = roomManager.addRoom("gürkanodasi");

            assert.strictEqual(roomManager.isRoomEmpty(addedRoom.name), true);
        });
    });
    
    describe('#getRoomByName(roomName)', function () {
        it('am I getting correct room?', function () {
            var roomManager = new RoomManager();

            var addedRoom = roomManager.addRoom("gürkanodasi");

            assert.strictEqual(roomManager.getRoomByName(addedRoom.name), addedRoom);
        });
    });

});