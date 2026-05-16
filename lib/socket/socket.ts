import { io } from "socket.io-client";
import { SERVER_URL } from "../constants/all-texts";

const socket = io(SERVER_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;