let allPosts = [];
let postsPerPage = 6;
let maxPage;
let currentPage;
let currentPosts;
let filteredPosts;

const posts = document.querySelector('.posts');
const button = document.querySelector('.button')

window.onload = async function() {
    const url_string = (window.location.href).toLowerCase();
    const url = new URL(url_string);
    const urlPage = url.searchParams.get("page");

    // Fetching from the API
    const resJson = await fetch('https://jsonplaceholder.typicode.com/posts');
	const res = await resJson.json();
    allPosts = res;

    maxPage = Math.ceil(allPosts.length / postsPerPage);

    // On load logic
    if (!isNaN(urlPage) && urlPage > maxPage) {
        currentPage = maxPage;
    } else if (!isNaN(urlPage) && urlPage >= '1') {
        currentPage = urlPage
    } else if (urlPage < 1 || isNaN(urlPage)) {
        currentPage = '1'
        window.history.pushState({}, document.title, window.location.pathname);
    }

    currentPosts = currentPage * postsPerPage;
    filteredPosts = allPosts.slice(0, currentPosts);

    // Hiding load more when there are no more posts
    if (parseInt(currentPage) === maxPage) {
        button.style.display = 'none';
    }

    displayPosts();
}

const displayPosts = () => {
    // Displaying posts to the DOM
    filteredPosts.map(p => posts.innerHTML +=
        `<div class="post">
            <span>${p.id}</span>
            <h3>${p.title}</h3>
            <p>${p.body}</p>
        </div>`
    );
}

const loadMore = () => {
    // Load More logic
    let updatedCurrentPosts = currentPage * postsPerPage + 6;
    nextPage = allPosts.slice(currentPosts, updatedCurrentPosts);

    currentPage = parseInt(currentPage) + 1;
    currentPosts = updatedCurrentPosts;

    // Updating URL query parameter page
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?page=${currentPage}`;
        window.history.pushState({path:newurl},'',newurl);
    }

    // Loading more posts to the DOM
    nextPage.map(p => posts.innerHTML +=
        `<div class="post">
            <span>${p.id}</span>
            <h3>${p.title}</h3>
            <p>${p.body}</p>
        </div>`
    );

    // Hiding load more when there are no more posts
    if (parseInt(currentPage) === maxPage) {
        button.style.display = 'none';
    }
}