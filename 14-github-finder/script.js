const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const profileContainer = document.getElementById('profile-container');
const errorContainer = document.getElementById('error-container');
const avatar = document.getElementById('avatar');
const nameElement = document.getElementById('name');
const usernameElement = document.getElementById('username');
const bioElement = document.getElementById('bio');
const locationElement = document.getElementById('location');
const joinedDateElement = document.getElementById('joined-date');
const profileLink = document.getElementById('profile-link');
const followersElement = document.getElementById('followers');
const followingElement = document.getElementById('following');
const reposElement = document.getElementById('repos');
const companyElement = document.getElementById('company');
const blogElement = document.getElementById('blog');
const twitterElement = document.getElementById('twitter');
const companyContainer = document.getElementById('company-container');
const blogContainer = document.getElementById('blog-container');
const twitterContainer = document.getElementById('twitter-container');
const reposContainer = document.getElementById('repos-container');

searchBtn.addEventListener('click', searchUser);
searchInput.addEventListener('keypress', e => {
    if(e.key === "Enter") searchUser();
});

async function searchUser() {
    const username = searchInput.value.trim();

    if(!username) return alert('Please enter a username');

    try{
        profileContainer.classList.add('hidden');
        errorContainer.classList.add('hidden');

        const response = await fetch(`https://api.github.com/users/${username}`);
        if(!response.ok) throw new Error('User not found');

        const userData = await response.json();
        console.log("user data is here", userData);

        displayUserData(userData);
        fetchRepositories(userData.repos_url);

    }catch(error){
        console.log(error);
        showError()
    }
}

async function fetchRepositories(reposUrl){
    reposContainer.innerHTML = '<div class="loading-repos">Loading repositories...</div>';

    try{
        const response = await fetch(reposUrl + '?per_page=6');
        const repos = await response.json();
        displayRepos(repos);
    }catch(error){
        reposContainer.innerHTML = `<div class="no-repos">${error.message}</div>`
    }
}

function displayRepos(repos){
    if(repos.length === 0){
        reposContainer.innerHTML = '<div class="no-repos">No repositories found</div>';
        return;
    }

    reposContainer.innerHTML = '';

    repos.forEach((repo) => {
        const repoCard = document.createElement('div');
        repoCard.className = "repo-card";

        const uodateAt = formatDate(repo.updated_at);

        repoCard.innerHTML = `
            <a  href="${repo.html_url}" target="_blank" class="repo-name">
                <i class="fas fa-code-branch"></i> ${repo.name}
            </a>

            <p class="repo-description">${repo.description || "No description"}</p>

            <div class="repo-meta">
                ${repo.language ? `<div class="repo-meta-item">
                    <i class="fas fa-circle"></i> ${repo.language}
                </div>` : ''}

                <div class="repo-meta-item">
                    <i class="fas fa-star"></i> ${repo.stargazers_count}
                </div>

                <div class="repo-meta-item">
                    <i class="fas fa-code-branch"></i> ${repo.forks_count}
                </div>

                <div class="repo-meta-item">
                    <i class="fas fa-calendar"></i> ${uodateAt}
                </div>
            </div>
        `;

        reposContainer.appendChild(repoCard);
    })
}


function displayUserData(user){
    avatar.src = user.avatar_url;
    nameElement.textContent = user.name || user.login;
    usernameElement.textContent = `@${user.login}`;
    bioElement.textContent = user.bio || "This user has no bio";

    locationElement.textContent = user.location || "Not Specified";
    joinedDateElement.textContent = formatDate(user.created_at);

    profileLink.href = user.html_url;
    followersElement.textContent = user.followers;
    followingElement.textContent = user.following;
    reposElement.textContent = user.public_repos;

    if(user.company) companyElement.textContent = user.company;
    else companyElement.textContent = "Not specified";

    if(user.blog){
        blogElement.textContent = user.blog;
        blogContainer.href = user.blog.startsWith("http")?user.blog:`https://${user.blog}`;
    }else{
        blogElement.textContent = "No website";
        blogElement.href = "#";
    }

    blogContainer.style.display = 'flex';

    if(user.twitter_username){
        twitterElement.textContent = `@${user.twitter_username}`;
        twitterElement.href = `https://twitter.com/${user.twitter_username}`;
    }else{
        twitterElement.textContent = "No Twitter";
        twitterElement.href = "#";
    }

    twitterContainer.style.display = 'flex';

    profileContainer.classList.remove('hidden');
}

function showError(){
    errorContainer.classList.remove('hidden');
    profileContainer.classList.add('hidden');
}

function formatDate(dateString){
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

searchInput.value = "burakorkmez";
searchUser();