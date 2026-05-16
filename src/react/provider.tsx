import React, {
  type ReactNode,
  createContext,
  useContext
} from 'react';

import type { UseStoreParams } from './types';
import useStore from './useStore';

export type StoreMethods<T extends object, H = {}> = ReturnType<typeof useStore<T, H>>;

export interface StoreContextValue<T extends object, H> {
  storeMethods: StoreMethods<T, H>;
}

export interface StoreProviderProps<T extends object, H = {}> extends UseStoreParams<T, H> {
  children?: ReactNode;
  // storeRef?: RefObject<StoreMethods<T>>
}

export const StoreContext = createContext<StoreContextValue<any, any> | undefined>(undefined);

export const StoreProvider = <T extends object, H = {}>({
  storeKey,
  initialState,
  children,
  ...params
}: StoreProviderProps<T, H>) => {
  const storeMethods: StoreMethods<T, H> = useStore<T, H>({
    storeKey,
    initialState,
    ...params
  });

  return (
    <StoreContext.Provider
      value={{ storeMethods }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = <T extends object, H = {}>() => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }

  return context.storeMethods as StoreMethods<T, H>;
};