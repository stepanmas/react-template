import { IMain } from '@type/interface';
import cx from 'classnames';
import { inject, observer } from 'mobx-react';
import React from 'react';

import styles from './main.scss';

interface IProps {
}

@inject('configModel')
@observer
class Main extends React.Component<IProps, {}> implements IMain {
  z() {

  }

  method() {
    return '';
  }

  render() {
    return (
      <div className={cx('container', styles.container)}>
        <h1>Main page</h1>
      </div>
    );
  }
}

export default Main;
