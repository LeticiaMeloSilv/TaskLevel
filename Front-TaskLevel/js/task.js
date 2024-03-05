'use strict'

const container = document.getElementById('atividades')

//Pega o id fornecido pelo login pra dps usar ele em confirmacoes
const idPerfil = localStorage.getItem('idusuario')
if (!idPerfil) {
    window.location.href = '../../index.html'
}
//pega todas as informacoes sobre os usuarios
async function pegarUsuariosBack() {
    const responseApi = await fetch('http://localhost:8080/usuario')
    const listUsuarios = await responseApi.json()
    return listUsuarios
}
//pega todas as informacoes das tarefas
async function pegarTarefasBack() {
    const responseApi = await fetch('http://localhost:8080/tarefas')
    const listTarefas = await responseApi.json()
    return listTarefas
}
async function pegarComentariosBack() {
    const responseApi = await fetch('http://localhost:8080/comentarios')
    const listComentarios = await responseApi.json()
    return listComentarios
}

pegarTarefasUsuario()
async function pegarTarefasUsuario() {
    const listaTarefas = await pegarTarefasBack()
    const listaTarefasUsuario = []
    listaTarefas.forEach(tarefa => {
        listaTarefasUsuario.push(tarefa)
    });
    return listaTarefasUsuario
}

const addTaskButton = document.getElementById('addTaskButton')
addTaskButton.addEventListener('click', abrirCampoCadastroTarefa)
async function abrirCampoCadastroTarefa() {
    const usuarios = await pegarUsuariosBack()
    usuarios.forEach(usuario => {
        if (usuario.premium == true && usuario.id == idPerfil) {
            campoCriacao.style.display = 'block'
        }
        else if (usuario.premium == false && usuario.id == idPerfil) {
            alert("Se torne em um usuario PREMIUM!!")
        }
    })

}
async function criarTarefa() {
    const titulo = document.getElementById('tituloCriarTarefa').value
    const descricao = document.getElementById('descricaoCriarTarefa').value
    const data = document.getElementById('dataCriarTarefa').value

    const novosDados = {
        titulo: titulo,
        descricao: descricao,
        dataConclusão: data,
        idUsuario: idPerfil
    }
    await fetch('http://localhost:8080/tarefas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novosDados)
    })
    console.log(novosDados)
}
function excluirListaTarefas() {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

async function posicionarCards() {
    const info = await pegarTarefasUsuario()
    info.forEach(tarefa => {
        criarCard(tarefa)
    });
}
async function criarCard(tarefa) {
    const card = document.createElement('div')
    card.classList.add('atividade')
    card.addEventListener('click', () => { exibir(tarefa.id) })


    const imagem = document.createElement('img')
    imagem.src = `../img/Rectangle 2.png`
    imagem.alt = 'imagem da tarefa'
    imagem.classList.add('img_atividade')

    const tituloData = document.createElement('div')
    tituloData.classList.add('titulo-data')

    const titulo = document.createElement('h3')
    titulo.textContent = tarefa.titulo
    titulo.classList.add('titulo')

    const data = document.createElement('h5')
    data.textContent = tarefa.dataConclusão
    data.classList.add('data')

    const conteudo = document.createElement('p')
    conteudo.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tem velit esse cillum dolore eu fugiat nulla pariatur.!"
    conteudo.classList.add('conteudo')

    const btn_editar = document.createElement('div')
    btn_editar.classList.add('btn_editar')

    const img = document.createElement('img')
    img.src = "../img/ferramenta-lapis.png"
    imagem.alt = 'editar atividade'

    const idTarefa = localStorage.getItem('idTask')

    const listaComentarios = await pegarComentariosBack()

    const comentarios = document.getElementById('comentarios')

    listaComentarios.forEach(comentario => {
        if (comentario.idTarefa == idTarefa) {

            const containerComentario = document.createElement('div')
            const descricao = document.createElement('p')

            containerComentario.classList.add('comentarios')

            descricao.textContent = `${comentario.conteudo}`
            containerComentario.appendChild(descricao)

            comentarios.appendChild(containerComentario)

        }
    });


    btn_editar.appendChild(img)

    tituloData.replaceChildren(titulo, data)

    card.replaceChildren(imagem, tituloData, conteudo, btn_editar)

    container.appendChild(card, comentarios);
}

const campoEdicao = document.getElementById("atividade_focus")
const campoCriacao = document.getElementById("campoCriacao")
async function exibir(id) {
    const titulo = document.getElementById('tituloEditarTarefa')
    const descricao = document.getElementById('descricaoEditarTarefa')
    const comentarios = document.getElementById('comentariosEditarTarefa')
    const listaTarefas = await pegarTarefasBack()
    const listaComentarios = await pegarComentariosBack()
    const infoTarefa = {}

    listaTarefas.forEach(tarefa => {
        if (tarefa.id == id) {
            infoTarefa.titulo = tarefa.titulo
            infoTarefa.descricao = tarefa.descricao
        }
        titulo.textContent = infoTarefa.titulo
        descricao.textContent = infoTarefa.descricao
    });
    let listaComentariosTarefa = []

    listaComentarios.forEach(comentario => {
        if (comentario.idTarefa == id) {
            listaComentariosTarefa.push(comentario.conteudo)
            infoTarefa.comentarios = listaComentariosTarefa
        }
        comentarios.textContent = infoTarefa.comentarios
    })
    console.log(listaComentariosTarefa);

    campoEdicao.style.display = 'block'
}

function fecharCampoEdicao() {
    campoEdicao.style.display = 'none'
}
function fecharCampoCriacao() {
    campoCriacao.style.display = 'none'
}

const logoutButton = document.getElementById('logoutButton')
logoutButton.addEventListener('click', logout)

window.onload = posicionarCards()

const emAndamento = document.getElementById('emAndamento')

async function filtrarAndamento() {
    excluirListaTarefas()
    const listaTarefas = await pegarTarefasUsuario()
    listaTarefas.forEach(tarefa => {
        if (!tarefa.concluida) {
            criarCard(tarefa)
        }
    });
}
async function filtrarConclusao() {
    excluirListaTarefas()
    const listaTarefas = await pegarTarefasUsuario()
    listaTarefas.forEach(tarefa => {
        if (tarefa.concluida) {
            criarCard(tarefa)
        }
    });
}

async function LoadComment() {
    const idTask = this.id
    localStorage.setItem('idTask', idTask)
    window.location.href = './home.html'
}
function logout() {
    localStorage.removeItem('idusuario')
    window.location.reload()
}