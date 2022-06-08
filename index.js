const express = require('express');
const app = express();


const http = require('http');
const server = http.createServer(app)
const chat = require("./database/firebase");



app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

const io = require("socket.io")(server)


const users = {}
io.on('connection', (socket) => {
    socket.on("new-user-joined", (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('user-connected', username)
    })

    socket.on("disconnect", () => {
        socket.broadcast.emit('user-disconnected', user = users[socket.id])
        delete users[socket.id];
    })
    socket.on('message', (data) => {
        socket.broadcast.emit('message', { user: data.user, msg: data.msg })
        const chatdata = {
            user: data.user,
            msg: data.msg
        }
        chat.add(chatdata)
        if (!chatdata) return console.log("databse errorr");
    })

})


const port = process.env.PORT || 5000
server.listen(port, () => {
    console.log("server is running on port " + port);
})