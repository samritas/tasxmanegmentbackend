var express = require('express');
var bodyParser = require('body-parser');
var connection = require('./app/config/connection');
var cors = require('cors'); // Import cors package

const authRoutes = require('./app/controllers/authRoutes');
const tasxRoutes = require('./app/controllers/tasxRoute');

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Use cors middleware
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/task', tasxRoutes);

connection.init();

var server = app.listen(8000, function(){
  console.log('Server listening on port ' + server.address().port);
});
