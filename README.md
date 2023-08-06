# React Tab State

![react-tab-state-example](https://github.com/Printy-Studios/react-tab-state/assets/17122123/104600af-6098-4019-98ed-9ec0cdfccd77)

## Overview

This is a small React library that allows you to sync state between tabs by 
using the 
[SharedWorker API](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker).

## Features
* Sync state across tabs
* Persist state between page refreshes

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

### **useTabState\<T\>(initial_state: T, id: string, persist: boolean = false, timeout: number = null, afterTimeout?: any)**

This is the main hook of the library that you can use to create state that is
synced across tabs

#### Params

*initial_state* - The initial state

*id* - A unique id used to identify the BroadcastChannel

*persist* - default `false` - Persist data even after all the tabs have been closed.

*timeout* - default `null` - Reset state to initial state after the number of ms
specified. If set to `null`, no reset is done

*afterTimeout* - Function to run after timeout has occurred

#### Return value

Returns an array with the state and the setState function, just like a regular
`setState()` hook.


### **useTabStateUtil(sync_main_tab?: number)**

This is a helper hook that exposes you to some useful things such as the ID of
the current and main tabs. If you're creating a component/app/hook that needs
a central main tab, you can use the isMainTab to check if the current tab is the
main tab. Currently the main tab gets determined by the worker and there is no 
way to set a main tab yourself.

#### Params

*sync_main_tab* - optional - (in ms) How often to check and update the main tab value if it 
has changed in session storage. This is useful if you are using multiple 
`useTabState()` hooks, because the main_tab value in session storage may not be
up to date if you use multiple `useTabState()`s. Recommended value is `100`-`1000`.
It's okay not to provide any value to this if you're not updating the main tab id
manually

#### Return value

Returns an object with the following properties - 

*isMainTab* - `boolean` - Tells you whether the current tab is the main tab
*tabId* - `string` - The id of the current tab

## Support

For any questions or issues feel free to contact me at jorensmerenjanu@gmail.com
