import React, { useEffect } from 'react';
import { css } from 'emotion';
import { Card, CardContent, Typography } from '@material-ui/core';

import { Chart } from './Chart';
import { useFetch } from './useFetch';

function displayOctets(value) {
    if (!value) {
        return value;
    }
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

export const Stats = ({ container, setData }) => {
    const { isLoading, response } = useFetch(`http://localhost:3003/measure/${container}`);

    useEffect(() => {
        response && setData(container, response);
    }, [setData, container, response]);

    if (isLoading || !response) {
        return '...';
    }

    const measures = Object.keys(response[0].measures);

    const Title = ({ children }) => (
        <Typography
            variant="h5"
            className={css`
                padding: 1em;
                text-transform: uppercase;
            `}
        >
            {children}
        </Typography>
    );

    const LeftPanel = ({ children }) => (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                width: 25%;
            `}
        >
            {children}
        </div>
    );

    const ChartContainer = ({ children }) => (
        <Card
            className={css`
                margin: 1em;
                width: calc(100% - 2em);
            `}
        >
            <CardContent>{children}</CardContent>
        </Card>
    );

    return (
        <StatContainer>
            <Title>{container}</Title>
            <LeftPanel>
                <ChartContainer>
                    <Chart
                        title="cpu percentage"
                        data={response}
                        lineKeys={measures}
                        avgValueKey="cpuPercentage"
                        valuesKey="cpuPercentageArea"
                        yTickFormatter={v => v && `${v.toFixed(2)}%`}
                    />
                </ChartContainer>
                <ChartContainer>
                    <Chart
                        title="memory usage"
                        data={response}
                        lineKeys={measures}
                        avgValueKey="memoryUsage"
                        valuesKey="memoryUsageArea"
                        yTickFormatter={displayOctets}
                    />
                </ChartContainer>
                <ChartContainer>
                    <Chart
                        title="network received"
                        data={response}
                        lineKeys={measures}
                        avgValueKey="networkReceived"
                        valuesKey="networkReceivedArea"
                        yTickFormatter={displayOctets}
                    />
                </ChartContainer>
                <ChartContainer>
                    <Chart
                        title="network transmitted"
                        data={response}
                        lineKeys={measures}
                        avgValueKey="networkTransmitted"
                        valuesKey="networkTransmittedArea"
                        yTickFormatter={displayOctets}
                    />
                </ChartContainer>
            </LeftPanel>
        </StatContainer>
    );
};
