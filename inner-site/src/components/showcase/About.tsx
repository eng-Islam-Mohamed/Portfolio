import React from 'react';
import { Link } from 'react-router-dom';
import ResumeDownload from './ResumeDownload';
const About: React.FC = () => <div className="site-page-content">
  <h1 style={{marginLeft:-16}}>Welcome</h1><h3>I'm Mohamed Islam</h3><br/>
  <div className="text-block"><p>I'm a software engineer from ESI — the National Higher School of Computer Science in Algeria. I build web, mobile, and AI solutions, with a focus on useful applications and thoughtful interfaces.</p><br/><p>Thank you for exploring my portfolio. This retro computer is a way to discover my work, try a few games, and get to know the person behind the code. If you have an idea or a question, visit <Link to="/contact">the contact page</Link> or email <a href="mailto:nm_benaboud@esi.dz">nm_benaboud@esi.dz</a>.</p></div>
  <ResumeDownload/>
  <div className="text-block"><h3>About Me</h3><br/><p>I enjoy turning complex information into approachable digital experiences. My work explores the connection between software engineering, visual interfaces, and AI-powered discovery.</p><br/><p>My projects include multilingual country discovery, history research, hadith verification, translation services, AI lead follow-up, quantum tutoring, a party game, and a personal knowledge vault. Explore them on the <Link to="/projects/software">software projects page</Link>.</p></div>
  <div className="text-block"><h3>Education</h3><br/><h4>ESI — National Higher School of Computer Science</h4><p>Software Engineering · Algeria</p></div>
  <div className="text-block"><h3>Find Me Online</h3><br/><p><a href="https://github.com/eng-Islam-Mohamed" target="_blank" rel="noreferrer">github.com/eng-Islam-Mohamed</a></p></div>
</div>;
export default About;
