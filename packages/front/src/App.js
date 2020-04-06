import React from 'react';

import { Stats } from './Stats';
import { useFetch } from './useFetch';

const containerName = 'angry_mayer';

export const App = () => {
    const { isLoading, response } = useFetch('http://localhost:3002/containers');

    if (isLoading || !response) {
        return '...';
    }

    const { containers } = response;

    return (
        <div>
            {containers.map(containerName => (
                <Stats container={containerName} />
            ))}
        </div>
    );
};
