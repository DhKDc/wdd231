/**
 * main.js
 *
 * This script contains functionality that is intended to be used across all pages
 * of the Bookmarked website. This includes mobile navigation, theme switching, and global button handlers.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation (Hamburger Menu) ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.querySelector('header nav');

    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            const isVisible = navMenu.style.display === 'flex';
            navMenu.style.display = isVisible ? 'none' : 'flex';
        });
    }

    // --- Active Page Link Highlighting ---
    const navLinks = navMenu.querySelectorAll('a');
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- "Learn More" Button Smooth Scroll ---
    const learnMoreButton = document.getElementById('learn-more-btn');
    const firstSection = document.querySelector('.reading-container');
    if (learnMoreButton && firstSection) {
        learnMoreButton.addEventListener('click', () => {
            firstSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Dark/Light Theme Switcher ---
    const themeSwitcher = document.getElementById('theme-switcher');
    
    // Function to set the theme
    const setTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Default to light theme if no preference is saved
        setTheme('light');
    }

    // Add event listener to the switcher button
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
});