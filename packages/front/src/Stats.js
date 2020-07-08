import React from 'react';
import { css } from 'emotion';
import { Card, CardContent, Typography } from '@material-ui/core';

import { Chart } from './Chart';
import { useFetch } from './useFetch';
import { runs } from './summaryTools';
import SummaryChart from './SummaryChart';

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

export const Stats = ({ container }) => {
    const { isLoading, response } = useFetch(`http://localhost:3003/measure/${container}`);

    if (isLoading || !response) {
        return '...';
    }

    const measures = Object.keys(response[0].measures);
    const runData = runs(response, measures[0])[0];

    const StatContainer = ({ children }) => (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                witdh: 100%;
            `}
        >
            {children}
        </div>
    );

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

    const CenterPanel = ({ children }) => (
        <div
            className={css`
                display: flex;
                width: 75%;
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
            <div
                className={css`
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    width: 100%;
                `}
            >
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
                <CenterPanel>
                    <ChartContainer>
                        <SummaryChart selectedRun={runData} />
                    </ChartContainer>
                </CenterPanel>
            </div>
        </StatContainer>
    );
};
