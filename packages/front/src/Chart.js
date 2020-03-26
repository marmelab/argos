import React from 'react';
import { LineChart, XAxis, YAxis, Line } from 'recharts';

export const Chart = ({ title, data }) => {
    return (
        <div>
            <h1>{title}</h1>
            <LineChart width={1000} height={300} data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Line type="monotone" dataKey="value"></Line>
            </LineChart>
        </div>
    );
};
