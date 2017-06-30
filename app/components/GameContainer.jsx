import React from 'react'

import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'

import firebase from 'APP/fire'
const db = firebase.database()

export class GameContainer extends React.Component {
  componentDidMount() {
    this.mountStoreAtRef(this.props.fireRef)
  }

  componentWillReceiveProps(incoming, outgoing) {
    this.mountStoreAtRef(incoming.fireRef)
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  mountStoreAtRef(ref) {
    if (this.state && this.state.store) {
      this.unsubscribe && this.unsubscribe()
      this.unsubscribe = null
      this.setState({store: null})
      return process.nextTick(() => this.mountStoreAtRef(ref))
    }

    const presenceRef = ref.child('roster').child(this.props.user.uid)
    presenceRef.set(true)
    presenceRef.onDisconnect().remove()
    const actionsRef = ref.child('actions')

    const store = createStore(
      reducer,
      composeWithDevTools(
        applyMiddleware(
          createLogger({collapsed: true}),
          thunkMiddleware,
          store => next => {
            const queue = []

            const listener = actionsRef.on('child_added', snapshot => {
              next(snapshot.val())
            })

            // Delete the room when *anyone* disconnects
            // ref.onDisconnect().remove()
            // When the room goes away, remount the store, resetting
            // its state.
            const remount = () => this.mountStoreAtRef(ref)
            const drainQueueAndSetReady = () => {
              while (queue.length) {
                next(queue.shift())
              }
              ready = true
              this.setState({ready: true})
            }
            actionsRef.once('child_removed', remount)
            actionsRef.once('value', drainQueueAndSetReady)

            this.unsubscribe = () => {
              actionsRef.off('child_added', listener)
              actionsRef.off('child_removed', remount)
              actionsRef.off('value', drainQueueAndSetReady)
            }

            let ready = false
            const pushWhenReady = (action) => ready ? actionsRef.push(action) : queue.push(action)

            return action => {
              if (action.doNotSync) { return next(action) }
              return pushWhenReady(action)
            }
          }
        )
      )
    )
    this.setState({store})
  }

  render() {
    const {store, ready} = this.state || {},
      {children, loading=<h1>Entering the Coven...</h1>} = this.props
    if (!store) return null
    if (!ready) return loading
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

class Auth extends React.Component {
  componentDidMount() {
    const {auth} = this.props
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {user} = this.state || {}
    if (!user) return null
    const child = React.Children.only(this.props.children)
    return React.cloneElement(child, {user})
  }
}

export default ({params: {title}, children}) =>
  <div className="container-fluid">
    {/* Here, we're passing in a Firebase reference to
     /whiteboards/$whiteboardTitle. This is where the whiteboard is
     stored in Firebase. Each whiteboard is an array of actions that
     users have dispatched into the whiteboard. */}
    <Auth auth={firebase.auth()}>
      <GameContainer fireRef={db.ref('gamerooms').child(title)}>
        {children}
      </GameContainer>
    </Auth>
  </div>
