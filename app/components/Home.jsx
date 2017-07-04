import React from 'react'
import { withRouter, Link } from 'react-router'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import Cauldron from './Cauldron'
import Ingredients from './Ingredients'

let firstTitle = [
  'owl',
  'lunar',
  'enchantments',
  'elder-flame',
  'the-quartz',
  'witches',
  'the-hallowed',
  'spirit',
  'the-divine',
  'the-eternal-light',
  'the-ember',
  'dark-crystal',
  'the-skulls',
  'evergreen',
  'sisters',
  'coven',
  'nest',
  'secrets',
  'raven-wing',
  'the-cauldron',
  'sacred-circle',
  'moonrise',
  'dragons',
  'the-totem',
  'sriracha',
  'elder-bones',
  'fire-bones',
  'nocturnal-souls',
  'the-secret-sisterhood',
  'dead-daughters',
  'the-thorny-briar',
  'black-briar',
  'the-notorious-sisters'
]

let secondTitle = [
  'of-twilight',
  'gathering',
  'of-the-willow',
  'of-the-flame',
  'of-the-night',
  'of-the-mirror',
  'of-patience',
  'of-poison',
  'of-the-reaper',
  'of-nightshade',
  'of-the-stars',
  'of-the-witches-moon',
  'wives',
  'of-the-graveyard',
  'circle',
  'guild',
  'of-dusk',
  'of-dawn',
  'of-salem',
  'of-brooklyn',
  'of-shadow',
  'in-ashes',
  'fellowship',
  'of-the-bramble',
  'of-the-devil',
  'of-the-pentagram',
  'of-butts'
]

const db = firebase.database()

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allCovens: []
    }
    this.createNewRoom = this.createNewRoom.bind(this)
    this.roomName = this.roomName.bind(this)
  }

  createNewRoom() {
    let newCoven = this.roomName()
    let go = '/play/' + newCoven
    this.props.router.push(go)
  }

  roomName() {
    let newRoom = firstTitle[Math.abs(Math.random() * firstTitle.length-1)] + '-' + secondTitle[Math.abs(Math.random() * secondTitle.length-1)] + '-' + Math.floor(Math.random() * 100)
    if (this.state.allCovens.includes(newRoom)) this.createNewRoom()
    else return newRoom
  }

  componentDidMount() {
    document.body.className=''
  }

  render() {
    return (
      <div className="mobile-container">
        <img className="logo" src="/gifs/WitchesBrewLogo.png" />
          <div className="row center">
            <h1> Establish a new Coven... </h1>
            <img src="/gifs/liveDeliciously.png" onClick={this.createNewRoom} className="live-deliciously" />
            <p className="center bottomText"><Link to='/instructions'>How to play</Link></p>
        </div>
      </div>
    )
  }
}
