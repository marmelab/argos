import React from 'react';

import { Chart, Line, Area, Axis } from 'bizcharts';
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

const getOtherMeasures = (measures, measureToTest) => {
    const { [measureToTest]: currentMeasure, ...otherMeasures } = measures;
    return otherMeasures;
};

const getTrailArea = (measures, key) => {
    const measuresArray = Object.values(measures);
    if (measuresArray.length === 0) {
        return [0, 0];
    }
    return [
        Math.min(...measuresArray.map(measure => (measure[key] ? measure[key][0] : 0))),
        Math.max(...measuresArray.map(measure => (measure[key] ? measure[key][1] : 0))),
    ];
};

const ContainerChart = ({ containerName, allData, measureToTest }) => {
    // Extract current values
    const data = allData
        .filter(row => !!row.measures[measureToTest])
        .map(row => ({
            time: row.time,
            ...row.measures[measureToTest],
            measures: getOtherMeasures(row.measures, measureToTest),
        }))
        .map(row => ({
            time: row.time,
            cpuPercentage: row.cpuPercentage,
            memoryUsage: row.memoryUsage,
            networkReceived: row.networkReceived,
            networkTransmitted: row.networkTransmitted,
            cpuPercentageArea: getTrailArea(row.measures, 'cpuPercentageArea'),
            memoryUsageArea: getTrailArea(row.measures, 'memoryUsageArea'),
            networkTransmittedArea: getTrailArea(row.measures, 'networkTransmittedArea'),
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
        cpuPercentageArea: [Math.round(row.cpuPercentageArea[0]), Math.round(row.cpuPercentageArea[1])],
        memoryUsageArea: [
            Math.round(row.memoryUsageArea[0] / memoryScaleDivider),
            Math.round(row.memoryUsageArea[1] / memoryScaleDivider),
        ],
        networkTransmittedArea: [
            Math.round(row.networkTransmittedArea[0] / networkScaleDivider),
            Math.round(row.networkTransmittedArea[1] / networkScaleDivider),
        ],
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
                    cpuPercentageArea: { min: 0, max: cpuMax },
                }}
            >
                <Line position="time*cpuPercentage" color={theme.colors.cpu.chart} shape="smooth" />
                <Area position="time*cpuPercentageArea" color={theme.colors.cpu.trail} shape="smooth" />
                <Axis name="cpuPercentage" label={{ formatter: val => `${val} %` }} />
                <Axis name="cpuPercentageArea" visible={false} />
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
                <Area position="time*memoryUsageArea" color={theme.colors.mem.trail} shape="smooth" />
                <Axis name="memoryUsage" label={{ formatter: val => `${val} ${memoryUnits}` }} />
                <Axis name="memoryUsageArea" visible={false} />
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
                <Area position="time*networkTransmittedArea" color={theme.colors.network.trail} shape="smooth" />
                <Axis name="networkReceived" label={{ formatter: val => `${val} ${networkUnits}` }} />
                <Axis name="networkTransmitted" visible={false} />
                <Axis name="networkTransmittedArea" visible={false} />
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
