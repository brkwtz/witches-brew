'use strict'

import React from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import Cauldron from './Cauldron'
import Ingredients from './Ingredients'
import Timer from './Timer'
import _ from 'lodash'
import ReactModal from 'react-modal'
import Clipboard from 'clipboard'

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
    this.handleInviteWitch = this.handleInviteWitch.bind(this)
  }

  handleOpenGameOverModal() {
    this.setState({showGameOverModal: true})
  }

  handleOpenUltimateWinModal() {
    this.setState({showUltimateWinModal: true})
  }

  handleInviteWitch(e) {
    const messageBody = `You've been invited to play Witches Brew with ${this.props.params.title}! Click here to join: https://www.playwitchesbrew.com/play/${this.props.params.title}`
    const targetPhoneRaw = e.target.value
    let targetPhone = targetPhoneRaw.replace(/\D/g, '')
    if (targetPhone[0] === '1') {
      targetPhone = targetPhone.slice(1)
    }
    if (targetPhone.length === 10) {
      targetPhone = '+1' + targetPhone
      firebase.database().ref('sms').push().set({
        messageBody,
        targetPhone
      })
      .then(window.alert(`An invitation has been sent to ${targetPhoneRaw}!`))
    }
  }

  componentDidMount() {
    this.copy = new Clipboard('.copy')
    this.copy.on('success', () => {
      document.getElementById('success').textContent = 'copied!'
    })
    document.body.className='waitingBody'
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user})
    })
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

    this.levelUp = (newProps.win !== this.props.win) ? (<p><img className="levelUp" src="/gifs/levelUp.gif" loop="0" width="100px"/></p>) : (<div><h4>Level {this.props.level}</h4></div>)

  }

  clickToStart = () => {
    this.props.playerReady(this.state.user.uid)
  }

  render() {
    if (!this.state.user) return null
    const currentPlayer = this.props.players[this.state.user.uid]
    const currentViewer = this.props.viewers[this.state.user.uid]
    if (!currentPlayer && !currentViewer) {
      return <h1>Joining Coven...</h1>
    }

    if (!currentPlayer) {
      return <h1>This coven is full. Reload to try joining again.</h1>
    }

    const covenName = this.props.params.title.split('-').map((name, i) => { if (i<(this.props.params.title.split('-').length-1)) return (name.charAt(0).toUpperCase() + name.slice(1)) }).join(' ')
    const witchNum = Object.keys(this.props.players).length
    let waitingWitches = []

    let poofedWitches = []
    for (let i = 0; i < witchNum; i++) {
      waitingWitches.push('/gifs/witch' + (i+1) + '.gif')
      poofedWitches.push('/gifs/poof' + (i+1) + '.gif')
    }

    const renderWitches = waitingWitches.map((witchPic, indx) => (<img key={indx} id="waiting-witch" src={witchPic}/>))
    const renderPoofs = poofedWitches.map((witchPic, indx) => (<img key={indx} className="col-lg-3 col-md-3 col-sm-6 col-xs-6" src={witchPic}/>))

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
            <Link to="/coven"><h2>Play Again</h2></Link>
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
            <h1>You've successfully brewed the potion!</h1>
            <img className="wizardPoof" src="/gifs/poofWizard.gif" />
            <Link to="/coven"><h2>Play Again</h2></Link>
          </div>
        </ReactModal>

        <div className="row">
          {(this.props.gameStarted) ? null : (<h1>Welcome to the coven of {covenName}!</h1>)}
        </div>
        <div>
        {
          (currentPlayer && this.props.gameStarted)
            ? (
              <div id="playInterface">
                <div id="levelDisplay">{this.levelUp}</div>
                <Cauldron />
                <Timer currentPlayer={currentPlayer}/>
                <Ingredients
                  IngredientsCommands={ingredientsCommands}
                  currentPlayer={currentPlayer}/>
              </div>
            )
            : (

            <div>
              <div className="container-fluid">
                <div className="row">
                  {renderWitches}
                </div>
              </div>
              <div className="row">
                <h3>Invite a witch to your coven</h3>
                  <form>
                    <label>Enter a phone number here </label>
                    <input type="text" name="targetPhone" onChange={this.handleInviteWitch}/>
                  </form>
                  <p>or <button className="copy" data-clipboard-text={`https://www.playwitchesbrew.com/play/${this.props.params.title}`}>copy the room link</button>
                  </p><div id="success"> </div>
              {
                (currentPlayer.ready)
                  ? <div></div>
                  : (<p><img src="/gifs/readyButton.gif" id="ready" onClick={this.clickToStart} /></p>)
              }
            </div>
            </div>
            )

        }
        </div>
    </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, ultimateWin, viewers}) => ({gameStarted, players, ingredients, commands, score, level, win, ultimateWin, viewers}),
  {playerJoin, playerReady, startRound, addIngredient, commandExpired},
)(PlayInterface)
