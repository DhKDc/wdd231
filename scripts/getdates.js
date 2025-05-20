document.addEventListener('DOMContentLoaded', function() {
    // Actualizar el año en el pie de página
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Actualizar la fecha de última modificación
    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) {
        const lastModDate = new Date(document.lastModified);
        const formattedLastModified = 
            ("0" + (lastModDate.getMonth() + 1)).slice(-2) + "/" +
            ("0" + lastModDate.getDate()).slice(-2) + "/" +
            lastModDate.getFullYear() + " " +
            ("0" + lastModDate.getHours()).slice(-2) + ":" +
            ("0" + lastModDate.getMinutes()).slice(-2) + ":" +
            ("0" + lastModDate.getSeconds()).slice(-2);
        lastModifiedSpan.textContent = formattedLastModified;
    }
});
