const spawn = require("child_process").spawn;
const readline = require("readline");

const containerName = "argos_cypress_1";

const initGetValueIncrement = () => {
    let previousValue = 0;
    return value => {
        const result = value - previousValue;
        previousValue = value;

        return result;
    };
};

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
            console.log(JSON.parse(line));
        });
    });
};

run();
