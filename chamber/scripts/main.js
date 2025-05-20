// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide Icons
    // Ensure Lucide is loaded before this script or handle potential errors
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        console.warn('Lucide icons library not found. Icons will not be rendered.');
    }

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isMenuOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');

            // Update ARIA attribute for accessibility
            mobileMenuButton.setAttribute('aria-expanded', String(!isMenuOpen));

            // Optional: Change button icon based on menu state
            // This requires specific SVG content or classes for icons
            if (!isMenuOpen) { // If menu was closed, now it's open
                mobileMenuButton.innerHTML = `
                    <svg class="icon-close" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" width="24" height="24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>`;
            } else { // If menu was open, now it's closed
                mobileMenuButton.innerHTML = `
                    <svg class="icon-menu" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" width="24" height="24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>`;
            }
            if (typeof lucide !== 'undefined') { // Re-create icons if they were part of the button
                 lucide.createIcons({
                    attrs: {'aria-hidden': 'true', width: 24, height: 24}, // Example attributes
                    nodes: [mobileMenuButton] // Only process icons within the button
                });
            }
        });
    } else {
        console.warn('Mobile menu button or menu element not found.');
    }

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    // Define SVG icons for dark mode toggle
    const sunIconSvg = `
        <svg class="icon-sun" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-12.66l-.707.707M4.04 19.96l-.707.707M21 12h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707"/>
        </svg>`;
    const moonIconSvg = `
        <svg class="icon-moon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>`;

    if (darkModeToggle) {
        // Check for saved dark mode preference from localStorage
        if (localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            htmlElement.classList.add('dark');
            darkModeToggle.innerHTML = sunIconSvg; // Show sun icon in dark mode
        } else {
            htmlElement.classList.remove('dark');
            darkModeToggle.innerHTML = moonIconSvg; // Show moon icon in light mode
        }

        darkModeToggle.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                darkModeToggle.innerHTML = moonIconSvg;
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                darkModeToggle.innerHTML = sunIconSvg;
            }
             if (typeof lucide !== 'undefined') { // Re-create icons if they were part of the button
                 lucide.createIcons({
                    attrs: {'aria-hidden': 'true', width: 24, height: 24},
                    nodes: [darkModeToggle]
                });
            }
        });
    } else {
        console.warn('Dark mode toggle button not found.');
    }


    // Footer: Current Year and Last Modified
    const currentYearSpan = document.getElementById('currentYear');
    const lastModifiedSpan = document.getElementById('lastModified');

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if (lastModifiedSpan) {
        // For 'Last Modification', in a real scenario, this would be server-generated or from build time.
        // document.lastModified refers to the HTML document itself.
        const lastModDate = new Date(document.lastModified);
        if (document.lastModified && lastModDate.getFullYear() > 1970) { // Check if a valid date is returned
             lastModifiedSpan.textContent = lastModDate.toLocaleDateString('en-US', {
                month: '2-digit', day: '2-digit', year: 'numeric'
            }) + ' ' + lastModDate.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        } else {
             // Fallback if document.lastModified is not useful (e.g. dynamically generated page)
            const now = new Date();
             lastModifiedSpan.textContent = now.toLocaleDateString('en-US', {
                month: '2-digit', day: '2-digit', year: 'numeric'
            }) + ' ' + now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }
    }
});
