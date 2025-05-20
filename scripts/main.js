document.addEventListener('DOMContentLoaded', () => {
    // --- MANEJO DEL MENÚ HAMBURGUESA ---
    const hamburgerButton = document.getElementById('hamburgerButton');
    const mainNav = document.getElementById('mainNav');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');

    if (hamburgerButton && mainNav && menuIcon && closeIcon) {
        hamburgerButton.addEventListener('click', () => {
            const isExpanded = mainNav.classList.toggle('open');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
            menuIcon.style.display = isExpanded ? 'none' : 'block';
            closeIcon.style.display = isExpanded ? 'block' : 'none';
        });
    }

    // --- MANEJO DE ENLACES DE NAVEGACIÓN ACTIVOS Y CIERRE DE MENÚ ---
    const navItems = document.querySelectorAll('#mainNav .nav-item');

    navItems.forEach(link => {
        link.addEventListener('click', function(event) {
            if (this.getAttribute('href') === '#') {
                event.preventDefault(); // Prevenir salto si es un enlace #
            }

            // Quitar clase activa de todos los enlaces
            navItems.forEach(item => item.classList.remove('active-link'));
            // Añadir clase activa al enlace clickeado
            this.classList.add('active-link');

            // Si el menú móvil está abierto (visible y estamos en vista móvil), cerrarlo
            if (window.innerWidth < 768 && mainNav && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                if (hamburgerButton) hamburgerButton.setAttribute('aria-expanded', 'false');
                if (menuIcon) menuIcon.style.display = 'block';
                if (closeIcon) closeIcon.style.display = 'none';
            }
        });
    });

    // Marcar el enlace "Home" como activo inicialmente (si es necesario y no lo maneja el HTML directamente)
    // Esta lógica puede ser más compleja si los href no son solo "#"
    const homeLink = Array.from(navItems).find(link => link.textContent.trim().toLowerCase() === 'home' && link.getAttribute('href') === '#');
    if (homeLink && !document.querySelector('#mainNav .nav-item.active-link')) { // Solo si no hay ya uno activo
         homeLink.classList.add('active-link');
    }
});
