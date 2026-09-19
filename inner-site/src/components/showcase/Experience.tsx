import React from 'react';
import { Link } from 'react-router-dom';
import ResumeDownload from './ResumeDownload';
import { projects } from './projects/projectData';

const Experience: React.FC = () => <div className="site-page-content">
  <h1>Experience</h1><br /><ResumeDownload />
  <div className="text-block"><h2>Education</h2><br /><h3>ESI</h3><h4>National Higher School of Computer Science</h4><br /><p>Software Engineering · Algeria</p></div>
  <div className="text-block"><h2>Project Work</h2><br />
    {projects.map(project => <div className="text-block" key={project.id}><h3>{project.name}</h3><h4>{project.category}</h4><br /><p>{project.description}</p><p><Link to={'/projects/software#' + project.id}>Explore {project.name}.</Link></p></div>)}
  </div>
  <div className="text-block"><h2>Areas of Focus</h2><br /><ul><li><p>Web applications and user interfaces</p></li><li><p>Android apps and multiplayer games</p></li><li><p>AI agents, automation, and retrieval-augmented generation</p></li></ul></div>
</div>;
export default Experience;
