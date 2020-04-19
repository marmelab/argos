import React from 'react';
import { ResponsiveContainer, Text, LineChart, XAxis, YAxis, Line, Legend } from 'recharts';
import { css } from 'emotion';

const colors = ['#006699', '#009933', '#cc9900', '#cc0000', '#cc00cc', '#3333ff'];

const getAverage = values => values.reduce((acc, v) => acc + v, 0) / values.length;
const getMedian = values => values.sort((a, b) => a - b)[Math.round(values.length / 2)];

export const Chart = ({ title, data, lineKeys, valueKey, yTickFormatter }) => {
    const getValue = dataKey => datum => (datum.measures[dataKey] && datum.measures[dataKey][valueKey]) || 0;
    return (
        <div
            className={css`
                width: 50%;
            `}
        >
            <h2>{title}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <Text>{title}</Text>
                    <Legend
                        verticalAlign="bottom"
                        formatter={(_, __, index) => {
                            const measure = lineKeys[index];
                            const values = data.map(getValue(measure));
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
                    <XAxis dataKey="time" />
                    <YAxis tickFormatter={yTickFormatter} width={80} />
                    {lineKeys.map((dataKey, index) => (
                        <Line dataKey={getValue(dataKey)} stroke={colors[index]}></Line>
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
