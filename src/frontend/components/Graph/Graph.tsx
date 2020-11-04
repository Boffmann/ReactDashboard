import React from 'react';
import Chart from 'chart.js'
import GraphLine from './GraphLine'
import './Graph.css';

interface GraphProps {
    lines: GraphLine[]
}

const GraphColors: string[] = [
    "#fb4934", // RED
    "#b8bb26", // GREEN
    "#fabd2f", // YELLOW
    "#83a598", // BLUE
    "#d3869b", // PURPLE
    "#8ec07c" // AQUA
]

export default class Graph extends React.Component {

    props: GraphProps;
    chartRef = React.createRef<HTMLCanvasElement>();

    createGraphData(): any {
        const { lines } = this.props;
        var labels: any
        var datasets: any[] = []

        for (var index = 0; index < Math.min(lines.length, GraphColors.length); ++index) {
            const graphLine = lines[index];
            if (!labels) {
                labels = graphLine.x_values;
            }
            datasets.push({
                label: graphLine.label,
                data: graphLine.y_values,
                fill: false,
                borderColor: GraphColors[index]
            })
        }
        
        var resultData = {
            labels: labels,
            datasets: datasets
        }

        return resultData
    }

    componentDidUpdate() {
        const myChartRef = this.chartRef.current.getContext("2d");
        
        new Chart(myChartRef, {
            type: "line",
            data: this.createGraphData(),
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
                className="graph"
                // id="myChart"
                ref={this.chartRef}
            />
        )

    }

};