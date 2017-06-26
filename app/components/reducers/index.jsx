import {combineReducers} from 'redux'
import {List} from 'immutable'
import ingredientsCommands from '../../assets/commands.json'

// =====actions=====//
const PLAYER_JOIN = 'PLAYER_JOIN'
const GAME_START = 'GAME_START'
const ADD_INGREDIENT = 'ADD_INGREDIENT'
const COMMAND_EXPIRED = 'COMMAND_EXPIRED'
const UPDATE_SCORE = 'UPDATE_SCORE'
const STAGE_OVER = 'STAGE_OVER'

// === ACTION CREATOR =======//

export const playerJoin = (player) => ({type: PLAYER_JOIN, player})
// triggered when player joins game room
export const startGame = (gameStarted, commands, ingredients) => ({type: GAME_START, gameStarted, commands, ingredients})
// triggered when all players press start
// >> triggers function that populates all game commands (spells) in master queue (List) and ingredients and assigns 4 ingredients to each player

export const addIngredient = (ingredient) => ({type: ADD_INGREDIENT, ingredient})

export const commandExpired = (commands) => ({type: COMMAND_EXPIRED, commands})
// triggered when timer for current task runs out
// >> triggers pushing failed command off of queue
// >> triggers restart of timer and sends next command in master queue (List) to player
// NB does not affect score
export const updateScore = (score) => ({type: UPDATE_SCORE, score})
export const stageOver = () => ({type: STAGE_OVER})

// ======reducer ======//

let initialState = {
  gameStarted: false,
  players: {},
  // ingredients: [],
  commands: [],
  score: 0,
  level: 1,
  win: false
}

export default function reducer(state = initialState, action) {
  let newState = Object.assign({}, state)

  switch (action.type) {
  case PLAYER_JOIN:
    if (action.player.uid in state.players) {
      return state
    }
    newState.players = {...state.players, [action.player.uid]: action.player}
    break

  case GAME_START:
    newState.gameStarted = action.gameStarted
    newState.commands = action.commands
    const uids = Object.keys(state.players)

    newState.players = uids.sort().map((uid, index) => {
      let num = action.ingredients.length/uids.length
      return {...state.players[uid],
        ingredients: action.ingredients.slice(index*num, (index+1)*num),
        currentCommand: action.commands.shift()}
    }).reduce((players, player) => Object.assign({}, players, {[player.uid]: player}), {})
    break

  case ADD_INGREDIENT:
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
          // dispatch next level
        }
      }
    })
    break

  case COMMAND_EXPIRED:
    newState.commands = action.commands
    break

  case UPDATE_SCORE:
    newState.score = action.score
    break

  case STAGE_OVER:
    if (state.score / state.players.length * 4 >= 0.7) {
      newState.win = true
    } else {
      newState.win = false
    }
    break

  default:
    return state
  }
  return newState
}
