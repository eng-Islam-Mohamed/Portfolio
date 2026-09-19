import React from 'react';
import {
    BrowserRouter as Router,
    NavLink,
    Route,
    Routes,
} from 'react-router-dom';
import Home from './Home';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';
import SoftwareProjects from './projects/Software';

const MobileNavigation: React.FC = () => (
    <header className="mobile-portfolio-header">
        <NavLink className="mobile-brand" to="/" aria-label="Portfolio home">
            <span>MI</span>
            <div>
                <b>Mohamed Islam</b>
                <small>Software Engineer · ESI</small>
            </div>
        </NavLink>
        <nav className="mobile-nav" aria-label="Portfolio navigation">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/experience">Experience</NavLink>
            <NavLink to="/projects/software">Projects</NavLink>
            <NavLink to="/contact">Contact</NavLink>
        </nav>
    </header>
);

const MobileShowcase: React.FC = () => (
    <Router basename="/os">
        <div className="mobile-portfolio-shell">
            <MobileNavigation />
            <main className="site-page mobile-site-page">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/software" element={<SoftwareProjects />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>
        </div>
    </Router>
);

export default MobileShowcase;
