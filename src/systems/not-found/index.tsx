import React from 'react';

import styles from './styles.scss';

interface IProps {
}

class NotFound extends React.Component<IProps, {}> {
  render() {
    return (
      <div className={styles.container}>
        <h1>404</h1>
      </div>
    );
  }
}

export default NotFound;
