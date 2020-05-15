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

roomManager.addRoom("Ağ Programlama");
roomManager.getRoomByName("Ağ Programlama").imageThumbnail = 'https://www.creativefabrica.com/wp-content/uploads/2019/05/Network-icon-by-Muhazdinata-580x386.jpg';
roomManager.addRoom("Javascript Odası");
roomManager.getRoomByName("Javascript Odası").imageThumbnail = 'https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/13691885491579517854-256.png';

roomManager.addRoom("Python Odası");
roomManager.getRoomByName("Python Odası").imageThumbnail = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png';

roomManager.addRoom("Socket.io Odası");
roomManager.getRoomByName("Socket.io Odası").imageThumbnail = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Socket-io.svg/220px-Socket-io.svg.png';

io.on('connection', onConnect);

function onConnect(socket) {
  var user = userManager.addUser(socket.id, undefined, socket.rooms);

  logger.print(JSON.stringify(user.name) + ' named connected to server.');

  var response = {
    "userList": userManager.users,
    "roomList": roomManager.rooms
  }

  BroadcastToEveryoneExceptMe(socket, Keys.ON_USER_CONNECTED, response);

  socket.on('disconnect', () => {
    user = userManager.removeUser(socket.id);

    logger.print(user.name + ' named user has been disconnected from server');
    
    var response = {
      "leftUser": user,
      "userList": userManager.users,
      "roomList": roomManager.rooms
    }

    BroadcastToEveryoneExceptMe(socket, Keys.ON_USER_DISCONNECTED, response);
  });

  socket.on(Keys.SEND_USERNAME, (name) => {
    logger.print(socket.id + ' named user has been changed its name to ' + name);
    
    user = userManager.setUsername(socket.id, name);

    var response = {
      "userList": userManager.users,
      "roomList": roomManager.rooms
    }
    
    BroadcastToEveryoneIncludeMe(socket, Keys.ON_USERNAME_CHANGED, response);
  });

  socket.on(Keys.SEND_JOIN_TO_ROOM, (roomName) => {
    user = userManager.getUserById(socket.id);
    logger.print(user.name + " named user wants to join room called " + roomName);

    var response = {};

    roomManager.addUser(socket, user, roomName, (isSuccess) => {
      if (isSuccess) {
        response = {
          "roomList": roomManager.rooms
        }

        BroadcastToEveryoneIncludeMe(socket, Keys.ON_JOIN_TO_ROOM_SUCCESS, response);
      } else {
        BroadcastToEveryoneIncludeMe(socket, Keys.ON_JOIN_TO_ROOM_FAILED);
      }
    });
  });

  socket.on(Keys.SEND_LEAVE_FROM_ROOM, (roomName) => {
    user = userManager.getUserById(socket.id);
    logger.print(user.name + " named user wants to leave from room called " + roomName);

    roomManager.removeUser(socket, user, roomName, (isSuccess) => {
      if (isSuccess) {
        BroadcastToEveryoneIncludeMe(socket, Keys.ON_LEAVE_FROM_ROOM_SUCCESS);
      } else {
        BroadcastToEveryoneIncludeMe(socket, Keys.ON_LEAVE_FROM_ROOM_FAILED);
      }
    });
  });

  socket.on(Keys.SEND_MESSAGE_TO_ROOM, (message) => {
    SendMessageToRoom(socket, Keys.ON_GET_MESSAGE_FROM_ROOM, message);
  });

  socket.on(Keys.SEND_MESSAGE_TO_PRIVATE, (message) => {
    SendMessageToPrivate(io, socket, Keys.ON_GET_MESSAGE_FROM_PRIVATE, message);
  });

  socket.on(Keys.SEND_MESSAGE_TO_GLOBAL, (message) => {
    SendMessageToGlobal(socket, Keys.ON_GET_MESSAGE_FROM_GLOBAL, message);
  });
}

function BroadcastToEveryoneExceptMe(socket, EVENT_CODE, data) {
  if (userManager.isUserExists(socket.id)) {
    logger.print(EVENT_CODE + " broadcasted to everyone except sender " + userManager.getUserById(socket.id).name);
  } else {
    logger.print(EVENT_CODE + " broadcasted to everyone except sender " + data.leftUser.name);
  }

  socket.broadcast.emit(EVENT_CODE, data);
}

function BroadcastToEveryoneIncludeMe(socket, EVENT_CODE, data) {
  logger.print(EVENT_CODE + " broadcasted to everyone");

  socket.emit(EVENT_CODE, data);
  socket.broadcast.emit(EVENT_CODE, data);
}

function SendMessageToRoom(socket, EVENT_CODE, message) {
  logger.print(EVENT_CODE + " broadcasted to group from " + message.senderName + " to " + message.receiverName + " room");
  
  message.messageType = "Room";

  if (roomManager.isRoomExists(message.receiverName) === false) {
    logger.print(message.receiverName + " named target room not found - " + message.senderName + " did this.");
    return;
  }
  
  var targetRoom = roomManager.getRoomByName(message.receiverName);
  targetRoom.users.forEach(user => {
    user.addMessage(message);
  });

  socket.emit(EVENT_CODE, message);
  socket.to(targetRoom.name).emit(EVENT_CODE, message);
}

function SendMessageToPrivate(io, senderSocket, EVENT_CODE, message) {
  logger.print(EVENT_CODE + " sent private message from " + message.senderName + " to " + message.receiverName);
  
  message.messageType = "Private";

  if (userManager.getUserByName(message.receiverName) === undefined) {
    logger.print(message.receiverName + " named receiver user not found - " + message.senderName + " did this.");
    return;
  }

  userManager.addMessageBoth(message);

  var receiverUser = userManager.getUserByName(message.receiverName);

  senderSocket.emit(EVENT_CODE, message);
  io.to(receiverUser.id).emit(EVENT_CODE, message);
}

function SendMessageToGlobal(senderSocket, EVENT_CODE, message) {
  logger.print(EVENT_CODE + " sent global message from " + message.senderName + " to everyone");

  message.messageType = "Global";

  userManager.users.forEach(user => {
    user.addMessage(message);
  });

  BroadcastToEveryoneIncludeMe(senderSocket, EVENT_CODE, message);
}

http.listen(3000, () => {
  console.log('listening on *:3000');
});