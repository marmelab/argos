import React from 'react';
import { css } from 'emotion';

import { Chart } from './Chart';
import { useFetch } from './useFetch';

function displayOctets(value) {
    value = Math.abs(parseInt(value, 10));
    const defList = [
        [1024 * 1024 * 1024 * 1024 * 1024, 'To'],
        [1024 * 1024 * 1024 * 1024, 'Go'],
        [1024 * 1024 * 1024, 'Mo'],
        [1024 * 1024, 'Ko'],
        [1024, 'octets'],
    ];
    const def = defList.find(([max]) => value > max);

    if (!def) {
        return `${value} octets`;
    }

    return `${(value / def[0]).toFixed(2)} ${def[1]}`;
}

export const Stats = ({ container }) => {
    const { isLoading, response } = useFetch(`http://localhost:3003/measure/${container}`);

    if (isLoading || !response) {
        return '...';
    }

    const measures = Object.keys(response[0].measures);

    return (
        <div>
            <h1>{container}</h1>
            <div
                className={css`
                    display: flex;
                    flex-wrap: wrap;
                `}
            >
                <Chart
                    title="cpu percentage"
                    data={response}
                    lineKeys={measures}
                    valueKey="cpuPercentage"
                    yTickFormatter={v => `${v.toFixed(2)}%`}
                />
                <Chart
                    title="memory usage"
                    data={response}
                    lineKeys={measures}
                    valueKey="memoryUsage"
                    yTickFormatter={displayOctets}
                />
                <Chart
                    title="network received"
                    data={response}
                    lineKeys={measures}
                    valueKey="networkReceived"
                    yTickFormatter={displayOctets}
                />
                <Chart
                    title="network transmitted"
                    data={response}
                    lineKeys={measures}
                    valueKey="networkTransmitted"
                    yTickFormatter={displayOctets}
                />
            </div>
        </div>
    );
};
