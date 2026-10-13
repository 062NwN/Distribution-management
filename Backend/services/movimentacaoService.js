const sequelize = require('../config/database');

const Produto = require('../models/produto');
const MovimentacaoEstoque = require('../models/MovimentacaoEstoque');

function criarErro(mensagem, status) {
    const erro = new Error(mensagem);
    erro.status = status;
    return erro;
}

async function movimentarEstoque({ produtoId, tipo, quantidade, motivo, descricao = '' }) {

    // Validações que não precisam do banco
    if (!Number.isSafeInteger(quantidade) || quantidade <= 0) {
        throw criarErro('Informe uma quantidade inteira válida.', 400);
    }

    if (!['ENTRADA', 'SAIDA'].includes(tipo)) {
        throw criarErro('Tipo de movimentação inválido.', 400);
    }

    if (typeof motivo !== 'string' || !motivo.trim()) {
        throw criarErro('Selecione o motivo da movimentação.', 400);
    }

    if (typeof descricao !== 'string') {
        throw criarErro('A observação é inválida.', 400);
    }

    // Tudo abaixo acontece junto: se algo falhar, nada é gravado
    return sequelize.transaction(async (t) => {

        // 1. Busca o produto e trava a linha até o fim da transação
        const produto = await Produto.findByPk(produtoId, {
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!produto) {
            throw criarErro('Produto não encontrado.', 404);
        }

        // 2. Valida o estoque disponível
        const estoqueAtual = Number(produto.total_estoque);

        if (!Number.isSafeInteger(estoqueAtual) || estoqueAtual < 0) {
            throw criarErro('Estoque atual inválido.', 500);
        }

        if (tipo === 'SAIDA' && quantidade > estoqueAtual) {
            throw criarErro('Estoque insuficiente.', 409);
        }

        // 3. Calcula o novo estoque
        const novoEstoque = tipo === 'ENTRADA'
            ? estoqueAtual + quantidade
            : estoqueAtual - quantidade;

        if (!Number.isSafeInteger(novoEstoque)) {
            throw criarErro('Saldo final inválido.', 400);
        }

        // 4. Atualiza o produto
        await produto.update(
            {
                total_estoque: novoEstoque,
                data_alteracao: new Date()
            },
            { transaction: t }
        );

        // 5. Registra a movimentação
        const movimentacao = await MovimentacaoEstoque.create(
            {
                produto_id: produto.id,
                produto_nome: produto.nome,
                tipo,
                quantidade,
                estoque_anterior: estoqueAtual,
                estoque_posterior: novoEstoque,
                motivo: motivo.trim(),
                descricao: descricao.trim()
            },
            { transaction: t }
        );

        // 6. Retorna os dados salvos
        return { produto, movimentacao };
    });
}

module.exports = { movimentarEstoque };