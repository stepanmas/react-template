import React from 'react';

interface IProps {
}

class NotFound extends React.Component<IProps, {}> {
  render() {
    return (
      <div className="container">
        <h1>404</h1>
      </div>
    );
  }
}

export default NotFound;
