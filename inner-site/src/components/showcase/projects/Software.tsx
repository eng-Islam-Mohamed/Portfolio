import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ResumeDownload from '../ResumeDownload';
import { projects, PortfolioProject } from './projectData';
import './ProjectGallery.css';

const ScreenshotGallery: React.FC<{ project: PortfolioProject }> = ({ project }) => {
  const [selected, setSelected] = useState(0);
  const screenshot = project.screenshots[selected];
  const source = '/os/projects/' + screenshot.file;
  return <figure className="project-gallery">
    <a className="project-gallery-preview" href={source} target="_blank" rel="noreferrer" aria-label={'Open full-size ' + project.name + ' screenshot'}>
      <img src={source} alt={project.name + ' — ' + screenshot.caption} loading="lazy" />
    </a>
    <figcaption><b>{selected + 1} / {project.screenshots.length}</b> · {screenshot.caption}</figcaption>
    {project.screenshots.length > 1 && <div className="project-gallery-thumbnails" role="group" aria-label={project.name + ' screenshots'}>
      {project.screenshots.map((item, index) => <button className="project-gallery-thumbnail" type="button" key={item.file} aria-label={'View ' + project.name + ' screenshot ' + (index + 1)} aria-pressed={selected === index} onClick={() => setSelected(index)}>
        <img src={'/os/projects/' + item.file} alt="" loading="lazy" /><span>{index + 1}</span>
      </button>)}
    </div>}
    <small>Click the picture to view it full size.</small>
  </figure>;
};

const SoftwareProjects: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    const target = document.getElementById(location.hash.slice(1));
    const container = target?.closest('.site-page-content') as HTMLElement | null;
    if (target && container) container.scrollTop += target.getBoundingClientRect().top - container.getBoundingClientRect().top - 16;
  }, [location.hash]);
  return <div className="site-page-content">
    <h1>Software</h1><h3>Selected Projects</h3><br />
    <p>Web applications, Android apps, games, and AI systems. Explore real screenshots, try the available demos, or download my Android apps.</p><br />
    <ResumeDownload />
    {projects.map(project => <section className="text-block portfolio-project" id={project.id} key={project.id} aria-labelledby={project.id + '-title'}>
      <h2 id={project.id + '-title'}>{project.name}</h2><h4>{project.subtitle}</h4><p className="project-category">{project.category}</p><br />
      <p>{project.description}</p><br /><ScreenshotGallery project={project} />
      <h3>Features</h3><br /><ul>{project.features.map(feature => <li key={feature}><p>{feature}</p></li>)}</ul>
      <p><b>Built with:</b> {project.tags}</p><br />
      <ul className="project-links">
        {project.live && <li><a href={project.live} target="_blank" rel="noreferrer">[Live Website] — {project.name}</a></li>}
        {project.repo && <li><a href={project.repo} target="_blank" rel="noreferrer">[GitHub] — {project.privateRepo ? 'Private repository' : 'Source code'}</a></li>}
        {project.download && <li><a href={'/os/downloads/' + project.download.file} download={project.download.file} target="_self">[Android APK] — {project.download.label} ({project.download.size})</a></li>}
      </ul>
    </section>)}
  </div>;
};
export default SoftwareProjects;

