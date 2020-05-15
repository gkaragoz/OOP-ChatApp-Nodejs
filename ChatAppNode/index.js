const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const strings = require('./strings')
const Keys = new strings.Keys();
const Log = require('./Log');
const RoomManager = require('./roomManager');
const UserManager = require('./userManager');

let roomManager = new RoomManager();
let userManager = new UserManager();
let logger = new Log("SERVER");

io.on('connection', onConnect);

function onConnect(socket) {
  var user = userManager.addUser(socket.id, undefined, socket.rooms);

  logger.print(JSON.stringify(user.name) + ' named connected to server.');

  BroadcastToEveryoneExceptMe(socket, Keys.ON_USER_CONNECTED, user);

  socket.on('disconnect', () => {
    user = userManager.removeUser(socket.id);

    logger.print(user.name + ' named user has been disconnected from server');
    
    BroadcastToEveryoneExceptMe(socket, Keys.ON_USER_DISCONNECTED, user);
  });

  socket.on(Keys.SEND_USERNAME, (name) => {
    logger.print(socket.id + ' named user has been changed its name to ' + name);
    
    user = userManager.setUsername(socket.id, name);
    
    BroadcastToEveryoneExceptMe(socket, Keys.ON_USERNAME_CHANGED, user);
  });

  socket.on(Keys.SEND_JOIN_TO_ROOM, (roomName) => {
    user = userManager.getUserById(socket.id);
    logger.print(user.name + " named user wants to join room called " + roomName);

    roomManager.addUser(socket, user, roomName, (isSuccess) => {
      if (isSuccess) {
        BroadcastToEveryoneIncludeMe(io, Keys.ON_JOIN_TO_ROOM_SUCCESS);
      } else {
        BroadcastToEveryoneIncludeMe(io, Keys.ON_JOIN_TO_ROOM_FAILED);
      }
    });
  });

  socket.on(Keys.SEND_LEAVE_FROM_ROOM, (roomName) => {
    user = userManager.getUserById(socket.id);
    logger.print(user.name + " named user wants to leave from room called " + roomName);

    roomManager.removeUser(socket, user, roomName, (isSuccess) => {
      if (isSuccess) {
        BroadcastToEveryoneIncludeMe(io, Keys.ON_LEAVE_FROM_ROOM_SUCCESS);
      } else {
        BroadcastToEveryoneIncludeMe(io, Keys.ON_LEAVE_FROM_ROOM_FAILED);
      }
    });
  });

  socket.on(Keys.SEND_MESSAGE_TO_ROOM, (targetRoomName, data) => {
    user = userManager.getUserById(socket.id);
    room = roomManager.getRoomByName(targetRoomName);

    let response = {
      "sender": user,
      "data": data
    };

    SendMessageToGroup(socket, targetRoomName, Keys.ON_GET_MESSAGE_FROM_ROOM, response);
  });

  socket.on(Keys.SEND_MESSAGE_TO_PRIVATE, (socketId, data) => {
    user = userManager.getUserById(socketId);
    
    let response = {
      "sender": user,
      "data": data
    };

    SendMessageToPrivate(io, socket, Keys.ON_GET_MESSAGE_FROM_PRIVATE, response);
  });

  socket.on(Keys.SEND_MESSAGE_TO_GLOBAL, (data) => {
    user = userManager.getUserById(socket.id);

    let response = {
      "sender": user,
      "data": data
    };

    BroadcastToEveryoneIncludeMe(io, Keys.ON_GET_MESSAGE_FROM_GLOBAL, response);
  });
}

function BroadcastToEveryoneExceptMe(socket, EVENT_CODE, data) {
  socket.broadcast.emit(EVENT_CODE, data);
}

function BroadcastToEveryoneIncludeMe(io, EVENT_CODE, data) {
  io.emit(EVENT_CODE, data);
}

function SendMessageToGroup(socket, groupName, EVENT_CODE, data) {
  socket.to(groupName).emit(EVENT_CODE, data);
}

function SendMessageToPrivate(io, socket, EVENT_CODE, data) {
  io.to(socket.id).emit(EVENT_CODE, data);
}

http.listen(3000, () => {
  console.log('listening on *:3000');
});