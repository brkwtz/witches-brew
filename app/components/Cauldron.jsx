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
      cauldronImg: "/gifs/cauldron.png",
      cauldron: ''
    }
    this.cauldronBubble = this.cauldronBubble.bind(this)
  }
  

  cauldronBubble(){
    // and more stuff eventually...
    this.setState({cauldronImg: "/gifs/cauldron.gif"})
  }

  render() {
      
        return (
            <img className="cauldron" id="cauldron" src={this.state.cauldronImg} />
           
        )
  }
}


export default connect(
  ({ingredients}) => ({ingredients}),
  { addIngredient},
)(Cauldron)

