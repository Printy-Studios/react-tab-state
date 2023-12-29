import { useEffect } from 'react';

const worker = new SharedWorker(new URL('./worker.js', import.meta.url))

export default function useTabStateControl<T>(state: T, setState: (new_state: T) => void, initial_state: T, id: string) {
    //const [localState, setLocalState] = useState<T>(null);

    const setTabState = (new_state: T) => {
        //setLocalState(new_state)
        setState(new_state);
        worker.port.postMessage({
            type: 'set_state',
            id: id,
            state: new_state
        })
    }

    useEffect(() => {
        worker.port.addEventListener('message', e => {
            console.log('received message');
            e.data;
            if (!e.data?.type) {
                return
            }

            switch (e.data.type){
                case 'set_state': {
                    if (e.data.id == id) {
                        if(e.data.state) {
                            setState(e.data.state)
                        } else {
                            setState(initial_state)
                        }
                        
                    }
                }
            }
        })
        worker.port.start() // This is important, otherwise the messages won't be received.
        worker.port.postMessage({
            type: 'get_state',
            id: id
        })
    }, [])

    return setTabState
}