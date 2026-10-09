import { FiPlusCircle, FiMinusCircle, FiSave, FiX } from "react-icons/fi";

import { useState, useEffect } from 'react';

import Styles from './ModalStock.module.css';

import Select from '../../pagesComponents/Select';

import ModalConfirm from './ModalConfirm';

function ModalStock({ produto, onClose, mostrarNotificacao, onAtualizar }) {
    const [closing, setClosing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [nomeProduto, setNomeProduto] = useState(produto?.nome ?? '');
    const [estoqueAtual, setEstoqueAtual] = useState(produto?.total_estoque ?? '');

    const [addEstoque, setAddEstoque] = useState('');

    const [observation, setObservation] = useState('');

    const [pagina, setPagina] = useState(0);

    const [quantidade, setQuantidade] = useState('');

    const [motivo, setMotivo] = useState('');

    const [descricao, setDescricao] = useState('');

    const [historico, setHistorico] = useState([]);

    const [confirm, setConfirm] = useState(false);

    async function carregarHistorico() {
        try {
            const response = await fetch(
                "http://localhost:8080/movimentacoes_estoque"
            );

            if (!response.ok) {
                throw new Error("Erro ao carregar histórico.");
            }

            const data = await response.json();

            setHistorico(
                data.filter(
                    (item) => String(item.produto_id) === String(produto.id)
                )
            );
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
        }
    }

    useEffect(() => {
        if (pagina === 2) {
            carregarHistorico();
        }
    }, [pagina, produto.id]);

    const motivoAdd = [
        'Compra não registrada',
        'Devolução de cliente',
        'Ajuste de inventário',
        'Transferência recebida',
        'Entrada por bonificação',
        'Outros'
    ]

    const motivoLow = [
        'Venda não registrada',
        'Produto danificado',
        'Produto vencido',
        'Perda ou extravio',
        'Uso interno',
        'Devolução ao fornecedor',
        'Ajuste de inventário',
        'Outros'
    ]

    function handleClose() {
        setClosing(true);
        setTimeout(() => onClose(), 250);
    }

    async function receberConfirm(resp) {
        if (resp === "confirm") {
            if(quantidade <= 0){
                mostrarNotificacao(
                    'Coloque uma quantidade válida!',
                    'error'
                )
                return
            }
        }

        setConfirm(false);
        onClose();
    }


    async function atualizarEstoque() {
        const quantidadeMovimentada = Number(quantidade);

        if (
            !Number.isSafeInteger(quantidadeMovimentada) ||
            quantidadeMovimentada <= 0
        ) {
            mostrarNotificacao?.(
                "Informe uma quantidade inteira válida.",
                "error"
            );
            return;
        }

        if (!motivo.trim()) {
            mostrarNotificacao?.(
                "Selecione o motivo da movimentação.",
                "error"
            );
            return;
        }

        const tipo = pagina === 0 ? "SAIDA" : "ENTRADA";

        await handleUpdateProduct({
            id: produto.id,
            tipo,
            quantidade: quantidadeMovimentada,
            motivo,
            descricao
        });
    }

    async function handleUpdateProduct(movimentacao) {
        if (loading) return;

        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8081/produtos/${movimentacao.id}/estoque`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tipo: movimentacao.tipo,
                        quantidade: movimentacao.quantidade,
                        motivo: movimentacao.motivo,
                        descricao: movimentacao.descricao
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem || "Erro ao movimentar estoque."
                );
            }

            mostrarNotificacao?.(
                "Estoque atualizado e movimentação registrada!",
                "success"
            );

            await onAtualizar?.();
            onClose();

        } catch (error) {
            console.error("Erro ao movimentar estoque:", error);

            mostrarNotificacao?.(
                error.message || "Erro ao atualizar estoque.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }


    return (
        <section className={Styles.bg}>

            <div className={Styles.container}>

                <div className={Styles.main}>
                    <div className={Styles.container_nav}>
                        <div className={Styles.title}>
                            <h1>Gerencie seu Estoque: </h1>
                            <div className={Styles.descProd}>
                                <p className={Styles.nome_produto}>Produto:</p>
                                <p className={Styles.p}>{nomeProduto}</p>
                            </div>
                        </div>

                        <div className={Styles.container_menu}>
                            <div className={pagina == 0 ? Styles.active : Styles.menu_stock} onClick={() => setPagina(0)}>
                                <p> <FiMinusCircle /> Baixar Estoque</p>
                            </div>
                            <div className={pagina == 1 ? Styles.active : Styles.menu_stock} onClick={() => setPagina(1)}>
                                <p> <FiPlusCircle /> Adicionar Estoque</p>
                            </div>
                            <div className={pagina == 2 ? Styles.active : Styles.menu_stock} onClick={() => setPagina(2)}>
                                <p> <FiPlusCircle /> Historico Movimentações</p>
                            </div>
                        </div>
                    </div>

                    <div className={Styles.page}>

                        <button
                            type="button"
                            className={Styles.close}
                            onClick={handleClose}
                        >
                            <FiX />
                        </button>

                        <div className={Styles.border_main}>
                            {pagina == 0 && (
                                <div className={Styles.inputs}>
                                    <h3>BAIXA DE ESTOQUE:</h3>
                                    <div className={Styles.container_inputs}>
                                        <div className={Styles.camp}>
                                            <label htmlFor="quantidade">Quantidade:</label>
                                            <input
                                                id="quantidade"
                                                type="number"
                                                min="1"
                                                step="1"
                                                placeholder="Digite a quantidade"
                                                value={quantidade}
                                                onChange={(e) => setQuantidade(e.target.value)}
                                            />
                                        </div>
                                        <div className={Styles.motivo}>
                                            <label htmlFor="motivo">Motivo:</label>
                                            <Select
                                                className={Styles.select}
                                                text="Motivo:"
                                                name="motivo"
                                                options={motivoLow}
                                                value={motivo}
                                                handleOnChange={(e) => setMotivo(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className={Styles.description}>
                                        <textarea
                                            type='text'
                                            onChange={(e) => { setDescricao(e.target.value) }}
                                            placeholder='Digite alguma observação...'
                                        />
                                    </div>
                                </div>
                            )}

                            {pagina == 1 && (
                                <div className={Styles.inputs}>
                                    <h3>ADICIONAR AO ESTOQUE:</h3>
                                    <div className={Styles.container_inputs}>
                                        <div className={Styles.camp}>
                                            <label htmlFor="quantidade">Quantidade:</label>
                                            <input
                                                id="quantidade"
                                                type="number"
                                                min="1"
                                                step="1"
                                                placeholder="Digite a quantidade"
                                                value={quantidade}
                                                onChange={(e) => setQuantidade(e.target.value)}
                                            />
                                        </div>
                                        <div className={Styles.motivo}>
                                            <label htmlFor="motivo">Motivo:</label>
                                            <Select
                                                className={Styles.select}
                                                text="Motivo:"
                                                name="motivo"
                                                options={motivoAdd}
                                                value={motivo}
                                                handleOnChange={(e) => setMotivo(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className={Styles.description}>
                                        <textarea
                                            type='text'
                                            onChange={(e) => { setDescricao(e.target.value) }}
                                            placeholder='Digite alguma observação...'
                                        />
                                    </div>
                                </div>
                            )}


                            {pagina === 2 && (
                                <div className={Styles.historico}>
                                    <h3>Histórico de movimentações</h3>

                                    <div className={Styles.listaHistorico}>
                                        {historico.length > 0 ? (
                                            historico.map((item) => (
                                                <div key={item.id} className={Styles.itemHistorico}>
                                                    <div>
                                                        <strong>{item.produto_nome}</strong>
                                                        <p>{item.motivo}</p>
                                                        {item.descricao && <p>{item.descricao}</p>}
                                                    </div>

                                                    <div className={Styles.detalhesHistorico}>
                                                        <span className={
                                                            item.tipo === "ENTRADA"
                                                                ? Styles.entrada
                                                                : Styles.saida
                                                        }>
                                                            {item.tipo === "ENTRADA" ? "+" : "-"}
                                                            {item.quantidade}
                                                        </span>

                                                        <small>
                                                            {new Date(item.data_movimentacao).toLocaleString("pt-BR")}
                                                        </small>

                                                        <small>
                                                            Estoque: {item.estoque_anterior} → {item.estoque_posterior}
                                                        </small>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>Nenhuma movimentação registrada.</p>
                                        )}
                                    </div>
                                </div>
                            )}


                            <div className={pagina < 2 ? Styles.footer : Styles.none}>
                                <button
                                    type="button"
                                    onClick={() => setConfirm(true)}
                                    disabled={loading}
                                >
                                    <FiSave />
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {confirm && (
                <ModalConfirm
                    mensagem='Deseja editar o estoque desse produto?'
                    onResposta={receberConfirm}
                />
            )}
        </section>
    )
}

export default ModalStock;