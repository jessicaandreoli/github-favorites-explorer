import { GithubUser } from "./githubUser.js"

//classe que vai conter a lógica dos dados
//como os dados serão estruturados
export class Favorites {
  //estou recebendo o #app aqui através da classe FavoritesView
  constructor(root) {
    //estou atribuindo o meu #app ao meu thhis.root
    this.root = document.querySelector(root)
    this.load()

    //estou usando a classe aqui, não usa new porque não tem constructor e sim static
    //estou passando o username que ela pede, porém isso é uma promessa
    //por isso preciso colocar o .then e retornar o que quero.
    //GithubUser.search('maykbrito').then(user => console.log(user))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    //pega o this.entries que é um array/objeto, transforma em texto Json e salva
    //no localStorage
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    //try significa tente
    try {
    //o find se ele encontra retorna verdadeiro
    const userExists = this.entries.find(entry => entry.login === username)

    if(userExists) {
      throw new Error ('Usuário já cadastrado')
    }
      const user = await GithubUser.search(username)
      //procurou o usuário e o user.login é undefined, capture o erro 
      //em seguida ele procura o catch para depositar esse erro
      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }
      //adicionar um novo usuário, utilizando o user que tenho na const
      //os 3 pontinhos significa espalhando entre as entradas que já tinha
      //nesse user coloca o usuário que estou puxando do github e todos os outros
      //se espalham abaixo. Isso td é p respeitar o princípio da imutabilidade
      this.entries = [ user, ...this.entries]
      this.update()
      this.save()

      //capture o erro
    } catch(error) {
      alert(error.message)
    }
  }


  delete(user) {
    //higher-order functions(função de alta ordem) - filter, map, find, reduce
    //me dá todos os usuários que tenho dentro do array this.entries, exceto a que
    //eu passar no filter
    const filteredEntries = this.entries
    //quando ele retorna falso, elimina do array, se retornar true coloca no array
    //return false
    .filter(entry => entry.login !== user.login)
    
    //está colocando no this.entries um novo array através do filteredEntries. O array
    //antigo de lá de cima some, e é colocado esse no lugar com os novos dados
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

//classe que vai criar a visualização e eventos do html
export class FavoritesView extends Favorites {
  //estou recebendo o #app aqui nesse constructor
  constructor(root) {
    //passando o #app para o super que se comunica com a classe de cima
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    //forEach significa que para cada um vai executar essa função
    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      //o user que está recebendo é o do forEach daqui
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(isOk) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })
  }

  createRow() {
    //estou criando o meu tr via js
    const tr = document.createElement('tr')

    //Estou passando o conteúdo que quero
    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/maykbrito.png" alt="imagem de Mayk Brito">
      <a href="https://github.com/maykbrito" target="_blank">
        <p>Maik Brito</p>
        <span>maikbrito</span>
      </a>
    </td>
    <td class="repositories">
      76
    </td>
    <td class="followers">
      9589
    </td>
    <td>
      <button class="remove" >&times;</button>
    </td>
    `
    //estou colocando o conteúdo no meu tr que está no innerHTML
    //tr.innerHTML = content

    //estou retornando pq vou usar toda essa estrutura depois
    return tr
  }


  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      });
  }
}