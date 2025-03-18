import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostPage.css';

const PostPage = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchPost = async () => {
            // Check if ID is undefined or null
            if (!id) {
                setError('Invalid post ID');
                setLoading(false);
                return;
            }

            try {
                const { data } = await axios.get(`http://localhost:5000/api/posts/${id}`);
                setPost(data);
                setLoading(false);
            } catch (err) {
                setError(
                    err.response && err.response.data.message
                        ? err.response.data.message
                        : 'Failed to fetch post'
                );
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const deleteHandler = async () => {
        if (!id) {
            setError('Invalid post ID');
            return;
        }

        if (window.confirm('Are you sure you want to delete this post?')) {
            setDeleteLoading(true);

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                await axios.delete(`http://localhost:5000/api/posts/${id}`, config);
                navigate('/');
            } catch (err) {
                setError(
                    err.response && err.response.data.message
                        ? err.response.data.message
                        : 'Failed to delete post'
                );
                setDeleteLoading(false);
            }
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="post-page">
            {post && (
                <>
                    {post.image && (
                        <div className="post-image">
                            <img src={`http://localhost:5000${post.image}`} alt={post.title} />
                        </div>
                    )}

                    <h1 className="post-title">{post.title}</h1>

                    <div className="post-meta">
                        <div className="post-info">
                            <span className="post-author">By {post.user?.name || 'Unknown'}</span>
                            <span className="post-date">{formatDate(post.createdAt)}</span>
                        </div>

                        {userInfo && post.user && (
                            userInfo.id === post.user.id || userInfo._id === post.user._id ||
                            userInfo.id === post.userId || userInfo._id === post.userId
                        ) && (
                                <div className="post-actions">
                                    <Link to={`/edit-post/${post.id || post._id}`} className="btn btn-edit">
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-delete"
                                        onClick={deleteHandler}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div className="post-tags">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="post-content">
                        {post.content.split('\n').map((paragraph, index) => (
                            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                        ))}
                    </div>

                    <div className="post-footer">
                        <Link to="/" className="back-link">
                            ← Back to Posts
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default PostPage;
