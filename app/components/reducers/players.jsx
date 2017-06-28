
// <-------------- actions -------------->
const PLAYER_JOIN = 'PLAYER_JOIN'
const PLAYER_READY = 'PLAYER_READY'

// <-------------- action creators -------------->
export const playerJoin = (player) => ({type: PLAYER_JOIN, player})
export const playerReady = (uid) => ({type: PLAYER_READY, uid})

// <-------------- reducers -------------->
const initialState = {
  players: {},
  commands: []
}

export default function reducer(state = initialState, action) {
  let newState = Object.assign({}, state)

  switch (action.type) {
  case PLAYER_JOIN:
    if (action.player.uid in state.players) {
      return state
    }
    newState.players = {...state.players, [action.player.uid]: action.player}
    newState.players = Object.keys(newState.players).sort().map((uid, index) => {
      return {...newState.players[uid], master: index === 0}
    }).reduce((players, player) => Object.assign({}, players, {[player.uid]: player}), {})
    break

  case PLAYER_READY:
    return {...state, players: {...state.players, [action.uid]: {...state.players[action.uid], ready: true}}}

  default:
    return state
  }
  return newState
}
