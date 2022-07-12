install:
	npm ci

start:
	node bin/server.js

start-dev:
	npx nodemon bin/server.js

test:
	npx jest --colors

lint:
	npx eslint .