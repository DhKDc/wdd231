document.addEventListener('DOMContentLoaded', () => {
    // --- MANEJO DEL MENÚ HAMBURGUESA ---
    // ... (código existente del menú hamburguesa sin cambios) ...
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
    // ... (código existente de enlaces de navegación sin cambios) ...
    const navItems = document.querySelectorAll('#mainNav .nav-item');

    navItems.forEach(link => {
        link.addEventListener('click', function(event) {
            if (this.getAttribute('href') === '#') {
                event.preventDefault();
            }
            navItems.forEach(item => item.classList.remove('active-link'));
            this.classList.add('active-link');

            if (window.innerWidth < 768 && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                hamburgerButton.setAttribute('aria-expanded', 'false');
                menuIcon.style.display = 'block';
                closeIcon.style.display = 'none';
            }
        });
    });

    // --- LÓGICA PARA MOSTRAR Y FILTRAR CURSOS ---
    const coursesContainer = document.getElementById('coursesContainer');
    const filterButtons = document.querySelectorAll('#filterButtonsContainer .filter-btn');
    const totalCreditsElement = document.getElementById('totalCreditsValue'); // Referencia al span de créditos

    function displayCourses(filter = 'ALL') {
        if (!coursesContainer) return;
        coursesContainer.innerHTML = ''; // Limpiar contenedor de cursos

        const filteredCourses = courses.filter(course => {
            if (filter === 'ALL') return true;
            return course.subject === filter;
        });

        // Calcular el total de créditos para los cursos filtrados usando reduce
        const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);

        // Actualizar el elemento span con el total de créditos
        if (totalCreditsElement) {
            totalCreditsElement.textContent = totalCredits;
        }

        if (filteredCourses.length === 0) {
            coursesContainer.innerHTML = '<p class="no-courses-message">No hay cursos que mostrar para esta selección.</p>';
            // Nota: totalCredits ya se habrá establecido en 0 si filteredCourses está vacío.
            return;
        }

        filteredCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.classList.add('course-card');
            courseCard.classList.add(course.completed ? 'completed' : 'not-completed');
            
            const fullDescription = `${course.description}\n\nTecnologías: ${course.technology.join(', ')}`;
            courseCard.setAttribute('title', fullDescription);

            courseCard.innerHTML = `
                <h4>${course.subject} ${course.number}</h4>
                <p>${course.title}</p>
                <p class="course-credits">Créditos: ${course.credits}</p>
            `;
            coursesContainer.appendChild(courseCard);
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active-filter'));
                button.classList.add('active-filter');
                const filterValue = button.getAttribute('data-filter');
                displayCourses(filterValue);
            });
        });
    }
    
    // --- INICIALIZACIÓN ---
    const initialActiveFilterButton = document.querySelector('#filterButtonsContainer .filter-btn[data-filter="ALL"]');
    if (initialActiveFilterButton) {
        initialActiveFilterButton.classList.add('active-filter');
    }
    displayCourses('ALL'); // Mostrar todos los cursos y calcular créditos iniciales al cargar
});
