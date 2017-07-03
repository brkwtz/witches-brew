import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import Draggabilly from 'draggabilly'
import ingredientsCommands from '../assets/commands.json'

export class Cauldron extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cauldronImg: '/gifs/cauldron.png'
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.level !== this.props.level) {
      this.state.cauldronImg = '/gifs/levelUpCauldron.gif'
    } else if (newProps.score !== this.props.score) {
      this.state.cauldronImg = '/gifs/cauldron.gif'
    } else {
      this.state.cauldronImg = '/gifs/cauldron.png'
    }
  }

  render() {
    const level = this.props.level
    return (
      <img loop="0" className="cauldron" id="cauldron" src={this.state.cauldronImg} />
    )
  }
}

export default connect(
  ({level, score}) => ({level, score}),
)(Cauldron)
