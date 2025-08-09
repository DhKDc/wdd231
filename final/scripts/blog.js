document.addEventListener('DOMContentLoaded', () => {
    // Page Elements
    const staffGrid = document.getElementById('staff-posts-grid');
    const reviewsGrid = document.getElementById('reviews-grid');
    const searchInput = document.getElementById('review-search-input');
    const suggestionsContainer = document.getElementById('search-suggestions');
    const modal = document.getElementById('staff-post-modal');
    const modalContent = document.getElementById('modal-post-content');
    const closeModalBtn = modal.querySelector('.close-button');
    const loadMorePostsBtn = document.getElementById('load-more-posts');
    const loadMoreReviewsBtn = document.getElementById('load-more-reviews');

    // Data Sources & Constants
    const staffPostsUrl = 'data/staff-posts.json';
    const memberReviewsUrl = 'data/reviews.json';
    const POSTS_INITIAL_LOAD = 2;
    const REVIEWS_INITIAL_LOAD = 4;
    
    // Global Data Stores
    let allStaffPosts = [];
    let allReviewsData = [];
    let allBooksData = {};

    if (!staffGrid || !reviewsGrid) return;

    /**
     * Shuffles an array in place using the Fisher-Yates algorithm.
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Main data loading function
     */
    async function loadAllBlogData() {
        try {
            const [staffResponse, reviewsResponse] = await Promise.all([
                fetch(staffPostsUrl),
                fetch(memberReviewsUrl)
            ]);
            if (!staffResponse.ok) throw new Error('Failed to fetch staff posts.');
            if (!reviewsResponse.ok) throw new Error('Failed to fetch member reviews.');

            let staffPosts = await staffResponse.json();
            let memberReviews = await reviewsResponse.json();
            
            shuffleArray(staffPosts);
            shuffleArray(memberReviews);
            
            allStaffPosts = staffPosts;
            allReviewsData = memberReviews;

            const allIsbns = [...new Set([...staffPosts.map(p => p.isbn), ...memberReviews.map(r => r.isbn)])];
            const bibkeys = allIsbns.map(isbn => `ISBN:${isbn}`).join(',');
            const openLibraryURL = `https://openlibrary.org/api/books?bibkeys=${bibkeys}&format=json&jscmd=data`;
            
            const booksResponse = await fetch(openLibraryURL);
            if (!booksResponse.ok) throw new Error('Failed to fetch book data.');
            
            allBooksData = await booksResponse.json();

            displayStaffPosts(allStaffPosts);
            displayReviews(allReviewsData);

        } catch (error) {
            console.error('Error loading blog content:', error);
            staffGrid.innerHTML = '<p>Could not load staff posts.</p>';
            reviewsGrid.innerHTML = '<p>Could not load member reviews.</p>';
        }
    }
    
    /**
     * Renders staff posts, respects the initial load limit.
     */
    function displayStaffPosts(posts) {
        staffGrid.innerHTML = '';
        posts.forEach((post, index) => {
            const bookData = allBooksData[`ISBN:${post.isbn}`];
            if (!bookData) return;

            const card = document.createElement('div');
            card.className = 'staff-post-card';
            if (index >= POSTS_INITIAL_LOAD) {
                card.classList.add('hidden');
            }
            
            card.dataset.postId = post.isbn + post.post_title;
            const coverUrl = bookData.cover ? bookData.cover.large : 'https://placehold.co/400x200/333/fff?text=No+Image';

            card.innerHTML = `
                <img src="${coverUrl}" alt="Image related to ${bookData.title}" loading="lazy">
                <div class="staff-post-content">
                    <h3>${post.post_title}</h3>
                    <p class="staff-post-meta">By ${post.author_name} on ${new Date(post.post_date).toLocaleDateString()}</p>
                    <p>${post.post_excerpt}</p>
                </div>
            `;
            card.addEventListener('click', () => showPostModal(post.isbn, post.post_title));
            staffGrid.appendChild(card);
        });

        if (posts.length > POSTS_INITIAL_LOAD) {
            loadMorePostsBtn.style.display = 'block';
        } else {
            loadMorePostsBtn.style.display = 'none';
        }
    }

    /**
     * Renders member review cards, respects limits unless filtering.
     */
    function displayReviews(reviews, isFiltering = false) {
        reviewsGrid.innerHTML = '';
        if (reviews.length === 0) {
            reviewsGrid.innerHTML = '<p>No reviews found.</p>';
            loadMoreReviewsBtn.style.display = 'none';
            return;
        }

        reviews.forEach((review, index) => {
            const bookData = allBooksData[`ISBN:${review.isbn}`];
            if (!bookData) return;

            const card = document.createElement('div');
            card.className = 'review-card';
            // Only apply the 'hidden' class if we are NOT filtering
            if (!isFiltering && index >= REVIEWS_INITIAL_LOAD) {
                card.classList.add('hidden');
            }

            const coverUrl = bookData.cover ? bookData.cover.medium : 'https://placehold.co/150x225/333/fff?text=No+Cover';
            const authorName = bookData.authors ? bookData.authors.map(a => a.name).join(', ') : 'Unknown Author';

            card.innerHTML = `
                <div class="review-book-info">
                    <img src="${coverUrl}" alt="Cover of ${bookData.title}" loading="lazy">
                    <h3>${bookData.title}</h3>
                    <p>by ${authorName}</p>
                </div>
                <div class="review-content">
                    <div class="star-rating">${generateStars(review.rating)}</div>
                    <blockquote class="review-text">${review.review_text}</blockquote>
                    <p class="reviewer-info">&mdash; ${review.reviewer_name} on ${new Date(review.review_date).toLocaleDateString()}</p>
                </div>
            `;
            reviewsGrid.appendChild(card);
        });

        // Hide 'Load More' button if we are filtering, or if there's nothing more to load
        if (isFiltering || reviews.length <= REVIEWS_INITIAL_LOAD) {
            loadMoreReviewsBtn.style.display = 'none';
        } else {
            loadMoreReviewsBtn.style.display = 'block';
        }
    }

    /**
     * MODAL: Finds post by its unique ID and shows it.
     */
    function showPostModal(isbn, title) {
        const post = allStaffPosts.find(p => p.isbn === isbn && p.post_title === title);
        if (!post) return;

        const bookData = allBooksData[`ISBN:${post.isbn}`];
        const coverUrl = bookData.cover ? bookData.cover.medium : 'https://placehold.co/200x300/333/fff?text=No+Cover';
        
        modalContent.innerHTML = `
            <div class="modal-post-layout">
                <img src="${coverUrl}" alt="Cover of ${bookData.title}" class="modal-book-cover">
                <div class="modal-post-text">
                    <h2>${post.post_title}</h2>
                    <p class="staff-post-meta">
                        <strong>Book:</strong> ${bookData.title}<br>
                        <strong>Author:</strong> ${post.author_name} | <strong>Published:</strong> ${new Date(post.post_date).toLocaleDateString()}
                    </p>
                    <p>${post.post_full_text.replace(/\n/g, '<br><br>')}</p>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    }

    /**
     * SEARCH: Handles the live search and suggestion dropdown
     */
    function handleSearchInput() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            suggestionsContainer.style.display = 'none';
            if (searchTerm.length === 0) {
                // When search is cleared, display the original limited list
                displayReviews(allReviewsData, false);
            }
            return;
        }

        const matchingReviews = allReviewsData.filter(review => {
            const bookData = allBooksData[`ISBN:${review.isbn}`];
            return bookData && bookData.title.toLowerCase().includes(searchTerm);
        });
        
        showSuggestions(matchingReviews);
    }

    /**
     * SEARCH: Shows the suggestions dropdown
     */
    function showSuggestions(reviews) {
        if (reviews.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        suggestionsContainer.innerHTML = '';
        const uniqueTitles = [...new Set(reviews.map(r => allBooksData[`ISBN:${r.isbn}`].title))];

        uniqueTitles.forEach(title => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = title;
            item.addEventListener('click', () => {
                searchInput.value = title;
                suggestionsContainer.style.display = 'none';
                filterReviewsByTitle(title);
_            });
            suggestionsContainer.appendChild(item);
        });
        suggestionsContainer.style.display = 'block';
    }

    /**
     * SEARCH: Filters the main grid based on a selected title
     */
    function filterReviewsByTitle(title) {
        const lowerCaseTitle = title.toLowerCase();
        const reviewsToDisplay = allReviewsData.filter(review => {
            const bookData = allBooksData[`ISBN:${review.isbn}`];
            return bookData && bookData.title.toLowerCase() === lowerCaseTitle;
        });
        // Display all results of the filter, and mark it as a filtering action
        displayReviews(reviewsToDisplay, true);
    }
    
    function generateStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += `<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>`;
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                starsHTML += `
                    <svg viewBox="0 0 20 20">
                        <path fill="currentColor" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0v15z"/>
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>`;
            } else {
                starsHTML += `<svg fill="none" stroke="currentColor" viewBox="0 0 20 20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>`;
            }
        }
        return starsHTML;
    }
    
    // --- Event Listeners ---
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
        if (!suggestionsContainer.contains(event.target) && event.target !== searchInput) {
            suggestionsContainer.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', handleSearchInput);

    loadMorePostsBtn.addEventListener('click', () => {
        staffGrid.querySelectorAll('.staff-post-card.hidden').forEach(card => card.classList.remove('hidden'));
        loadMorePostsBtn.style.display = 'none';
    });

    loadMoreReviewsBtn.addEventListener('click', () => {
        reviewsGrid.querySelectorAll('.review-card.hidden').forEach(card => card.classList.remove('hidden'));
        loadMoreReviewsBtn.style.display = 'none';
    });

    loadAllBlogData();
});