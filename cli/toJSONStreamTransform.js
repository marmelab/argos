const stream = require("stream");

const toJSONStreamTransform = new stream.Transform({
    transform(chunk, encoding, next) {
        try {
            if (this.hasStarded) {
                this.push(",");
            }
            if (!this.hasStarded) {
                this.push("[");
                this.hasStarded = true;
            }
            this.push(chunk);

            next();
        } catch (error) {
            this.emit("error", error);
        }
    },
    flush(done) {
        this.push("]");

        done();
    },
});

module.exports = toJSONStreamTransform;
