export const getValues = (raw, valueName, areaName, key) => {
    const result = raw
        .filter(({ measures }) => !!measures[key])
        .map(metric => {
            const otherKeys = Object.keys(metric.measures).filter(k => k !== key);
            const areaMin = otherKeys.reduce((min, cur) => {
                if (metric.measures[cur][areaName][0] < min) {
                    return metric.measures[cur][areaName][0];
                }
                return min;
            }, 1000000000);
            const areaMax = otherKeys.reduce((max, cur) => {
                if (metric.measures[cur][areaName][1] > max) {
                    return metric.measures[cur][areaName][1];
                }
                return max;
            }, 0);

            return {
                time: metric.time,
                value: metric.measures[key][valueName],
                area: otherKeys.length > 0 ? [areaMin, areaMax] : [null, null],
            };
        })
        .filter(({ value }) => !!value);
    return result;
};

export const getBothValues = (raw, value1Name, value2Name, area1Name, area2Name, key) => {
    const result = raw
        .filter(({ measures }) => !!measures[key])
        .map(metric => {
            const otherKeys = Object.keys(metric.measures).filter(k => k !== key);
            const areaMin = otherKeys.reduce((min, cur) => {
                if (metric.measures[cur][area1Name][0] + metric.measures[cur][area2Name][0] < min) {
                    return metric.measures[cur][area1Name][0] + metric.measures[cur][area2Name][0];
                }
                return min;
            }, 1000000000);
            const areaMax = otherKeys.reduce((max, cur) => {
                if (metric.measures[cur][area1Name][1] + metric.measures[cur][area2Name][1] > max) {
                    return metric.measures[cur][area1Name][1] + metric.measures[cur][area2Name][1];
                }
                return max;
            }, 0);

            return {
                time: metric.time,
                value: metric.measures[key][value1Name] + metric.measures[key][value2Name],
                area: otherKeys.length > 0 ? [areaMin, areaMax] : [null, null],
            };
        })
        .filter(({ value }) => !!value);
    return result;
};

export const createSummary = (selectedRun, hiddenMetricsList = []) => {
    const metricsLists = selectedRun.raw.reduce((metricsList, category) => {
        return [
            ...metricsList,
            ...category.metrics.map(metric => ({
                name: `${category.label.toLowerCase()}-${metric.type}`,
                values: metric.values,
            })),
        ];
    }, []);

    return createSummaryFromMetricsList(
        ...metricsLists.filter(metricList => !hiddenMetricsList.includes(metricList.name)).map(({ values }) => values),
    );
};

export const createSummaryFromMetricsList = (...metricsLists) => {
    const maxMetrics = metricsLists.map(metricList => {
        return Math.max(...metricList.map(({ value }) => value));
    });

    let metricsByTime = {};
    metricsLists.forEach((metricList, index) => {
        metricList.forEach(metric => {
            if (!metricsByTime[metric.time]) {
                metricsByTime[metric.time] = [];
            }
            metricsByTime[metric.time][index] = metric.value;
        });
    });

    let metricsMinByTime = {};
    metricsLists.forEach((metricList, index) => {
        metricList.forEach(metric => {
            if (!metricsMinByTime[metric.time]) {
                metricsMinByTime[metric.time] = [];
            }
            metricsMinByTime[metric.time][index] = metric.area[0];
        });
    });

    let metricsMaxByTime = {};
    metricsLists.forEach((metricList, index) => {
        metricList.forEach(metric => {
            if (!metricsMaxByTime[metric.time]) {
                metricsMaxByTime[metric.time] = [];
            }
            metricsMaxByTime[metric.time][index] = metric.area[1];
        });
    });

    const averages = Object.values(metricsByTime).map(
        (metrics, index) =>
            metrics.reduce((prev, curr, index) => {
                const scaledCurrent = (curr / maxMetrics[index]) * 100;
                return prev + scaledCurrent;
            }, 0) / metrics.length,
    );

    const minAverages = Object.values(metricsMinByTime).map(
        (metrics, index) =>
            metrics.reduce((prev, curr, index) => {
                const scaledCurrent = (curr / maxMetrics[index]) * 100;
                return prev + scaledCurrent;
            }, 0) / metrics.length,
    );

    const maxAverages = Object.values(metricsMaxByTime).map(
        (metrics, index) =>
            metrics.reduce((prev, curr, index) => {
                const scaledCurrent = (curr / maxMetrics[index]) * 100;
                return prev + scaledCurrent;
            }, 0) / metrics.length,
    );

    return averages.map((average, index) => {
        let trailingAverage = average;

        const numberOfItemsInTrailing = 5;
        const averageFactorForCurrentItem = 1;

        // we emulate a "previous run averages" here by
        // taking the averages near my point in time to soften the curve... (1/2)

        const previousAverages = averages.slice(
            index - numberOfItemsInTrailing >= 0 ? index - numberOfItemsInTrailing : 0,
            index + numberOfItemsInTrailing + 1 > averages.length ? index : index + numberOfItemsInTrailing + 1,
        );

        if (previousAverages.length) {
            trailingAverage =
                previousAverages.reduce(
                    (prev, curr, index) =>
                        prev + (numberOfItemsInTrailing === index ? curr * averageFactorForCurrentItem : curr),
                    0,
                ) / previousAverages.length;
        }

        return {
            time: index,
            average,
            previousAverages,
            trailingAverage,
            ten: 10,
            trail: [minAverages[index], maxAverages[index]],
            budget: [maxAverages[index], maxAverages[index] * 1.02],
        };
    });
};

export const runs = (allRawData, measureName) => {
    return [
        {
            id: 6892,
            repository: 'marmelab/react-admin',
            status: 'failed',
            branch: 'master',
            message: 'Merge pull request #4970 from hammadj/ra-data-fakeres...',
            milestones: [
                {
                    label: 'Orders',
                    start: 1,
                    end: 45,
                    children: [
                        { label: 'creation', start: 7, end: 12, status: 'failed' },
                        { label: 'delete', start: 13, end: 14 },
                        { label: 'edit', start: 15, end: 21 },
                        { label: 'list', start: 22, end: 23 },
                        { label: 'filtering', start: 24, end: 31 },
                        { label: 'pagination', start: 32, end: 33 },
                        { label: 'printing', start: 34, end: 35 },
                        { label: 'archive', start: 36, end: 37 },
                        { label: 'cancel', start: 38, end: 45 },
                    ],
                },
                {
                    label: 'Customers',
                    start: 46,
                    end: 64,
                    children: [
                        { label: 'creation', start: 46, end: 48 },
                        { label: 'delete', start: 49, end: 57 },
                        { label: 'edit', start: 58, end: 59 },
                        { label: 'list', start: 60, end: 61 },
                        { label: 'filtering', start: 62, end: 64 },
                    ],
                },
                {
                    label: 'Invoices',
                    start: 65,
                    end: 123,
                    children: [
                        { label: 'creation', start: 65, end: 70 },
                        { label: 'delete', start: 71, end: 73, status: 'overachieve' },
                        { label: 'edit', start: 74, end: 85 },
                        { label: 'list', start: 86, end: 93 },
                        { label: 'filtering', start: 94, end: 98, status: 'failed' },
                        { label: 'pagination', start: 99, end: 102 },
                        { label: 'printing', start: 103, end: 105, status: 'overachieve' },
                        { label: 'archive', start: 106, end: 120 },
                        { label: 'cancel', start: 121, end: 123 },
                    ],
                },
                {
                    label: 'Products',
                    start: 124,
                    end: 163,
                    children: [
                        { label: 'creation', start: 124, end: 132 },
                        { label: 'delete', start: 133, end: 134 },
                        { label: 'edit', start: 135, end: 136 },
                        { label: 'list', start: 137, end: 144, status: 'failed' },
                        { label: 'filtering', start: 145, end: 148 },
                        { label: 'pagination', start: 149, end: 154, status: 'failed' },
                        { label: 'printing', start: 155, end: 158 },
                        { label: 'archive', start: 159, end: 161 },
                        { label: 'cancel', start: 162, end: 163 },
                    ],
                },
            ],
            raw: Object.keys(allRawData)
                .filter(key => {
                    return allRawData[key].filter(e => !!e.measures[measureName]).length > 0;
                })
                .map(key => {
                    const currentData = allRawData[key];
                    return {
                        label: key,
                        metrics: [
                            {
                                type: 'cpu',
                                values: getValues(currentData, 'cpuPercentage', 'cpuPercentageArea', measureName),
                            },
                            {
                                type: 'mem',
                                values: getValues(currentData, 'memoryUsage', 'memoryUsageArea', measureName),
                            },
                            {
                                type: 'network',
                                values: getBothValues(
                                    currentData,
                                    'networkReceived',
                                    'networkTransmitted',
                                    'networkReceivedArea',
                                    'networkTransmittedArea',
                                    measureName,
                                ),
                            },
                        ],
                    };
                }),
        },
    ];
};
