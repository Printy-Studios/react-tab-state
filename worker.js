const ports = []
let all_tabs = new Set()
let main_tab = ''
// let all_tabs_temp = []
let check_tabs = false
let latest_state = {}

const postMessage = (msg) => {
    ports.forEach( port => {
        port.postMessage(msg)
    })
}

onconnect = (e) => {
    postMessage('connected: ', e)
    const port = e.ports[0]
    ports.push(port)

    postMessage({
        type: 'test'
    })

    //postMessage(ports)

    
    
    const getTabs = () => {
        check_tabs = false
        all_tabs.clear()
        // all_tabs_temp = []
        postMessage({
            type: 'get_tabs'
        })
        setTimeout(() => {
            //all_tabs = all
            setMainTab()
            check_tabs = true
        }, 3000)
    }

    const setMainTab = () => {
        //postMessage('trying to set main tab')
        //postMessage(all_tabs)
        //postMessage(all_tabs)
        if (all_tabs.size > 0 && !all_tabs.has(main_tab)) {
            
            main_tab = Array.from(all_tabs)[0]
            //postMessage('worker: setting main tab to ' + main_tab)
        }

        postMessage({
            type: 'set_main_tab',
            tab_id: main_tab
        })
    }

    getTabs()

    setInterval(() => {
        if(check_tabs) {
            getTabs()
        }
       
    }, 500)

    // setInterval(() => {
    //     // port.postMessage({
    //     //     msg: "checking if all tabs include main tab",
    //     //     all_tabs: all_tabs,
    //     //     main_tab: main_tab
    //     // })

    //     if (!all_tabs.includes(main_tab)) {
    //         //port.postMessage('don\'t include')
    //         setMainTab()
    //     }
    // }, 4000)

    port.onmessage = (e) => {
        if (e.data.type === 'share_tab_id') {
            //postMessage('tab id share: ' + e.data.tab_id)
            // if (!all_tabs.includes[e.data.tab_id]) {
            //     all_tabs.push(e.data.tab_id)
            // }
            all_tabs.add(e.data.tab_id)
        }
        if (e.data.type == 'set_state') {
            
            
            latest_state[e.data.id] = e.data.state

            postMessage('setting latest state to')
            postMessage(latest_state)
            
            postMessage({
                type: 'set_state',
                id: e.data.id,
                from_tab: e.data.from_tab,
                state: e.data.state,
                test: 'abc'
            })
        }
        if (e.data.type == 'get_main_tab') {
            postMessage({
                type: 'get_main_tab',
                from_tab: e.data.from_tab,
                main_tab: main_tab
            })
        }
        if (e.data.type == 'get') {
            postMessage('sending latest state for' + e.data.id + ', which is')
            postMessage(latest_state)
            if (latest_state[e.data.id] !== undefined) {
                postMessage({
                    type: 'get',
                    id: e.data.id,
                    from_tab: e.data.from_tab,
                    state: latest_state[e.data.id]
                })
            }
            
        }
    }
}