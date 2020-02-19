const spawn = require("child_process").spawn;
const readline = require("readline");

const containerName = "argos_cypress_1";

const get = path => data =>
    path.reduce((subData, key) => (subData ? subData[key] : undefined), data);

const getTotalCpu = get(["cpu_stats", "system_cpu_usage"]);
const getCpuUsage = get(["cpu_stats", "cpu_usage", "total_usage"]);
const getKernelCpuUsage = get([
    "cpu_stats",
    "cpu_usage",
    "usage_in_kernelmode",
]);
const getUserCpuUsage = get(["cpu_stats", "cpu_usage", "usage_in_usermode"]);

const getMemoryUsage = get(["memory_stats", "usage"]);
const getMemoryMaxUsage = get(["memory_stats", "max_usage"]);
const getMemoryLimit = get(["memory_stats", "limit"]);

const getReceivedNetwork = get(["networks", "eth0", "rx_bytes"]);
const getTransmittedNetwork = get(["networks", "eth0", "tx_bytes"]);

const initGetValueIncrement = () => {
    let previousValue = 0;
    return value => {
        const result = value - previousValue;
        previousValue = value;

        return result;
    };
};

const getCurrentReceivedNetwork = initGetValueIncrement();
const getCurrentTransmittedNetwork = initGetValueIncrement();

const run = async () => {
    input = spawn("curl", [
        "-v",
        "--unix-socket",
        "/var/run/docker.sock",
        `http://localhost/containers/${containerName}/stats`,
    ]);
    input.stdout.setEncoding("utf-8");
    const readInterface = readline.createInterface({
        input: input.stdout,
        output: null,
        console: false,
    });

    return new Promise((resolve, reject) => {
        readInterface.on("line", function(line) {
            const json = JSON.parse(line);

            const totalCpu = getTotalCpu(json);
            const cpuUsage = getCpuUsage(json);
            const kernelCpuUsage = getKernelCpuUsage(json);
            const userCpuUsage = getUserCpuUsage(json);

            const totalReceivedNetwork = getReceivedNetwork(json);
            const currentReceivedNetwork = getCurrentReceivedNetwork(
                totalReceivedNetwork
            );

            const totalTransmittedNetwork = getTransmittedNetwork(json);
            const currentTransmittedNetwork = getCurrentTransmittedNetwork(
                totalReceivedNetwork
            );

            const result = {
                cpu: {
                    totalCpu,
                    cpuUsage,
                    kernelCpuUsage,
                    userCpuUsage,
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
            };
            console.log(result);
        });
    });
};

run();
