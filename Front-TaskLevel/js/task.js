'use strict'

const container = document.getElementById('atividades')



//Pega o id fornecido pelo login pra dps usar ele em confirmacoes
const idPerfil = localStorage.getItem('idusuario')
if (!idPerfil) {
    window.location.href = '../../index.html'
}

//pega todas as informacoes sobre os usuarios
async function pegarUsuariosBack() {
    const responseApi = await fetch('http://localhost:5080/usuario')
    const listUsuarios = await responseApi.json()
    return listUsuarios
}
//pega todas as informacoes das tarefas
async function pegarTarefasBack() {
    const responseApi = await fetch('http://localhost:5080/tarefas')
    const listTarefas = await responseApi.json()
    return listTarefas
}
//funcao para pegar as tarefas do usuario logado
pegarTarefasUsuario()
async function pegarTarefasUsuario() {
    const listaTarefas = await pegarTarefasBack()
    const listaTarefasUsuario = []
    listaTarefas.forEach(tarefa => {
        if (tarefa.idUsuario == idPerfil) {
            listaTarefasUsuario.push(tarefa)
        }
    });
    return listaTarefasUsuario
}

//Sai da conta
function logout() {
    localStorage.removeItem('idusuario')
    window.location.reload()
}

//botao para deixar a tela de adicionar tarefa visivel
const addTaskButton = document.getElementById('addTaskButton')
addTaskButton.addEventListener('click', abrirCampoCadastroTarefa)
function abrirCampoCadastroTarefa() {
    campoCriacao.style.display = 'block'
}

//serve pra criar a tarefa no back
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
    await fetch('http://localhost:5080/tarefas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novosDados)
    })
    console.log(novosDados)
}
function atualizarPaginaFiltro(){

}
function excluirListaTarefas(){
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}


//funcao para criar o card das tarefas

async function posicionarCards(){
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

        btn_editar.appendChild(img)

        tituloData.replaceChildren(titulo, data)

        card.replaceChildren(imagem, tituloData, conteudo, btn_editar)

        container.appendChild(card);
}

//funcao que cria os cards das tarefas

const campoEdicao = document.getElementById("atividade_focus")
const campoCriacao = document.getElementById("campoCriacao")

//funcao q da a possibilidade de editar a tarefa
// async function exibir(id) {
//     const titulo = document.getElementById('tituloEditarTarefa')
//     const descricao = document.getElementById('descricaoEditarTarefa')
//     const listaTarefas = await pegarTarefasBack()
//     listaTarefas.forEach(tarefa => {
//         if (tarefa.id == id) {
//             const infoTarefa = {
//                 titulo: tarefa.titulo,
//                 descricao: tarefa.descricao
//             }
//             titulo.textContent = infoTarefa.titulo
//             descricao.textContent = infoTarefa.descricao
//         }
//     });
//     campoEdicao.style.display = 'block'
// }

async function exibir(id) {
    const titulo = document.getElementById('tituloEditarTarefa')
    const descricao = document.getElementById('descricaoEditarTarefa')
    const listaTarefas = await pegarTarefasBack()
    listaTarefas.forEach(tarefa => {
        if (tarefa.id == id) {
            const infoTarefa = {
                titulo: tarefa.titulo,
                descricao: tarefa.descricao
            }
            titulo.textContent = infoTarefa.titulo
            descricao.textContent = infoTarefa.descricao
        }
    });
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

const emAndamento=document.getElementById('emAndamento')
// function atividadesEmAndamento() {
//     const listaTarefas = await pegarTarefasBack()
//     const listaUsuarios = await pegarUsuariosBack()
// }

async function filtrarAndamento(){
    excluirListaTarefas()
    const listaTarefas = await pegarTarefasUsuario()
    listaTarefas.forEach(tarefa => {
        if(!tarefa.concluida){
            criarCard(tarefa)
        }
    });
}
async function filtrarConclusao(){
    excluirListaTarefas()
    const listaTarefas = await pegarTarefasUsuario()
    listaTarefas.forEach(tarefa => {
        if(tarefa.concluida){
            criarCard(tarefa)
        }
    });
}