# ARGOS

Auditing Reporter for Greener Ops Strategies

Tool to measure consumption of a given docker command and see its performance evolution.
Argos is able to measure cpu, memory and network usage of docker containers for a given command.
By measuring resource consumption of dockerized e2e tests, argos allows to compare the consumption of an app between its different versions.

Argos use the collected metrics to generate chart per docker container and metrics.

## Requirements

- Docker
- Docker Compose

## Installation

`make install`

## Usage

### Start the App

`make start` start the server and the mongo database.

Go to http://localhost:3003 to see the report.

### Run the CLI

The CLI allows to realize measures. It will execute the given command x times, and then compute the average, min and max of the realized measures.
The mongo database must be up.

`NAME="[name_of_the_run]" COMMAND="[docker command to measure]" RUN_QUANTITY=[number of run to execute] MONGO_HOST=localhost MONGO_PORT=27017 MONGO_USER=root MONGO_PASSWORD=secret make run`

- NAME: the name of the measure
- COMMAND: the command to measure: this must be a docker command
- RUN_QUANTITY: the number of command execution, argos need to execute the command several times in order to get an average measure.

### Stop the App

Use `make stop` to stop the server and the database.

### See the Logs

If the app is not workings as expected, you can see the logs by using `make logs`.
