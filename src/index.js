// Atakan Kul 17.12.2019

const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')



const app = express ()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

let count = 0

//Connection giren client tarafına initial mesaj gönderimi
io.on('connection' , (socket) => {

console.log('New socket connection')

//Message eventi içinde 'welcome' bir string gönderiyoruz
socket.emit('message' , 'welcome !')

//Broadcast kullanarak kendi client kullanıcım hariç diğerlerinin bu mesajı almasını sağlarız
socket.broadcast.emit('message', 'New user joined')



//Client server içindeyken 'sendMessage' eventiyle mesaj gönderdiyse bütün socket bağlantılarına bu mesajı gönderiyoruz
socket.on('sendMessage', (message) => {     
  io.emit('message', message)

 })

 //sendLocation eventinden gelen parametrik objeyi alır ve emit eder
socket.on('sendLocation', (coords) => {
      io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)

})

 socket.on('disconnect' , () => {
      io.emit('message', 'A user has left the room')

 })  


})

app.use(express.static(publicDirectoryPath))

server.listen(port, () => {
   console.log("Port is on " + port)

})