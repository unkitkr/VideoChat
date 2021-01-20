const io = require('socket.io-client');
const conSocket  = io('http://127.0.0.1:5000/',{reconnect: true})


conSocket.emit('join-room',20002022, 1222 )
conSocket.on('user-connected', (userID) =>{
    console.log("User Connected " + userID)
})

