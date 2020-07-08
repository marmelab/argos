import React from 'react';
import { ResponsiveContainer, Text, AreaChart, XAxis, YAxis, Area, Legend } from 'recharts';
import { Typography } from '@material-ui/core';

const colors = ['#006699', '#009933', '#cc9900', '#cc0000', '#cc00cc', '#3333ff'];

const getAverage = values => values.reduce((acc, v) => acc + v, 0) / values.length;
const getMedian = values => values.sort((a, b) => a - b)[Math.round(values.length / 2)];

export const Chart = ({
    title,
    data,
    height = 150,
    legend = false,
    lineKeys,
    avgValueKey,
    valuesKey,
    yTickFormatter,
}) => {
    const getAvgValue = dataKey => datum => datum.measures[dataKey] && datum.measures[dataKey][avgValueKey];
    const getValues = dataKey => datum => datum.measures[dataKey] && datum.measures[dataKey][valuesKey];
    return (
        <div>
            <Typography variant="h6">{title}</Typography>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data}>
                    <Text>{title}</Text>
                    {legend && (
                        <Legend
                            verticalAlign="bottom"
                            formatter={(_, __, index) => {
                                const measure = lineKeys[index];
                                const values = data.map(getAvgValue(measure)).filter(v => v !== null && !isNaN(v));
                                return (
                                    <>
                                        {measure}
                                        <ul>
                                            <li>average: {yTickFormatter(getAverage(values))}</li>
                                            <li>median: {yTickFormatter(getMedian(values))}</li>
                                        </ul>
                                    </>
                                );
                            }}
                        />
                    )}
                    <XAxis dataKey="time" />
                    <YAxis tickFormatter={yTickFormatter} width={80} />
                    {lineKeys.map((dataKey, index) => (
                        <Area dataKey={getValues(dataKey)} stroke={colors[index]} fill={colors[index]}></Area>
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
