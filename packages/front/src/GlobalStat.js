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
    <Card>
        <CardContent>{children}</CardContent>
    </Card>
);

export default GlobalStat;
