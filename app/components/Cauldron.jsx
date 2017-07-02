import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import Draggabilly from 'draggabilly'
import ingredientsCommands from '../assets/commands.json'
import {addIngredient, startFire} from './reducers'

export class Cauldron extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
        return (
          <div>
            <img className="cauldron" id="cauldron" src="/gifs/cauldron.gif" /> <br />
            <img className="fire" src="" /> <br />
          </div>
        )
  }
}


export default connect(
  ({ingredients}) => ({ingredients}),
  { addIngredient},
)(Cauldron)

