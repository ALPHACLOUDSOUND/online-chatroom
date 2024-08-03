const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../client')));

let onlineUsers = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (username) => {
        onlineUsers.push({ id: socket.id, username });
        io.emit('userList', onlineUsers);
        io.emit('message', { user: 'System', text: `${username} has joined the chat` });
    });

    socket.on('message', (msg) => {
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        const user = onlineUsers.find(user => user.id === socket.id);
        if (user) {
            onlineUsers = onlineUsers.filter(user => user.id !== socket.id);
            io.emit('userList', onlineUsers);
            io.emit('message', { user: 'System', text: `${user.username} has left the chat` });
        }
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
