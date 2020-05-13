const Log = require('./Log');

function Room(name) {
    this.name = name;
    this.users = [];

    this.addUser = function(user) {
        this.users.push(user);
      
        return user;
    }
    
    this.removeUser = function(user) {
        index = this.users.indexOf(user);
      
        this.users.splice(index, 1);
      
        return user;
    }

    this.getUserById = function(id) {
        return this.users.find(user => user.id === id);
    }

    this.getIsEmpty = function() {
        return this.users.length !== 0 ? false : true;
    }
  
}

module.exports = Room;