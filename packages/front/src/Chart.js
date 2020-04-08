import React from 'react';
import { LineChart, XAxis, YAxis, Line, Legend } from 'recharts';

const colors = ['#006699', '#009933', '#cc9900', '#cc0000', '#cc00cc', '#3333ff'];

export const Chart = ({ title, data, lineKeys }) => {
    return (
        <div>
            <h2>{title}</h2>
            <LineChart width={1000} height={300} data={data}>
                <Legend verticalAlign="top" height={36} />
                <XAxis dataKey="time" />
                <YAxis />
                {lineKeys.map((dataKey, index) => (
                    <Line dataKey={dataKey} stroke={colors[index]}></Line>
                ))}
            </LineChart>
        </div>
    );
};
