const stream = require('stream');

const get = path => data => path.reduce((subData, key) => (subData ? subData[key] : undefined), data);

const getCurAvailableCpu = get(['cpu_stats', 'system_cpu_usage']);
const getPreAvailableCpu = get(['precpu_stats', 'system_cpu_usage']);
const getCurCpuUsage = get(['cpu_stats', 'cpu_usage', 'usage_in_usermode']);
const getPreCpuUsage = get(['precpu_stats', 'cpu_usage', 'usage_in_usermode']);
const getOnlineCpus = get(['cpu_stats', 'online_cpus']);

const getMemoryUsage = get(['memory_stats', 'usage']);
const getMemoryMaxUsage = get(['memory_stats', 'max_usage']);
const getMemoryLimit = get(['memory_stats', 'limit']);

const getReceivedNetwork = get(['networks', 'eth0', 'rx_bytes']);
const getTransmittedNetwork = get(['networks', 'eth0', 'tx_bytes']);

const getIOServiceBytesRecursive = get(['blkio_stats', 'io_service_bytes_recursive']);

const initGetPreviousValue = (previousValue = null) => {
    return value => {
        const result = JSON.parse(JSON.stringify(previousValue));
        previousValue = value;

        return result;
    };
};

const initGetValueIncrement = () => {
    const getPreviousValue = initGetPreviousValue(0);
    return value => {
        const previousValue = getPreviousValue(value);
        const result = value - previousValue;

        return result;
    };
};

const parseStatsTransform = (containerName, measureName) => {
    const getCurrentReceivedNetwork = initGetValueIncrement();
    const getCurrentTransmittedNetwork = initGetValueIncrement();

    const getPreviousRawIO = initGetPreviousValue();

    return new stream.Transform({
        transform(chunk, encoding, next) {
            try {
                const json = JSON.parse(chunk.toString());

                // no data: discarding
                if (json.read === '0001-01-01T00:00:00Z') {
                    next();
                    return;
                }

                const curAvailableCpu = getCurAvailableCpu(json);

                const preAvailableCpu = getPreAvailableCpu(json);

                const curCpuUsage = getCurCpuUsage(json);
                const preCpuUsage = getPreCpuUsage(json);

                const totalReceivedNetwork = getReceivedNetwork(json);
                const currentReceivedNetwork = getCurrentReceivedNetwork(totalReceivedNetwork);

                const totalTransmittedNetwork = getTransmittedNetwork(json);
                const currentTransmittedNetwork = getCurrentTransmittedNetwork(totalReceivedNetwork);
                const onlineCpus = getOnlineCpus(json);

                const availableCpu = curAvailableCpu - preAvailableCpu;
                const cpuUsage = curCpuUsage - preCpuUsage;

                // see https://github.com/moby/moby/blob/eb131c5383db8cac633919f82abad86c99bffbe5/cli/command/container/stats_helpers.go#L175
                const cpuPercentage = (cpuUsage / availableCpu) * onlineCpus * 100;

                const rawIO = getIOServiceBytesRecursive(json) || [];
                const previousRawIO = getPreviousRawIO(rawIO);

                const io = rawIO.reduce((acc, { major, minor, op, value }, index) => {
                    const previousValues = previousRawIO ? previousRawIO[index] : null;

                    const key = `${major}-${minor}`;
                    return {
                        ...acc,
                        [key]: {
                            ...(acc[key] || {}),
                            [`total-${op}`]: value,
                            [op]: value - (previousValues ? previousValues.value : 0),
                        },
                    };
                }, {});

                const result = {
                    measureName,
                    containerName,
                    date: json.read,
                    cpu: {
                        availableCpu,
                        cpuUsage,
                        cpuPercentage,
                    },
                    memory: {
                        usage: getMemoryUsage(json),
                        maxUsage: getMemoryMaxUsage(json),
                        limit: getMemoryLimit(json),
                    },
                    network: {
                        totalReceived: totalReceivedNetwork,
                        currentReceived: currentReceivedNetwork,
                        totalTransmitted: totalTransmittedNetwork,
                        currentTransmitted: currentTransmittedNetwork,
                    },
                    io,
                };

                this.push(JSON.stringify(result));

                next();
            } catch (error) {
                this.emit('error', error);
            }
        },
    });
};

module.exports = parseStatsTransform;
