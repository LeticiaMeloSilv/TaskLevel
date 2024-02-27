'use strict'

async function validarLogin() {
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    console.log(senha);
    if (email == '' || senha == '') {
        alert('Preencha os campos corretamente')
    }
    try {
        const responseApi = await fetch('http://localhost:5080/usuario')
        const listUsers = await responseApi.json()
        
        
        listUsers.forEach((usuario) => {
            if (email ==! usuario.email && email==!'' || senha ==! usuario.senha &&senha==!'') {
                alert('Email ou senha incorretos')
            }
            else if (email == usuario.email && senha == usuario.senha) {
                localStorage.setItem('idusuario', usuario.id)
                window.location.href = './Front-TaskLevel/html/home.html'
            }
        })
    }
    catch (error) {
        console.error(error)
    }
}
