import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import Draggabilly from 'draggabilly'
import ingredientsCommands from '../assets/commands.json'

export class Cauldron extends React.Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   cauldron: 'static'
    // }
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps.level !== this.props.level) {
  //     this.state.cauldron = 'levelUp'
  //   // } else if (newProps.score !== this.props.score) {
  //   //   this.state.cauldron = 'glitter'
  //   } else {
  //     this.state.cauldron = 'static'
  //   }
  // }

  render() {
    let currentCauldron = '/gifs/cauldron.png'
    // { (this.state.cauldron === 'levelUp') ? (currentCauldron = '/gifs/levelUpCauldron.gif') : null }
    // { (this.state.cauldron === 'glitter') ? (currentCauldron = '/gifs/cauldron.gif') : null }
    return (
      <img className="cauldron" id="cauldron" src={currentCauldron} />
    )
  }
}

export default connect(
  ({level, score}) => ({level, score}),
)(Cauldron)
