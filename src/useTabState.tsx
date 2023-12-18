import { useEffect, useMemo, useState } from 'react';

const worker = new SharedWorker(new URL('./worker.js', import.meta.url))

export default function useTabState<T>(initial_state: T, id: string){
    const [localState, setLocalState] = useState<T>(initial_state);

    const setTabState = (new_state: T) => {
        setLocalState(new_state)
        worker.port.postMessage({
            type: 'set_state',
            id: id,
            state: new_state
        })
    }

    useEffect(() => {
        worker.port.addEventListener('message', e => {
            if (!e.data?.type) {
                return
            }

            switch (e.data.type){
                case 'set_state': {
                    if (e.data.id == id) {
                        setLocalState(e.data.state)
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
  }