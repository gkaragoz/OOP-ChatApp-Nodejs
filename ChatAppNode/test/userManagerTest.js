const UserManager = require('../userManager');
const User = require('../user');

var assert = require('assert');

describe('Array', function () {

    let userManager = new UserManager();
    let id = "dummyId";
    let name = "dummyName";
    let rooms = "dummyRooms";

    describe('#addUser(id, rooms)', function () {
        it('adding user to server list', function () {
            userManager = new UserManager();

            let user = new User(id, name);

            userManager.addUser(user.id, name, rooms);

            assert.equal(userManager.users.length, 1);
        });
    });
    
    describe('#removeUser(id)', function () {
        it('remove user from server list', function () {
            userManager = new UserManager();

            let user = new User(id, name);

            userManager.addUser(user.id, name, rooms);

            assert.equal(userManager.users.length, 1, "User could not added to server list");
            
            userManager.removeUser(user.id);
            
            assert.equal(userManager.users.length, 0);
        });
    });
    
    describe('#isUserExists(id)', function () {
        it('is user exists in list', function () {
            userManager = new UserManager();

            let user = new User(id, name);

            assert.equal(userManager.isUserExists(user.id), false);
        });
    });
    
    describe('#getUserById(id)', function () {
        it('getting user by id', function () {
            userManager = new UserManager();

            let addedUser = userManager.addUser(id, name, rooms);
            assert.equal(userManager.users.length, 1, "User could not added to server list");

            assert.strictEqual(userManager.getUserById(id), addedUser);
        });
    });
    
    describe('#setUsername(user, newName)', function () {
        it('checking rooms count', function () {
            userManager = new UserManager();

            let addedUser = userManager.addUser(id, rooms);
            assert.equal(userManager.users.length, 1, "User could not added to server list");

            userManager.setUsername(addedUser.id, "Gürkan");
            assert.equal(addedUser.name, "Gürkan", "User name could not changed");
        });
    });

});