const functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.sendPresenceActions = functions.database.ref('/gamerooms/{gameId}/roster/{userId}')
  .onWrite(event => {
    // Grab the current value of what was written to the Realtime Database.
    const isThere = event.data.val()
    if (isThere) {
      return event.data.ref.parent.parent.child('actions').push({
        type: 'PLAYER_JOIN',
        player: {uid: event.params.userId}
      })
    }

    return event.data.ref.parent.parent.child('actions').push({
      type: 'PLAYER_LEAVE',
      player: {uid: event.params.userId}
    })
  })
