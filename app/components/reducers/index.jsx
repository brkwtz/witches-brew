import {combineReducers} from 'redux'
import {List} from 'immutable'
import ingredientsCommands from '../../assets/commands.json'
import _ from 'lodash'

// =====actions=====//
const PLAYER_JOIN = 'PLAYER_JOIN'
const PLAYER_READY = 'PLAYER_READY'
const GAME_START = 'GAME_START'
const ADD_INGREDIENT = 'ADD_INGREDIENT'
const COMMAND_EXPIRED = 'COMMAND_EXPIRED'

// === action creators =======//
export const playerJoin = (player) => ({type: PLAYER_JOIN, player})

export const playerReady = (uid) => ({type: PLAYER_READY, uid})

export const startGame = (commands, ingredients) => ({type: GAME_START, commands, ingredients})

export const addIngredient = (ingredient) => ({type: ADD_INGREDIENT, ingredient})

export const commandExpired = (uid) => ({type: COMMAND_EXPIRED, uid})

// ======reducers ======//
const initialState = {
  gameStarted: false,
  players: {},
  ingredientsPerPlayer: 4,
  commands: [],
  score: 0,
  level: 1,
  win: null
}

export default function reducer(state = initialState, action) {
  let newState = Object.assign({}, state)
  const uids = Object.keys(state.players)

  // helper functions
  function updatePlayerState() {
    // if all commands are removed from queue, level ends
    if (Object.keys(newState.players).every(uid => !newState.players[uid].currentCommand)) {
      // if score is higher than 70% clear score and move to next level
      if (state.score / (uids.length * state.ingredientsPerPlayer) >= 0.7) {
        newState = {
          gameStarted: false,
          players: state.players,
          ingredientsPerPlayer: state.ingredientsPerPlayer + 1,
          commands: state.commands,
          score: 0,
          level: state.level + 1,
          win: true
        }
      // if score is lower than 70%, lose game by setting win to false
      } else {
        newState = {
          gameStarted: true,
          players: state.players,
          ingredientsPerPlayer: state.ingredientsPerPlayer,
          commands: [],
          score: state.score,
          level: state.level,
          win: false
        }
      }
    }
  }

  // reducer
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
        }
      }
    })
    updatePlayerState()
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
    }
    updatePlayerState()
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

  dispatch(startGame(commands, ingredients))
}
