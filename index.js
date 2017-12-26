const express = require('express');
const app = express();
const dbGet = require('./dbGet')
const multer = require('multer')
const uidSafe = require('uid-safe')
const path = require('path')
const bp = require('body-parser')
const s3 = require('./s3')
var dbUrl ;
// var dbUrl = process.env.DATABASE_URL || 'postgres://spicedling:password@localhost:5432/dogboard';

//======================================.

if (process.env.DATABASE_URL) {
    dbURL = process.env.DATABASE_URL
} else {
    var info = require('./secrets.json')
    var user = info.username;
    var pass = info.password;
    dbURL = `postgres:${user}:${pass}psql@localhost:5432/images`
}

//=====================================
app.use(express.static('./public'));
app.use(bp.urlencoded({extended: false}))
app.use(bp.json())
app.use(express.static('uploads'))
//=====================================Boiler Code Getting Image upload
var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//=====================================Get Request for Images
app.get('/images' , function(req,res) {
    dbGet.getImages().then(function(results){
        // console.log(results);
        res.json(results)
    })
})
//=====================================Post Uploading image into DB
app.post('/upload-image', uploader.single('file'), function(req, res) {
    s3.upload(req.file)
    .then(dbGet.uploadImages(req.file.filename, req.body.username, req.body.title, req.body.description)
)
})
//=====================================Get Request Using Promise All Method
// app.get('/getSingleImage/:imageId', (req, res) => {
//     var id = req.params.imageId
//     var title = req.params.title
//     var comment = req.body.comment
//     Promise.all([
//         dbGet.displayPhotoFromDb(id, title),
//         dbGet.displayCommentFromDb(comment)
//     ]).then((results) => {
//         console.log('this is the promise all comment', comment);
//         res.json(results)
//         return results.rows[0]
//     })
// })
//==================================Posting the images onto the Single Image page
app.get('/getSingleImage/:imageId', (req, res) => {
    var id = req.params.imageId
    var title = req.params.title
    dbGet.displayPhotoFromDb(id, title).then((results) => {
        res.json(results);
    })
})
//====================================POST UPLOAD comments
app.get('/add-comment/:imageId' , (req, res) => {

    var imageId = req.params.imageId
    dbGet.displayCommentFromDb(imageId).then((results) => {
        res.json(results);
    })
})
//=====================================Post Adding Comments to Database table Comment
app.post('/add-comment/:imageId', (req, res) => {
    var comment = req.body.comment
    var imageId = req.params.imageId
    var username = req.body.username

    console.log('this is the stuff', comment, username, imageId);

    dbGet.uploadComment(req.body.comment, req.params.imageId, req.body.username)
    .then((results) => {
        res.json(results);
    })
})
//====================================
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})
//=====================================
app.listen(process.env.PORT || 8080, () => console.log('listening to that fresh heroku port'));
// app.listen(8080, () => console.log("i'm listening to youuuu"));
