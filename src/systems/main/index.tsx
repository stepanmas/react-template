import { ConfigModel, TranslateModel } from '@app/models';
import Controller from '@app/shared/controller';
import { MainView } from '@app/systems/main/views/main.view';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IMainControllerProps {
}

interface IState {
}

type IProps = (
  IMainControllerProps
  & { configModel: ConfigModel }
  & { translateModel: TranslateModel }
)

@inject('configModel', 'translateModel')
@observer
class MainController extends Controller<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      ...this.state,
      loading: ['app'],
    };
  }

  componentDidMount() {
    this.subManager.on(
      't',
      this.props.translateModel.use$('common')
        .subscribe({
          error: () => {
            this.loadManager.off('app');
          },
          next: () => {
            this.props.translateModel.setBrowserTitle('common.appName');
            this.loadManager.off('app');
          },
        }),
    );
  }

  render() {
    return (
      <MainView />
    );
  }
}

export default MainController;
