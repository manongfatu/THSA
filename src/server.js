const express = require('express');

let app = express();
let routes = require('./routes');
app.use(routes);

const PORT = 3000;
app.listen(PORT, () => console.info("Server Start!"));
