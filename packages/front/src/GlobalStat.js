import React from 'react';
import { css } from 'emotion';
import { Card, CardContent } from '@material-ui/core';

import { runs } from './summaryTools';
import SummaryChart from './SummaryChart';

export const GlobalStat = ({ data, measureToTest }) => {
    const runData = runs(data, measureToTest)[0];
    const ChartContainer = ({ children }) => (
        <Card
            className={css`
                margin: 1em;
                width: calc(75% - 2em);
            `}
        >
            <CardContent>{children}</CardContent>
        </Card>
    );

    return (
        <ChartContainer>
            <SummaryChart selectedRun={runData} />
        </ChartContainer>
    );
};
