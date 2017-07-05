import React from 'react'
import { Link } from 'react-router'

const Instructions = props => {
  return (
    <div className="center">
      <img className="instruction center" src="/gifs/scroll.gif" />
      <p><Link to='/coven'><img src="/gifs/backButton.gif"/></Link></p>
    </div>
  )
}

export default Instructions
