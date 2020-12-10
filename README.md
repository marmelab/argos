# ARGOS

 ![GitHub top language](https://img.shields.io/github/languages/top/marmelab/argos.svg) ![GitHub contributors](https://img.shields.io/github/contributors/marmelab/argos.svg) ![License](https://img.shields.io/github/license/marmelab/argos.svg) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Auditing Reporter for Greener Ops Strategies

Tool to measure consumption of a given Docker command and see its performance evolution.
Argos is able to measure CPU, memory and network usage of Docker containers for a given command.
By measuring resource consumption of dockerized E2E tests, Argos allows to compare the consumption of an app between its different versions.

Argos use the collected metrics to generate chart per Docker container and metrics.

## Requirements

- Docker
- Docker Compose

## Installation

`make install`

## Usage

### Start the App

`make start` start the server and the MongoDB database.

Go to http://localhost:3003 to see the report.

### Run the CLI

The CLI allows to realize measures. It will execute the given command x times, and then compute the average, min and max of the realized measures.
The MongoDB database must be up.

`NAME="[name_of_the_run]" COMMAND="[docker command to measure]" RUN_QUANTITY=[number of run to execute] MONGO_HOST=localhost MONGO_PORT=27017 MONGO_USER=root MONGO_PASSWORD=secret make run`

- NAME: the name of the measure.
- COMMAND: the command to measure. It must be a Docker command running the containers, executing the tests and stopping the containers.
- RUN_QUANTITY: the number of command executions. Argos needs to execute the command several times in order to get an average measure.

### Compare the App Performance Between Versions

Once the CLI has realized a first benchmark of your app, you can compare it with another benchmark of a different version of your application.

To do so, relaunch the CLI with the same environment variables excepted the `NAME` one (choose another name). When the benchmark is finished, you will the comparison of the benchmarks in the report page.

### Stop the App

Use `make stop` to stop the server and the database.

### See the Logs

If the app is not workings as expected, you can see the logs by using `make logs`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

```bash
make cypress open
```

To learn more about the contributions to this project, consult the [contribution guide](/.github/CONTRIBUTING.md).

## Team

[![ThieryMichel](https://avatars3.githubusercontent.com/u/4034399?s=96&amp;v=4)](https://github.com/ThieryMichel) | [![JulienMattiussi](https://avatars2.githubusercontent.com/u/39904906?s=96&amp;v=4)](https://github.com/JulienMattiussi) | [![floo51](https://avatars3.githubusercontent.com/u/2562270?s=96&amp;v=4)](https://github.com/floo51)| [![Alan Poulain](https://avatars3.githubusercontent.com/u/10920253?s=96&u=936bd5325071ddb7fa1123b4b1eab1f737d282b1&v=4)](https://github.com/alanpoulain)
:---:|:---:|:---:|:---:
[ThieryMichel](https://github.com/ThieryMichel) | [JulienM](https://github.com/JulienMattiussi) | [Florian F.](https://github.com/floo51) | [Alan Poulain](https://github.com/alanpoulain)

## License

Argos is licensed under the [MIT License](LICENSE), courtesy of [Marmelab](http://marmelab.com).
