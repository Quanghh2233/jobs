import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditPostPage.css';

const EditPostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        navigate('/login');
    }

    // Fetch post data when component mounts
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

                // Check if user is authorized to edit this post
                const userId = userInfo.id || userInfo._id;
                const postUserId = data.user.id || data.user._id || data.userId;

                if (userId !== postUserId) {
                    setError('You are not authorized to edit this post');
                    return;
                }

                setTitle(data.title);
                setContent(data.content);

                // Convert tags array back to comma-separated string if needed
                if (Array.isArray(data.tags)) {
                    setTags(data.tags.join(', '));
                } else {
                    setTags(data.tags || '');
                }

                if (data.image) {
                    setImagePreview(`http://localhost:5000${data.image}`);
                }

                setLoading(false);
            } catch (err) {
                setError(
                    err.response && err.response.data.message
                        ? err.response.data.message
                        : 'Failed to fetch post data'
                );
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, userInfo, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        // Create image preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('tags', tags);
            if (image) {
                formData.append('image', image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(`http://localhost:5000/api/posts/${id}`, formData, config);
            setSubmitting(false);
            navigate(`/posts/${id}`);
        } catch (err) {
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : 'An error occurred. Please try again.'
            );
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="edit-post-page">
            <h1>Edit Post</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={submitHandler} className="post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        rows="10"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="tags">Tags (comma separated)</label>
                    <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="technology, programming, news"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image (optional)</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <p className="image-note">
                                {image ? 'New image selected' : 'Current image (leave empty to keep)'}
                            </p>
                        </div>
                    )}
                </div>

                <div className="button-group">
                    <button type="submit" disabled={submitting} className="save-button">
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate(`/posts/${id}`)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPostPage;
