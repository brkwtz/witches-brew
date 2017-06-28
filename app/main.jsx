'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'

import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'

import firebase from 'APP/fire'

import Demos from 'APP/demos'
import GameContainer from './components/GameContainer'
import PlayInterface from './components/PlayInterface'
import LevelUp from './components/LevelUp'
import Instructions from './components/Instructions'
import Home from './components/Home.jsx'
import GameOverContainer from './components/GameOverContainer'

// Get the auth API from Firebase.
const auth = firebase.auth()

// Ensure that we have (almost) always have a user ID, by creating
// an anonymous user if nobody is signed in.
auth.onAuthStateChanged(user => user || auth.signInAnonymously())

const App = ({children}) =>
  <div>
    <nav>
      {/* WhoAmI takes a firebase auth API and renders either a
          greeting and a logout button, or sign in buttons, depending
          on if anyone's logged in */}
      <WhoAmI auth={auth}/>
    </nav>
    {/* Render our children (whatever the router gives us) */}
    {children}
  </div>

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/coven"/>
      <Route path="/play/" component={GameContainer}>
        <Route path="/play/:title" components={PlayInterface} />
        <Route path="/play/:title/levelup" component={LevelUp} />
        {/*<Route path="/play/:title/gameover" component={GameOverContainer} />*/}
      </Route>
      <Route path="/instructions" component={Instructions}/>
      <Route path ="/coven" component={Home}></Route>
      <Route path="/gameover" component={GameOverContainer} />

    </Route>
    <Route path='*' component={NotFound}/>
  </Router>,
  document.getElementById('main')
)
