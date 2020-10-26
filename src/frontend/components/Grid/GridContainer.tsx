import React, {ReactNode} from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

interface GridProps {
  children: ReactNode;
  className?: string;
}

const useStyles = makeStyles({
  grid: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default function GridContainer(props: GridProps) {

    const classes = useStyles();
    const {children, ...rest } = props;

    return (
        <Grid container {...rest} className={classes.grid}>
            {children}
        </Grid>
    );
}