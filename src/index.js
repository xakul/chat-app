// Atakan Kul 17.12.2019

const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage} = require('./utils/messages')
const {generateLocationMessage} = require('./utils/generateLocationMessage')



const app = express ()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 1000
const publicDirectoryPath = path.join(__dirname,'../public')

let count = 0

//Connection giren client tarafına initial mesaj gönderimi
io.on('connection' , (socket) => {

console.log('New socket connection')

//Message eventi içinde 'welcome' bir string gönderiyoruz
socket.emit('message' , generateMessage('Welcome'))


//Broadcast kullanarak kendi client kullanıcım hariç diğerlerinin bu mesajı almasını sağlarız
socket.broadcast.emit('message', generateMessage('New user joined'))




//Client server içindeyken 'sendMessage' eventiyle mesaj gönderdiyse bütün socket bağlantılarına bu mesajı gönderiyoruz
socket.on('sendMessage', (message, callback) => { 
      
   const filter = new Filter()
   
   if(filter.isProfane(message))
   {
        return callback('Kufur edemezsin')
   }

  io.emit('message', generateMessage(message))
  callback()

 })

 //sendLocation eventinden gelen parametrik objeyi alır ve emit eder
socket.on('sendLocation', (coords, callback) => {
      console.log('Server gets the message')
      io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
      
})

 socket.on('disconnect' , () => {
      io.emit('message', generateMessage('A user has left the room'))

 })  


})

app.use(express.static(publicDirectoryPath))

server.listen(port, () => {
   console.log("Port is on " + port)

})