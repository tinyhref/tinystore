import type { Store, Handlers, Listener } from './types';

export const createStore = <T extends object, H>(initialState: T, handlersFn?: Handlers<T, H>): Store<T, H> => {
  let state = initialState;
  const listeners = new Set<Listener>();

  const setState: Store<T, H>['setState'] = (newState) => {
    if (typeof newState === 'function') {
      newState = newState(state);
    }
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener());
  };

  let handlers: H | undefined;
  if (typeof handlersFn === 'function') {
    handlers = handlersFn({ state, setState });
  }

  return {
    getState: () => state,
    setState,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    handlers
  };
};

export default createStore
