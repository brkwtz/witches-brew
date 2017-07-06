'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import firebase from 'APP/fire'

import NotFound from './components/NotFound'
import GameContainer from './components/GameContainer'
import PlayInterface from './components/PlayInterface'
import LevelUp from './components/LevelUp'
import Instructions from './components/Instructions'
import Home from './components/Home.jsx'
import Intro from './components/Intro'

// Get the auth API from Firebase.
const auth = firebase.auth()

// Ensure that we have (almost) always have a user ID, by creating
// an anonymous user if nobody is signed in.
auth.onAuthStateChanged(user => user || auth.signInAnonymously())

const App = ({children}) =>
  <div>
    {/* Render our children (whatever the router gives us) */}
    {children}
  </div>

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/intro"/>
      <Route path="/play/" component={GameContainer}>
        <Route path="/play/:title" components={PlayInterface} />
        <Route path="/play/:title/levelup" component={LevelUp} />
      </Route>
      <Route path ="/intro" component={Intro}/>
      <Route path="/instructions" component={Instructions}/>
      <Route path ="/coven" component={Home}></Route>

    </Route>
    <Route path='*' component={NotFound}/>
  </Router>,
  document.getElementById('main')
)
