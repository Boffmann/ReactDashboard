import React, {ReactNode} from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

/*const styles = {

    card: {
        // wordWrap: "break-word",
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

}*/

interface CardProps {
    children: ReactNode;
    className?: string;
}

const useStyles = makeStyles({
    card: {
        position: "relative",
        background: "#689d6a",
        marginLeft: "10px",
        marginRight: "10px",
        height: "100%"
    }
});


const Card: React.FC<CardProps> = props => {
    
    const classes = useStyles();
    const { className, children, ...rest} = props;
    const cardClasses = classNames({
        [classes.card]: true,
        [className!]: className !== undefined && className !== null

    });

    return (
        <div className={cardClasses} {...rest}>
            {children}
        </div>
    );
}

export default Card;