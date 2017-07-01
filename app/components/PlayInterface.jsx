'use strict'

import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import Cauldron from './Cauldron'
import Ingredients from './Ingredients'
import Timer from './Timer'
import _ from 'lodash'
import {browserHistory} from 'react-router'
import ReactModal from 'react-modal'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, playerReady, startRound, addIngredient, commandExpired} from './reducers'

export class PlayInterface extends React.Component {
  constructor() {
    super()
    this.state = {
      user: null,
      showGameOverModal: false,
      showUltimateWinModal: false
    }
    
    this.handleOpenGameOverModal = this.handleOpenGameOverModal.bind(this)
    this.handlePlayAgain = this.handlePlayAgain.bind(this)
    this.handleQuit = this.handleQuit.bind(this)
  }

  handleOpenGameOverModal() {
    this.setState({showGameOverModal: true})
  }

  handleOpenUltimateWinModal() {
    this.setState({showUltimateWinModal: true})
  }

  handleQuit() {
    // close modal
    this.setState({showGameOverModal: false})
    // delete gameroom from database
    firebase.database().ref('gamerooms').child(this.props.params.title).remove()
    // redirect to /coven
    .then(() => browserHistory.push('/'))
  }

  handlePlayAgain() {
    // close modal
    this.setState({showGameOverModal: false})
    this.setState({showUltimateWinModal: false})
    // delete gameroom from database
    firebase.database().ref('gamerooms').child(this.props.params.title).remove()
    // redirect to /play/gameroom
    .then(() => browserHistory.push(`/play/${this.props.params.title}`))
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user}, this.joinGame)
    })
    this.joinGame()
  }

  joinGame = () => {
    const user = this.state.user
    if (!user) return
    if (!this.props.players[user.uid]) {
      let player = {uid: user.uid, ingredients: [], currentCommand: ''}
      this.props.playerJoin(player)
    }
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.user) return
    const currentPlayer = this.props.players[this.state.user.uid]
    if (!currentPlayer) return
    if (currentPlayer.master && _.every(newProps.players, player => player.ready) && !newProps.gameStarted) {
      this.props.startRound()
    }

    if (newProps.win === false) {
      this.handleOpenGameOverModal()
    }

    if (newProps.ultimateWin === true) {
      this.handleOpenUltimateWinModal()
    }

    this.levelUp = (newProps.win !== this.props.win) ? (<h2><img className="levelUp" src="/gifs/levelUp.gif" loop="0" width="100px"/></h2>) : (<div><h2>level {this.props.level}</h2></div>)
  }

  clickToStart = () => {
    this.props.playerReady(this.state.user.uid)
  }

  render() {
    if (!this.state.user) return null
    const currentPlayer = this.props.players[this.state.user.uid]
    if (!currentPlayer) {
      return <h1>This coven is full...</h1>
    }
    const covenName = this.props.params.title.split('-').map((name, i) => {if(i<(this.props.params.title.split('-').length-1)) return (name.charAt(0).toUpperCase() + name.slice(1))}).join(' ')
    const witchNum = Object.keys(this.props.players).length
    let waitingWitches = []

    let poofedWitches = []
    for (let i = 0; i < witchNum; i++) {
      waitingWitches.push('/gifs/witch' + (i+1) + '.gif')
      poofedWitches.push('/gifs/poof' + (i+1) + '.gif')
    }

    const renderWitches = waitingWitches.map((witchPic, indx) => (<img key={indx} id="waiting-witch" src={witchPic}/>))
    const renderPoofs = poofedWitches.map((witchPic, indx) => (<img key={indx} id="poofed-witch" src={witchPic}/>))

    return (
      <div className="container-fluid center">
        <ReactModal
          id="gameOver"
          isOpen={this.state.showGameOverModal}
          contentLabel="Game Over"
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="center">
            <h1>Game Over</h1>
            <h2>maybe burn some sage and try again</h2>
            {renderPoofs}
            <button onClick={this.handlePlayAgain}>Play Again</button>
            <button onClick={this.handleQuit}>Quit</button>
          </div>
        </ReactModal>

        <ReactModal
          id="ultimateWin"
          isOpen={this.state.showUltimateWinModal}
          contentLabel="Congrats! You've won the game!"
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="center">
            <h1>You've successfully brewed all the potion</h1>
            <img className="center wizardPoof" src="/gifs/poofWizard.gif" />
            <button onClick={this.handlePlayAgain}>Play Again</button>
            <button onClick={this.handleQuit}>Quit</button>
          </div>
        </ReactModal>

        <div className="row">
          <h1 >Welcome to the coven of {covenName}!</h1>
          {this.levelUp}
          <br />
          <Cauldron />
        </div>
        <div>
        {

          (currentPlayer && this.props.gameStarted)
            ? (
              <div>
              <br />
               <Timer currentPlayer={currentPlayer}/>
                <Ingredients
                  IngredientsCommands={ingredientsCommands}
                  currentPlayer={currentPlayer}/>
              </div>
          )
            : (

            <div>
              {renderWitches}

              {
                (currentPlayer.ready)
                  ? <div></div>
                  : (<p><img src="/gifs/readyButton.gif" onClick={this.clickToStart} /></p>)
              }
            </div>
          )

        }
        </div>
    </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, ultimateWin}) => ({gameStarted, players, ingredients, commands, score, level, win, ultimateWin}),
  {playerJoin, playerReady, startRound, addIngredient, commandExpired},
)(PlayInterface)
