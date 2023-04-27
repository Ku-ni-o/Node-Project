const path = require('path');
const express = require('express');
const mysql = require('mysql');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public/images/', express.static('/public/images/'));


const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'database'
});

connection.connect((err) => {
if (err)
    { console.error('Error connecting to MySQL database: ' + err.stack);
return;
    }
console.log('Connected to MySQL database with id ' + connection.threadId);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/home', (req, res) => {
        res.sendFile(path.join(__dirname, 'views','home.html'));
    });

app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, 'views','login.html'));
    });

app.get('/inputpage', (req, res) => {
        res.sendFile(path.join(__dirname, 'views','inputpage.html'));
    });

app.post('/add', (req, res) => {
    // Transaction
    connection.query(
        'INSERT INTO kanjidata (kanji, reading, meaning) VALUES (?, ?, ?)',
        [
            req.body.kanji,
            req.body.reading,
            req.body.meaning
        ],
        (error, results) => {
            res.redirect('/inputpage');
        });
    });


// default database view
app.get('/searchform', (req, res) => {
    connection.query('SELECT * FROM kanjidata',
        (error, result) => {
        res.render('searchform', {data: result});
        });
    });

// search process
app.get('/searchresult', (req, res) => {
    const searchInput = req.query.searchInput;
    console.log(searchInput);
    connection.query(
        `SELECT *
        FROM kanjidata
        WHERE reading = '${searchInput}'
        OR meaning = '${searchInput}'
        OR kanji = '${searchInput}'`,
        (error, result) => {
        res.render('searchform', {data: result});
        });
    });

app.get('/practice', (req, res) => {
        res.sendFile(path.join(__dirname, 'views/practice.html'));
    });

app.listen(3000, () => {
        console.log('Server started on port 3000');
    });

