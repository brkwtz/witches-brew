import {combineReducers} from 'redux'
import levels from './levels'
import gamePlay from './gamePlay'
import players from './players'

export default combineReducers({
  players,
  gamePlay,
  levels
})
