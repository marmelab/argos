const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = async command => {
    const { stdout, stderr } = await exec(command);

    if (stderr) {
        throw stderr;
    }

    return stdout;
};
