import React, {ReactNode} from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

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
        height: "100%",
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