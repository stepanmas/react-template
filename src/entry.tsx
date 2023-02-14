import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'react-router';

import App from './app';
import * as models from './models';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const stores = {
  routing: routingStore,
  ...models,
};
const appName = 'app-root';
const container = document.createElement(appName);
const history = syncHistoryWithStore(browserHistory, routingStore);

document.body.appendChild(container);
document.querySelector(appName)!.attachShadow({ mode: 'open' });
const root = ReactDOM.createRoot(document.querySelector(appName)!.shadowRoot!);

const RENDER = (COMPONENT: any) => root.render(
  <Provider {...stores}>
    <Router history={history}>
      <COMPONENT />
    </Router>
  </Provider>,
);

RENDER(App);

if ((module as any).hot) {
  (module as any).hot.accept(
    './app',
    () => {
      // eslint-disable-next-line global-require
      const nextApp = require('./app').default;
      RENDER(nextApp);
    },
  );
}
