document.addEventListener('DOMContentLoaded', () => {
    const submissionDataContainer = document.getElementById('submission-data');

    // Get the URL search parameters
    const params = new URLSearchParams(window.location.search);

    // Create a display-friendly list of the submitted data
    let html = '<ul>';
    for (const [key, value] of params.entries()) {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        html += `<li><strong>${label}:</strong> ${value}</li>`;
    }
    html += '</ul>';

    // Display the data on the page
    submissionDataContainer.innerHTML = html;
});