// Atakan Kul 17.12.2019
const socket = io()



 const $messageForm = document.querySelector('#message-form')
 const $messageFormInput = $messageForm.querySelector('input')
 const $messageFormButton = $messageForm.querySelector('button')
 const $messages = document.querySelector('#messages')
 

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('locationMessage' ,(message) => {
   console.log(message)
   const html = Mustache.render(locationMessageTemplate, {
    url : message.url,
    createdAt : moment(message.createdAt).format('h:mm a')
   })
   $messages.insertAdjacentHTML('beforeend',  html)


})

// 'Server tarafından gelen 'message' eventini alır.
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt : moment(message.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend', html)
 
 })




 //html document içinde 'message-form' isimli formu alıyoruz. Submit eventi ekliyoruz. 
document.querySelector('#message-form').addEventListener('submit' , (e) => {
        e.preventDefault()

         $messageFormButton.setAttribute('disabled' , 'disabled')

    //Input kısmına girilen değeri alıyoruz
    const message = e.target.elements.message.value
    
    //Server-side kısmına girdiğimiz mesajı gönderiyoruz
    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        //Callback fonksyonu olarak error yollarız
            if(error)
            {
                return console.log(error)
            }
        // console.log('Message delivered')

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

