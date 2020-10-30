import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles'

interface CardHeaderProps {
    className?: string;
    children: any;
};

const useStyles = makeStyles({
    cardHeader: {
        position: "absolute",
        top: "0px",
        left: "0px",
        // margin: "0.75rem",
        width: '100%',
        height: '70%'
    }
});

export default function CardHeader(props: CardHeaderProps) {
    const classes = useStyles();
    const { className, children, ...rest } = props;
    const cardHeaderClasses = classNames({

        [classes.cardHeader]: true,
        [className!]: className !== undefined && className !== null

    });

    return (
        <div className={cardHeaderClasses} {...rest}>
            {children}
        </div>
    );
}