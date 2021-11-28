import UtilsService from '@components/shared/UtilsService';
import cx from 'classnames';
import { resolve } from 'inversify-react';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Alert } from 'react-bootstrap';

import styles from './main.scss';

interface IProps {
}

@inject('configModel')
@observer
class Main extends React.Component<IProps, {}> {
  @resolve private readonly utils!: UtilsService;

  render() {
    console.log(this.props, this.utils.isDev());
    return (
      <div className={cx('container', styles.container)}>
        <Alert variant="secondary">Warn!1</Alert>
        <h1>Main page</h1>
      </div>
    );
  }
}

export default Main;
