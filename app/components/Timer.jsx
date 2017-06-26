import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

// import {} from './reducers'

export default (props) => {
  let timerProps = props.props
  console.log('timer props', timerProps)
  return (
    <div>
      <p id='countdown'></p>
    </div>
  )
}


// let commandTimer = (secs) => {
//           //countdown timer
//           let interval = setInterval( () => {
//             if (secs===0) clearInterval(interval)
//             return secs--
//           }, 1000)
//           //command change
//           if(secs===0) {
//             state.player.currentCommand = state.commands.shift()
//           }
//         }
