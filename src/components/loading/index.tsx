import * as React from 'react';

interface IProps {
  size?: string;
}

const Loading: React.FunctionComponent<IProps> = (
  {
    size: Size = 'h5',
    children = 'Загружаю...',
  },
) => (
  // @ts-ignore
  <Size className="loading-text fill"><em className="loading inline" /> {children}</Size>
);

export default Loading;
