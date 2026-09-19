const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const inner = path.join(root,'inner-site');
const edit = (file, fn) => {const target=path.join(inner,file);fs.writeFileSync(target,fn(fs.readFileSync(target,'utf8')));};
edit('package.json',text=>{const pkg=JSON.parse(text);pkg.dependencies['@types/node']='^22.12.0';pkg.dependencies.typescript='^5.9.0';return JSON.stringify(pkg,null,2)+'\n';});
edit('src/components/showcase/Home.tsx',text=>text.replaceAll('Henry Heffernan','Mohamed Islam').replace('<h2>Software Engineer</h2>','<h2>Software Engineer · ESI</h2>'));
edit('src/components/showcase/VerticalNavbar.tsx',text=>text.replace('>Henry</h1>','>Mohamed</h1>').replace('>Heffernan</h1>','>Islam</h1>').replace("Showcase '22","Showcase '26").replace(/\s*<Link\s+containerStyle=\{styles.insetLink\}\s+to="projects\/(music|art)"[^]*?\/>/g,''));
edit('src/components/applications/ShowcaseExplorer.tsx',text=>text.replace('windowTitle="Henry Heffernan - Showcase 2022"','windowTitle="Mohamed Islam - Showcase 2026"').replace('© Copyright 2022 Henry Heffernan','© Copyright 2026 Mohamed Islam').replace('<Router>','<Router basename="/os">').replace(/^import (MusicProjects|ArtProjects)[^\n]*\n/gm,'').replace(/\s*<Route\s+path="\/projects\/music"[^]*?\/>/g,'').replace(/\s*<Route path="\/projects\/art"[^]*?\/>/g,''));
edit('src/components/showcase/ResumeDownload.tsx',text=>text.replace(/^import Resume from[^\n]*\n/m,'').replace('Looking for my resume?','Looking for my code?').replace('href={Resume}', 'href="https://github.com/eng-Islam-Mohamed"').replace('Click here to download it!','Explore my projects on GitHub!'));
edit('src/components/os/Toolbar.tsx',text=>text.replaceAll('HeffernanOS','IslamOS'));
edit('src/components/os/DesktopShortcut.tsx',text=>text.replace(/^\s*const requiredIcon = require[^\n]*\n/m,''));
edit('src/components/os/Desktop.tsx',text=>text.replace("name: 'Henordle'","name: 'Islamle'"));
edit('src/components/wordle/Wordle.tsx',text=>text.replaceAll("'HENRY'","'ISLAM'").replaceAll('HENRY','ISLAM'));
edit('src/components/applications/Henordle.tsx',text=>text.replaceAll('© Copyright 2022 Henry Heffernan','© Copyright 2026 Mohamed Islam').replaceAll('Henordle','Islamle'));
edit('src/components/dos/DosPlayer.tsx',text=>text.replace('dos.run(props.bundleUrl);',"dos.run(new URL('/os/' + props.bundleUrl, window.location.origin).href);"));
edit('src/components/applications/Credits.tsx',text=>text.replace("const CREDITS = [", "const CREDITS = [\n    { title: 'Portfolio & Selected Projects', rows: [['Mohamed Islam', 'WorldLens & ChronoLivre'], ['ESI', 'Software Engineering']] },").replace('<p>henryheffernan.com, 2022</p>','<p>Mohamed Islam · Original experience by Henry Heffernan</p>'));
edit('src/components/showcase/Contact.tsx',text=>{
  const start=text.indexOf('    async function submitForm()');
  const end=text.indexOf('    useEffect(() => {',start);
  text=text.slice(0,start)+`    function submitForm() {
        if (!isFormValid) return;
        const subject = encodeURIComponent('Portfolio enquiry from ' + name);
        const body = encodeURIComponent(message + '\\n\\nFrom: ' + name + '\\nEmail: ' + email + (company ? '\\nCompany: ' + company : ''));
        window.location.href = 'mailto:nm_benaboud@esi.dz?subject=' + subject + '&body=' + body;
        setFormMessage('Email draft opened. Send it from your email application.');
        setFormMessageColor(colors.blue);
    }

`+text.slice(end);
  text=text.replaceAll('henryheffernan@gmail.com','nm_benaboud@esi.dz').replaceAll('https://github.com/henryjeff','https://github.com/eng-Islam-Mohamed');
  text=text.replace(/\s*<SocialBox\s+icon=\{(inIcon|twitterIcon)\}[^]*?\/>/g,'');
  text=text.replace(/I am currently employed,[^]*?the form below!/,'Have an idea, a question, or a project to discuss? I would love to hear from you. Reach me at my ESI email, or use the form below to prepare an email draft.');
  text=text.replace('Send Message','Open Email Draft').replace(' All messages get forwarded straight to my personal email',' Opens a draft in your email application').replace('Need a copy of my Resume?','Explore more of my work?').replace('onMouseDown={submitForm}','onClick={submitForm}');
  return text;
});
const loadingPath=path.join(root,'src/Application/UI/components/LoadingScreen.tsx');
fs.writeFileSync(loadingPath,fs.readFileSync(loadingPath,'utf8').replace('MIBIOS (C)2000 Heffernan Islam Inc.,','MIBIOS (C)2026 Mohamed Islam Inc.,'));
