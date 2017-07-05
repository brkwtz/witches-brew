import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import Draggabilly from 'draggabilly'
import ingredientsCommands from '../assets/commands.json'
import {addIngredient} from './reducers'

export class Cauldron extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cauldronImg: '/gifs/cauldron.png',
      cauldron: ''
    }
  }

  render() {
    return (
      <div>
        <img className="cauldron" id="cauldron" src={this.state.cauldronImg} />
        <br />
        <img className="fire" id="fire" src="" />
        <br />
      </div>
    )
  }
}

export default connect(
  ({ingredients}) => ({ingredients}),
  {addIngredient},
)(Cauldron)
