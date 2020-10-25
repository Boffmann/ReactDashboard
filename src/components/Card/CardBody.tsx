import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles'

interface CardBodyProps {
    className?: string;
    children: any;
}

const useStyles = makeStyles({
    cardBody: {
        position: "absolute",
        top: "40%",
        left: "0px",
        marginLeft: "1.75rem",
        textAlign: "left",
    }
});

export default function CardBody(props: CardBodyProps) {

    const classes = useStyles();
    const { className, children, ...rest } = props;
    const cardBodyClasses = classNames({
        [classes.cardBody]: true,
        [className!]: className !== undefined && className !== null
    });

    return (
        <div className={cardBodyClasses} {...rest}>
            {children}
        </div>
    );
}
