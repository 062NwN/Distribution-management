import { useState, useEffect } from 'react'

import { FiCalendar, FiBell, FiBox, FiPlus, FiInfo, FiAlertTriangle, FiImage, FiSearch, FiTrash, FiEdit3 } from "react-icons/fi";

import Styles from '../pages_css/NewProduct.module.css';
import ModalNewProduct from '../components/models/ModalNewProduct';

function NewProduct() {
    const date = new Date();

    const [modalOpen, setModalOpen] = useState(false);

    const [produto, setProduto] = useState([]);
    const [totalProdutos, setTotalProdutos] = useState(0);

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
                setTotalProdutos(data.totalProdutos)
            })
            .catch((error) => {
                console.error("ERRO AO BUSCAR PRODUTOS:", error);
            });
    }, []);

    async function deletProduct(id) {
        const confirmDelete = window.confirm('Tem certeza que deseja deletar esse produto?');

        if (!confirmDelete)
            return

        try {
            const response = await fetch(`http://localhost:8081/produtos/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir produto: ${response.status}`);
            }

            setProduto((produtos) =>
                produtos.filter((produto) => produto.id !== id)
            );

            setTotalProdutos((total) => total - 1);

        } catch (error) {
            console.error("Erro ao excluir produto", error);
        }
    }

    function formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }   

    return (
        <section className={Styles.container}>
            <article className={Styles.header}>
                <div className={Styles.title}>
                    <h1>Produtos</h1>
                    <p>Visão geral dos seus produtos.</p>
                </div>

                <div className={Styles.date}>
                    <p><FiCalendar /> {dataFormatada}</p>
                    <h4><FiBell /></h4>
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
                        <h3 className={Styles.cards_value}>0</h3>
                    </div>
                </div>

                <div className={Styles.cards}>
                    <div className={Styles.cards_svg}>
                        <FiInfo />
                    </div>
                    <div className={Styles.cards_infor}>
                        <h4 className={Styles.cards_title}>Estoque Baixo</h4>
                        <h3 className={Styles.cards_value}>0</h3>
                    </div>
                </div>

                <div className={Styles.cards}>
                    <div className={Styles.cards_svg}>
                        <FiAlertTriangle />
                    </div>
                    <div className={Styles.cards_infor}>
                        <h4 className={Styles.cards_title}>Produtos Esgotados </h4>
                        <h3 className={Styles.cards_value}>0</h3>
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
                        />
                    </div>
                    <select>
                        <option value='todas as categorias'>Todas as categorias</option>
                    </select>
                    <select>
                        <option value='todos os status'>Todos os status</option>
                    </select>
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
                            {produto.map((produto) => {
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
                                            <span className={Styles.status_active}>
                                                {produto.status === "ativo" ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={Styles.actions}>
                                                <button className={Styles.edit}>
                                                    <FiEdit3 />
                                                </button>

                                                <button className={Styles.delete} onClick={() => deletProduct(produto.id)}>
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
                    }}
                />
            )}
        </section>
    )
}

export default NewProduct;