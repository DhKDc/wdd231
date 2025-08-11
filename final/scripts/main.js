document.addEventListener('DOMContentLoaded', () => {
    
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.querySelector('header nav');

    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            const isVisible = navMenu.style.display === 'flex';
            navMenu.style.display = isVisible ? 'none' : 'flex';
        });
    }

    const navLinks = navMenu.querySelectorAll('a');
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    const learnMoreButton = document.getElementById('learn-more-btn');
    const firstSection = document.querySelector('.reading-container');
    if (learnMoreButton && firstSection) {
        learnMoreButton.addEventListener('click', () => {
            firstSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const themeSwitcher = document.getElementById('theme-switcher');
    
    const setTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('light');
    }

    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
});