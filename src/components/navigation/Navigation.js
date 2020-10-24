import React from 'react';
import Clock from './Clock'
import NavButton from './NavButton'
import "bootstrap/dist/css/bootstrap.css"


function Navigation(props) {

    return (
    <nav style={{backgroundColor: "#504945"}} className="navbar navbar-expand-lg is-dark-text">
        <div className="navbar-nav h1 mb-0 text-large font-medium">
            <NavButton label ="First" variant="basic"/>
            <NavButton label ="Second" variant="basic"/>
            <NavButton label ="Third" variant="basic"/>
        </div>
        <div style={{color: "#ebdbb2"}} className="navbar-nav ml-auto">
                <Clock />
        </div>
    </nav>
    );
}

export default Navigation;