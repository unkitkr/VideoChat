// const io = require('socket.io-client');
const conSocket  = io('http://127.0.0.1:5000')
const conPeer = new Peer(undefined, {
    host : "127.0.0.1",
    port : "3001",

});

const peers = {}

const videoGrid = document.getElementById("video-grid")
const myVideo = document.createElement('video')
myVideo.muted = true
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
  conPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    
  })
  conSocket.on('user-connected', userId => {
    console.log(userId)

    setTimeout(() => {
      // user joined
      connectToNewUser(userId, stream)
    }, 3000)  })
})

conSocket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

conPeer.on('open', id => {
  conSocket.emit('join-room', 20020, id)
})

function connectToNewUser(userId, stream) {
  const call = conPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call

}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}