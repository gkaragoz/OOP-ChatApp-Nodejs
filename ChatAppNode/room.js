function Room(name) {
    this.name = name;
    this.users = [];

    this.addUser = function(user) {
        if (this.isUserIn(user.id)) {
            return false;
        }
        this.users.push(user);

        return true;
    }
    
    this.removeUser = function(user) {
        if (this.isUserIn(user.id) === false) {
            return false;
        }

        index = this.users.indexOf(user);
      
        this.users.splice(index, 1);
      
        return true;
    }

    this.getUserById = function(id) {
        return this.users.find(user => user.id === id);
    }

    this.isUserIn = function(id) {
        let user = this.getUserById(id);
        return user === undefined ? false : true;
    }

    this.getIsEmpty = function() {
        return this.users.length !== 0 ? false : true;
    }
  
}

module.exports = Room;