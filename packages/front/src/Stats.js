import React from 'react';
import { Chart } from './Chart';

import { useFetch } from './useFetch';

const regroupStats = stats => {
    return Object.values(
        stats.reduce(
            (acc, { time, ...rest }) => ({
                ...acc,
                [time]: {
                    time,
                    ...(acc[time] || {}),
                    ...rest,
                },
            }),
            {},
        ),
    ).sort(({ time: a }, { time: b }) => a - b);
};

export const Stats = ({ container }) => {
    const { isLoading, response } = useFetch(`http://localhost:3003/measure/${container}`);

    if (isLoading || !response) {
        return '...';
    }

    const measures = Object.keys(response[0].measures);

    return (
        <div>
            <h1>{container}</h1>
            <Chart title="cpu percentage" data={response} lineKeys={measures} valueKey="cpuPercentage" />
            <Chart title="memory usage" data={response} lineKeys={measures} valueKey="memoryUsage" />
            <Chart title="network received" data={response} lineKeys={measures} valueKey="networkReceived" />
            <Chart title="network transmitted" data={response} lineKeys={measures} valueKey="networkTransmitted" />
        </div>
    );
};
