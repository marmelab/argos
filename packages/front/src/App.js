import React from 'react';
import { css } from 'emotion';

import { Stats } from './Stats';
import { useFetch } from './useFetch';

export const App = () => {
    const { isLoading, response } = useFetch('http://localhost:3003/containers');

    if (isLoading || !response) {
        return '...';
    }

    return (
        <div
            className={css`
                background-color: floralwhite;
                font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
                width: 100%;
            `}
        >
            {response.map(containerName => (
                <Stats container={containerName} />
            ))}
        </div>
    );
};
