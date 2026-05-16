import React, {
  type ReactNode,
  createContext
} from 'react';

import type { UseStoreParams } from './types';
import useStore from './useStore';

export type StoreMethods<T extends object, H = any> = ReturnType<typeof useStore<T, H>>;

interface StoreContextValue<T extends object, H> {
  storeMethods: StoreMethods<T, H>;
}

interface StoreProviderProps<T extends object, H = any> extends UseStoreParams<T, H> {
  children?: ReactNode;
  // storeRef?: RefObject<StoreMethods<T>>
}

const StoreContext = createContext<StoreContextValue<any, any> | undefined>(undefined);