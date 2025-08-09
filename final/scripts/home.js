/**
 * home.js
 *
 * This script handles all the dynamic functionality for the home page (index.html).
 * It fetches book data from a local JSON file and the Open Library API to populate
 * the "Currently Reading" and "Bookshelf" sections.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Elements specific to the home page
    const currentlyReadingContainer = document.getElementById('currently-reading-book');
    const bookshelfGrid = document.getElementById('bookshelf-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const localDataUrl = 'data/bookinfo.json';
    const booksPerPage = 10; // 2 rows of 5 on desktop

    // Guard clause: If the required elements for this page aren't present, stop execution.
    if (!currentlyReadingContainer || !bookshelfGrid) {
        return; 
    }

    /**
     * Main function to orchestrate fetching local data first,
     * then using that data to fetch from the external Open Library API.
     */
    async function loadBookData() {
        try {
            const response = await fetch(localDataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const bookInfo = await response.json();

            if (bookInfo.currentlyReading) {
                await displayCurrentlyReading(bookInfo.currentlyReading);
            }
            if (bookInfo.bookshelf) {
                await displayBookshelf(bookInfo.bookshelf);
            }
        } catch (error) {
            console.error('Failed to load local book info:', error);
            currentlyReadingContainer.innerHTML = `<p>Could not load our book list. Please try again later.</p>`;
            bookshelfGrid.innerHTML = `<p>Could not load our bookshelf. Please try again later.</p>`;
        }
    }

    /**
     * Fetches and displays the single "Currently Reading" book.
     * @param {string} isbn - The ISBN of the book to display.
     */
    async function displayCurrentlyReading(isbn) {
        const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const bookData = data[`ISBN:${isbn}`];

            if (bookData) {
                const bookHTML = `
                    <img src="${bookData.cover ? bookData.cover.medium : 'https://placehold.co/200x300'}" alt="Cover of ${bookData.title}" loading="lazy">
                    <div class="book-info">
                        <h3>${bookData.title}</h3>
                        <h4>${bookData.authors ? bookData.authors.map(author => author.name).join(', ') : 'Unknown Author'}</h4>
                        <p>${bookData.excerpts ? bookData.excerpts[0].text : 'A captivating read for our members.'}</p>
                        <a href="${bookData.url}" target="_blank">Read more on Open Library</a>
                    </div>
                `;
                currentlyReadingContainer.innerHTML = bookHTML;
            } else {
                currentlyReadingContainer.innerHTML = `<p>Details for the current book (ISBN: ${isbn}) are not available in the Open Library database.</p>`;
            }
        } catch (error) {
            console.error('Error fetching currently reading book:', error);
            currentlyReadingContainer.innerHTML = `<p>Could not load book details. Please check the console for more information.</p>`;
        }
    }

    /**
     * Fetches and displays multiple books for the bookshelf grid.
     * @param {string[]} isbns - An array of ISBNs for the bookshelf.
     */
    async function displayBookshelf(isbns) {
        if (!isbns || isbns.length === 0) return;
        const bibkeys = isbns.map(isbn => `ISBN:${isbn}`).join(',');
        const url = `https://openlibrary.org/api/books?bibkeys=${bibkeys}&format=json&jscmd=data`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            bookshelfGrid.innerHTML = ''; // Clear placeholder content
            const bookKeys = Object.keys(data);

            bookKeys.forEach((key, index) => {
                const bookData = data[key];
                const bookItem = document.createElement('div');
                bookItem.className = 'book-item';
                if (index >= booksPerPage) {
                    bookItem.classList.add('hidden');
                }
                bookItem.innerHTML = `
                    <img src="${bookData.cover ? bookData.cover.medium : 'https://placehold.co/150x225/333/fff?text=No+Cover'}" alt="Cover of ${bookData.title}" loading="lazy">
                    <p class="book-title">${bookData.title}</p>
                `;
                bookItem.addEventListener('click', () => showBookModal(bookData));
                bookshelfGrid.appendChild(bookItem);
            });

            if (bookKeys.length > booksPerPage) {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.addEventListener('click', () => {
                    bookshelfGrid.querySelectorAll('.book-item.hidden').forEach(item => {
                        item.classList.remove('hidden');
                    });
                    loadMoreBtn.style.display = 'none';
                });
            }

        } catch (error) {
            console.error('Error fetching bookshelf:', error);
            bookshelfGrid.innerHTML = '<p>Could not load bookshelf.</p>';
        }
    }
    
    /**
     * Displays a modal with detailed information about a selected book.
     * @param {object} bookData - The book data object from the Open Library API.
     */
    function showBookModal(bookData) {
        const modal = document.getElementById('book-modal');
        const modalDetails = document.getElementById('modal-book-details');
        
        // More robustly find the best available cover image
        const coverUrl = (bookData.cover && bookData.cover.large) 
                       ? bookData.cover.large 
                       : (bookData.cover && bookData.cover.medium) 
                       ? bookData.cover.medium 
                       : 'https://placehold.co/300x450/333/fff?text=No+Cover';

        modalDetails.innerHTML = `
            <img src="${coverUrl}" alt="Cover of ${bookData.title}">
            <div class="modal-text">
                <h2>${bookData.title}</h2>
                <h4>By: ${bookData.authors ? bookData.authors.map(author => author.name).join(', ') : 'Unknown Author'}</h4>
                <p><strong>Published:</strong> ${bookData.publish_date || 'N/A'}</p>
                <p><strong>Pages:</strong> ${bookData.number_of_pages || 'N/A'}</p>
                <a href="${bookData.url}" target="_blank" class="button">View on Open Library</a>
            </div>
        `;
        
        modal.style.display = 'block';

        // Scope the close button query to the modal for robustness
        const closeBtn = modal.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
            }
        }
        
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // Initial call to start the data loading process for the home page
    loadBookData();
});