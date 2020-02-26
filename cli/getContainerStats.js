const spawn = require("child_process").spawn;
const readline = require("readline");
const fs = require("fs");

const get = path => data =>
    path.reduce((subData, key) => (subData ? subData[key] : undefined), data);

const getCurAvailableCpu = get(["cpu_stats", "system_cpu_usage"]);
const getPreAvailableCpu = get(["precpu_stats", "system_cpu_usage"]);
const getCurCpuUsage = get(["cpu_stats", "cpu_usage", "usage_in_usermode"]);
const getPreCpuUsage = get(["precpu_stats", "cpu_usage", "usage_in_usermode"]);
const getOnlineCpus = get(["cpu_stats", "online_cpus"]);

const getMemoryUsage = get(["memory_stats", "usage"]);
const getMemoryMaxUsage = get(["memory_stats", "max_usage"]);
const getMemoryLimit = get(["memory_stats", "limit"]);

const getReceivedNetwork = get(["networks", "eth0", "rx_bytes"]);
const getTransmittedNetwork = get(["networks", "eth0", "tx_bytes"]);

const getIOServiceBytesRecursive = get([
    "blkio_stats",
    "io_service_bytes_recursive",
]);

const getContainerStats = async containerName => {
    input = spawn("curl", [
        "-v",
        "--unix-socket",
        "/var/run/docker.sock",
        `http://localhost/containers/${containerName}/stats`,
    ]);
    input.stdout.setEncoding("utf-8");
    const fileStream = fs.createWriteStream(`./${containerName}.json`);
    fileStream.write("[");
    const readInterface = readline.createInterface({
        input: input.stdout,
        output: null,
        console: false,
    });
    let isFirst = false;
    return new Promise((resolve, reject) => {
        readInterface.on("line", function(line) {
            const json = JSON.parse(line);

            // the container has stopped
            if (json.read === "0001-01-01T00:00:00Z") {
                fileStream.write("]");
                resolve();
                return;
            }

            const curAvailableCpu = getCurAvailableCpu(json);

            if (!isFirst) {
                fileStream.write(",");
            }
            if (isFirst) {
                isFirst = false;
            }

            const preAvailableCpu = getPreAvailableCpu(json);

            const curCpuUsage = getCurCpuUsage(json);
            const preCpuUsage = getPreCpuUsage(json);

            const totalReceivedNetwork = getReceivedNetwork(json);

            const totalTransmittedNetwork = getTransmittedNetwork(json);

            const onlineCpus = getOnlineCpus(json);

            const availableCpu = curAvailableCpu - preAvailableCpu;
            const cpuUsage = curCpuUsage - preCpuUsage;

            // see https://github.com/moby/moby/blob/eb131c5383db8cac633919f82abad86c99bffbe5/cli/command/container/stats_helpers.go#L175
            const cpuPercentage = (cpuUsage / availableCpu) * onlineCpus * 100;

            const rawIO = getIOServiceBytesRecursive(json) || [];

            const io = rawIO.reduce(
                (acc, { major, minor, op, value }, index) => {
                    const key = `${major}.${minor}`;
                    return {
                        ...acc,
                        [key]: {
                            ...(acc[key] || {}),
                            [`total-${op}`]: value,
                        },
                    };
                },
                {}
            );

            const result = {
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
                    totalTransmitted: totalTransmittedNetwork,
                },
                io,
            };
            fileStream.write(JSON.stringify(result));
        });
    });
};

module.exports = getContainerStats;
