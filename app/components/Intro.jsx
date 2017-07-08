import React from 'react'
import { Link, withRouter } from 'react-router'
import {connect} from 'react-redux'
import Cauldron from './Cauldron'
import Ingredients from './Ingredients'

const MobileDetect = require('mobile-detect')

export default class Intro extends React.Component {
  constructor(props) {
    super(props)
    this.md = new MobileDetect(window.navigator.userAgent)
  }

  componentDidMount() {
    document.body.className='introBody'
    setTimeout(() => this.props.router.push('/coven'), 45000)
  }

  render() {
    return (
      <div>
        <div className="mobile-container">
          <img className="introLogo" src="/gifs/WitchesBrewLogo.png" />
        </div>
        <div className="skip"><Link to="/coven"><h2>skip intro</h2></Link></div>
        <audio autoPlay>
          <source src="/music/intro.mp3" type="audio/mpeg" />
        </audio>
      </div>
    )
  }
}
