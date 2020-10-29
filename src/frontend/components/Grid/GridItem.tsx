import React, {ReactNode} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

interface GridItemProps {
  children: ReactNode;
  className?: string;
  xs: number;
}

const useStyles = makeStyles({
  grid: {
    height: '100%'
  }
});

const GridItem: React.FC<GridItemProps> = (props) => {
    const classes = useStyles();
    const { children, xs, ...rest } = props;
    return (
        <Grid item xs {...rest} className={classes.grid}>
            {children}
        </Grid>
    );
}

export default GridItem;