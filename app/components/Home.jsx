import React from 'react'
import { withRouter, Link } from 'react-router'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
// import command component(includes timer), ingredients component
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
  'of-the-pentagram'
]

const db = firebase.database()

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allCovens: []
    }
    this.createNewRoom = this.createNewRoom.bind(this)
    this.goToRoom = this.goToRoom.bind(this)
    this.roomName = this.roomName.bind(this)
  }

  goToRoom(e) {
    let roomName = e.target.value
    let go = '/play/' + roomName
    this.props.router.push(go)
  }

  createNewRoom() {
    let newCoven = this.roomName()
    let go = '/play/' + newCoven
    this.props.router.push(go)
  }

  roomName() {
    let newRoom = firstTitle[Math.floor(Math.random() * firstTitle.length-1)] + '-' + secondTitle[Math.floor(Math.random() * secondTitle.length-1)]
    if (this.state.allCovens.includes(newRoom)) this.createNewRoom()
    else return newRoom
  }

  componentDidMount() {
    let covens = []
    let query = firebase.database().ref('gamerooms').orderByKey()
    query.once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          let coven = childSnapshot.key
          console.log('gameStarted = ', this.props.gameStarted)
          covens.push(coven)
        })
      })
      .then(() => {
        this.setState({allCovens: covens})
      })
  }

  render() {
    let openCovens = this.state.allCovens

    return (
      <div>
        <img src="/gifs/WitchesBrewLogo.png" />
          <h1> The initiation begins... </h1>
          <select onChange={this.goToRoom}>
          <option selected>Join a Coven</option>
            {this.state.allCovens && this.state.allCovens.map((coven, index) => {
              return (<option value={coven} key={index}>{coven.split('-').join(' ')}</option>)
            })}
          </select>
          <h1> Establish a new Coven... </h1>
          <button onClick={this.createNewRoom}>Live Deliciously</button>
          <Link to='/instructions'>How to play</Link>
      </div>
    )
  }
}

export default connect(
  ({gameStarted}) => ({gameStarted}),
  {},
)(Home)
