import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import ingredientsCommands from '../assets/commands.json'
import {addIngredient} from './reducers'

export class Cauldron extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cauldronImg: "/gifs/cauldron.png"
    }

    
    this.allowDrop = this.allowDrop.bind(this)
    this.selectIngredient = this.selectIngredient.bind(this)
    this.cauldronBubble = this.cauldronBubble.bind(this)
  }

  allowDrop(e){
    e.preventDefault();
  }

  cauldronBubble(){
    // and more stuff eventually...
    this.setState({cauldronImg: "/gifs/cauldron.gif"})
  }

  // will fire add ingredient when dragged to the right area.
  selectIngredient(e) {
    setTimeout(this.cauldronBubble(), 500)
    let ingredient = e.dataTransfer.getData("ingredient")
    this.props.addIngredient(ingredient)
    
  }

  render() {
        return (
            <img id="cauldron" onDragOver={this.allowDrop} onDrop={this.selectIngredient} src={this.state.cauldronImg} />
           
        )
  }
}


export default connect(
  ({ingredients}) => ({ingredients}),
  { addIngredient},
)(Cauldron)

