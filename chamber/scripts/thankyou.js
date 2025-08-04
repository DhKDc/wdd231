document.addEventListener('DOMContentLoaded', () => {
    const summaryContainer = document.getElementById('submission-summary');
    if (summaryContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        let summaryHTML = '<dl class="submission-details">';

        const labels = {
            firstName: "First Name",
            lastName: "Last Name",
            title: "Title",
            email: "Email",
            mobile: "Mobile Phone",
            organization: "Organization",
            membershipLevel: "MembershipLevel",
            description: "Description",
            timestamp: "Submission Time"
        };

        for (const [key, value] of urlParams.entries()) {
            if (value) {
                const label = labels[key] || key;
                let displayValue = value;
                if (key === 'timestamp') {
                    displayValue = new Date(value).toLocaleString();
                }
                summaryHTML += `<dt>${label}</dt><dd>${displayValue}</dd>`;
            }
        }
        summaryHTML += '</dl>';
        summaryContainer.innerHTML = summaryHTML;
    }
});