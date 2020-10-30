import React from 'react';
import Chart from 'chart.js'
import GraphLine from './GraphLine'

interface GraphProps {
    lines: GraphLine[]
}

export default class Graph extends React.Component {

    props: GraphProps;
    chartRef = React.createRef<HTMLCanvasElement>();

    componentDidUpdate() {
        const { lines, ...rest } = this.props;
        const firstLine = lines[0]; 
        // const secondLine = lines[1];
        const myChartRef = this.chartRef.current.getContext("2d");
        
        new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: firstLine.x_values,
                datasets: [
                    {
                        label: firstLine.label,
                        data: firstLine.y_values,
                        fill: false,
                        borderColor: "#FB4934"
                    }//,
                    // {
                    //     label: secondLine.label,
                    //     data: secondLine.y_values,
                    //     fill: false,
                    //     borderColor: "#00FF00"
                    // }
                ]
            },
            options: {
                //Customize chart options
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 80,
                        fontColor: 'rgb(255, 255, 255)',
                        fontSize: 18
                    }
                },
                scales: {
                    yAxes: [{
                        // type: 'logarithmic',
                        ticks: {
                            fontColor: '#FFF',
                            fontSize: 12
                        },
                        gridLines: {
                            color: 'rgba(255, 255, 255, 0.3)',
                            drawTicks: false,
                            drawBorder: false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: '#FFF',
                            fontSize: 12
                        }
                    }]
                }
            }
        });
    }

    render() {

        return (
            <canvas
                style={{height: '100%', width: '100%'}}
                // id="myChart"
                ref={this.chartRef}
            />
        )

    }

};