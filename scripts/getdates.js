const currentYear = new Date().getFullYear();

const currentYearElement = document.getElementById("currentyear");

currentYearElement.textContent = currentYear;

const lastModified = document.lastModified;

const lastModifiedElement = document.getElementById("lastModified");

lastModifiedElement.textContent = "Last Modified: " + lastModified;