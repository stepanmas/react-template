import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { createHashHistory } from 'history';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';

import App from './App';
import * as models from './components/models';

const hashHistory = createHashHistory();
const routingStore = new RouterStore();
const stores = {
  routing: routingStore,
  ...models,
};
const history = syncHistoryWithStore(hashHistory, routingStore);

// eslint-disable-next-line react/no-render-return-value
const RENDER = (COMPONENT: any) => ReactDOM.render(
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Provider {...stores}>
    <Router history={history}>
      <COMPONENT />
    </Router>
  </Provider>,
  document.getElementById('root'),
);

RENDER(App);

if ((module as any).hot) {
  (module as any).hot.accept(
    './App',
    () => {
      // eslint-disable-next-line global-require
      const nextApp = require('./App').default;
      RENDER(nextApp);
    },
  );
}
