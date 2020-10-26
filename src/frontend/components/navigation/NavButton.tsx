import React from 'react';
import styles from './index.module.css';
import cx from 'classnames'
import PropTypes from 'prop-types'

interface PropTypes {
    onClick?: Function;
    children?: Node;
    variant: string;
    className: string;
    label: string;
    size: string;
    disabledClassName: string;
    disabled: boolean;
}

class NavButton extends React.Component {

    props: PropTypes;

    constructor(props: PropTypes) {
        super(props);
        this.props = props;
    }

    static defaultProps = {
        className: "",
        label: "",
        size: "",
        variant: "basic",
        disabled: false,
        disabledClassName: ""
    };

    handleButtonClick = (event: React.MouseEvent) => {
        const { onClick, disabled } = this.props;

        if (disabled) return;

        onClick &&
            onClick({
                event
            });
    };

    renderChildren = () => {
        const {label, children} = this.props;

        if (label) {
            return label;
        }

        if (children) {
            return children;
        }

        return "Button";
    };

    render() {
        const {
            className,
            size,
            variant,
            disabled,
            disabledClassName
        } = this.props;

        const _className = cx(
            className,
            styles[size],
            styles.button,
            styles[variant],
            {
                [styles.disabled]: disabled,
                [disabledClassName]: disabled
            }
        );

        return (
            <div onClick={this.handleButtonClick} className={_className}>
                {this.renderChildren()}
            </div>
        );
    }
}

export default NavButton;