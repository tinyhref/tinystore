import type { Handlers } from '../types';

export interface UseStoreParams<T, H = {}, K extends string = string> {
  storeKey?: string;
  initialState?: T;
  isWithState?: boolean;
  handlers?: Handlers<T, H>;
  prefixKey?: K;
}