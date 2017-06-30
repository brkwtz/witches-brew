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
    const room = event.data.ref.parent.parent
    const actions = room.child('actions')
    const roster = room.child('roster')

    const isThere = event.data.val()
    if (isThere) {
      return actions.push({
        type: 'PLAYER_JOIN',
        player: {uid: event.params.userId}
      })
    }

    return roster.once('value').then(roster => roster.val()
        ? actions.push({
          type: 'PLAYER_LEAVE',
          player: {uid: event.params.userId}
        })
        : room.remove())
  })
