import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreatePostPage.css';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        navigate('/login');
    }

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
        } else {
            setImagePreview(null);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
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

            await axios.post('http://localhost:5000/api/posts', formData, config);
            setLoading(false);
            navigate('/');
        } catch (err) {
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : 'An error occurred. Please try again.'
            );
            setLoading(false);
        }
    };

    return (
        <div className="create-post-page">
            <h1>Create New Post</h1>
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
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePostPage;
