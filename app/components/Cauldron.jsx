import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import ingredientsCommands from '../assets/commands.json'
import {addIngredient} from './reducers'

export class Cauldron extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.allowDrop = this.allowDrop.bind(this)
    this.selectIngredient = this.selectIngredient.bind(this)
  }

  allowDrop(e){
    e.preventDefault();
  }

  // will fire add ingredient when dragged to the right area.
  selectIngredient(e) {
    let ingredient = e.dataTransfer.getData("ingredient")
    console.log('you added', ingredient, 'to the cauldron?')
    this.props.addIngredient(ingredient)
  }

  render() {
        return (
            <div id="cauldron" onDragOver={this.allowDrop} onDrop={this.selectIngredient}>
                CAULDRON!
            </div>
        )
  }
}


export default connect(
  ({ingredients}) => ({ingredients}),
  { addIngredient},
)(Cauldron)

