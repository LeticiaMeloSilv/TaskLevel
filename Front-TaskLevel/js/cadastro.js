'use strict'

async function cadastrarUsuario() {

    let nome = document.getElementById('nome').value
    let email = document.getElementById('email').value
    let senha = document.getElementById('senha').value
    let confirmaSenha = document.getElementById('confirmar').value
    let telefone = document.getElementById('telefone').value

    if (nome == '' || email == '' || senha == '' || confirmaSenha == '' || telefone == '') {
        alert('Preencha todos os campos')
    }
    else if (senha !== confirmaSenha) {
        alert('Senha incorreta')
    }
    else if(isNaN(telefone)){
        alert('verifique o numero de telefone')
    }
    else {
        const usuario = {
            nome: nome,
            email: email,
            senha: senha,
            telefone: telefone
        }

        console.log(usuario)
        try {
            const url = 'http://localhost:8080/usuario'
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            }

            const response = await fetch(url, options)
            console.log(response.ok);
            window.location.href = '../html/home.html'
            return response.ok
        }
        catch (error) {
            console.error(error)
        }
    }
}