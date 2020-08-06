import React, { useEffect } from 'react';
import { css } from 'emotion';
import { Card, CardContent } from '@material-ui/core';

import ContainerChart from './ContainerChart';
import { useFetch } from './useFetch';

export const DetailStats = ({ container, setData, measureToTest }) => {
    const { isLoading, response } = useFetch(`http://localhost:3003/measure/${container}`);

    useEffect(() => {
        response && setData(container, response);
    }, [setData, container, response]);

    if (isLoading || !response) {
        return '...';
    }

    const measures = Object.keys(response[0].measures);

    if (!measures.includes(measureToTest)) {
        return null;
    }

    if (response[0].time === null) {
        return null;
    }

    const StatContainer = ({ children }) => (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                width: 100%;
            `}
        >
            <Card
                className={css`
                    margin: 1em;
                    width: calc(100% - 2em);
                `}
            >
                <CardContent>{children}</CardContent>
            </Card>
        </div>
    );

    return (
        <StatContainer>
            <ContainerChart containerName={container} allData={response} measureToTest={measureToTest} />
        </StatContainer>
    );
};
