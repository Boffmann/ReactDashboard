import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles'

const styles = {
    cardHeader: {
        position: "absolute",
        top: "0px",
        left: "0px",
        margin: "0.75rem",
        // marginBottom: "0",
        // borderBottom: "none",
        // background: "transparent",
        // zIndex: "3 !important",
    }
};

const useStyles = makeStyles(styles);

export default function CardHeader(props) {
    const classes = useStyles();
    const { className, children, ...rest } = props;
    const cardHeaderClasses = classNames({

        [classes.cardHeader]: true,
        [className]: className !== undefined

    });

    return (
        <div className={cardHeaderClasses} {...rest}>
            {children}
        </div>
    );
}

CardHeader.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
}