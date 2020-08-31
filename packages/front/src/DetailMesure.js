import React from 'react';
import { Typography, Card, CardContent } from '@material-ui/core';

import { useFetch } from './useFetch';
import { apiUrl } from './config';

const DetailMesure = ({ containerName, measureToTest, run }) => {
    const { isLoading, response } = useFetch(`${apiUrl}/measureRun/${containerName}/${measureToTest}/${run}`);

    if (isLoading || !response) {
        return '...';
    }

    return (
        <CardContainer>
            <Typography variant="h5">Container : {containerName}</Typography>
            <Typography variant="h6">
                Measure : {measureToTest} (run {run})
            </Typography>
            <Typography variant="h6">
                Run {run} ({response.length} entries)
            </Typography>
            <textarea rows="50" cols="200">
                {JSON.stringify(response, null, 1)}
            </textarea>
        </CardContainer>
    );
};

const CardContainer = ({ children }) => (
    <Card>
        <CardContent>{children}</CardContent>
    </Card>
);

export default DetailMesure;
