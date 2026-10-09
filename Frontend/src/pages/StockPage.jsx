import { useState, useEffect } from 'react';
import { FiCalendar, FiBox, FiDatabase, FiAlertOctagon, FiAlertTriangle, FiSearch, FiRefreshCcw, FiImage } from 'react-icons/fi';

import Styles from '../pages_css/StockPage.module.css';

import FilterProducts from '../components/FilterProducts';

import Select from '../pagesComponents/Select';

function StockPage() {
    const [produtos, setProduto] = useState([]);
    const [totalProdutos, setTotalProdutos] = useState(0);

    const [pesquisa, setPesquisa] = useState('');

    const [filterStatus, setFilterStatus] = useState('');
    const [categoria, setCategoria] = useState('');

    const verificarStatus = (produto) => {
        const estoque = Number(produto.total_estoque);
        const minimo = Number(produto.estoque_minimo);

        if (estoque <= 0) {
            return 'Estoque Esgotado';
        }

        if (estoque <= minimo) {
            return 'Estoque Baixo';
        }

        return 'Estoque Bom';
    };

    const statusOptions = [
        'Estoque Bom',
        'Estoque Baixo',
        'Estoque Esgotado'
    ];

    const produtosFiltrado = FilterProducts(produtos, {
        busca: pesquisa,
        categoria
    })

    const produtosFiltradosPorStatus = produtosFiltrado.filter((produto) => {
        if (!filterStatus) return true;

        return verificarStatus(produto) === filterStatus;
    });

    const date = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })

    useEffect(() => {
        fetch('http://localhost:8081/produtos')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Erro HTTP: ${res.status}`);
                }

                return res.json();
            })
            .then((data) => {
                setProduto(data.produtos)
                setTotalProdutos(data.produtos.length);
            })
            .catch((error) => {
                console.error('Erro ao buscar produtos:', error);
            });
    }, []);

    const totalEstoqueProdutos = produtos.reduce((total, p) => {
        return total + (Number(p.total_estoque) || 0);
    }, 0);

    const estoqueBaixo = produtos.filter((produto) => {
        return Number(produto.total_estoque) <= Number(produto.estoque_minimo) && Number(produto.total_estoque) > 0;
    })

    const esgotados = produtos.filter((produto) => {
        return Number(produto.total_estoque) <= 0;
    })

    const categorias = [
        ...new Set(
            produtos
                .map((produtos) => produtos.categoria)
                .filter(Boolean)
        )
    ];

    return (
        <section className={Styles.container_page}>
            <div className={Styles.container_header}>
                <div className={Styles.title}>
                    <h1>Estoque</h1>
                    <p>Gerencie todo o seu estoque em tempo real.</p>
                </div>

                <div className={Styles.date}>
                    <FiCalendar /> {date}
                </div>
            </div>

            <div className={Styles.container_main}>
                <div className={Styles.container_cards}>
                    <div className={Styles.cards}>
                        <div className={Styles.cards_svg}>
                            <FiBox />
                        </div>
                        <div className={Styles.cards_infor}>
                            <h4 className={Styles.cards_title}>Total Produtos</h4>
                            <h3 className={Styles.cards_value}>{totalProdutos}</h3>
                        </div>
                    </div>

                    <div className={Styles.cards}>
                        <div className={Styles.cards_svg}>
                            <FiDatabase />
                        </div>
                        <div className={Styles.cards_infor}>
                            <h4 className={Styles.cards_title}>Estoque Total</h4>
                            <h3 className={Styles.cards_value}>{totalEstoqueProdutos}</h3>
                        </div>
                    </div>

                    <div className={Styles.cards}>
                        <div className={Styles.cards_svg}>
                            <FiAlertOctagon />
                        </div>
                        <div className={Styles.cards_infor}>
                            <h4 className={Styles.cards_title}>Estoque Baixo</h4>
                            <h3 className={Styles.cards_value}>{estoqueBaixo.length}</h3>
                        </div>
                    </div>

                    <div className={Styles.cards}>
                        <div className={Styles.cards_svg}>
                            <FiAlertTriangle />
                        </div>
                        <div className={Styles.cards_infor}>
                            <h4 className={Styles.cards_title}>Estoque esgotado</h4>
                            <h3 className={Styles.cards_value}>{esgotados.length}</h3>
                        </div>
                    </div>
                </div>

                <div className={Styles.container_content}>
                    <div className={Styles.container_search}>
                        <div className={Styles.search}>
                            <FiSearch />
                            <input
                                type='text'
                                placeholder='Pesquise por nome, SKU, código de barras, categorias ou subcategorias... '
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
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
                            options={statusOptions}
                            value={filterStatus}
                            handleOnChange={(e) => setFilterStatus(e.target.value)}
                        />
                    </div>

                    <div className={Styles.table_container}>
                        <table className={Styles.products_table}>
                            <thead>
                                <tr>
                                    <th>PRODUTO</th>
                                    <th>CÓDIGO</th>
                                    <th>SKU</th>
                                    <th>CATEGORIA</th>
                                    <th>SUBCATEGORIA</th>
                                    <th>ESTOQUE ATUAL</th>
                                    <th>ESTOQUE MÍNIMO</th>
                                    <th>STATUS</th>
                                    <th>AÇÕES</th>
                                </tr>
                            </thead>

                            <tbody>
                                {produtosFiltradosPorStatus.map((produto) => (
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
                                        <td>{produto.sku}</td>
                                        <td>{produto.categoria}</td>
                                        <td>{produto.subcategoria}</td>
                                        <td>{produto.total_estoque}</td>
                                        <td>{produto.estoque_minimo}</td>
                                        <td>
                                            <span className={
                                                verificarStatus(produto) === 'Estoque Bom'
                                                    ? Styles.status_active
                                                    : verificarStatus(produto) === 'Estoque Baixo'
                                                        ? Styles.status_warning
                                                        : Styles.status_inactive
                                            }>
                                                {verificarStatus(produto)}
                                            </span>
                                        </td>
                                        <td><button><FiRefreshCcw /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={Styles.footer}>
                        <p>© 2026 StockFlow. Todos os direitos reservados.</p>

                        <span>Gestão de produtos e estoque</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StockPage;