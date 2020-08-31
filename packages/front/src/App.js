import React, { useState, useCallback } from 'react';
import { css } from 'emotion';

import DetailStats from './DetailStats';
import GlobalStat from './GlobalStat';
import { useFetch } from './useFetch';
import { apiUrl } from './config';

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
    const measureToTest = getQueryVariable('look') || 'arte_liquid';
    const { isLoading, response } = useFetch(`${apiUrl}/containers/${measureToTest}`);
    const [globalData, setGlobalData] = useState({});

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
            <div
                className={css`
                    position: sticky;
                    top: 1em;
                    margin: 1em;
                    width: calc(75% - 2em);
                    max-height: 500px;
                `}
            >
                <GlobalStat data={globalData} measureToTest={measureToTest} />
            </div>
        </div>
    );
};
