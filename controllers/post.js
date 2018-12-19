var Post = require('../models/post');
var fs = require('fs');
var path = require("path");

const handleError = (err, res) => {
    res
        .status(500)
        .end();
  };

exports.post_create = function (req, res) {
    var imgFile = req.files.imageFile[0];
    var imgExt = path.extname(imgFile.originalname).toLowerCase();
    var tempPath = imgFile.path;
    var targetPath = imgFile.path + imgExt;

    if (imgExt === ".jpg" || imgExt === ".png" || imgExt === ".gif") {
        fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);
            var post = new Post(
                {
                    name: req.body.descText,
                    url: "/images/" + imgFile.filename + imgExt,
                    orderPos: Number(req.body.totalItems) + 1
                }
            );
    
            post.save(function (err) {
                if (err) {
                    return handleError(err, post);
                }
                res.send(post);
            });
        });
      } else {
        fs.unlink(tempPath, err => {
          return handleError(err, res);
        });
    }
};

exports.post_all = function (req, res) {
    Post.find({}).then(function (posts) {
        posts.sort((a,b) => (a.orderPos > b.orderPos) ? 1 : ((b.orderPos > a.orderPos) ? -1 : 0)); 
        res.send(posts);
    });
};

exports.post_update = function (req, res) {
    var imgFile = req.files.imageFile[0];
    var imgExt = path.extname(imgFile.originalname).toLowerCase();
    var tempPath = imgFile.path;
    var targetPath = imgFile.path + imgExt;

    if (imgExt === ".jpg" || imgExt === ".png" || imgExt === ".gif") {
        fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);
            Post.findByIdAndUpdate(req.params.id, {$set: { name: req.body.descText, url: "/images/" + imgFile.filename + imgExt}}, {new: true}, function (err, post) {
                if (err) return handleError(err, res);
                res.send(post);
            });
        });
      } else {
        fs.unlink(tempPath, err => {
          return handleError(err, res);
        });
    }
};

exports.post_update_order = function (req, res) {
    req.body.data.reverse().forEach(function(post, index) {
        Post.findByIdAndUpdate(post, {$set: { orderPos: index + 1}}, function (err) {
            if (err) return handleError(err, res);
        });
      });
    res.send('Order updated.');
};

exports.post_delete = function (req, res) {
    Post.findByIdAndRemove(req.body.id, function (err) {
        if (err) return handleError(err, res);
        res.send('Deleted successfully!');
    });
};