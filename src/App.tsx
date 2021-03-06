// eslint-disable-next-line import/no-unresolved
import '@styles/main.scss?global';

import { detectLanguage, fetchLanguage } from '@components/shared/i18n';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { ConfigModel } from './components/models';
import routes from './routes';

interface IApp {
  configModel: ConfigModel;
}

interface IAppState {

}

@inject('configModel')
@observer
class App extends React.Component<IApp, IAppState> {
  public componentMap = new Map();

  constructor(props: IApp) {
    super(props);
    routes.forEach((route) => (
      this.componentMap.set(route.key, React.lazy(() => import(`@components/${route.key}`)))
    ));
  }

  public render() {
    const { configModel } = this.props;

    if (!configModel.lang) {
      const lang = detectLanguage();

      fetchLanguage(lang).subscribe((lg) => {
        configModel.setLanguage(lang);
      });
      return null;
    }

    return (
      <BrowserRouter>
        <React.Suspense fallback={<div>Загрузка...</div>}>
          <Switch>
            {routes.map((route) => (
              <Route render={() => this.getComponentCached(route.key)} {...route} />
            ))}
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }

  protected getComponentCached(name: string) {
    const Component = this.componentMap.get(name);
    return this.componentMap.has(name) ? <Component /> : null;
  }
}

export default App;
