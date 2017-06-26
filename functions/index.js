var functions = require('firebase-functions')

// // Start writing Firebase Functions
// // https://firebase.google.com/preview/functions/write-firebase-functions
//
// exports.helloWorld = functions.https().onRequest((request, response) => {
//   response.send('Hello from Firebase!')
// })

exports.startGame = functions.database.ref('/gamerooms/{roomId}')
  .onWrite(event => {
    // Grab the current value of what was written to the Realtime Database.
    const original = event.data.val()
    console.log('event origin', original)
    // const uppercase = original.toUpperCase()
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    // return event.data.ref.parent.child('uppercase').set(uppercase)
  })
