import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container header-content">
                <div className="logo">
                    <Link to="/">MyBlog</Link>
                </div>
                <nav className="nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        {userInfo ? (
                            <>
                                <li><Link to="/create-post">New Post</Link></li>
                                <li><button onClick={logoutHandler} className="btn-link">Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
