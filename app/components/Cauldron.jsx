import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import ingredientsCommands from '../assets/commands.json'

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
            <br /><br />
          </div>
        )
  }
}

export default connect(
  ({level, score}) => ({level, score}),
)(Cauldron)
