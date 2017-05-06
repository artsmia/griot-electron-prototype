import nextConnectRedux from 'next-connect-redux'
import { createStore, combineReducers } from 'redux'
import * as reducers from './ducks'

const reducer = combineReducers(reducers)

export const initStore = initialState => {
  return createStore(reducer, initialState)
}

export const nextConnect = nextConnectRedux(initStore)
