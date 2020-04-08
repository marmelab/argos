import React from 'react';

import { Stats } from './Stats';
import { useFetch } from './useFetch';

export const App = () => {
    const { isLoading, response } = useFetch('http://localhost:3003/containers');

    if (isLoading || !response) {
        return '...';
    }

    return (
        <div>
            {response.map(containerName => (
                <Stats container={containerName} />
            ))}
        </div>
    );
};
