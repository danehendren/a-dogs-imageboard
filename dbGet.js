var spicedPg = require('spiced-pg');
var config = require('./config.json')
var amazon = config.s3Url
var dbUrl;

//=====================
if (process.env.DATABASE_URL) {
    dbURL = process.env.DATABASE_URL
} else {
    var info = require('./secrets.json')
    var user = info.username;
    var pass = info.password;
    dbURL = `postgres:${user}:${pass}psql@localhost:5432/images`
}
var db = spicedPg(dbURL)
//=====================Getting Images from Database
exports.getImages = function() {
    return db.query(
        `SELECT *
        FROM images`
    ).then((results) => {
        results.rows.forEach(function(photos) {
            // console.log('this is a error in foreach loop');
            photos.image = amazon + photos.image
            // console.log(photos.image);
        })
        return results.rows;
    })
}
//====================Inserting the Images into the Public Folder
exports.uploadImages = function(image, username, title, description) {

    const q =`INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4) `
    const params = [ image, username, title, description ]
    // console.log('this is my params in the upload photos', params);
    return db.query(q, params)
    .then(() => {
        console.log('inside of the uploading function');
    }).catch(err => {
        console.log("there was an error in upload imges",err);
    })
}
//============================Posting image TO About page
exports.displayPhotoFromDb = function(id) {
    const q = `SELECT * FROM images WHERE id = $1`
    const params = [ id ]
    return db.query(q, params)
    .then((results) => {
        return results.rows[0];
    })
}
//============================Comments Uploading to DB
exports.uploadComment = function(comment, imageId, username) {
    const q =`INSERT INTO comments (comment, imageId, username) VALUES ($1, $2, $3)`
    const params = [ comment, imageId, username ]
    // console.log('console logging my username man', username);
    return db.query(q, params)
    .then((results) => {
        return results.rows[0];
        // console.log('inside the comment uploading section', results.rows[0]);
    }).catch(err => {
        console.log('upload comment error caught');
    })
}
//=============================Displaying the comments
exports.displayCommentFromDb = function(imageId){
    const q = `SELECT * FROM comments WHERE imageId = $1`
    const params = [ imageId ]
    return db.query(q, params)
    .then((results) => {
        return results.rows;
    })
}
