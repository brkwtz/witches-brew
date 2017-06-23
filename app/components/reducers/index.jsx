import {combineReducers} from 'redux'
import {List} from 'immutable'

// =====actions=====//
const GAME_START = 'GAME_START'
const PLAYER_JOIN = 'PLAYER_JOIN'
const ADD_INGREDIENT = 'ADD_INGREDIENT'
const COMMAND_EXPIRED = 'COMMAND_EXPIRED'
const UPDATE_SCORE = 'UPDATE_SCORE'
const STAGE_OVER = 'STAGE_OVER'

// === ACTION CREATOR =======//

export const playerJoin = (players) => ({type: PLAYER_JOIN, players})
// triggered when player joins game room
export const startGame = (gameStarted) => ({type: GAME_START, gameStarted})
// triggered when all players press start
// >> triggers function that populates all game commands (spells) in master queue (List) and ingredients and assigns 4 ingredients to each player
export const addIngredient = (commands) => ({type: ADD_INGREDIENT, commands})
// triggered only if correct ingredient is added
// >> triggers restart of timer and pushing next command in master queue (List) to player
// >> triggers add +1 to score
export const commandExpired = (commands) => ({type: COMMAND_EXPIRED, commands})
// triggered when timer for current task runs out
// >> triggers pushing failed command off of queue
// >> triggers restart of timer and sends next command in master queue (List) to player
// NB does not affect score
export const updateScore = (score) => ({type: UPDATE_SCORE, score})
export const stageOver = (level, score) => ({type: STAGE_OVER, payload: {level: level, score: score}})

// ======reducer ======//

let initialState = {
  gameStarted: false,
  players: [],
  ingredients: [],
  commands: [],
  score: 0,
  level: 1
}

export default function reducer(state = initialState, action) {
  let newState = Object.assign({}, state)

  switch (action.type) {
    case GAME_START:
      newState.gameStarted = action.gameStarted
      break

    case PLAYER_JOIN:
      newState.players = action.players
      break

    case ADD_INGREDIENT:
      newState.commands = action.commands
      break

    case COMMAND_EXPIRED:
      newState.commands = action.commands
      break

    case UPDATE_SCORE:
      newState.score = action.score
      break

    case STAGE_OVER:
      newState.payload = action.payload

    default:
      return state
  }
  return newState
}
