# React Tab State

![react-tab-state-example](https://github.com/Printy-Studios/react-tab-state/assets/17122123/104600af-6098-4019-98ed-9ec0cdfccd77)

## Overview

This is a small React library that allows you to sync state between tabs by using the [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API).

## Features
* Sync state across tabs
* Persist state between page refreshes

## Setup
To install this package, simply run `npm i @printy/react-tab-state`

## Usage

Simply import and use the `useTabState()` hook just like you would use a normal `useState()` hook. Just like `useState()`, `useTabState()` returns an array with two variables - one for the state and the other for setting state.

## API

### **useTabState\<T\>(initial_state: T, id: string, persist: boolean = false)**

*initial_state* - The initial state.

*id* - A unique id used to identify the BroadcastChannel

*persist* - default `false` - persists data even after all the tabs have been closed.

## Support

For any questions or issues feel free to contact me at jorensmerenjanu@gmail.com
