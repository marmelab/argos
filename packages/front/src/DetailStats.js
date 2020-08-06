import React, { useEffect } from 'react';
import { css } from 'emotion';
import { Card, CardContent } from '@material-ui/core';

import ContainerChart from './ContainerChart';
import { useFetch } from './useFetch';

const cleanData = data => data.filter(measure => measure.time !== null && measure._id !== null);

const DetailStats = ({ container, setData, measureToTest }) => {
    const { isLoading, response } = useFetch(`http://localhost:3003/measure/${container}`);

    useEffect(() => {
        response && setData(container, cleanData(response));
    }, [setData, container, response]);

    if (isLoading || !response) {
        return '...';
    }

    const data = cleanData(response);

    const measures = Object.keys(data[0].measures);

    if (!measures.includes(measureToTest)) {
        return null;
    }

    return (
        <CardContainer>
            <ContainerChart containerName={container} allData={data} measureToTest={measureToTest} />
        </CardContainer>
    );
};

const CardContainer = ({ children }) => (
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

export default DetailStats;
