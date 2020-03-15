import React from "react";
import { Chart } from "./Chart";

export const App = () => {
    return (
        <div>
            <Chart
                data={[
                    { time: 1, value: 2 },
                    { time: 2, value: 4 },
                    { time: 3, value: 6 },
                ]}
            />
        </div>
    );
};
