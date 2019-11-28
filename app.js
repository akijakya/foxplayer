'use strict';

// requiring path
const path = require('path');

// requiring bodyParser
const bodyParser = require('body-parser');
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

// requiring env
const env = require('dotenv').config();

// requiring express
const express = require('express');
const app = express();
const PORT = process.env.PORT;

// connection with the database
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME,
});

connection.connect(function(err) {
    if (err) {
      console.log('Error connecting to database');
      return;
    }
    console.log('Connection to database established');
});

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// app.get('/hello', function (req, res) {
//     res.send('hello world');
// });

app.get('/playlists', function(req, res) {
    // console.log(req.headers);
    connection.query('SELECT * FROM playlists;', function(err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        res.status(200);
        res.setHeader("Content-type", "application/json");
        res.send(result);
    });
});

app.post('/playlists', function(req, res) {
    connection.query(`INSERT INTO playlists (playlist) VALUES (?);`, [req.body.name], function(err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        connection.query('SELECT * FROM playlists WHERE id=(SELECT max(id) FROM playlists);', function(err, result) {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
            res.status(200);
            res.setHeader("Content-type", "application/json");
            res.send(result[0]);
        });
    });
});

app.delete('/playlists/:id', function(req, res) {
    connection.query(`SELECT * FROM playlists WHERE id = ?;`, [req.params.id], function (err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        connection.query(`DELETE FROM playlists WHERE id = ?;`, [req.params.id], function(err, result) {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
        });
        res.status(200);
        res.setHeader("Content-type", "application/json");
        if (result[0] !== undefined) {
            res.send(result[0]);    
        } else {
            res.send('There is no such playlist');
        }
    });
});

// GETTING INFO ABOUT THE TRACKS IN THE MUSIC FOLDER

const trackPathForJS = 'public/assets/music/';
const trackPathForHTML = 'assets/music/';

const fs = require('fs');
const mm = require('musicmetadata');

let trackData = function(filename) {
    return new Promise (function(resolve, reject) {
        let readableStream = fs.createReadStream(path.join(__dirname, trackPathForJS + filename));
        mm(readableStream, { duration: true }, function (err, metadata) {
            if (err) throw err;
            readableStream.close();
            resolve(metadata);
        });
    });
}

// async function getTrackData (filename) {
//     let result = await trackData(filename);
//     console.log(result);
// };

// getTrackData('Organoid_-_09_-_Purple_Drift.mp3');
    
function getTrackNames (){
    let files = fs.readdirSync(path.join(__dirname, trackPathForJS));
    let trackNames = [];
    files.forEach(function (e) {
        if (e.slice(-2) !== 'MD') {
            trackNames.push(e);
        }
    });
    return trackNames;
}

app.get('/playlist-tracks', function(req, res) {
    let trackNamePromises = [];

    getTrackNames().forEach(function(e) {
        trackNamePromises.push (
            new Promise (async function(resolve, reject) {
                let result = await trackData(e);
                resolve({"title": result.title, "artist": result.artist[0], "duration": result.duration, "path": trackPathForHTML + e});
            })
        );
    });

    Promise.all(trackNamePromises).then(function(result) {
        res.status(200);
        res.setHeader("Content-type", "application/json");
        res.send(result);
    });
});

// app.put('/posts/:id/upvote', function(req, res) {
//     connection.query(`UPDATE posts SET score = score + 1 WHERE id = ?;`, [req.params.id], function(err, result) {
//         if (err) {
//             res.status(500).send('Database error');
//             return;
//         }
//         connection.query(selectById(req.params.id), function(err, result) {
//             if (err) {
//                 res.status(500).send('Database error');
//                 return;
//             }
//             res.status(200);
//             res.setHeader("Content-type", "application/json");
//             if (result[0] !== undefined) {
//                 res.send(result[0]);    
//             } else {
//                 res.send('There is no such post');
//             }
//         });
//     });
// });

// // Viktorr's async method:
// // app.put('/posts/:id/upvote', async function(req, response) {
// //     let result = await getScoreById(req.params.id);
// //     if (result.length > 0) {
// //         await incrementScoreByOneById(req.params.id);
// //     }
// //     let newResult = await getScoreById(req.params.id);
// //     response.setHeader("Content-type", "application/json");
// //     response.send(newResult[0]);
// // });

// // async function incrementScoreByOneById(id) {
// //     return new Promise((resolve, reject) => {
// //         connection.query(`UPDATE posts SET score = score + 1 WHERE id = '${id}';`, (err, result) => {
// //             resolve(result);
// //         });
// //     });
// // }

// // async function getScoreById(id){
// //     // console.log(connection);
// //     return new Promise((resolve, reject) => {
// //         connection.query(`SELECT score FROM posts WHERE id = '${id}';`, (err, result) => {
// //             resolve(result);
// //         });
// //     });
// // }

// app.put('/posts/:id/downvote', function(req, res) {
//     connection.query(`UPDATE posts SET score = score - 1 WHERE id = ?;`, [req.params.id], function(err, result) {
//         if (err) {
//             res.status(500).send('Database error');
//             return;
//         }
//         connection.query(selectById(req.params.id), function(err, result) {
//             if (err) {
//                 res.status(500).send('Database error');
//                 return;
//             }
//             res.status(200);
//             res.setHeader("Content-type", "application/json");
//             if (result[0] !== undefined) {
//                 res.send(result[0]);    
//             } else {
//                 res.send('There is no such post');
//             }
//         });
//     });
// });

// // absolute barebone solution with no error handling
// // app.put('/posts/:id/downvote', function(req, res) {
// //     connection.query(`UPDATE posts SET score = score - 1 WHERE id = '${req.params.id}';`);
// //     connection.query(`SELECT * FROM posts WHERE id = '${req.params.id}';`, function(err, result) {
// //         res.status(200);
// //         res.setHeader("Content-type", "application/json");
// //         res.send(result[0]);
// //     });
// // });

// app.put('/posts/:id', function(req, res) {
//     connection.query(`UPDATE posts SET title = ?, url = ? WHERE id = ?;`, [req.body.title, req.body.url, req.params.id], function (err, result) {
//         if (err) {
//             res.status(500).send('Database error');
//             return;
//         }
//         connection.query(selectById(req.params.id), function(err, result) {
//             if (err) {
//                 res.status(500).send('Database error');
//                 return;
//             }
//             res.status(200);
//             res.setHeader("Content-type", "application/json");
//             if (result[0] !== undefined) {
//                 res.send(result[0]);    
//             } else {
//                 res.send('There is no such post');
//             }
//         });
//     });
// });

app.listen(PORT, () => {
    console.log(`The server is up and running on ${PORT}`);
});