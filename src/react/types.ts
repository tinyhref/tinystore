import type { Handlers } from '../types';

export interface UseStoreParams<T, H = any> {
  storeKey?: string;
  initialState?: T;
  isWithState?: boolean;
  handlers?: Handlers<T, H>;
  prefixKey?: string;
}