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

    const measures = [...new Set(response.map(({ measureName }) => measureName))];

    const cpuPercentage = regroupStats(
        response.map(({ time, cpu, measureName }) => ({
            time: Math.round(time / 1000),
            [measureName]: cpu.cpuPercentage || 0,
        })),
    );

    const memoryUsage = regroupStats(
        response.map(({ time, memory, measureName }) => ({
            time: Math.round(time / 1000),
            [measureName]: memory.usage || 0,
        })),
    );

    const networkReceived = regroupStats(
        response.map(({ time, network, measureName }) => ({
            time: Math.round(time / 1000),
            [measureName]: network.currentReceived || 0,
        })),
    );

    const networkEmitted = regroupStats(
        response.map(({ time, network, measureName }) => ({
            time: Math.round(time / 1000),
            [measureName]: network.currentEmitted || 0,
        })),
    );

    return (
        <div>
            <h1>{container}</h1>
            <Chart title="cpu percentage" data={cpuPercentage} lineKeys={measures} />
            <Chart title="memory usage" data={memoryUsage} lineKeys={measures} />
            <Chart title="network received" data={networkReceived} lineKeys={measures} />
            <Chart title="network emitted" data={networkEmitted} lineKeys={measures} />
        </div>
    );
};
