// scripts/course_logic.js
document.addEventListener('DOMContentLoaded', () => {
    const coursesContainer = document.getElementById('coursesContainer');
    const filterButtons = document.querySelectorAll('#filterButtonsContainer .filter-btn');
    const totalCreditsElement = document.getElementById('totalCreditsValue');

    function displayCourses(filter = 'ALL') {
        if (typeof courses === 'undefined') {
            console.error("Error: El array 'courses' no está definido. Asegúrate de que course_data.js se carga antes que course_logic.js.");
            if (coursesContainer) coursesContainer.innerHTML = '<p class="no-courses-message">Error al cargar los datos de los cursos.</p>';
            if (totalCreditsElement) totalCreditsElement.textContent = "Error";
            return;
        }

        if (!coursesContainer) {
            console.warn("Elemento coursesContainer no encontrado.");
            return;
        }
        coursesContainer.innerHTML = ''; 

        const filteredCourses = courses.filter(course => {
            if (filter === 'ALL') return true;
            return course.subject === filter;
        });

        const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);

        if (totalCreditsElement) {
            totalCreditsElement.textContent = totalCredits;
        }

        if (filteredCourses.length === 0) {
            coursesContainer.innerHTML = '<p class="no-courses-message">No hay cursos que mostrar para esta selección.</p>';
            return;
        }

        filteredCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.classList.add('course-card');
            courseCard.classList.add(course.completed ? 'completed' : 'not-completed');
            
            // Mantenemos el tooltip para información detallada al pasar el ratón
            const fullDescription = `${course.description}\n\nTecnologías: ${course.technology.join(', ')}\nCréditos: ${course.credits}`;
            courseCard.setAttribute('title', fullDescription);

            // Contenido de la tarjeta: Solo Asignatura y Número
            courseCard.innerHTML = `<h4>${course.subject} ${course.number}</h4>`;
            
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
    
    const initialActiveFilterButton = document.querySelector('#filterButtonsContainer .filter-btn[data-filter="ALL"]');
    if (initialActiveFilterButton) {
        initialActiveFilterButton.classList.add('active-filter');
    } else if (filterButtons.length > 0) {
        filterButtons[0].classList.add('active-filter');
    }

    displayCourses(initialActiveFilterButton ? 'ALL' : (filterButtons.length > 0 ? filterButtons[0].getAttribute('data-filter') : 'ALL'));
});
