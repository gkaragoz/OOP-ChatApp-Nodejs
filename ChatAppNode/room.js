function Room(name) {
    this.name = name;
    this.users = [];

    function addUser(user) {
        this.users.push(user);
      
        Log(user.name + ' joined to room ' + this.name);
      
        return user;
    }
    
    function removeUser(user) {
        index = this.users.indexOf(user);
      
        this.users.splice(index, 1);
      
        return user;
    }

    function getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    function getIsEmpty() {
        return this.users.length !== 0 ? false : true;
    }
  
}

module.exports = Room;