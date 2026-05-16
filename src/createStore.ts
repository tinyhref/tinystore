import type { Store, Handlers, Listener } from './types';

const is = (x: any, y: any) => {
  return ((x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y));
}

export const objectIs: ((x: any, y: any) => boolean) = typeof Object.is === 'function' ? Object.is : is;

export const createStore = <T extends object, H>(initialState: T, handlersFn?: Handlers<T, H>): Store<T, H> => {
  let state = initialState;
  const listeners = new Set<Listener<T>>();

  const setState: Store<T, H>['setState'] = (updateState, params: { replace?: boolean } = {}) => {
    const { replace } = params;

    const nextState = typeof updateState === 'function' ? updateState(state) : updateState;

    if (nextState && !objectIs(nextState, state)) {
      const prevState = state;
      state = replace ? nextState as T : { ...state, ...nextState };
      listeners.forEach((listener) => listener(state, prevState));
    }
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
