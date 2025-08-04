document.addEventListener('DOMContentLoaded', () => {
    // Modal logic
    const modalLinks = document.querySelectorAll('.modal-link');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-button');

    modalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'block';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Timestamp logic for form submission
    const joinForm = document.querySelector('.join-form');
    if (joinForm) {
        const timestampField = document.getElementById('timestamp');
        if (timestampField) {
            joinForm.addEventListener('submit', () => {
                timestampField.value = new Date().toISOString();
            });
        }
    }
});