const vm = new Vue({
  el: "#app",

  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    mensagemAlerta: "Item adcionado",
    alertaAtivo: false,
    carrinhoAtivo: false
  },

  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })
    }
  },

  computed: {
    carrinhoTotal() {
      let total = 0;
      if(this.carrinho.length){
        this.carrinho.forEach(item => {
          total+=item.preco;
        })
      }
      return total;
    }
  },

  methods: {
    alerta(mensgem){
      this.mensagemAlerta = mensgem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1500)
    },

    fetchProdutos() {
      fetch("./api/produtos.json")
        .then(r => r.json())
        .then(r => {
          this.produtos = r;
        })
    },

    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then(r => r.json())
        .then(r => {
          this.produto = r;
        })
    },

    fecharModal({ target, currentTarget }) {
      if (target === currentTarget)
        this.produto = false;
    },

    clickForaCarrinho({ target, currentTarget }) {
      if (target === currentTarget)
        this.carrinhoAtivo = false;
    },

    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },

    adcionarItem() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
      this.alerta(`${nome} foi adicionado ao carrinho`);
    },

    removerItem(index) {
      this.carrinho.splice(index, 1);
    },

    checkLocalStorage(){
      if(window.localStorage.carrinho)
        this.carrinho = JSON.parse(window.localStorage.carrinho)
    },

    router(){
      const hash = document.location.hash;
      console.log('heeey')
      if(hash){
        this.fetchProduto(hash.replace("#", ""));
      }
    }
  },

  watch: {
    produto(){
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || "";
      history.pushState(null, null, '#' + hash)
    },

    carrinho(){
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    }
  },

  created() {
    this.fetchProdutos();
    this.router();
    this.checkLocalStorage();
  }
})