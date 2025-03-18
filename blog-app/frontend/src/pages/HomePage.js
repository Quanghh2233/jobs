import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostItem from '../components/PostItem';
import './HomePage.css';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/posts');
                setPosts(data);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message
                    ? err.response.data.message
                    : err.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="home-page">
            <div className="hero">
                <h1>Welcome to MyBlog</h1>
                <p>Discover stories, thoughts, and insights</p>
            </div>
            <div className="posts-container">
                <h2>Latest Posts</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <>
                        {posts.length === 0 ? (
                            <p>No posts found</p>
                        ) : (
                            <div className="posts-grid">
                                {posts.map((post) => (
                                    <PostItem key={post._id} post={post} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;
