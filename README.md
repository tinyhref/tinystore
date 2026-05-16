# tinystore

##  Installation

```bash
npm install @tinyhref/tinystore
or
yarn add @tinyhref/tinystore
```

## Use It

```js
import React from 'react';
import { useStore } from '@tinyhref/tinystore';

function Counter() {
  const storeMethods = useStore({
    storeKey: '', // optional
    initialState: {
      count: 0
    },
    handlers: ({ setState }) => {
      return {
        inc: () => setState((state) => ({ count: state.count + 1 }))
      }
    }
  });

  const { useStoreSelector, handlers } = storeMethods;

  const count = useStoreSelector(state => state.count);

  return (
    <div>
      <span>{count}</span>
      <button onClick={handlers.inc}>one up</button>
    </div>
  )
}
```