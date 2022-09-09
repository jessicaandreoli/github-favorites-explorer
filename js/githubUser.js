export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    //Aqui estou recebendo um objeto e desestruturando, pegando apenas o que quero
    return fetch(endpoint)
    .then(data => data.json())
    .then(({ login, name, public_repos, followers }) => ({
      login,
      name,
      public_repos,
      followers,
    }))
  }
}