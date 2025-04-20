import React from 'react';
import './App.css';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

function App() {
  return (
      <>
        <header>FütiPick's Developer Page</header>
        <div className="card-container">
          <div className="developer-cards">
            <img src="/default-picture.jpg" alt="developer-francisco" style={{ width: '100%' }} />
            <h1>Francisco Godoy</h1>
            <p className="title">Software/Front-End Developer</p>
            <p>California State University Fullerton</p>
            <div style={{ margin: '24px 0' }} className="social-links">
              <a href="https://www.linkedin.com/in/francisco-godoy-79503a190/"><FaLinkedin /></a>
              <a href="https://www.github.com/psithepyro"><FaGithub /></a>
            </div>
          </div>
          <div className="developer-cards">
            <img src="/default-picture.jpg" alt="developer-bishoy" style={{ width: '100%' }} />
            <h1>Bishoy Farag</h1>
            <p className="title">Software/Front-End Developer</p>
            <p>California State University Fullerton</p>
            <div style={{ margin: '24px 0' }} className="social-links">
              <a href="https://www.linkedin.com/in/bishoy-farag/"><FaLinkedin /></a>
              <a href="https://github.com/bishoyfarag"><FaGithub /></a>
            </div>
          </div>
        </div>
      </>
    );
}

export default App;
