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

// https://github.com/facebook/react/issues/16604#issuecomment-528663101
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  const runtime = require('react-refresh/runtime');
  runtime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;
}

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
