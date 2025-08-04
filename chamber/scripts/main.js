document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        console.warn('Lucide icons library not found. Icons will not be rendered.');
    }

    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenuButton.classList.toggle('active');
            const isMenuOpen = mobileMenu.classList.toggle('open');
            mobileMenuButton.setAttribute('aria-expanded', isMenuOpen);
        });
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    if (darkModeToggle) {
        const applyTheme = (isDark) => {
            if (isDark) {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        };

        if (localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            applyTheme(true);
        } else {
            applyTheme(false);
        }

        darkModeToggle.addEventListener('click', () => {
            const isCurrentlyDark = htmlElement.classList.contains('dark');
            applyTheme(!isCurrentlyDark);
        });
    }

    const currentYearSpan = document.getElementById('currentYear');
    const lastModifiedSpan = document.getElementById('lastModified');

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if (lastModifiedSpan) {
        const lastModDate = new Date(document.lastModified);
        if (document.lastModified && lastModDate.getFullYear() > 1970) {
            lastModifiedSpan.textContent = lastModDate.toLocaleDateString('en-US', {
                month: '2-digit', day: '2-digit', year: 'numeric'
            }) + ' ' + lastModDate.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        } else {
            const now = new Date();
            lastModifiedSpan.textContent = now.toLocaleDateString('en-US', {
                month: '2-digit', day: '2-digit', year: 'numeric'
            }) + ' ' + now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }
    }
});