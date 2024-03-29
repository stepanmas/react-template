import { inject, observer } from 'mobx-react';
import React from 'react';
import { Route, Switch } from 'react-router';

import { ConfigModel, TranslateModel } from './models';
import routes from './routes';

interface IApp {
  configModel: ConfigModel;
  translateModel: TranslateModel;
}

interface IAppState {

}

@inject('configModel', 'translateModel')
@observer
class App extends React.Component<IApp, IAppState> {
  public componentMap = new Map();

  constructor(props: IApp, context) {
    super(props, context);
    routes.forEach((route) => (
      this.componentMap.set(route.key, React.lazy(() => import(`@app/${route.key}`)))
    ));
  }

  public render() {
    return (
      <React.Suspense fallback="Loading...">
        <Switch>
          {routes.map((route) => (
            <Route render={() => this.getComponentCached(route.key)} {...route} />
          ))}
        </Switch>
      </React.Suspense>
    );
  }

  protected getComponentCached(name: string) {
    const Component = this.componentMap.get(name);
    return this.componentMap.has(name) ? <Component /> : null;
  }
}

export default App;
