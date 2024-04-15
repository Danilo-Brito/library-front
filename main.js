/**
 * Executa a requisição dos livros cadastrados no banco e retorma como lista.
 */

const getList = async () => {
    let url = 'http://127.0.0.1:5000/livros';
    fetch(url, {
        method: 'get'
    })
        .then((response) => response.json())
        .then((data) => {
            data.books.forEach(item => insertList(item.id, item.name, item.category, item.author))
            console.log('Response', data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Função o para trazer carregamento inicial dos dados.
getList()

/**
 * Requisição POST para adicionar um livro novo na lista.
 * @param {String} name Nome do livro.
 * @param {String} category Categoria do livro.
 * @param {String} author Autor do livro.
 */
const postItem = async (name, category, author) => {

    // Cria um FormData() para pegar os dados via parâmetros e
    // adicionar os valores para enviar ao servidor.
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('author', author);

    // Cria uma requisição POST para o servidor.
    let url = 'http://127.0.0.1:5000/criar';
    fetch(url, {
        method: "post",
        body: formData
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}

/**
 * Função para criar um novo livro na lista via submit do botão Adicionar do formulário.
 */
const newItem = () => {

    // Pega os valores inseridos nos campos do formulário
    let idInput = document.getElementById("id").value;
    let nameInput = document.getElementById("name").value;
    let categoryInput = document.getElementById("category").value;
    let authorInput = document.getElementById("author").value;

    // Condição para verificar se o nome do livro foi inserido ou se já é um livro existente,
    // caso contrário envia os valores para a função que vai fazer a requisição.
    if (nameInput === '') {
        alert("Escreve o nome do livro!");
    } else if (categoryInput === '' || authorInput === '') {
        alert("Categoria e nome do author estão vazios!")
    } else {

        // Chama a função para inserir os campos na lista.
        insertList(idInput, nameInput, categoryInput, authorInput)

        // Chama a função para adicionar os campos na lista.
        postItem(idInput, nameInput, categoryInput, authorInput)
        alert("Item adicionado!")
    }
}


/**
 * 
 * Função para inserir os campos.
 * 
 * @param {String} idInput id do livro
 * @param {String} nameInput  nome do livro
 * @param {String} categoryInput categoria do livro
 * @param {String} authorInput autor do livro
 */
const insertList = (idInput, nameInput, categoryInput, authorInput) => {

    // Cria uma variável com os dados recebidos via parâmetro.
    var item = [idInput, nameInput, categoryInput, authorInput]

    // Pega o id da tabela.
    var table = document.getElementById('book-table');

    // Cria um insertRow para inserir os dados na tabela.
    var row = table.insertRow();

    // Executa um FOR para adicionar os novos valores ao Row a partir da posição
    // e insere essa posição na row.
    for (var i = 0; i < item.length; i++) {
        var cel = row.insertCell(i);

        // Adiciona os items a linha.
        cel.textContent = item[i];
    }
    // Cria um botão para edição para cada linha.
    insertButtonEdit(row.insertCell(-1))

    // Cria um botão para deletar para cada linha.
    insertButtonDelete(row.insertCell(-1))

    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("author").value = "";

    // Chama as funções para editar e deletar.
    editElement()
    removeElement()
}

/**
 * 
 * Função para criar um botão de Edição.
 * Cria uma TAG de <i> e define o nome da classe e adiciona um icone.
 */
const insertButtonEdit = (parent) => {
    let iconElementEdit = document.createElement('i');
    iconElementEdit.className = "btn-edit-book"
    iconElementEdit.classList.add('fa-solid', 'fa-pen');
    parent.appendChild(iconElementEdit);
}

/**
 * 
 * Função para criar um botão de Deletar.
 * Cria uma TAG de <i> e define o nome da classe e adiciona um icone.
 */
const insertButtonDelete = (parent) => {
    let iconElementDelete = document.createElement('i');
    iconElementDelete.className = "btn-delete-book"
    iconElementDelete.classList.add('fa-solid', 'fa-trash');
    parent.appendChild(iconElementDelete);
}

/**
 * Cria um onclick para o id do botão de deletar e aplica uma função 
 * para chamar a requisição de delete.
 */
const removeElement = () => {
    let deleteBtn = document.getElementsByClassName("btn-delete-book");
    let i;

    // Executa um for para pegar a posição do item clicado na tabela.
    for (i = 0; i < deleteBtn.length; i++) {

        // Cria uma função no clique do delete.
        deleteBtn[i].onclick = function () {
            let div = this.parentElement.parentElement;

            // Pega o nome do item da linha clicada.
            const nomeItem = div.getElementsByTagName('td')[1].innerHTML

            // Condição para exibir um alerta para confirmar a deleção do item.
            if (confirm("Você tem certeza?")) {
                div.remove()

                // Chama função para deletar item.
                deleteItem(nomeItem)
                alert("Removido!")
            }
        }
    }
}

/**
 * Cria uma requisição de delete para deletar o item do banco de dados.
 * 
 * @param {String} item nome do livro
 */
const deleteItem = (item) => {
    console.log(item)
    let url = 'http://127.0.0.1:5000/deletar?nome=' + item;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}

/**
 * Função para pegar o click do icone de edição e trazer os dados da linha
 * que vai ser alterado.
 */
const editElement = () => {
    let editBtn = document.getElementsByClassName("btn-edit-book");
    let editForm = document.getElementById("edit-form-container");

    let i;
    for (i = 0; i < editBtn.length; i++) {

        // Criar uma função de clique para o botão de edição.
        editBtn[i].onclick = function () {

            // Adiciona a tag active para executar a exibição do formulário de edição.
            editForm.classList.toggle("active")
            let div = this.parentElement.parentElement;

            // Pega o valor do ID da linha clicada.
            const idItem = div.getElementsByTagName('td')[0].innerHTML

            // Chama a função de editar item.
            setClickEdit(idItem)
        }
    }
}

/**
 * 
 * Função para adicionar um evento de listener ao botão de "Salvar" do
 * formulário de edição e exibe um alerta de livro atualizado.
 * 
 * @param {Int} id id do livro.
 */
const setClickEdit = (id) => {
    let saveChange = document.getElementById("form-container-button")
    saveChange.addEventListener('click', function () {

        // Função para criar requisição de edição.
        changeItemRequest(id)
        alert("Livro atualizado!")
    });
}

/**
 * Cria uma requisição POST para enviar os novos dados para editar o livro no servidor.
 * 
 * @param {Int} id id do livro.
 */
const changeItemRequest = async (id) => {
    console.log(id)

    // Pega os valores inseridos no formulário de edição
    // e mantém o ID do livro selecionado.
    let idInput = document.getElementById("edit-id").value = id;
    let nameInput = document.getElementById("edit-name").value;
    let categoryInput = document.getElementById("edit-category").value;
    let authorInput = document.getElementById("edit-author").value;
    console.log("Foi", idInput, nameInput, categoryInput, authorInput)

    // Cria um novo FormData() com os novos dados.
    const newformData = new FormData();
    newformData.append('id', idInput);
    newformData.append('name', nameInput);
    newformData.append('category', categoryInput);
    newformData.append('author', authorInput);

    let url = 'http://127.0.0.1:5000/atualizar';
    fetch(url, {
        method: "post",
        body: newformData
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}

/**
 * Cria as animações do formulário de adicionar.
 * 
 * formInputs: Campos do formulário.
 * 
 * libraryIcon: Icone "+" que fica no canto da página
 *              serve para abrir o formulário de adicionar item.
 * 
 * formContainer: Container do formulário.
 */
const formInputs = document.querySelectorAll(".floating-library-form .form-container .form-input");

const libraryIcon = document.querySelector(".floating-library-form .library-icon");

const formContainer = document.querySelector(".floating-library-form .form-container");

/**
 * Executa a animação de exibir/ocultar o formulário definida no styles.css
 */
libraryIcon.addEventListener("click", () => {

    // Adiciona a palavra active ao nome da classe do formContainer.
    formContainer.classList.toggle("active");
});

/**
 * Executa a animação de nas labels do formúlario quando clicado.
 */
formInputs.forEach(i => {
    i.addEventListener("focus", () => {
        // Adiciona a palavra active ao nome da classe
        // apartir do campo selecionado no formulário.
        i.previousElementSibling.classList.add("active");
    });
});

formInputs.forEach(i => {
    i.addEventListener("blur", () => {
        if (i.value == "") {
            // Remove a palavra active ao nome da classe
            // apartir do campo selecionado no formulário.
            i.previousElementSibling.classList.remove("active");
        }
    });
});
