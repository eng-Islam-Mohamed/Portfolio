import { useEffect, useState } from 'react';
import './App.css';
import Desktop from './components/os/Desktop';
import MobileShowcase from './components/showcase/MobileShowcase';

function App() {
    const query = new URLSearchParams(window.location.search);
    const queryRequestsMobile = query.get('mobile') === '1';
    const isEmbeddedDesktop = query.get('embedded') === '1';

    if (queryRequestsMobile) {
        sessionStorage.setItem('portfolio-mobile-mode', '1');
    }

    const [isMobilePortfolio, setIsMobilePortfolio] = useState(
        queryRequestsMobile ||
            sessionStorage.getItem('portfolio-mobile-mode') === '1' ||
            window.innerWidth <= 768
    );

    useEffect(() => {
        const onResize = () => {
            if (sessionStorage.getItem('portfolio-mobile-mode') !== '1') {
                setIsMobilePortfolio(window.innerWidth <= 768);
            }
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <div className="App">
            {isEmbeddedDesktop ? (
                <Desktop />
            ) : isMobilePortfolio ? (
                <MobileShowcase />
            ) : (
                <Desktop />
            )}
        </div>
    );
}

export default App;
