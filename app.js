const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const app = express();
const { join } = require("path");
const port = 3000;

const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(join(__dirname, 'login.html'))
})


let count = 0;

const chat = [];
//connection
io.on('connection', (socket) => {
    io.emit('chat-history', chat);

    //count
    count = count + 1;
    io.emit('count+', count);
   
    socket.on('disconnect', () => {
        //count
        count = count - 1;
        //sent count to fontend
        io.emit('count-', count);
       
    });



});



io.on('connection', (socket) => {
    //brodcast chats and ussername to frrontend.
    //push chat messages on chat stack
    socket.on('chat-message', (data) => {
        io.emit('chat-message', data)
        let user = data.user;
        let msg = data.iv;
        chat.push({ user: user, msg: msg });
           });
})








server.listen(port, () => {
    console.log(`listning on ${port}...`);
});