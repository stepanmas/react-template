import React from 'react';

import { NotFoundView } from './views/not-found.view';

interface IProps {
}

interface IState {
}

class NotFound extends React.Component<IProps, IState> {
  render() {
    return (
      <NotFoundView />
    );
  }
}

export default NotFound;
