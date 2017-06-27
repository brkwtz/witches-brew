import {combineReducers} from 'redux'

// <-------------- actions -------------->
const ADD_INGREDIENT = 'ADD_INGREDIENT'
const COMMAND_EXPIRED = 'COMMAND_EXPIRED'

// <-------------- action creators -------------->
export const addIngredient = (ingredient) => ({type: ADD_INGREDIENT, ingredient})
export const commandExpired = (uid) => ({type: COMMAND_EXPIRED, uid})

// <-------------- reducers -------------->
const initialState = {
  gameStarted: false,
  players: {},
  ingredientsPerPlayer: 4,
  commands: [],
  score: 0,
  level: 1,
  win: null,
  levelEnd: false
}

export default function reducer(state = initialState, action) {
  let newState = Object.assign({}, state)

  switch (action.type) {

//just for if you add ingredient
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
          // if no more command in queue, set the currentCommand to null for the player whose command is completed
          newState.players = {...state.players,
            [uid]: {...state.players[uid], currentCommand: null}}
        }

      if (Object.keys(newState.players).every(uid => !newState.players[uid].currentCommand)) {
        newState.levelEnd = true
        if (state.score / (Object.keys(state.players).length * state.ingredientsPerPlayer) <= 0.7) {
          newState.win = true
          newState.level = state.level + 1
          newState.ingredientsPerPlayer = state.ingredientsPerPlayer + 1
          newState.score = 0
        } else {
          newState = {
            gameStarted: false,
            players: state.players,
            ingredientsPerPlayer: 4,
            commands: [],
            score: 0,
            level: 1,
            win: false,
            levelEnd: false
          }
        }
      }
    }
  })
    break

//just for if the timer runs out
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
      if (state.score / (Object.keys(state.players).length * state.ingredientsPerPlayer) <= 0.7) {
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
