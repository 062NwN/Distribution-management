async function salvarNotificacao(mensagem, tipo) {
    const response = await fetch('http://localhost:8081/notificacoes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensagem, tipo })
    });
    return response.json();
}

export default salvarNotificacao;