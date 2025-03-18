const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }]
        });

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        // Handle image uploads
        let image = '';
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        const post = await Post.create({
            title,
            content,
            userId: req.user.id,
            tags: tags || '',
            image,
        });

        const postWithUser = await Post.findByPk(post.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }]
        });

        res.status(201).json(postWithUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        const post = await Post.findByPk(req.params.id);

        if (post) {
            if (post.userId !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to update this post' });
            }

            // Update post data
            if (title) post.title = title;
            if (content) post.content = content;
            if (tags) post.tags = tags;

            // Handle image uploads
            if (req.file) {
                post.image = `/uploads/${req.file.filename}`;
            }

            await post.save();

            const updatedPost = await Post.findByPk(post.id, {
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }]
            });

            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);

        if (post) {
            if (post.userId !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to delete this post' });
            }

            await post.destroy();
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};
