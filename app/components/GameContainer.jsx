import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'

import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'

import firebase from 'APP/fire'
const db = firebase.database()

import PlayInterface from './PlayInterface'
import Home from './Home'

export default class GameContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {ref: db.ref('gamerooms').child(this.props.params.title)}
  }

  componentDidMount() {
    this.mountStoreAtRef(this.state.ref)
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
            this.unsubscribe = () => ref.off('child_added', listener)

            return action => {
              if (action.doNotSync) { return next(action) }
              return ref.push(action)
            }
          }
        )
      )
    )
    this.setState({store})
  }

  render() {
    console.log('gamecontainer props', this.props)
    console.log('ref', this.state.ref)
    const {store} = this.state || {},
      {children} = this.props
    if (!store) return null
    let title = this.props.params.title
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}
