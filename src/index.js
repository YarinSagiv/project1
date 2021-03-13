// Load Node modules
const express = require("express");
const ejs = require('ejs');
// Initialise Express
const app = express();

const app_port = process.env.PORT || 3000;

// Set the view engine to ejs
app.set('view engine', 'ejs');
// Render static files
app.use(express.static('public'));


app.listen(app_port);
console.log(`app is running. port: ${app_port}`);
console.log(`http://127.0.0.1:${app_port}/`);

// *** GET Routes - display pages ***
// Root Route
app.get('/', function (req, res) {
    res.render('pages/firstpage');
});

app.get('/logIn', function (req, res) {
    res.render('pages/logIn')
})

app.get('/connectpage', function (req, res) {
    res.render('pages/connectpage')
})

app.get('/newu', function (req, res) {
    res.render('pages/newu')
})


// https://project1sprint1.herokuapp.com/

