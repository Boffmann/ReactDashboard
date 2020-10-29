import React, {ReactNode} from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

interface GridProps {
  children: ReactNode;
  className?: string;
  height: string;
}

const useStyles = makeStyles({
  grid: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // height: '20%',
    marginTop: '2%',
    marginBottom: '2%'
  }
});

export default function GridContainer(props: GridProps) {

  const classes = useStyles();
  const {children, height, ...rest } = props;

  return (
      <Grid container {...rest} style={{height: height}} className={classes.grid}>
          {children}
      </Grid>
  );
}
