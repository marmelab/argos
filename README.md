# ARGOS

Auditing Reporter for Greener Ops Strategies

Tool to measure consumption of a given docker command and see its performance evolution.
Argos is able to measure cpu, memory and network usage of docker containers for a given command.
By measuring resource consumption of dockerized e2e test, argos allows to compare the consumption of an app between its different version.

Argos use the collected metrics to generate chart per docker container and metrics.

## Requirements

- Docker
- Docker Compose

## Installation

`make install`

## Usage

### start the app

`make start` start the server and the mongo database.

Go to localhost:3003 to see the report.

### Run the cli

The cli allows to realize measure. It will execute the given command x times, and then compute the average, min and max of the realized measures.
The mongo database must be up.

`NAME="[name_of_the_run]" COMMAND="[docker command to measure]" RUN_QUANTITY=[number of run to execute] docker-compose up`

- NAME: the name of the measure
- COMMAND: the command to measure: this must be a docker command
- RUN_QUANTITY: the number of command execution, argos need to execute the command several time in order to get an average measure.
