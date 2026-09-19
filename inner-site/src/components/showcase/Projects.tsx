import React from 'react';
import { useNavigate } from 'react-router-dom';
import software from '../../assets/pictures/projects/software.gif';
import { projects } from './projects/projectData';
import './projects/ProjectGallery.css';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  return <div className="site-page-content"><h1>Projects</h1><h3>Web, Mobile & AI</h3><br />
    <p>Explore {projects.length} projects, from research tools and AI agents to Android apps and multiplayer games. Choose a project to see its screenshots and available links.</p><br />
    {projects.map(project => <button key={project.id} type="button" className="big-button-container portfolio-project-button" onClick={() => navigate('/projects/software#' + project.id)}>
      <img src={software} alt="" /><div><h1>{project.name}</h1><h3>{project.subtitle}</h3></div>
    </button>)}
  </div>;
};
export default Projects;
