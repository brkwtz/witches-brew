import React from 'react'
import { withRouter } from 'react-router'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
// import command component(includes timer), ingredients component
import Cauldron from './Cauldron'
import Command from './Command'
import Ingredients from './Ingredients'

let firstTitle = ['owl',
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
'dark-crystal',]

let secondTitle = ['sisters',
'coven',
'wives',
'circle',
'nest',
'of-twilight',
'gathering',
'of-the-willow',
'of-the-flame',
'of-the-night',
'of-the-mirror',
'of-patience',
'of-nightshade',
]

const db = firebase.database()

export default class extends React.Component {
  
    constructor(props) {
        super(props)
        this.state = {
            allCovens: []
        }
        this.createNewRoom = this.createNewRoom.bind(this)
        this.goToRoom = this.goToRoom.bind(this)
        this.roomName = this.roomName.bind(this)
    }

    goToRoom(e){
        let roomName = e.target.value
        let go = '/play/' + roomName
        this.props.router.push(go);
    }

    createNewRoom() {
        let newCoven = this.roomName()
        let go = '/play/' + newCoven
        this.props.router.push(go);
    }

    roomName() {
        let newRoom = firstTitle[Math.floor(Math.random() * firstTitle.length)] + '-' + secondTitle[Math.floor(Math.random() * firstTitle.length)]
        if(this.state.allCovens.includes(newRoom)) this.createNewRoom()
        else return newRoom
    }


  componentDidMount() {
    let covens = [];
    let query = firebase.database().ref("gamerooms").orderByKey()
    query.once("value")
    .then(snapshot => {
        snapshot.forEach(function(childSnapshot) {
        let coven = childSnapshot.key;
        covens.push(coven)
        })
    })
    .then(() => { 
        this.setState({allCovens: covens})
        console.log(covens)
    })
  }


  render() {
      console.log('state covens:', this.state.allCovens)
      let openCovens = this.state.allCovens
    return (
        <div>
            <h1> Join a Coven </h1>
            <select onChange={this.goToRoom}>
                {this.state.allCovens && this.state.allCovens.map(coven => {
                    return (<option value={coven}>{coven}</option>)
                })}
            </select>
            <h1> Create a Coven </h1>
            <button onClick={this.createNewRoom}>Live Deliciously</button>
        </div>
    )
  }
}

