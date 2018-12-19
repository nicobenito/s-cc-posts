var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __imgdir)
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});

var post_controller = require('../controllers/post');

router.post('/create', upload.fields([{ name: 'imageFile', maxCount: 1 }]), post_controller.post_create);

router.get('/getall', post_controller.post_all);

router.post('/sort', post_controller.post_update_order);

router.post('/:id/update', upload.fields([{ name: 'imageFile', maxCount: 1 }]), post_controller.post_update);

router.post('/delete', post_controller.post_delete);

module.exports = router;