import React, { useEffect, useMemo, useState, useRef } from 'react';
import { v4 as uuid } from 'uuid'

//console.log('creating worker')
const worker = new SharedWorker(new URL('./worker.js', import.meta.url))

function useTabStateUtil(sync?: number) {

    const tabId = useMemo(() => {
        if (!sessionStorage.getItem('tab_id')) {
            sessionStorage.setItem('tab_id', uuid())
        }
        //console.log('this tab: ', sessionStorage.getItem('tab_id'));
        return sessionStorage.getItem('tab_id')
    }, [])

    const [isMainTab, setIsMainTab] = useState<boolean>(false)

    const _setIsMainTab = (value: boolean) => {
        sessionStorage.setItem('is_main', value.toString())
        setIsMainTab(value)
    }

    const getIsMainTab = () => {
        if(sessionStorage.getItem('is_main') === null){
            _setIsMainTab(false)
        }
        return sessionStorage.getItem('is_main') === 'false' ? false : true
    }

    useEffect(() => {

        worker.port.addEventListener('message', e => {
            console.log(e.data)
            if (!e.data?.type) {
                return
            }
            if (e.data.type === 'set_main_tab') {
                //console.log('in app: setting main tab to ', e.data.tab_id)
                if (e.data.tab_id === tabId) {
                    //console.log('this is the main tab')
                    //debugger
                    _setIsMainTab(true)
                } else {
                    _setIsMainTab(false)
                }
            }

            if (e.data.type == 'get_main_tab') {
                if (e.data.main_tab == tabId) {
                    _setIsMainTab(true)
                }
            }
        })

        if (sync) {
            setInterval(() => {
                
                const is_main = getIsMainTab();
                console.log('is main:', is_main)
                setIsMainTab(is_main)
            }, sync)
        }
    }, [])

    return { 
        isMainTab,
        tabId
    }
}

export { useTabStateUtil }

/**
 * Hook that allows you to sync state between tabs
 * 
 * @param {any}         initial_value   Initial value of state. Will be 
 * overwritten by state from other tabs if there are any.
 * @param {string}      id              Unique id to identify the state
 * @param {boolean}     [persist=false] Whether to persist the state even after 
 * all tabs have been closed
 * @param {number}      [timeout]       Timeout after which state will be reset 
 * to initial state. Optional
 * @param {function}    [afterTimeout]  Function to run after timeout has been
 * reached  
 * 
 * @returns [state, setState] array in the same format as a useState() hook
 */
export default function useTabState<T>(
    initial_value: T, 
    id: string, 
    persist: boolean = false, 
    timeout: number = null,
    afterTimeout?: any
) {

    const _initial_value = useMemo(() => {
        
        const local_storage_str = localStorage.getItem(id)

        if (persist && local_storage_str !== null && local_storage_str !== 'undefined') {
            console.log(local_storage_str)
            return JSON.parse(local_storage_str)
        } else {
            return initial_value
        }

    }, [])

    const [state, setState] = useState<T>(_initial_value)

    const { isMainTab, tabId } = useTabStateUtil(500)

    const _setState = (new_state: T) => {
        setState(new_state)
        worker.port.postMessage({
            type: 'set_state',
            from_tab: tabId,
            id: id,
            state: new_state
        })
    }

    useEffect(() => {

        if (timeout) {
            setInterval(() => {
                _setState(initial_value)
                afterTimeout()
            }, timeout)
        }

        worker.port.addEventListener('message', e => {
            if (!e.data?.type) {
                return
            }

            switch (e.data.type) {
                case 'get_tabs': {
                    worker.port.postMessage({
                        type: 'share_tab_id',
                        tab_id: tabId
                    })
                }
                case 'set_state': {
                    if (e.data.id == id && e.data.from_tab != tabId) {
                        setState(e.data.state)
                    }
                }
                case 'get': {
                    if (e.data.from_tab === tabId && e.data.id === id) {
                        setState(e.data.state)
                    }
                }
            }
            
        })

        worker.port.start()

        worker.port.postMessage({
            type: 'get',
            from_tab: tabId,
            id: id
        })

        worker.port.postMessage({
            type: 'get_main_tab'
        })
    }, [])

    useEffect(() => {
        if (persist) {
            localStorage.setItem(id, JSON.stringify(state))
        }
    }, [state])

    return [
        state,
        _setState
    ] as const
}