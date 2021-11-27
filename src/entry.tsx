import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { RouterStore } from '@superwf/mobx-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';

import App from './App';
import * as models from './components/models';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore(browserHistory);
const stores = {
  routing: routingStore,
  ...models,
};

// eslint-disable-next-line react/no-render-return-value
const RENDER = (COMPONENT: any) => ReactDOM.render(
  <Provider {...stores}>
    <Router history={routingStore.history}>
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
