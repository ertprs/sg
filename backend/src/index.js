const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const ptbr = require('moment/locale/pt-br');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

var port = process.env.PORT || 3333;

app.listen(port);
