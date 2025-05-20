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
            if (window.innerWidth < 768 && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                hamburgerButton.setAttribute('aria-expanded', 'false');
                menuIcon.style.display = 'block';
                closeIcon.style.display = 'none';
            }
        });
    });

    // --- DATOS DE CURSOS ---
    const courses = [
        {
            subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2,
            description: 'This course will introduce students to programming...', technology: ['Python'], completed: true
        },
        {
            subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2,
            description: 'This course introduces students to the World Wide Web...', technology: ['HTML', 'CSS'], completed: true
        },
        {
            subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2,
            description: 'CSE 111 students become more organized...', technology: ['Python'], completed: false
        },
        {
            subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2,
            description: 'This course will introduce the notion of classes...', technology: ['C#'], completed: false
        },
        {
            subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2,
            description: 'This course builds on prior experience in Web Fundamentals...', technology: ['HTML', 'CSS', 'JavaScript'], completed: true
        },
        {
            subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2,
            description: 'This course builds on prior experience with Dynamic Web...', technology: ['HTML', 'CSS', 'JavaScript'], completed: false
        }
    ]; // Descripciones acortadas para brevedad

    // --- LÓGICA PARA MOSTRAR Y FILTRAR CURSOS ---
    const coursesContainer = document.getElementById('coursesContainer');
    const filterButtons = document.querySelectorAll('#filterButtonsContainer .filter-btn');

    function displayCourses(filter = 'ALL') {
        if (!coursesContainer) return;
        coursesContainer.innerHTML = ''; // Limpiar contenedor

        const filteredCourses = courses.filter(course => {
            if (filter === 'ALL') return true;
            return course.subject === filter;
        });

        if (filteredCourses.length === 0) {
            coursesContainer.innerHTML = '<p class="no-courses-message">No hay cursos que mostrar para esta selección.</p>';
            return;
        }

        filteredCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.classList.add('course-card');
            courseCard.classList.add(course.completed ? 'completed' : 'not-completed');
            
            // Tooltip con descripción y tecnologías
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
    // Mostrar todos los cursos al cargar y marcar "All" como activo por defecto
    const initialActiveFilterButton = document.querySelector('#filterButtonsContainer .filter-btn[data-filter="ALL"]');
    if (initialActiveFilterButton) {
        initialActiveFilterButton.classList.add('active-filter');
    }
    displayCourses('ALL'); // Mostrar todos los cursos al cargar
});
