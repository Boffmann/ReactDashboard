
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles'

// TODO Styles

export default function CardBody(props) {

    const { children } = props;

    return (
        <div>
            {children}
        </div>
    );
}