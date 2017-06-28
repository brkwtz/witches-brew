import {combineReducers} from 'redux'
import {List} from 'immutable'
import ingredientsCommands from '../../assets/commands.json'
import lodash from 'lodash'

// =====actions=====//
const PLAYER_JOIN = 'PLAYER_JOIN'
const PLAYER_READY = 'PLAYER_READY'
const GAME_START = 'GAME_START'
const ADD_INGREDIENT = 'ADD_INGREDIENT'
const COMMAND_EXPIRED = 'COMMAND_EXPIRED'

// === ACTION CREATOR =======//

export const playerJoin = (player) => ({type: PLAYER_JOIN, player})
// triggered when player joins game room

export const playerReady = (uid) => ({type: PLAYER_READY, uid})

export const startGame = (commands, ingredients) => ({type: GAME_START, commands, ingredients})
// triggered when all players press start
// >> triggers function that populates all game commands (spells) in master queue (List) and ingredients and assigns 4 ingredients to each player

export const addIngredient = (ingredient) => ({type: ADD_INGREDIENT, ingredient})

export const commandExpired = (uid) => ({type: COMMAND_EXPIRED, uid})
// triggered when timer for current task runs out
// >> triggers pushing failed command off of queue
// >> triggers restart of timer and sends next command in master queue (List) to player
// NB does not affect score

// ======reducer ======//

let initialState = {
  gameStarted: false,
  players: {},
  ingredientsPerPlayer: 4,
  commands: [],
  score: 0,
  level: 1,
  win: false,
  levelEnd: false
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

  case GAME_START:
    newState.gameStarted = true
    newState.commands = action.commands
    const uids = Object.keys(state.players)

    newState.players = uids.sort().map((uid, index) => {
      let num = action.ingredients.length/uids.length
      return {...state.players[uid],
        ingredients: action.ingredients.slice(index*num, (index+1)*num),
        currentCommand: action.commands.shift()}
    }).reduce((players, player) => Object.assign({}, players, {[player.uid]: player}), {})
    break

  case ADD_INGREDIENT: //this works...
    Object.keys(state.players).forEach(uid => {
      // if right ingredient is added
      if (state.players[uid].currentCommand === ingredientsCommands[action.ingredient]) {
        newState.score = state.score + 1
        // if there's still command in the queue, fetch the next command to player whose command is completed
        if (state.commands.length > 0) {
          newState.players = {...state.players,
            [uid]: {...state.players[uid], currentCommand: state.commands[0]}}
           
           
          newState.commands = state.commands.slice(1)
        } else {
          // if no more command in queue, set the currentCommand to null for the player whose command is completed
          newState.players = {...state.players,
            [uid]: {...state.players[uid], currentCommand: null}}

        }
        if (Object.keys(newState.players).every(uid => !newState.players[uid].currentCommand)) {
          newState.levelEnd = true
          if (state.score / (Object.keys(state.players).length * state.ingredientsPerPlayer) >= 0.7) {
            newState.win = true
          } else {
            newState.win = false
          }
        }
      }
    })
    break

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
    if (Object.keys(newState.players).every(uid => !newState.players[uid].currentCommand)) {
      newState.levelEnd = true
      if (state.score / (Object.keys(state.players).length * state.ingredientsPerPlayer) >= 0.7) {
        newState.win = true
      } else {
        newState.win = false
      }
    }
    break

  default:
    return state
  }
  return newState
}

export const startRound = () => (dispatch, getState) => {
  let commands = []
  let ingredients = []
  let playerNum = Object.keys(getState().players).length

  lodash.shuffle(Object.keys(ingredientsCommands)).slice(0, playerNum * getState().ingredientsPerPlayer).forEach(ingredient => {
    ingredients.push(ingredient)
    commands.push(ingredientsCommands[ingredient])
  })

  dispatch(startGame(commands, ingredients))
}
