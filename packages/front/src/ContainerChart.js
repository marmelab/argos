import React from 'react';

import { Chart, Line, Axis } from 'bizcharts';
import { css } from 'emotion';
import { Typography } from '@material-ui/core';

import theme from './theme';

const graphHeight = 100;

const defList = [
    [1024 * 1024 * 1024 * 1024 * 1024, 'To'],
    [1024 * 1024 * 1024 * 1024, 'Go'],
    [1024 * 1024 * 1024, 'Mo'],
    [1024 * 1024, 'Ko'],
    [1024, 'o'],
];

const getUnits = divider => {
    if (!divider) {
        return 'o';
    }
    const def = defList.find(([max]) => divider * 1024 === max);

    if (!def) {
        return 'o';
    }

    return def[1];
};

const getScaleDivider = value => {
    if (!value) {
        return value;
    }
    value = Math.abs(parseInt(value, 10));
    const def = defList.find(([max]) => value > max);

    if (!def) {
        return value;
    }

    return def[0];
};

const ContainerChart = ({ containerName, allData, measureToTest }) => {
    // Extract current values
    const data = allData
        .filter(row => !!row.measures[measureToTest])
        .map(row => ({
            time: row.time,
            ...row.measures[measureToTest],
        }));

    // Get max values to set scale
    const cpuMax = Math.max(100, ...data.map(row => row.cpuPercentage));
    const memoryMax = Math.max(100, ...data.map(row => row.memoryUsage));
    const networkMax = Math.max(
        100,
        ...data.map(row => row.networkReceived),
        ...data.map(row => row.networkTransmitted),
    );

    const memoryScaleDivider = getScaleDivider(memoryMax);
    const networkScaleDivider = getScaleDivider(networkMax);

    const memoryUnits = getUnits(memoryScaleDivider);
    const networkUnits = getUnits(networkScaleDivider);

    // Scale data depending on max values
    const scaledData = data.map(row => ({
        ...row,
        cpuPercentage: Math.round(row.cpuPercentage),
        memoryUsage: Math.round(row.memoryUsage / memoryScaleDivider),
        networkReceived: Math.round(row.networkReceived / networkScaleDivider),
        networkTransmitted: Math.round(row.networkTransmitted / networkScaleDivider),
    }));

    return (
        <div
            className={css`
                position: relative;
            `}
        >
            <Title>{containerName}</Title>
            <SubTitle height={75}>CPU</SubTitle>
            <Chart
                height={graphHeight}
                data={scaledData}
                autoFit
                scale={{
                    cpuPercentage: { min: 0, max: cpuMax },
                }}
            >
                <Line position="time*cpuPercentage" color={theme.colors.cpu.chart} shape="smooth" />
                <Axis name="cpuPercentage" label={{ formatter: val => `${val} %` }} />
            </Chart>
            <SubTitle height={175}>Mem</SubTitle>
            <Chart
                height={graphHeight}
                data={scaledData}
                autoFit
                scale={{
                    memoryUsage: { min: 0, max: Math.round(memoryMax / memoryScaleDivider) },
                }}
            >
                <Line position="time*memoryUsage" color={theme.colors.mem.chart} shape="smooth" />
                <Axis name="memoryUsage" label={{ formatter: val => `${val} ${memoryUnits}` }} />
            </Chart>
            <SubTitle height={265}>Network</SubTitle>
            <Chart
                height={graphHeight}
                data={scaledData}
                autoFit
                scale={{
                    networkReceived: { min: 0, max: Math.round(networkMax / networkScaleDivider) },
                    networkTransmitted: { min: 0, max: Math.round(networkMax / networkScaleDivider) },
                }}
            >
                <Line position="time*networkReceived" color={theme.colors.network.chartReceived} shape="smooth" />
                <Line position="time*networkTransmitted" color={theme.colors.network.chartTransmitted} shape="smooth" />
                <Axis name="networkReceived" label={{ formatter: val => `${val} ${networkUnits}` }} />
                <Axis name="networkTransmitted" visible={false} />
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

const SubTitle = ({ children, height }) => (
    <Typography
        variant="h6"
        className={css`
            position: absolute;
            top: ${height}px;
            right: 0px;
            padding: 1em;
            color: grey;
            text-transform: uppercase;
        `}
    >
        {children}
    </Typography>
);

export default ContainerChart;
