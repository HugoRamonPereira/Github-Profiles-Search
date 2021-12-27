const API_URL = 'http://api.github.com/users/'

const form = document.getElementById('form')
const search = document.getElementById('search')
const main = document.getElementById('main')

// getUser('higordiego')

async function getUser(username) {
  try {
    const { data } = await axios(API_URL + username)
    createUserCard(data)
    getRepos(username)
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard('No Profile With This Username')
    }  
  }
}

function createUserCard(user) {
  const cardHTML = `
    <div class="card">
      <div>
          <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${user.name}</h2>
        <p>${user.bio}</p>
        
        <div id="repos">
          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>
        </div>
      </div>
    </div>
  `
  main.innerHTML = cardHTML
}

function createErrorCard(msg) {
  const cardHTML = `
    <div class="card">
      <h1>${msg}</h1>
    </div>
  `
  main.innerHTML = cardHTML
}

async function getRepos(username) {
  try {
    const { data } = await axios(API_URL + username + '/repos?sort=created')
    addReposToCard(data)
  } catch (err) {
      createErrorCard('Sorry! We Could Not Get Your Repositories!')
  }
}

function addReposToCard(repos) {
  const reposEl = document.getElementById('repos')
  repos
    .slice(0, 10)
    .forEach(repo => {
      const repoEl = document.createElement('a')
      repoEl.classList.add('repo')
      repo.href = repo.html_url
      repoEl.target = '_blank'
      repoEl.innerText = repo.name
      reposEl.appendChild(repoEl)
    })
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const user = search.value

  if (user) {
    getUser(user)

    search.value = ''
  }
})