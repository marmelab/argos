import React, { useState, useCallback } from 'react';
import { css } from 'emotion';

import DetailStats from './DetailStats';
import GlobalStat from './GlobalStat';
import { useFetch } from './useFetch';

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

export const App = () => {
    const { isLoading, response } = useFetch('http://localhost:3003/containers');
    const [globalData, setGlobalData] = useState({});

    const measureToTest = getQueryVariable('look') || 'arte_liquid';

    const handleSetGlobalData = useCallback(
        (containerName, data) => {
            setGlobalData(previous => ({ ...previous, [containerName]: data }));
        },
        [setGlobalData],
    );

    if (isLoading || !response) {
        return '...';
    }

    return (
        <div
            className={css`
                background-color: floralwhite;
                font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
                width: 100%;
                display: flex;
                flex-direction: row;
                width: 100%;
            `}
        >
            <div
                className={css`
                    display: flex;
                    flex-direction: column;
                    flex-wrap: wrap;
                `}
            >
                {response.map(containerName => {
                    return (
                        <DetailStats
                            container={containerName}
                            setData={handleSetGlobalData}
                            measureToTest={measureToTest}
                        />
                    );
                })}
            </div>
            <GlobalStat data={globalData} measureToTest={measureToTest} />
        </div>
    );
};
