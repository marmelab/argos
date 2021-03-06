.PHONY: release

help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# =====================================================================
# Docker variables and exports ========================================
# =====================================================================

CURRENT_DIR = $(shell pwd)
USER_ID = $(shell id -u)
GROUP_ID = $(shell id -g)

export UID = $(USER_ID)
export GID = $(GROUP_ID)

install: ## fresh install all services in docker for local development
	docker run --rm -t node bash -ci 'yarn'

cs-fix: # fix the code style
	npm run cs-fix

run: ## run stats cli
	node packages/cli/src/index.js

connect-mongo:
	docker exec -it argos_mongo_1 mongo mongodb://root:@localhost:27017

start:
	docker-compose up -d

logs:
	docker-compose logs -f

stop:
	docker-compose stop

down:
	docker-compose down -v
