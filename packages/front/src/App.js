import React from 'react';
import { Chart } from './Chart';

import { useFetch } from './useFetch';

export const App = () => {
    const { isLoading, response } = useFetch('http://localhost:3002/angry_mayer');

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
            <Chart title="cpu percentage" data={cpuPercentage} />
            <Chart title="memory usage" data={memoryUsage} />
            <Chart title="network received" data={networkReceived} />
            <Chart title="network emitted" data={networkEmitted} />
        </div>
    );
};
