import React from 'react';

import { Chart, Area, Line } from 'bizcharts';
import { Typography } from '@material-ui/core';

import theme from './theme';
import { createSummary } from './summaryTools';

const SummaryChart = ({ selectedRun, hiddenMetrics = [] }) => {
    const summary = createSummary(selectedRun, hiddenMetrics);
    return (
        <div>
            <Typography variant="h6">Summary</Typography>
            <Chart
                height={400}
                data={summary}
                autoFit
                scale={{
                    budget: { min: 0, max: 100 },
                    trail: { min: 0, max: 100 },
                    average: { min: 0, max: 100 },
                }}
            >
                <Area position="time*trail" color={theme.colors.trail.chart} shape="smooth" />
                <Line position="time*average" shape="smooth" />
            </Chart>
        </div>
    );
};
export default SummaryChart;
