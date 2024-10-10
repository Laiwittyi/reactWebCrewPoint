import React from 'react';
import './App.css'; // Create an App.css file for the CSS

const AppBar = () => {
    return (
        <div className="toolbar">
            <div className="logo">
                <img src="https://www.skylark.co.jp/site_resource/common/images/header/logo_skylark_gloup.png" alt="Logo" className="responsive-image" />
            </div>
            <div className="menu">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </div>
        </div>
    );
};

export default AppBar;
