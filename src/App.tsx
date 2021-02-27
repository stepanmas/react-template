// eslint-disable-next-line import/no-unresolved
import '@styles/main.scss?global';

import { detectLanguage, fetchLanguage } from '@components/shared/i18n';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

@inject('configModel')
@observer
class App extends React.Component<any, any> {
  componentMap = new Map();

  constructor(props: any) {
    super(props);
    this.componentMap.set('main', React.lazy(() => import('@components/main/Main')));
    this.componentMap.set('not-found', React.lazy(() => import('@components/not-found/NotFound')));
  }

  public render() {
    const { configModel } = this.props;

    if (!configModel.lang) {
      const lang = detectLanguage();

      fetchLanguage(lang, (lg: string) => {
        configModel.setLanguage(lg);
      });

      return null;
    }

    return (
      <BrowserRouter>
        <React.Suspense fallback={<div>Загрузка...</div>}>
          <Switch>
            <Route exact path="/:lang?" render={() => this.getComponentCached('main')} />
            <Route render={() => this.getComponentCached('not-found')} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }

  private getComponentCached(name: string) {
    const Component = this.componentMap.get(name);
    return this.componentMap.has(name) ? <Component /> : null;
  }
}

export default App;
