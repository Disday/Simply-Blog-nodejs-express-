/* eslint-disable no-console */
import server from '../index.js';

const port = 8080;
server().listen(port, () => {
  console.log(`Server was started on '${port}'`);
});
