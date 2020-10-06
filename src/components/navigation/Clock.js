import React from 'react';

class Clock extends React.Component {

    constructor(props) {
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