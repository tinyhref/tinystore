export type Listener = () => void;

export type Handlers<T, H = any> = (store: { state: T; setState: Store<T, H>['setState'] }) => H;

export interface Store<T, H> {
  getState: () => T;
  setState: (newState: Partial<T> | ((prevState: T) => Partial<T>)) => void;
  subscribe: (listener: Listener) => () => void;
  handlers?: H;
}