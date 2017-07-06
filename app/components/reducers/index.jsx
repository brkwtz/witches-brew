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

// Make one player (arbitrarily, the first in sorted order)
// master.
const withMaster = players =>
  Object.keys(players)
        .sort()
        .map((uid, index) => ({
          ...players[uid], master: index === 0
        }))
        .reduce(toObjectByUid, {})

const toObjectByUid = (players, player) => Object.assign({}, players, {[player.uid]: player})

export default function reducer(state = initialState, action) {
  let newState = Object.assign({}, state)
  const uids = Object.keys(state.players)

  // reducer
  switch (action.type) {
  case PLAYER_JOIN:
    if (action.player.uid in state.players) {
      return state
    }

    // game is full
    if (state.gameStarted || Object.keys(state.players).length >= 4) {
      return {...state, viewers: {...state.viewers, [action.player.uid]: true}}
    }

    return {
      ...state,
      players: withMaster({
        ...state.players,
        [action.player.uid]: action.player
      })
    }
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
        currentCommand: action.commands.shift(),
        waiting: false
      }
    }).reduce((players, player) => Object.assign({}, players, {[player.uid]: player}), {})
    break

  case ADD_INGREDIENT:
    uids.forEach(uid => {
      // if correct ingredient is added
      if (state.players[uid].currentCommand === ingredientsCommands[action.ingredient]) {
        newState.score = state.score + 1
        // if there's still a command in the queue, fetch the next command to player whose command is completed
        if (state.commands.length > 0) {
          newState.players = {...state.players,
            [uid]: {...state.players[uid],
              currentCommand: state.commands[0]}}
          newState.commands = state.commands.slice(1)
        } else {
          // if no more command in queue, set the currentCommand to null for the player whose command is completed
          newState.players = {...state.players,
            [uid]: {...state.players[uid], currentCommand: null}}
          newState = updatePlayerState(newState, state, uid)
        }
      }
    })
    break

  case COMMAND_EXPIRED:
    const allCommandsNull = uids.every(uid => {
      return state.players[uid].currentCommand === null
    })

    // no commands left, all null
    if (!state.commands.length && allCommandsNull) {
      // check score and return won, lost or next level
      // state.players[action.uid].waiting = true
      return updatePlayerState(newState, state)

    // if currentCommand === null for just one player && the state has more commands
    } else if (state.commands.length > 0 && state.players[action.uid].currentCommand === null) {
      // seed new command to the player who doesn't have any
      newState.players = {...state.players,
          [action.uid]: {...state.players[action.uid], currentCommand: state.commands[0]}}
      newState.commands = state.commands.slice(1)


    // if currentCommand === null for just one player && the state DOES NOT have more commands
    } else if (!state.commands.length && state.players[action.uid].currentCommand) {
      // turn off the timer for this player//possibly some kind of waiting message
      newState.players[action.uid].currentCommand = null
      newState.players[action.uid].waiting = true
      return updatePlayerState(newState, state)

    // state has no commands, and the player doesn't have a command
    } else if (!state.commands.length && state.players[action.uid].currentCommand === null) {
      // turn off the timer for this player//possibly some kind of waiting message
      newState.players[action.uid].waiting = true
      return updatePlayerState(newState, state)

    //state has commands and player has a command
    } else if(state.commands.length && state.players[action.uid].currentCommand) {
      newState.players = {...state.players,
          [action.uid]: {...state.players[action.uid], currentCommand: state.commands[0]}}
      newState.commands = state.commands.slice(1)
      return updatePlayerState(newState, state)
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
  const allCommandsNull = uids.every(uid => {
      return newState.players[uid].currentCommand === null
    })
  if (allCommandsNull) {
    // if score is higher than 70% clear score and move to next level
    if (newState.score / (uids.length * state.ingredientsPerPlayer) >= 0.7) {
      return {...newState,
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
