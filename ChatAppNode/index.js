const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const User = require('./user');
const { v4: uuidv4 } = require('uuid');

const strings = require('./strings')
const Keys = new strings.Keys();
const Log = require('./Log');
const RoomManager = require('./roomManager');

let Users = [];
let roomManager = new RoomManager();
let logger = new Log("SERVER");

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  var user = AddUser(socket.id, socket.rooms);
  TellServerStatus();

  BroadcastToEveryoneExceptMe(socket, Keys.ON_USER_CONNECTED, user);

  socket.on('disconnect', () => {
    user = RemoveUser(socket.id);

    logger.print('A user has been disconnected from server: ' + user.name);
    
    TellServerStatus();

    BroadcastToEveryoneExceptMe(socket, Keys.ON_USER_DISCONNECTED, user);
  });

  socket.on(Keys.SEND_USERNAME, (name) => {
    logger.print('A user name has been changed to ' + name);
    user = GetUserById(socket.id);
    user.name = name;
    
    BroadcastToEveryoneExceptMe(socket, Keys.ON_USERNAME_CHANGED, user);
  });

  socket.on(Keys.SEND_JOIN_TO_ROOM, (roomName) => {
    logger.print("A user wants to join room called: " + roomName);
    user = GetUserById(socket.id);

    roomManager.addUser(socket, user, roomName);
  });

});

function AddUser(id, rooms) {
  var user = new User(id, uuidv4(), rooms);
  Users.push(user);

  logger.print('New connection received!');

  return user;
}

function RemoveUser(id) {
  var user = GetUserById(id);

  index = Users.indexOf(user);

  Users.splice(index, 1);

  return user;
}

function GetUserById(id) {
  return Users.find(user => user.id === id);
}

function GetPrettyUserPrint(user) {
  return JSON.stringify(user, null, ' ');
}

function BroadcastToEveryoneExceptMe(socket, EVENT_CODE, data) {
  socket.broadcast.emit(EVENT_CODE, data);
}

function TellServerStatus() {
  logger.print("Online users count: " + Users.length);
}

function TellUsersDetails() {
  Users.forEach(user => {
    logger.print("User: " + GetPrettyUserPrint(user));
  });
}

http.listen(3000, () => {
  console.log('listening on *:3000');
});