import React from 'react';
import Clock from './Clock'
import NavButton from './NavButton'
import "bootstrap/dist/css/bootstrap.css"


function Navigation(props) {

    return (
    <nav className="navbar navbar-expand-lg fixed-top is-white is-dark-text">
        <div className="navbar-brand h1 mb-0 text-large font-medium">
            <NavButton label ="First" variant="basic"/>
            <NavButton label ="Second" variant="basic"/>
            <NavButton label ="Third" variant="basic"/>
        </div>
        <div className="navbar-nav ml-auto">
                <Clock />
        </div>
    </nav>
    );
}

export default Navigation;