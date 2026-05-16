import { useRef, useCallback, useSyncExternalStore, useMemo } from 'react';

import type { RefObject } from 'react';

import createStore from '../createStore';

import type { UseStoreParams } from './types';
import type { Store } from '../types';

type StoresMap = Map<string, Store<any, any>>;

const stores: StoresMap = new Map();

export const isServer = typeof window === 'undefined';

type ExtendProps<K extends string, T, H> = string extends K
  ? {}
  : {
  [P in `${K}Handlers`]: H | undefined;
} & {
  [P in `use${Capitalize<K>}Selector`]: <S>(selector: (state: T) => S) => S;
} & {
  [P in `get${Capitalize<K>}State`]: () => T;
};

export const useStore = <T extends object, H = any, K extends string = string>(
  params: UseStoreParams<T, H, K> = {}
) => {
  const { initialState = {} as T, storeKey, isWithState, prefixKey } = params;
  const { handlers: handlersFn } = params;

  const storeRef = useRef<Store<T, H> | null>(null);

  const getStore = useCallback(({ storeKey, storeRef, stores, handlers }: {
    storeKey?: string;
    storeRef: RefObject<Store<T, H> | null>;
    stores: StoresMap
    handlers?: UseStoreParams<T, H>['handlers']
  }) => {
    if (storeKey && !isServer) {
      const store = stores.get(storeKey);

      if (store) {
        return store as Store<T, H>;
      }
    }

    if (!storeRef.current) {
      storeRef.current = createStore<T, H>(initialState, handlers);
    }

    if (!storeKey || isServer) {
      return storeRef.current;
    }

    stores.set(storeKey, storeRef.current);
    return stores.get(storeKey)!;
  }, []);

  const store = getStore({ storeKey, storeRef, stores, handlers: handlersFn });

  const useStoreSelector = useCallback(<S, >(selector: (state: T) => S): S => {
    const getSnapshot = () => selector(store.getState());
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
  }, [store]);

  let handlers: H | undefined;

  if (typeof handlersFn === 'function') {
    const state = store.getState();
    handlers = handlersFn({ state, setState: store.setState });
  } else {
    handlers = handlersFn
  }

  const storeProps = {
    ...store,
    handlers: {
      ...store.handlers,
      ...handlers,
    } as H,
    useStoreSelector,
    destroy: () => {
      storeRef.current = null;
      if (storeKey) {
        stores.delete(storeKey);
      }
    }
  };

  if (isWithState) {
    (storeProps as any).state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  }

  const { key, prefix } = useMemo(() => {
    if (prefixKey) {
      const key = prefixKey.replace(/[^a-zA-Z0-9]/g, '');

      return {
        key,
        prefix: key.charAt(0).toUpperCase() + key.slice(1)
      }
    }

    return {}
  }, [prefixKey]);

  if (key) {
    (storeProps as unknown as Record<string, unknown>)[`${key}Handlers`] = storeProps.handlers;
  }

  if (prefix) {
    (storeProps as unknown as Record<string, unknown>)[`use${prefix}Selector`] = useStoreSelector;
    (storeProps as unknown as Record<string, unknown>)[`get${prefix}State`] = store.getState;
  }

  return storeProps as typeof storeProps & ExtendProps<K, T, H>
}

export default useStore