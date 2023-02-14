import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProps {
}

@inject('configModel')
@observer
class Main extends React.Component<IProps, {}> {
  render() {
    return (
      <div>
        <h1>Main page</h1>
      </div>
    );
  }
}

export default Main;
