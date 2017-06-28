import ingredientsCommands from '../../assets/commands.json'
import _ from 'lodash'

// <-------------- actions -------------->
const GAME_START = 'GAME_START'

// <-------------- action creators -------------->
export const startGame = (commands, ingredients) => ({type: GAME_START, commands, ingredients})

// <-------------- reducers -------------->
const initialState = {
  gameStarted: false,
  ingredientsPerPlayer: 4,
  score: 0,
  level: 1,
  win: null,
  levelEnd: false
}

export default function reducer(state = initialState, action) {
  let newState = Object.assign({}, state)

  switch (action.type) {

  case GAME_START:
    newState.gameStarted = true
    newState.commands = action.commands
    const uids = Object.keys(state.players)
    newState.players = uids.sort().map((uid, index) => {
      const num = action.ingredients.length / uids.length
      return {...state.players[uid],
        ingredients: action.ingredients.slice(index*num, (index+1)*num),
        currentCommand: action.commands.shift()}
    }).reduce((players, player) => Object.assign({}, players, {[player.uid]: player}), {})
    break

  default:
    return state
  }
  return newState
}

// <-------------- thunks -------------->
export const startRound = () => (dispatch, getState) => {
  let commands = []
  let ingredients = []
  let playerNum = Object.keys(getState().players).length

  _.shuffle(Object.keys(ingredientsCommands)).slice(0, playerNum * getState().ingredientsPerPlayer).forEach(ingredient => {
    ingredients.push(ingredient)
    commands.push(ingredientsCommands[ingredient])
  })

  dispatch(startGame(commands, ingredients))
}
