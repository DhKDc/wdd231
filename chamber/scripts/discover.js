document.addEventListener('DOMContentLoaded', async () => {
    // --- Logic for Interest Cards ---
    const interestCardsContainer = document.getElementById('interest-cards-container');
    const interestDataURL = 'data/interest.json';

    const interestImageMap = {
        "Plaza de Los Héroes": "plazaheroes.webp",
        "Estadio El Teniente": "estadioelteniente.webp",
        "Parque Safari Chile": "parquesafari.webp",
        "Regional Museum of Rancagua": "museoregional.webp",
        "Medialuna de Rancagua": "medialuna.webp",
        "Iglesia de la Merced": "iglesiamerced.webp",
        "Sewell Mining Town (UNESCO World Heritage Site)": "sewell.webp",
        "Cachapoal Valley Wine Route": "cachapoalvalley.webp"
    };

    try {
        const response = await fetch(interestDataURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const interests = await response.json();

        interests.forEach(interest => {
            const card = document.createElement('div');
            card.classList.add('interest-card');

            const imageFileName = interestImageMap[interest.name];
            const imagePath = imageFileName ? `images/${imageFileName}` : '';
            const altText = `Image of ${interest.name}`;

            card.innerHTML = `
                <h2 class="interest-title">${interest.name}</h2>
                <figure class="interest-figure">
                    <img src="${imagePath}" alt="${altText}" loading="lazy">
                </figure>
                <address class="interest-address">${interest.address}</address>
                <p class="interest-description">${interest.description}</p>
                <button class="button button-secondary learn-more-button">Learn More</button>
            `;
            interestCardsContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching or displaying interest data:', error);
        if (interestCardsContainer) {
            interestCardsContainer.innerHTML = '<p>Error loading points of interest data. Please try again later.</p>';
        }
    }

    // --- Logic for Last Visit Message ---
    const visitMessageElement = document.getElementById('visit-message-banner');
    if (!visitMessageElement) return;

    const lastVisit = localStorage.getItem('lastVisitTimestamp');
    const now = Date.now();
    let message = "";

    if (lastVisit === null) {
        // First visit
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitTime = parseInt(lastVisit, 10);
        const timeDifference = now - lastVisitTime; // Difference in milliseconds

        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

        if (timeDifference < oneDay) {
            // Less than a day
            message = "Back so soon! Awesome!";
        } else {
            // More than a day
            // Calculate days and round to nearest whole number
            const daysAgo = Math.round(timeDifference / oneDay);
            if (daysAgo === 1) {
                message = "You last visited 1 day ago.";
            } else {
                message = `You last visited ${daysAgo} days ago.`;
            }
        }
    }

    visitMessageElement.textContent = message;
    // Store current visit timestamp for the next visit
    localStorage.setItem('lastVisitTimestamp', now.toString());
});