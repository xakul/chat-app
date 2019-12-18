// Atakan Kul 17.12.2019
const socket = io()

// 'Server tarafından gelen 'message' eventini alır.
socket.on('message', (message) => {
    console.log(message)
 
 })

 //html document içinde 'message-form' isimli formu alıyoruz. Submit eventi ekliyoruz. 
document.querySelector('#message-form').addEventListener('submit' , (e) => {
        e.preventDefault()

    //Input kısmına girilen değeri alıyoruz
    const message = e.target.elements.message.value
    
    //Server-side kısmına girdiğimiz mesajı gönderiyoruz
    socket.emit('sendMessage', message, (error) => {
            if(error)
            {
                return console.log(error)
            }
        console.log('Message delivered', error)

    })

})

document.querySelector('#send-location').addEventListener('click', () => {


      if( !navigator.geolocation) 
      {
          return alert('Geolocation is not supported in your browser')
      }

      navigator.geolocation.getCurrentPosition((position) => {
           console.log(position)

           socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        })
        

      })

    

})

