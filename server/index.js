const spawn = require("child_process").spawn;

const parseSize = str => {
    const trimmedStr = str.trim();
    if (trimmedStr.match(/GiB/)) {
        return parseInt(trimmedStr, 10) * 1000000000;
    }
    if (trimmedStr.match(/MB/)) {
        return parseInt(trimmedStr, 10) * 1000000;
    }
    if (trimmedStr.match(/kb/)) {
        return parseInt(trimmedStr, 10) * 1000;
    }
    return parseInt(trimmedStr, 10);
};

const initGetValueIncrement = () => {
    let previousValue = 0;
    return value => {
        const result = value - previousValue;
        previousValue = value;

        return result;
    };
};

const run = async () => {
    child = spawn("docker", [
        "stats",
        "argos_cypress_1",
        "--no-trunc",
        "--format",
        '{"memUsage":"{{ .MemUsage }}", "memPerc": "{{ .MemPerc }}", "cpuPerc":"{{ .CPUPerc }}", "networkIO": "{{ .NetIO }}", "blockIO": "{{ .BlockIO }}"}',
    ]);
    child.stdout.setEncoding("utf-8");

    // let prevNetworkInput = null;
    let prevNetworkOutput = null;
    const getCurrentNetworkInput = initGetValueIncrement();
    return new Promise((resolve, reject) => {
        child.stdout.on("data", function(data) {
            const trimmedData = data.trim();
            if (trimmedData === "\u001b[2J\u001b[H") {
                console.log(data);
                return;
            }
            try {
                const json = JSON.parse(trimmedData);
                const [usedMemory, availableMemory] = json.memUsage
                    .split("/")
                    .map(parseSize);
                const [
                    totalNetworkInput,
                    totalNetworkOutput,
                ] = json.networkIO.split("/").map(parseSize);
                const [blockInput, blockOutput] = json.blockIO
                    .split("/")
                    .map(parseSize);

                const currentNetworkInput = getCurrentNetworkInput(
                    totalNetworkInput
                );

                const currentNetworkOutput = prevNetworkOutput
                    ? totalNetworkOutput - prevNetworkOutput
                    : null;
                prevNetworkOutput = totalNetworkOutput;

                const extendedData = {
                    usedMemory,
                    availableMemory,
                    totalNetworkInput,
                    currentNetworkInput,
                    totalNetworkOutput,
                    currentNetworkOutput,
                    blockInput,
                    blockOutput,
                    cpuPerc: json.cpuPerc,
                };
                console.log(extendedData);
            } catch (error) {
                console.error(error, data);
            }
        });
        child.stdout.on("end", resolve);
        child.stdout.on("error", reject);
    });
};

run();
