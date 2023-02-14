import React from 'react';

import { useStyles } from '../styles/main.styles';

interface IProps {

}
export const MainView = (props: IProps) => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      Main
    </div>
  );
};
