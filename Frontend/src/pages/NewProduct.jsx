import { useState, useEffect } from 'react'

import { FiCalendar, FiBell, FiBox, FiPlus, FiInfo, FiAlertTriangle, FiImage, FiSearch, FiTrash, FiEdit3 } from "react-icons/fi";

import Styles from '../pages_css/NewProduct.module.css';

import Select from '../pagesComponents/Select';

import ModalNewProduct from '../components/models/ModalNewProduct';
import ModalConfirm from '../components/models/ModalConfirm';
import ModalEditProduct from '../components/models/ModalEditProduct';

import Notifications from '../components/Notifications';

import salvarNotificacao from '../components/functions/salvarNotificacao';

import FilterProducts from '../components/FilterProducts';

import Loading from '../components/Loading';

function NewProduct() {
    const date = new Date();

    const [modalOpen, setModalOpen] = useState(false);

    const [produto, setProduto] = useState([]);
    const [totalProdutos, setTotalProdutos] = useState(0);

    const [confirm, setConfirm] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    const [editOpen, setEditOpen] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);

    const [loading, setLoading] = useState(false);

    function confirmDelete(id) {
        setProdutoSelecionado(id);
        setConfirm(true);
    }

    function handleEdit(produto) {
        setProdutoEditando(produto);
        setEditOpen(true);
    }

    async function receberConfirm(resp) {
        if (resp === "confirm") {
            const sucesso = await deletProduct(produtoSelecionado);

            if (sucesso) {
                mostrarNotificacao(
                    "Produto deletado com sucesso!",
                    "warning"
                );
            }
        }

        setConfirm(false);
        setProdutoSelecionado(null);
    }

    async function handleUpdateProduct(produtoAtualizado) {
        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8081/produtos/${produtoAtualizado.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(produtoAtualizado)
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Erro ao atualizar produto: ${response.status}`
                );
            }

            const data = await response.json();

            setProduto((produtos) =>
                produtos.map((produto) =>
                    produto.id === produtoAtualizado.id
                        ? (data.produto ?? produtoAtualizado)
                        : produto
                )
            );

            mostrarNotificacao(
                "Produto atualizado com sucesso!",
                "success"
            );

            setEditOpen(false);
            setProdutoEditando(null);

        } catch (error) {
            console.error("Erro ao atualizar produto:", error);

            mostrarNotificacao(
                "Erro ao atualizar produto.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    const dataFormatada = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    useEffect(() => {
        fetch('http://localhost:8081/produtos')
            .then((resp) => {
                return resp.json();
            })
            .then((data) => {
                setProduto(data.produtos);
                setTotalProdutos(data.totalProdutos);
            })
            .catch((error) => {
                console.error("ERRO AO BUSCAR PRODUTOS:", error);
            });
    }, []);

    async function deletProduct(id) {
        setLoading(true);
        
        try {
            const response = await fetch(
                `http://localhost:8081/produtos/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Erro ao excluir produto: ${response.status}`
                );
            }

            setProduto((produtos) =>
                produtos.filter((produto) => produto.id !== id)
            );

            setTotalProdutos((total) => total - 1);

            return true;

        } catch (error) {
            console.error("Erro ao excluir produto", error);

            mostrarNotificacao(
                "Erro ao excluir produto.",
                "error"
            );

            return false;
        } finally {
            setLoading(false);
        }
    }

    function formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    const ProdutosAtivos = produto.filter((produtos) => {
        return produtos.status === "ativo";
    });

    const estoqueBaixo = produto.filter((produtos) => {
        const estoque = Number(produtos.total_estoque);
        const minimo = Number(produtos.estoque_minimo)

        return estoque > 0 && estoque <= minimo;
    });

    const esgotados = produto.filter((produtos) => {
        return produtos.total_estoque <= 0;
    });

    const produtosEstoqueBaixo = estoqueBaixo.length;
    const qtdProdutosAtivos = ProdutosAtivos.length;
    const produtosEsgotados = esgotados.length;

    const [notification, setNotification] = useState(null);

    const categorias = [
        ...new Set(
            produto
                .map((produto) => produto.categoria)
                .filter(Boolean)
        )
    ];

    const status = [
        ...new Set(
            produto
                .map((produto) => produto.status)
                .filter(Boolean)
        )
    ]

    const [filterStatus, setFilterStatus] = useState('');
    const [busca, setBusca] = useState('');
    const [categoria, setCategoria] = useState('');

    const produtosFiltrados = FilterProducts(produto, {
        busca,
        categoria,
        status: filterStatus
    });

    const mostrarNotificacao = (mensagem, tipo) => {
        setNotification({ mensagem, tipo });

        salvarNotificacao(mensagem, tipo);

        setTimeout(() => {
            setNotification(null);
        }, 2500);
    };

    return (
        <section className={Styles.container}>
            <article className={Styles.header}>
                <div className={Styles.title}>
                    <h1>Produtos</h1>
                    <p>Visão geral dos seus produtos.</p>
                </div>

                <div className={Styles.date}>
                    <p><FiCalendar /> {dataFormatada}</p>
                </div>
            </article>

            <article className={Styles.cards_main}>
                <div className={Styles.cards}>
                    <div className={Styles.cards_svg}>
                        <FiBox />
                    </div>
                    <div className={Styles.cards_infor}>
                        <h4 className={Styles.cards_title}>Produtos Cadastrados</h4>
                        <h3 className={Styles.cards_value}>{totalProdutos}</h3>
                    </div>
                </div>

                <div className={Styles.cards}>
                    <div className={Styles.cards_svg}>
                        <FiPlus />
                    </div>
                    <div className={Styles.cards_infor}>
                        <h4 className={Styles.cards_title}>Produtos Ativos</h4>
                        <h3 className={Styles.cards_value}>{qtdProdutosAtivos}</h3>
                    </div>
                </div>

                <div className={Styles.cards}>
                    <div className={Styles.cards_svg}>
                        <FiInfo />
                    </div>
                    <div className={Styles.cards_infor}>
                        <h4 className={Styles.cards_title}>Estoque Baixo</h4>
                        <h3 className={Styles.cards_value}>{produtosEstoqueBaixo}</h3>
                    </div>
                </div>

                <div className={Styles.cards}>
                    <div className={Styles.cards_svg}>
                        <FiAlertTriangle />
                    </div>
                    <div className={Styles.cards_infor}>
                        <h4 className={Styles.cards_title}>Produtos Esgotados </h4>
                        <h3 className={Styles.cards_value}>{produtosEsgotados}</h3>
                    </div>
                </div>
            </article>

            <article className={Styles.main_products}>
                <div className={Styles.header_products}>
                    <div className={Styles.search}>
                        <FiSearch />
                        <input
                            className={Styles.input_search}
                            type='text'
                            placeholder='Pesquise por nome, SKU, código de barras, categorias ou subcategorias'
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <Select
                        className={Styles.select}
                        text="Selecione uma categoria"
                        name="categoria"
                        options={categorias}
                        value={categoria}
                        handleOnChange={(e) => setCategoria(e.target.value)}
                    />

                    <Select
                        className={Styles.select}
                        text="Selecione um status"
                        name="status"
                        options={status}
                        value={filterStatus}
                        handleOnChange={(e) => setFilterStatus(e.target.value)}
                    />

                    <button onClick={() => setModalOpen(true)}><FiPlus /> Novo Produto</button>
                </div>
                <div className={Styles.table_container}>
                    <table className={Styles.products_table}>
                        <thead>
                            <tr>
                                <th>PRODUTO</th>
                                <th>CÓDIGO</th>
                                <th>CATEGORIA</th>
                                <th>ESTOQUE</th>
                                <th>PREÇO VND</th>
                                <th>CUSTO TOTAL</th>
                                <th>LUCRO</th>
                                <th>STATUS</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>

                        <tbody>
                            {produtosFiltrados.map((produto) => {
                                return (
                                    <tr key={produto.id}>
                                        <td>
                                            <div className={Styles.product_name}>
                                                <div className={Styles.product_image}>
                                                    {produto.imagem && !produto.imagem.startsWith('blob:') ? (
                                                        <img src={produto.imagem} alt={produto.nome} />
                                                    ) : (
                                                        <span><FiImage /></span>
                                                    )}
                                                </div>

                                                {produto.nome}
                                            </div>
                                        </td>

                                        <td>{produto.codigo_barras}</td>
                                        <td>{produto.categoria}</td>
                                        <td>{produto.total_estoque}</td>
                                        <td>{formatarMoeda(produto.preco_venda)}</td>
                                        <td>{formatarMoeda(produto.custo_total || 0)}</td>
                                        <td>+ {Number(produto.margem_lucro || 0).toFixed(2)}%</td>
                                        <td>
                                            <span className={
                                                produto.status === 'ativo'
                                                    ? Styles.status_active
                                                    : Styles.status_inactive
                                            }>
                                                {produto.status === "ativo" ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={Styles.actions}>
                                                <button className={Styles.edit}
                                                    onClick={() => handleEdit(produto)}
                                                >
                                                    <FiEdit3 />
                                                </button>

                                                <button className={Styles.delete} onClick={() => confirmDelete(produto.id)}>
                                                    <FiTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={Styles.footer}>
                    <p>© 2026 StockFlow. Todos os direitos reservados.</p>

                    <span>Gestão de produtos e estoque</span>
                </div>
            </article>

            {modalOpen && (
                <ModalNewProduct
                    onClose={() => setModalOpen(false)}
                    onProductCreated={(novoProduto) => {
                        setProduto((produtos) => [...produtos, novoProduto]);
                        setTotalProdutos((total) => total + 1);

                        mostrarNotificacao(
                            "Produto cadastrado com sucesso!",
                            "success"
                        );
                    }}
                />
            )}

            {confirm && (
                <ModalConfirm
                    mensagem='Deseja excluir esse produto?'
                    onResposta={receberConfirm}
                />
            )}

            {editOpen && produtoEditando && (
                <ModalEditProduct
                    produto={produtoEditando}
                    onClose={() => {
                        setEditOpen(false);
                        setProdutoEditando(null);
                    }}
                    onSave={handleUpdateProduct}
                />
            )}

            {loading && (
                <Loading />
            )}

            <Notifications notification={notification} />
        </section>
    )
}

export default NewProduct;