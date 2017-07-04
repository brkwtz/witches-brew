import React from 'react'
import { Link, withRouter } from 'react-router'
import {connect} from 'react-redux'
import Cauldron from './Cauldron'
import Ingredients from './Ingredients'

const MobileDetect = require('mobile-detect')

export default class Intro extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        skip: false
    }
    this.md = new MobileDetect(window.navigator.userAgent)
  }


  componentDidMount (){
    document.body.className='introBody'
    // if(!this.mobilePlayer){this.props.router.push('/coven')}
    // comment line 21 back in for deployment...
    setTimeout(() => this.setState({skip: true}), 2000)
    setTimeout(() => this.props.router.push('/coven'), 8000)
}
  
  get mobilePlayer() {
    let detect = this.md.ua
    let playingOnA = detect.slice((detect.indexOf('(') + 1), detect.indexOf(';'))
    if (playingOnA === 'iPhone' || playingOnA === 'Android') {
      return true
    } else {
      return false
    }
  }

  render() {
    

    return (
      <div>
          <div className="mobile-container">
           <img className="logo" src="/gifs/WitchesBrewLogo.png" />
           </div>
            <div className="skip">
            {this.state.skip ? 
            <h1><Link  to='/coven'>skip intro</Link></h1>
            : <h1></h1>
          }
           </div>
      </div>
    )
  }
}
