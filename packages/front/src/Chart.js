import React from "react";
import { LineChart, XAxis, YAxis, Line } from "recharts";

export const Chart = ({ data }) => {
    return (
        <LineChart width={500} height={300} data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Line type="monotone" dataKey="value"></Line>
        </LineChart>
    );
};
