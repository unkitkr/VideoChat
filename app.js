const { Console } = require('console');
const express = require('express')
const app =  express()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
})

const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 443, path: '/peerjs' });

peerServer.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const shortUID = require('short-uuid');

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.send("Yaay")
})

app.get('/createmeeting', (req,res) => {
    res.redirect(`/createmeeting/${shortUID.generate()}`)
})

app.get('/createmeeting/:meetingID', (req,res) => {
    console.log(req.params.meetingID);
    res.send({
        "meetingID": req.params.meetingID
    })
})


io.on('connection', (socket) =>{
    socket.on('join-room', (roomID, userID) => {
        console.log(userID, roomID)
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('user-connected', userID)
        socket.on('disconnect', () => {
            socket.to(roomID).broadcast.emit('user-disconnected', userID)
        })
    })
})

const PORT  = process.env.PORT || 5000

server.listen(PORT, 
	() => {console.log("Server is running on :" + PORT)}
)
