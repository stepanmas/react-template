import React from 'react';

import { useStyles } from '../styles/not-found.styles';

interface IProps {

}

export const NotFoundView = (props: IProps) => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      404
    </div>
  );
};
