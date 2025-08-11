document.addEventListener('DOMContentLoaded', () => {
    const submissionDataContainer = document.getElementById('submission-data');

    const params = new URLSearchParams(window.location.search);

    let html = '<ul>';
    for (const [key, value] of params.entries()) {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        html += `<li><strong>${label}:</strong> ${value}</li>`;
    }
    html += '</ul>';

    submissionDataContainer.innerHTML = html;
});