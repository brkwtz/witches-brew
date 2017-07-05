import React from 'react'
import { Link } from 'react-router'

const Instructions = props => {
  return (
    <div className="instruction">
      {/*<h1>How to Play Witches Brew</h1>*/}
      {/*<h3>A party game for bad witches</h3>*/}
      {/*<p>Join a coven (2-4 players) and work together to add ingredients to the cauldron. Finish the potion to cast a spell onto the evil wizard before time runs out!</p>*/}
      <img src="/gifs/instruction.gif" />
      <Link to='/coven'>back</Link>
    </div>
  )
}

export default Instructions
