import React from 'react';
import { Link } from 'react-router-dom';
import './PostItem.css';

const PostItem = ({ post }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Fix for accessing post ID - check both id and _id properties
    const postId = post.id || post._id;

    return (
        <div className="post-card">
            {post.image && (
                <div className="post-image">
                    <img
                        src={post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`}
                        alt={post.title}
                    />
                </div>
            )}
            <div className="post-content">
                <h2><Link to={`/posts/${postId}`}>{post.title}</Link></h2>
                <div className="post-meta">
                    <span>By {post.user.name}</span>
                    <span>{formatDate(post.createdAt)}</span>
                </div>
                <p className="post-excerpt">
                    {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                </p>
                <Link to={`/posts/${postId}`} className="read-more">
                    Read More
                </Link>
            </div>
        </div>
    );
};

export default PostItem;
