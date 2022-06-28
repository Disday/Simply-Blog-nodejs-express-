install:
	npm ci

start:
	bin/server.js

start-dev:
	npx nodemon bin/server.js

test:
	npx jest --colors