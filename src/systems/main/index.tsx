import { inject, observer } from 'mobx-react';
import React from 'react';

import styles from './styles.scss';

interface IProps {
}

@inject('configModel')
@observer
class Main extends React.Component<IProps, {}> {
  render() {
    return (
      <div className={styles.container}>
        <h1>Main page</h1>
      </div>
    );
  }
}

export default Main;
