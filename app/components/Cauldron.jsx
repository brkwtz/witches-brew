import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import ingredientsCommands from '../assets/commands.json'

export class Cauldron extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cauldron: 'static'
    }
  }
<<<<<<< HEAD

  componentWillReceiveProps(newProps) {
    if (newProps.score !== this.props.score) {
      this.setState({cauldron: 'glitter'})
    } else {
      this.setState({cauldron: 'static'})
    }
  }

  render() {
    let currentCauldron = '/gifs/cauldron.png'
    { (this.state.cauldron === 'levelUp') ? (currentCauldron = '/gifs/levelUpCauldron.gif') : null }
    { (this.state.cauldron === 'glitter') ? (currentCauldron = '/gifs/cauldron.gif') : null }
    return (
      <img className="cauldron" id="cauldron" src={currentCauldron} />
    )
=======
  
  render() {
      
        return (
          <div>
            <img className="cauldron" id="cauldron" src={this.state.cauldronImg} />
            <br />
            <img className="fire" id="fire" src="" />
            <br />
          </div>
        )
>>>>>>> master
  }
}

export default connect(
  ({level, score}) => ({level, score}),
)(Cauldron)
