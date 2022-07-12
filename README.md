# Simply-Blog (nodejs/express)

## Description
Light-weight blog web-service with authentication.

## Features
- Authorization for private actions - only author has permission to edit and delete his own posting.
- Form validation with error displaying.
- Flash-messages for important user events.

## Main dependencies
- Express 4.18.1
- Express-session 1.17.3
- Bootstrap 5.1.3
- Pug 3.0.2
- Eslint 8.19.0
- Jest 28.1.1

## Requirements
1. **Nodejs** v16.0 or higher. For install you can follow  https://nodejs.org/en/
2. **Make** utility. For install use ```sudo apt install make```

## Setup
1. Clone repository to your system with ```git clone https://github.com/Disday/Simply-Blog-nodejs-express-.git```\
**OR**\
Dowload archive and extract to any directory https://github.com/Disday/Simply-Blog-nodejs-express-/archive/refs/heads/master.zip
2. Run installation from project directory with ```make install``` 

## Run
1. Run local server with ```make start```
2. Open http://localhost:8080 with browser

## Run tests
Use ```make test``` for running tests
