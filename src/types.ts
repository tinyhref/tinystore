export type Listener<T> = (state: T, prevState: T) => void;

export type Handlers<T, H = any> = (store: {
  setState: Store<T, H>['setState'],
  getState: Store<T, H>['getState']
}) => H;

export interface Store<T, H> {
  getState: () => T;
  setState: (newState: Partial<T> | ((prevState: T) => Partial<T>)) => void;
  subscribe: (listener: Listener<T>) => () => void;
  handlers?: H;
}