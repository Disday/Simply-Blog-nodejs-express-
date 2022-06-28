start:
	export NODE_PATH=./node_modules && npx nodemon bin/server.js
test:
	export NODE_PATH=./node_modules && npx jest