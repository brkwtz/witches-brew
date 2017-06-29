'use strict'

import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import Cauldron from './Cauldron'
import Ingredients from './Ingredients'
import Timer from './Timer'
import _ from 'lodash'
import {browserHistory} from 'react-router'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, playerReady, startRound, addIngredient, commandExpired} from './reducers'

export class PlayInterface extends React.Component {
  state = {user: null}

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user})
      if (!user) return

      if (!this.props.players[user.uid]) {
        let player = {uid: user.uid, ingredients: [], currentCommand: ''}
        this.props.playerJoin(player)
      }
    })
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.user) return
    if (newProps.players[this.state.user.uid] && newProps.players[this.state.user.uid].master && _.every(newProps.players, player => player.ready) && !newProps.gameStarted) {
      this.props.startRound()
    }
    
    if (newProps.win === false) {
    
    let query = firebase.database().ref('gamerooms').orderByKey()
    firebase.database().ref('gamerooms').child(this.props.params.title).remove()
    // query.once('value')
    //   .then(snapshot => {
    //     snapshot.forEach(childSnapshot => {
    //       console.log(this.props.params.title, '=', childSnapshot.key, '?')
    //       if(this.props.params.title === childSnapshot.key){
    //         console.log()
    //         firebase.database().ref('gamerooms').child(childSnapshot.key).remove()
    //       }
    //     })
    //   })

      window.alert('GAME OVER')
      browserHistory.push(`/`)
    }
  }

  clickToStart = () => {
    this.props.playerReady(this.state.user.uid)
  }

  render() {
    if (!this.state.user) return null
    const currentPlayer = this.props.players[this.state.user.uid]
    const covenName = this.props.params.title.split('-').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ')
    let witchNum = Object.keys(this.props.players).length
    let waitingWitches = []
    for(let i = 0; i < witchNum; i++){
      waitingWitches.push("/gifs/witch" + (i+1) + ".gif")
    }
    return (
      <div>
        <h1>Welcome to {covenName}!</h1>
        <Cauldron />
        <h2>LEVEL {this.props.level}</h2>
         
        {
          (currentPlayer && this.props.gameStarted)
            ? (
              <div>
               <Timer currentPlayer={currentPlayer}/>
                <Ingredients
                  IngredientsCommands={ingredientsCommands}
                  currentPlayer={currentPlayer}/>
                 
              </div>
          )
            : (
            
            <div>          
              {waitingWitches.map((witchPic, indx) => {
                return (<img key={indx} id="waiting-witch" src={witchPic}/>)
              })}
        
              <button onClick={this.clickToStart}>Start</button>
            </div>
          )
         
        }
    </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win}) => ({gameStarted, players, ingredients, commands, score, level, win}),
  {playerJoin, playerReady, startRound, addIngredient, commandExpired},
)(PlayInterface)
