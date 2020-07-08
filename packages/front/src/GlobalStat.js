import React from 'react';
import { css } from 'emotion';
import { Card, CardContent } from '@material-ui/core';

import { runs } from './summaryTools';
import SummaryChart from './SummaryChart';

export const GlobalStat = ({ data }) => {
    const runData = runs(data)[0];

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
