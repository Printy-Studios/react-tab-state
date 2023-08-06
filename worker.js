const ports = []
let all_tabs = []
let main_tab = ''

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

    
    
    const getTabs = () => {
        all_tabs = []
        postMessage({
            type: 'get_tabs'
        })
        setTimeout(() => {
            setMainTab()
        }, 400)
    }

    const setMainTab = () => {
        postMessage('trying to set main tab')
        if (all_tabs.length > 0 && main_tab !== all_tabs[0]) {
            postMessage('setting main tab')
            main_tab = all_tabs[0]
            postMessage({
                type: 'set_main_tab',
                tab_id: main_tab
            })
        }
    }

    getTabs()

    setInterval(() => {
        getTabs()
    }, 6000)

    setInterval(() => {
        // port.postMessage({
        //     msg: "checking if all tabs include main tab",
        //     all_tabs: all_tabs,
        //     main_tab: main_tab
        // })

        if (!all_tabs.includes(main_tab)) {
            //port.postMessage('don\'t include')
            setMainTab()
        }
    }, 5000)

    port.onmessage = (e) => {
        if (e.data.type === 'share_tab_id') {
            all_tabs.push(e.data.tab_id)
        }
        if (e.data.type == 'set_state') {
            postMessage({
                type: 'set_state',
                id: e.data.id,
                from_tab: e.data.from_tab,
                state: e.data.state,
                test: 'abc'
            })
        }
    }
}