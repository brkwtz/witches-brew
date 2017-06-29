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

    const store = createStore(
      reducer,
      composeWithDevTools(
        applyMiddleware(
          createLogger({collapsed: true}),
          thunkMiddleware,
          store => next => {
            const listener = ref.on('child_added', snapshot => {
              next(snapshot.val())
            })
            ref.onDisconnect().remove()
            const rmlistener = ref.on('child_removed', snapshot => {
              this.mountStoreAtRef(ref)
            })
            const onceListener = ref.once('value', () => {
              while (queue.length) {
                next(queue.shift())
              }
              ready = true
              this.setState({ready: true})
            })

            this.unsubscribe = () => {
              ref.off('child_added', listener)
              ready || ref.off('value', onceListener)
            }

            let ready = false
            const queue = []
            const pushWhenReady = (action) => ready ? ref.push(action) : queue.push(action)

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

export default ({params: {title}, children}) =>
  <div>
    {/* Here, we're passing in a Firebase reference to
     /whiteboards/$whiteboardTitle. This is where the whiteboard is
     stored in Firebase. Each whiteboard is an array of actions that
     users have dispatched into the whiteboard. */}
    <GameContainer fireRef={db.ref('gamerooms').child(title)}>
      {children}
    </GameContainer>
  </div>
