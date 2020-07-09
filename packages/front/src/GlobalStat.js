import React from 'react';
import { css } from 'emotion';
import { Card, CardContent } from '@material-ui/core';

import { runs } from './summaryTools';
import SummaryChart from './SummaryChart';

const getQueryVariable = variable => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return null;
};

export const GlobalStat = ({ data }) => {
    const measureToTest = getQueryVariable('look') || 'arte_liquid';
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
