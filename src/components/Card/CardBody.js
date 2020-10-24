
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles'

const styles = {
  cardBody: {
    position: "absolute",
    top: "50%",
    left: "0px",
    marginLeft: "1.75rem",
    // fontSize: "2rem"
    // flex: "1 1 auto",
    // WebkitBoxFlex: "1",
    // position: "relative"
  }
};

const useStyles = makeStyles(styles);

export default function CardBody(props) {

    const classes = useStyles();
    const { className, children, ...rest } = props;
    const cardBodyClasses = classNames({
        [classes.cardBody]: true,
        [className]: className !== undefined
    });

    return (
        <div className={cardBodyClasses} {...rest}>
            {children}
        </div>
    );
}

CardBody.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};