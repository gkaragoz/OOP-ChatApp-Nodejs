// CLIENT EVENT CODES

/////////////////// EVENTS

// USER HANDLES
SEND_USERNAME = "SEND_USERNAME";
SEND_JOIN_TO_ROOM = "SEND_JOIN_TO_ROOM";
SEND_LEAVE_FROM_ROOM = "SEND_LEAVE_FROM_ROOM";

// MESSAGES
SEND_MESSAGE_TO_ROOM = "SEND_MESSAGE_TO_ROOM";
SEND_MESSAGE_TO_PRIVATE = "SEND_MESSAGE_TO_PRIVATE";
SEND_MESSAGE_TO_GLOBAL = "SEND_MESSAGE_TO_GLOBAL";

////////////////// LISTENERS

// USER HANDLES
ON_USER_CONNECTED = "ON_USER_CONNECTED";
ON_USER_DISCONNECTED = "ON_USER_DISCONNECTED";
ON_USERNAME_CHANGED = "ON_USERNAME_CHANGED";

ON_JOIN_TO_ROOM_SUCCESS = "ON_JOIN_TO_ROOM_SUCCESS";
ON_JOIN_TO_ROOM_FAILED = "ON_JOIN_TO_ROOM_FAILED";

ON_LEAVE_FROM_ROOM_SUCCESS = "ON_LEAVE_FROM_ROOM_SUCCESS";
ON_LEAVE_FROM_ROOM_FAILED = "ON_LEAVE_FROM_ROOM_FAILED";

// MESSAGES
ON_GET_MESSAGE_FROM_ROOM = "ON_GET_MESSAGE_FROM_ROOM";
ON_GET_MESSAGE_FROM_PRIVATE = "ON_GET_MESSAGE_FROM_PRIVATE";
ON_GET_MESSAGE_TO_GLOBAL = "ON_GET_MESSAGE_TO_GLOBAL";