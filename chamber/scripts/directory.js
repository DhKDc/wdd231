document.addEventListener('DOMContentLoaded', () => {
    const membersContainer = document.querySelector('.members-container');
    if (!membersContainer) {
        return;
    }

    const gridViewButton = document.getElementById('gridViewButton');
    const listViewButton = document.getElementById('listViewButton');
    const membersDataURL = 'data/members.json';


    const displayMembers = (members, viewType = 'grid') => {
        membersContainer.innerHTML = '';
        membersContainer.className = viewType === 'grid' ? 'grid-view' : 'list-view'; // Set class for styling

        members.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('member-card');

            let cardContent = '';
            const imagePath = `images/${member.imageFileName}`;

            if (viewType === 'grid') {
                cardContent = `
                    <img src="${imagePath}" alt="Logo of ${member.name}" loading="lazy">
                    <h4>${member.name}</h4>
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <p><a href="${member.websiteURL}" target="_blank">${member.websiteURL.replace(/^https?:\/\//, '')}</a></p>
                    <p class="membership-level-${member.membershipLevel}">${member.description || ''}</p>
                `;
            } else {
                cardContent = `
                    <img src="${imagePath}" alt="Logo of ${member.name}" loading="lazy">
                    <div>
                        <h4>${member.name}</h4>
                        <p>${member.address}</p>
                        <p>Phone: ${member.phone}</p>
                        <p>Website: <a href="${member.websiteURL}" target="_blank">${member.websiteURL.replace(/^https?:\/\//, '')}</a></p>
                        <p class="membership-level-${member.membershipLevel}">${member.description || ''}</p>
                    </div>
                `;
            }
            card.innerHTML = cardContent;
            membersContainer.appendChild(card);
        });
    };

    async function getMemberData() {
        try {
            const response = await fetch(membersDataURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            window.allMembersData = data;
            displayMembers(data);

            if (gridViewButton && listViewButton) {
                gridViewButton.addEventListener('click', () => {
                    displayMembers(window.allMembersData, 'grid');
                    gridViewButton.classList.add('active');
                    listViewButton.classList.remove('active');
                });

                listViewButton.addEventListener('click', () => {
                    displayMembers(window.allMembersData, 'list');
                    listViewButton.classList.add('active');
                    gridViewButton.classList.remove('active');
                });
            }

        } catch (error) {
            console.error('Error fetching member data:', error);
            if (membersContainer) {
                membersContainer.innerHTML = '<p>Error loading member data. Please try again later.</p>';
            }
        }
    }

    getMemberData();

});