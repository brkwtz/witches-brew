'use strict'

import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import Cauldron from './Cauldron'
import Command from './Command'
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
      showLevelModal: false,
      showGameOverModal: false
    }

    this.handleOpenLevelModal = this.handleOpenLevelModal.bind(this)
    this.handleCloseLevelModal = this.handleCloseLevelModal.bind(this)
    this.handleOpenGameOverModal = this.handleOpenGameOverModal.bind(this)
    this.handleCloseGameOverModal = this.handleCloseGameOverModal.bind(this)
  }

  handleOpenLevelModal() {
    this.setState({showLevelModal: true})
  }

  handleCloseLevelModal() {
    this.setState({showLevelModal: false})
  }

  handleOpenGameOverModal() {
    this.setState({showGameOverModal: true})
  }

  handleCloseGameOverModal() {
    this.setState({showGameOverModal: false})
  }

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
    if (this.props.level !== newProps.level) {
      this.handleOpenLevelModal()
    }
    if (newProps.win === false) {
      this.handleOpenGameOverModal()
    }
  }

  clickToStart = () => {
    this.props.playerReady(this.state.user.uid)
  }

  render() {
    if (!this.state.user) return null
    const currentPlayer = this.props.players[this.state.user.uid]
    return (
      <div>
        <ReactModal
         id="levelUp"
          isOpen={this.state.showLevelModal}
          contentLabel="New Level"
        >
          <p>YOU HAVE REACHED LEVEL {this.props.level}</p>
          <button onClick={this.handleCloseLevelModal}>Close Modal</button>
        </ReactModal>
        <ReactModal
          id="gameOver"
          isOpen={this.state.showGameOverModal}
          contentLabel="Game Over"
        >
          <p>GAME OVER</p>
          <button onClick={this.handleCloseGameOverModal}>Close Modal</button>
        </ReactModal>
        <h3>Welcome to the coven of {this.props.params.title}!</h3>
        <Cauldron />
        <h1>LEVEL {this.props.level}</h1>
        {
          (currentPlayer && this.props.gameStarted)
            ? (
              <div>
                <Ingredients
                  IngredientsCommands={ingredientsCommands}
                  currentPlayer={currentPlayer}/>
                  <Timer currentPlayer={currentPlayer}/>
              </div>
          )
            : (
            <button onClick={this.clickToStart}>Start</button>
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
