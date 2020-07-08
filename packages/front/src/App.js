import React, { useState, useCallback } from 'react';
import { css } from 'emotion';

import { Stats } from './Stats';
import { GlobalStat } from './GlobalStat';
import { useFetch } from './useFetch';

export const App = () => {
    const { isLoading, response } = useFetch('http://localhost:3003/containers');
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
                    return <Stats container={containerName} setData={handleSetGlobalData} />;
                })}
            </div>
            <GlobalStat data={globalData} />
        </div>
    );
};
