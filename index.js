const express = require('express')
const app = express()
const path = require('path');
const server = require('http').createServer(app)
const cors = require('cors')

const io = require('socket.io')(server, {
    cors: {
        origin:"*", 
        methods: ["GET", "POST"]
    }
});



app.use(cors());
app.use(express.static(path.join(__dirname, "client/build")))

const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('server is running ')
})

app.get('/health-check', (req, res) => {
    res.send('server is running ')
})



io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit("callEnded")
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
            io.to(userToCall).emit("callUser", { signal: signalData, from, name })
    })

    socket.on("answerCall" , (data) => {
        io.to(data.to).emit("callAccpeted", data.signal)
    })

    
})


server.listen(port, () => {
    console.log(`listening on port ${port}` )
})