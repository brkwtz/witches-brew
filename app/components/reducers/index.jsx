import {combineReducers} from 'redux'
import {List} from 'immutable'

// =====actions=====//
const PLAYER_JOIN = 'PLAYER_JOIN'
const GAME_START = 'GAME_START'
const ADD_RIGHT_INGREDIENT = 'ADD_INGREDIENT'
const COMMAND_EXPIRED = 'COMMAND_EXPIRED'
const UPDATE_SCORE = 'UPDATE_SCORE'
const STAGE_OVER = 'STAGE_OVER'

// === ACTION CREATOR =======//

export const playerJoin = (player) => ({type: PLAYER_JOIN, player})
// triggered when player joins game room
export const startGame = (gameStarted, commands, ingredients) => ({type: GAME_START, gameStarted, commands, ingredients})
// triggered when all players press start
// >> triggers function that populates all game commands (spells) in master queue (List) and ingredients and assigns 4 ingredients to each player

export const addRightIngredient = (commands, score) => ({type: ADD_RIGHT_INGREDIENT, commands: commands, score: score})
// triggered only if correct ingredient is added
// >> triggers restart of timer and pushing next command in master queue (List) to player
// >> triggers add +1 to score
export const commandExpired = (commands) => ({type: COMMAND_EXPIRED, commands})
// triggered when timer for current task runs out
// >> triggers pushing failed command off of queue
// >> triggers restart of timer and sends next command in master queue (List) to player
// NB does not affect score
export const updateScore = (score) => ({type: UPDATE_SCORE, score})
export const stageOver = (level, score) => ({type: STAGE_OVER, level: level, score: score})

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
    case PLAYER_JOIN:
      if(state.players.find(player => player.uid === action.player.uid))
        return state
      newState.players = [...state.players, action.player]
      break

    case GAME_START:
      newState.gameStarted = action.gameStarted
      newState.commands = action.commands
      newState.ingredients = action.ingredients.slice(state.players.length)
      newState.players = state.players.map((player, index) => {
        let num = action.ingredients.length/state.players.length
        return {...player,
                ingredients: action.ingredients.slice(index*num, (index+1)*num),
                currentCommand: action.commands[index]}
      })
      break

    case ADD_RIGHT_INGREDIENT:
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
