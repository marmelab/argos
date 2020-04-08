import React from 'react';
import { Chart } from './Chart';

import { useFetch } from './useFetch';

export const Stats = ({ container }) => {
    const { isLoading, response } = useFetch(`http://localhost:3003/measure/${container}`);

    if (isLoading || !response) {
        return '...';
    }

    const cpuPercentage = response.map(({ date, cpu }) => ({
        date: new Date(date),
        value: cpu.cpuPercentage || 0,
    }));

    const memoryUsage = response.map(({ date, memory }) => ({
        date: new Date(date),
        value: memory.usage || 0,
    }));

    const networkReceived = response.map(({ date, network }) => ({
        date: new Date(date),
        value: network.currentReceived || 0,
    }));

    const networkEmitted = response.map(({ date, network }) => ({
        date: new Date(date),
        value: network.currentEmitted || 0,
    }));

    return (
        <div>
            <h1>{container}</h1>
            <Chart title="cpu percentage" data={cpuPercentage} />
            <Chart title="memory usage" data={memoryUsage} />
            <Chart title="network received" data={networkReceived} />
            <Chart title="network emitted" data={networkEmitted} />
        </div>
    );
};
