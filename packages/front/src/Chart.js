import React from 'react';
import { LineChart, XAxis, YAxis, Line, Legend } from 'recharts';

const colors = ['#006699', '#009933', '#cc9900', '#cc0000', '#cc00cc', '#3333ff'];

const getAverage = values => values.reduce((acc, v) => acc + v, 0) / values.length;
const getMedian = values => values.sort((a, b) => a - b)[Math.round(values.length / 2)];

export const Chart = ({ title, data, lineKeys, valueKey }) => {
    const getValue = dataKey => datum => (datum.measures[dataKey] && datum.measures[dataKey][valueKey]) || 0;
    return (
        <div>
            <h2>{title}</h2>
            {lineKeys.map(measure => {
                const values = data.map(getValue(measure));
                return (
                    <div>
                        <h3>{measure}</h3>
                        <ul>
                            <li>average:{getAverage(values).toFixed(2)}</li>
                            <li>median:{getMedian(values).toFixed(2)}</li>
                        </ul>
                    </div>
                );
            })}
            <LineChart width={1000} height={300} data={data}>
                <Legend verticalAlign="top" height={36} formatter={(_, __, index) => lineKeys[index]} />
                <XAxis dataKey="time" />
                <YAxis />
                {lineKeys.map((dataKey, index) => (
                    <Line dataKey={getValue(dataKey)} stroke={colors[index]}></Line>
                ))}
            </LineChart>
        </div>
    );
};
