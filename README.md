# React Tab State

![react-tab-state-example](https://github.com/Printy-Studios/react-tab-state/assets/17122123/104600af-6098-4019-98ed-9ec0cdfccd77)

## Overview

This is a small React library that allows you to sync state between tabs by 
using the 
[SharedWorker API](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker).

## Setup
To install this package, simply run `npm i @printy/react-tab-state`

## Usage

Simply import and use the `useTabState()` hook just like you would use a normal 
`useState()` hook. Just like `useState()`, `useTabState()` returns an array with
 two variables - one for the state and the other for setting state.

## Example

```
    import useTabState from '@printy/react-tab-state'
    function MyComponent() {
        const [counter, setCounter] = useTabState(0, 'counter')

        return (
            <button
                onClick={() => setCounter(counter + 1)}
            >
                {counter}
            </button>
        )
    }
```

## API

### **useTabState\<T\>(initial_state: T, id: string)**

This is the main hook of the library that you can use to create state that is
synced across tabs

#### Params

*initial_state* - The initial state

*id* - A unique id used to identify the BroadcastChannel

#### Return value

Returns an array with the state and the setState function, just like a regular
`setState()` hook.

## Support

For any questions or issues feel free to submit an issue or email me at [jorensmerenjanu@gmail.com](mailto:jorensmerenjanu@gmail.com)
