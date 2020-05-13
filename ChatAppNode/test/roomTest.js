const Room = require('../room');
const User = require('../user');

var assert = require('assert');

describe('Array', function () {

    let user = new User("socketid", "gürkan");

    describe('#addUser(user)', function () {
        it('add user to room', function () {
            let room = new Room("gürkanodasi");

            room.addUser(user);

            assert.equal(room.users.length, 1);
        });
    });

    describe('#removeUser(user)', function () {
        it('remove a user from room', function () {
            let room = new Room("gürkanodasi");

            room.addUser(user);

            assert.equal(room.users.length, 1, "We have one user in room");

            room.removeUser(user);

            assert.equal(room.users.length, 0);
        });
    });
    
    describe('#getUserById(id)', function () {
        it('getting a user via id', function () {
            let room = new Room("gürkanodasi");

            room.addUser(user);

            assert.equal(room.users.length, 1, "We have one user in room");

            let gotUser = room.getUserById(user.id);

            assert.strictEqual(gotUser, user);
        });
    });
    
    describe('#getIsEmpty()', function () {
        it('is room empty or not', function () {
            let room = new Room("gürkanodasi");

            room.addUser(user);

            assert.notEqual(room.getIsEmpty(), true, "We don't have one user in room");

            room.removeUser(user);

            assert.equal(room.getIsEmpty(), true, "Okay room is not really empty");
        });
    });
    
    describe('#isUserIn(id)', function () {
        it('is room empty or not', function () {
            let room = new Room("gürkanodasi");

            assert.equal(room.isUserIn(user.id), false);
        });
    });

});