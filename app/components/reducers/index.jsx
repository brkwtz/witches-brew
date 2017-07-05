import ingredientsCommands from '../../assets/commands.json'
import firebase from 'APP/fire'
import _ from 'lodash'

const db = firebase.database()

// =====actions=====//
const PLAYER_JOIN = 'PLAYER_JOIN'
const PLAYER_LEAVE = 'PLAYER_LEAVE'
const PLAYER_READY = 'PLAYER_READY'
const GAME_START = 'GAME_START'
const ADD_INGREDIENT = 'ADD_INGREDIENT'
const COMMAND_EXPIRED = 'COMMAND_EXPIRED'

// === action creators =======//
export const playerJoin = (player) => ({type: PLAYER_JOIN, player})

export const playerLeave = (uid) => ({type: PLAYER_LEAVE, uid})

export const playerReady = (uid) => ({type: PLAYER_READY, uid})

export const startGame = (commands, ingredients) => ({type: GAME_START, commands, ingredients})

export const addIngredient = (ingredient) => ({type: ADD_INGREDIENT, ingredient})

export const commandExpired = (uid) => ({type: COMMAND_EXPIRED, uid})

// ======reducers ======//
const initialState = {
  viewers: {},
  gameStarted: false,
  players: {},
  ingredientsPerPlayer: 4,
  commands: [],
  score: 0,
  level: 1,
  win: null,
  ultimateWin: false
}

export default function reducer(state = initialState, action) {
  let newState = Object.assign({}, state)
  const uids = Object.keys(state.players)

  // reducer
  switch (action.type) {
  case PLAYER_JOIN:
    if (action.player.uid in state.players) {
      return state
    }

    if (state.gameStarted || Object.keys(state.players).length >= 4) {
      return {...state, viewers: {...state.viewers, [action.player.uid]: true}}
    }

    newState.players = {...state.players, [action.player.uid]: action.player}
    newState.players = Object.keys(newState.players).sort().map((uid, index) => {
      return {...newState.players[uid], master: index === 0}
    }).reduce((players, player) => Object.assign({}, players, {[player.uid]: player}), {})
    break

  case PLAYER_LEAVE:
    const players = {...state.players}
    const viewers = {...state.viewers}
    delete players[action.player.uid]
    delete viewers[action.player.uid]
    return {...state, players, viewers, gameStarted: false}

  case PLAYER_READY:
    return {...state, players: {...state.players, [action.uid]: {...state.players[action.uid], ready: true}}}

  case GAME_START:
    newState.gameStarted = true
    newState.win = null
    newState.commands = action.commands
    newState.players = uids.sort().map((uid, index) => {
      const num = action.ingredients.length / uids.length
      return {...state.players[uid],
        ingredients: action.ingredients.slice(index*num, (index+1)*num),
        currentCommand: action.commands.shift()}
    }).reduce((players, player) => Object.assign({}, players, {[player.uid]: player}), {})
    break

  case ADD_INGREDIENT:
    uids.forEach(uid => {
      // if correct ingredient is added
      if (state.players[uid].currentCommand === ingredientsCommands[action.ingredient]) {
        // console.log('increment score')
        newState.score = state.score + 1
        // if there's still a command in the queue, fetch the next command to player whose command is completed
        if (state.commands.length > 0) {
          // console.log('there are still commands, update current command')
          newState.players = {...state.players,
            [uid]: {...state.players[uid],
              currentCommand: state.commands[0]}}
          newState.commands = state.commands.slice(1)
        } else {
          // if no more command in queue, set the currentCommand to null for the player whose command is completed
          // console.log('there are no more commands, update player state')
          newState.players = {...state.players,
            [uid]: {...state.players[uid], currentCommand: null}}
          newState = updatePlayerState(newState, state, uid)
        }
      }
    })
    break

// just for if the timer runs out
  case COMMAND_EXPIRED:
    // if there's still command in the queue, fetch the next command to player whose command is completed
    if (state.commands.length > 0) {
      newState.players = {...state.players,
        [action.uid]: {...state.players[action.uid], currentCommand: state.commands[0]}}
      newState.commands = state.commands.slice(1)
    } else {
      // if no more command in queue, set the currentCommand to null for the player whose command is completed
      newState.players = {...state.players,
        [action.uid]: {...state.players[action.uid], currentCommand: null}}
      newState = updatePlayerState(newState, state)
    }
    break

  default:
    return state
  }
  return newState
}

// ====== thunks ======//

export const startRound = () => (dispatch, getState) => {
  const commands = []
  const ingredients = []
  const playerNum = Object.keys(getState().players).length

  _.shuffle(Object.keys(ingredientsCommands)).slice(0, playerNum * getState().ingredientsPerPlayer).forEach(ingredient => {
    ingredients.push(ingredient)
    commands.push(ingredientsCommands[ingredient])
  })

  dispatch(startGame(commands, _.shuffle(ingredients)))
}

// ======================= helper functions ===================== //
function updatePlayerState(newState, state, id) {
  const uids = Object.keys(state.players)
  // if all commands are removed from queue, level ends
  if (Object.keys(newState.players).every(uid => !newState.players[uid].currentCommand)) {
    if (state.level >=10) {
      newState.players = {...newState.players,
        [id]: {...newState.players[id], ready: false}}
    }
    // if score is higher than 70% clear score and move to next level
    console.log('newState is: ', newState)
    console.log('newState.score is: ', newState.score)
    if (newState.score / (uids.length * state.ingredientsPerPlayer) >= 0.7) {
      return {
        ...newState,
        gameStarted: false,
        ingredientsPerPlayer: (state.ingredientsPerPlayer >= 8) ? 8 :state.ingredientsPerPlayer + 1,
        commands: _.shuffle(state.commands),
        score: 0,
        level: (state.level >=10) ? 10 : state.level + 1,
        win: true,
        ultimateWin: state.level >= 10
      }
      // if score is lower than 70%, lose game by setting win to false
    } else {
      return {
        ...newState,
        gameStarted: true,
        players: {...newState.players, [id]: {...newState.players[id], ready: false}},
        ingredientsPerPlayer: state.ingredientsPerPlayer,
        commands: [],
        score: state.score,
        level: state.level,
        win: false,
        ultimateWin: false
      }
    }
  } else {
    return newState
  }
}
