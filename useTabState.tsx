import React, { useEffect, useMemo, useState, useRef } from 'react';
import { v4 as uuid } from 'uuid'

const worker = new SharedWorker(new URL('./worker.js', import.meta.url))

export default function useTabState<T>(
    initial_value: T, 
    id: string, 
    persist: boolean = false, 
    timeout: number = null,
    afterTimeout?: any
) {

    const _initial_value = useMemo(() => {
        
        const local_storage_str = localStorage.getItem(id)

        if (persist && local_storage_str !== null) {
            return JSON.parse(local_storage_str)
        } else {
            return initial_value
        }

    }, [])

    const [state, setState] = useState<T>(_initial_value)

    const tabId = useMemo(() => {
        if (!sessionStorage.getItem('tab_id')) {
            sessionStorage.setItem('tab_id', uuid())
        }
        console.log('this tab: ', sessionStorage.getItem('tab_id'));
        return sessionStorage.getItem('tab_id')
    }, [])

    const setIsMainTab = (value: boolean) => {
        sessionStorage.setItem('is_main', value.toString())
    }

    const isMainTab = () => {
        if(sessionStorage.getItem('is_main') === null){
            setIsMainTab(false)
        }
        return !!sessionStorage.getItem('is_main')
    }

    //const [isMainTab, setIsMainTab] = useState<boolean>(false)

    //const stateRef = useRef(state)
    //stateRef.current = state

    //const isMainTabRef = useRef(isMainTab)
    //isMainTabRef.current = isMainTab

    // const worker = useMemo(() => {
    //     return new SharedWorker(new URL('./worker.js', import.meta.url))
    // }, [])

    const _setState = (new_state: T) => {
        setState(new_state)
        // worker.port.postMessage({
        //     type: 'set_state',
        //     from_tab: tabId,
        //     id: id,
        //     state: new_state
        // })
    }


    const channel = useMemo(() => {
        //console.log('creating broadcast channel at ' + id)
        return new BroadcastChannel(id)
    }, [])

    useEffect(() => {

        if (timeout) {
            setInterval(() => {
                _setState(initial_value)
            }, timeout)
        }

        //setIsMainTab(true)

        worker.port.onmessage = e => {
            console.log(e.data)
            if (e.data.type === 'get_tabs') {
                worker.port.postMessage({
                    type: 'share_tab_id',
                    tab_id: tabId
                })
            } else if (e.data.type === 'set_main_tab') {
                console.log('setting main tab to ', e.data.tab_id)
                if (e.data.tab_id === tabId) {
                    console.log('this is the main tab')
                    //debugger
                    setIsMainTab(true)
                } else {
                    setIsMainTab(false)
                }
            }

            if (e.data.type == 'set_state' && e.data.id == id && e.data.from_tab != tabId) {
                console.log('setting state')
                console.log(e.data.from_tab)
                console.log(tabId)
                //setState(e.data.state)
            }
        }

        // channel.addEventListener('message', (e) => {
        //     if (e.data.type === 'get') {
        //         channel.postMessage({
        //             type: 'set',
        //             state: stateRef.current
        //         })
        //     } else {
        //         setState(e.data.state)
        //     }

        // })

        channel.postMessage({
            type: 'get'
        })
    }, [])

    useEffect(() => {
        if (persist) {
            localStorage.setItem(id, JSON.stringify(state))
        }
    }, [state])

    // useEffect(() => {
    //     console.log('in tab: ', isMainTab)
    // }, [isMainTab])

    return [
        state,
        _setState,
        isMainTab
    ] as const
}