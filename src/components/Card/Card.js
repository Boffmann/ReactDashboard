import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const styles = {

    card: {
        // wordWrap: "break-word",
        position: "relative",
        background: "#689d6a",
        margin: "20px",
        height: "100px"
        // border: "0",
        // marginBottom: "30px",
        // marginTop: "30px",
        // borderRadius: "6px",
        // // color: "rgba(" + hexToRgb(blackColor) + ", 0.87)",
        // background: blue,
        // width: "100%",
        // // boxShadow: "0 1px 4px 0 rgba(" + hexToRgb(blackColor) + ", 0.14)",
        // position: "relative",
        // display: "flex",
        // flexDirection: "column",
        // minWidth: "0",
        // wordWrap: "break-word",
        // fontSize: ".875rem"
    }

}

const useStyles = makeStyles(styles);


export default function Card(props) {
    
    const classes = useStyles();
    const { className, children, ...rest} = props;
    const cardClasses = classNames({
        [classes.card]: true,
        [className]: className !== undefined

    });

    return (
        <div className={cardClasses} {...rest}>
            {children}
        </div>
    );
}

Card.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};