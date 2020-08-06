import React from 'react';

import { Chart, Line } from 'bizcharts';
import { css } from 'emotion';
import { Typography } from '@material-ui/core';

import theme from './theme';

const ContainerChart = ({ containerName, allData, measureToTest }) => {
    const data = allData.map(row => ({
        time: row.time,
        ...row.measures[measureToTest],
        memoryUsage: Math.round(row.measures[measureToTest].memoryUsage / 1000000), // Display memory in Mo
    }));

    const graphHeight = 150;

    const cpuMax = Math.max(100, ...data.map(row => row.cpuPercentage));
    const memoryMax = Math.max(100, ...data.map(row => row.memoryUsage));
    const networkMax = Math.max(
        100,
        ...data.map(row => row.networkReceived),
        ...data.map(row => row.networkTransmitted),
    );

    return (
        <div>
            <Title>{containerName}</Title>
            <Chart
                height={graphHeight}
                data={data}
                autoFit
                scale={{
                    cpuPercentage: { min: 0, max: cpuMax },
                }}
            >
                <Line position="time*cpuPercentage" color={theme.colors.cpu.chart} shape="smooth" />
            </Chart>
            <Chart
                height={graphHeight}
                data={data}
                autoFit
                scale={{
                    memoryUsage: { min: 0, max: memoryMax },
                }}
            >
                <Line position="time*memoryUsage" color={theme.colors.mem.chart} shape="smooth" />
            </Chart>
            <Chart
                height={graphHeight}
                data={data}
                autoFit
                scale={{
                    networkReceived: { min: 0, max: networkMax },
                    networkTransmitted: { min: 0, max: networkMax },
                }}
            >
                <Line position="time*networkReceived" color={theme.colors.network.chartReceived} shape="smooth" />
                <Line position="time*networkTransmitted" color={theme.colors.network.chartTransmitted} shape="smooth" />
            </Chart>
        </div>
    );
};

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

export default ContainerChart;
