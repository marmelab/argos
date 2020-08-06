import React from 'react';
import { css } from 'emotion';
import { Card, CardContent } from '@material-ui/core';

import { runs } from './summaryTools';
import SummaryChart from './SummaryChart';

const GlobalStat = ({ data, measureToTest }) => {
    const runData = runs(data, measureToTest)[0];

    return (
        <CardContainer>
            <SummaryChart selectedRun={runData} />
        </CardContainer>
    );
};

const CardContainer = ({ children }) => (
    <Card
        className={css`
            margin: 1em;
            width: calc(75% - 2em);
        `}
    >
        <CardContent>{children}</CardContent>
    </Card>
);

export default GlobalStat;
