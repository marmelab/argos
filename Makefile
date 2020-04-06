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
	$(MAKE) --quiet --no-print-directory install-js-dep

install-js-dep:
	docker-compose run --no-deps --rm cypress bash -ci 'npm install'
	$(MAKE) --quiet --no-print-directory install-cypress 1>/dev/null

install-cypress: ## install cypress
	docker-compose run --rm --no-deps \
		cypress bash -ci ' \
			CI=true ./node_modules/.bin/cypress install \
	'
	docker-compose down || true

start-cypress-docker: ## Open cypress window.
	docker-compose run --rm cypress npm run cypress:open

cs-fix: # fix the code style
	npm run cs-fix

run: ## run stats cli
	node packages/cli/src/index.js

api: # run api server
	npm run start:server

connect-mongo:
	docker exec -it argos_mongo_1 mongo db

start:
	npm run start
