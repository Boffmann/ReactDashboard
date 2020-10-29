import React from 'react';
import { XYPlot, XAxis, YAxis, LineSeries, DiscreteColorLegend } from 'react-vis';
import 'react-vis/dist/style.css'

interface GraphProps {
    data: {x: string, y: number}[][];
}

const Graph: React.FC<GraphProps> = props => {

    const { data, ...rest } = props;
    const firstData = data[0]; 
    const secondData = data[1];
    // console.log(`First Data: ${firstData[0].x}`);

    return (
        <XYPlot
            xType="ordinal"
            width={800}
            height={300}>
            <DiscreteColorLegend 
                items={[
                    {title: 'Title', color: 'violet'},
                    {title: 'Title2', color: 'green'}
                ]}
            />
            <LineSeries
                data={[{x: 1, y: 0}]}
                style={{display: 'none'}}
            />
            <LineSeries
                data = {[
                    {x:1, y:4},
                    {x:5, y:2},
                    {x:15, y:6}
                ]}
                style={{stroke: 'violet',
                        strokeWidth: 3}}
            />
            <LineSeries
                data = {[
                    {x:1, y:3},
                    {x:5, y:7},
                    {x:15, y:24}
                ]}
                style={{stroke: 'green',
                        strokeWidth: 3}}
            />
            {/* <LineSeries
                data = {firstData}/> */}
            {/* <LineSeries
                data = {secondData}/> */}
            <XAxis />
            <YAxis />
        </XYPlot>
    )

};

export default Graph;