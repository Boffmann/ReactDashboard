import React from 'react';
import { getNodeMajorVersion } from 'typescript';

interface ClockState {
    date: Date;
}

interface ClockProps {

}

class Clock extends React.Component {
    state: ClockState;
    // TODO Type is NodeJS.Timeout
    timerID: any;

    constructor(props: ClockProps) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
                1000
        );
    }

    componentDidUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {

        const styles = {
            display: 'inline-block',
            padding: '10px'
        }

        return(
            <div>
                <h4 style={styles}>{this.state.date.toLocaleDateString()}</h4>
                <h4 style={styles}>{this.state.date.toLocaleTimeString()}</h4>
            </div>
        );
    }
}

export default Clock;