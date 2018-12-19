// app.js

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var posts = require('./routes/post');
var app = express();
global.__basedir = __dirname;
global.__imgdir = __dirname + '/public_html/images';

var dev_db_url = 'mongodb://benito:jUbkVD2Tym5vCrt@ds045507.mlab.com:45507/ben-challenge1';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/posts', posts);
app.use(express.static('public_html'));

var port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public_html/index.html')
});