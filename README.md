# ARGOS

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
