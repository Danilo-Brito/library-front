/*
    Requisição para buscar items do banco de dados
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

/*
    Carregamento inicial dos dados
*/
getList()

/*
    Requisição de post para adicionar um livro ao banco
*/
const postItem = async (name, category, author) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('author', author);

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

/*
    Função para adicionar um novo livro a lista.
*/
const newItem = () => {
    let idInput = document.getElementById("id").value;
    let nameInput = document.getElementById("name").value;
    let categoryInput = document.getElementById("category").value;
    let authorInput = document.getElementById("author").value;

    if (nameInput === '') {
        alert("Escreve o nome do livro!");
    } else if (categoryInput === '' || authorInput === '') {
        alert("Categoria e nome do author estão vazios!")
    } else {
        insertList(idInput, nameInput, categoryInput, authorInput)
        postItem(idInput, nameInput, categoryInput, authorInput)
        alert("Item adicionado!")
    }
}

/*
    Função para inserir items na lista apresentada
*/
const insertList = (idInput, nameInput, categoryInput, authorInput) => {
    var item = [idInput, nameInput, categoryInput, authorInput]
    var table = document.getElementById('book-table');
    var row = table.insertRow();

    for (var i = 0; i < item.length; i++) {
        var cel = row.insertCell(i);
        cel.textContent = item[i];
    }
    insertButtonEdit(row.insertCell(-1))
    insertButtonDelete(row.insertCell(-1))
    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("author").value = "";

    editElement()
    removeElement()
}

/*
    Criando botões de forma dinamica.
*/
const insertButtonEdit = (parent) => {
    let iconElementEdit = document.createElement('i');
    iconElementEdit.className = "btn-edit-book"
    iconElementEdit.classList.add('fa-solid', 'fa-pen');
    parent.appendChild(iconElementEdit);
}

const insertButtonDelete = (parent) => {
    let iconElementDelete = document.createElement('i');
    iconElementDelete.className = "btn-delete-book"
    iconElementDelete.classList.add('fa-solid', 'fa-trash');
    parent.appendChild(iconElementDelete);
}

/*
     Função para remover um item da lista
*/
const removeElement = () => {
    let deleteBtn = document.getElementsByClassName("btn-delete-book");
    let i;
    for (i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].onclick = function () {
            let div = this.parentElement.parentElement;
            const nomeItem = div.getElementsByTagName('td')[1].innerHTML
            if (confirm("Você tem certeza?")) {
                div.remove()
                deleteItem(nomeItem)
                alert("Removido!")
            }
        }
    }
}

/*
    Requisição para deletar um item do banco
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

/*
     Função Editar o item.
     
     Para pegar os dados da linha e passa para o metódo editItem()
*/

const editElement = () => {
    let editBtn = document.getElementsByClassName("btn-edit-book");
    let editForm = document.getElementById("edit-form-container");

    let i;
    for (i = 0; i < editBtn.length; i++) {
        editBtn[i].onclick = function () {
            editForm.classList.toggle("active")
            let div = this.parentElement.parentElement;
            const idItem = div.getElementsByTagName('td')[0].innerHTML
            setClickEdit(idItem)
        }
    }
}

const setClickEdit = (id) => {
    let saveChange = document.getElementById("form-container-button")
    saveChange.addEventListener('click', function() {
        changeItemRequest(id)
        alert("Livro atualizado!")
    });
}

const changeItemRequest = async (id) => {
    console.log(id)

    let idInput = document.getElementById("edit-id").value = id;
    let nameInput = document.getElementById("edit-name").value;
    let categoryInput = document.getElementById("edit-category").value;
    let authorInput = document.getElementById("edit-author").value;
    console.log("Foi", idInput, nameInput, categoryInput, authorInput)

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


/*
  Bloco para adicionar a palavra "active" nas classe do formulário para aplicar o efeito de transição
*/

const formInputs = document.querySelectorAll(".floating-library-form .form-container .form-input");

const libraryIcon = document.querySelector(".floating-library-form .library-icon");

const formContainer = document.querySelector(".floating-library-form .form-container");

libraryIcon.addEventListener("click", () => {
    formContainer.classList.toggle("active");
});

formInputs.forEach(i => {
    i.addEventListener("focus", () => {
        i.previousElementSibling.classList.add("active");
    });
});

formInputs.forEach(i => {
    i.addEventListener("blur", () => {
        if (i.value == "") {
            i.previousElementSibling.classList.remove("active");
        }
    });
});
