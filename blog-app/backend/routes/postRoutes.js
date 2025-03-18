const express = require('express');
const { getPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { postValidationRules, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(
        protect,
        upload.single('image'),
        postValidationRules(),
        validate,
        createPost
    );

router.route('/:id')
    .get(getPostById)
    .put(
        protect,
        upload.single('image'),
        postValidationRules(),
        validate,
        updatePost
    )
    .delete(protect, deletePost);

module.exports = router;
