import { useEffect, useMemo, useState } from 'react';
import useTabStateControl from './useTabStateControl';

const worker = new SharedWorker(new URL('./worker.js', import.meta.url))

export default function useTabState<T>(initial_state: T, id: string): [T, (new_state: T) => void]{
    const [localState, setLocalState] = useState<T>(null);

    const setTabState = useTabStateControl(localState, setLocalState, initial_state, id);

    return [localState, setTabState];
  }