import React from 'react'
import { Link } from 'react-router'

const Instructions = props => {
  return (
    <div className="instruction">
      <p ><img className="scroll" src="/gifs/scroll.gif" /></p>
      <p><Link to='/coven'><img className="backButton" src="/gifs/backButton.gif"/></Link></p>
    </div>
  )
}

export default Instructions
