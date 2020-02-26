const spawn = require("child_process").spawn;

const getAllContainersName = async () => {
    input = spawn("curl", [
        "-v",
        "--unix-socket",
        "/var/run/docker.sock",
        `http://localhost/containers/json`,
    ]);

    input.stdout.setEncoding("utf-8");

    return new Promise((resolve, reject) => {
        let result = "";
        input.stdout.on("data", data => {
            result += data;
        });
        input.stdout.on("end", () => {
            const containers = JSON.parse(result);

            resolve(
                containers.reduce((acc, { Names }) => acc.concat(Names), [])
            );
        });
    });
};

module.exports = getAllContainersName;
