const ports = [] // All ports/tabs
let latest_state = {} // Up-to-date state

// Utility function to send message to all ports at once
const postMessage = (msg, excluded_port = null) => {
    ports.forEach( port => {
        // Don't post message to the excluded port, if one has been specified
        if(port == excluded_port){
              return;
        }
        port.postMessage(msg);
    })
}

onconnect = (e) => {
    const port = e.ports[0]
    ports.push(port)

    port.onmessage = (e) => {
        // Sent by a tab to update state in other tabs
        if (e.data.type == 'set_state') {
            latest_state[e.data.id] = e.data.state

            // Send message to all ports except the requesting one
            postMessage({
                type: 'set_state',
                id: e.data.id
                state: latest_state
            }, port);
        }
        // Sent by a tab to request the value of current state. Used when initializing the state.
        if (e.data.type == 'get_state') {
            // Send message ONLY to requesting port
            port.postMessage({
                type: 'set_state',
                id: e.data.id,
                state: latest_state
            })
        }
    }
}