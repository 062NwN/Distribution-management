import { FiCalendar, FiBell, FiBox, FiPlus, FiInfo, FiAlertTriangle, FiImage, FiSearch, FiTrash, FiEdit3 } from "react-icons/fi";

import Styles from '../pages_css/NewProduct.module.css';

function NewProduct() {
    const date = new Date();

    const dataFormatada = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

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
                        <h3 className={Styles.cards_value}>0</h3>
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
                    <button><FiPlus /> Novo Produto</button>
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
                                <th>PREÇO CMP</th>
                                <th>LUCRO</th>
                                <th>STATUS</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>
                                    <div className={Styles.product_name}>
                                        <div className={Styles.product_image}>
                                            <span><FiImage /></span>
                                        </div>

                                        Coca-Cola 2L
                                    </div>
                                </td>

                                <td>7925862100</td>
                                <td>Refrigerantes</td>
                                <td>24</td>
                                <td>R$ 11,00</td>
                                <td>R$ 6,00</td>
                                <td>+ 3%</td>
                                <td>
                                    <span className={Styles.status_active}>
                                        Ativo
                                    </span>
                                </td>
                                <td>
                                    <div className={Styles.actions}>
                                        <button className={Styles.edit}>
                                            <FiEdit3 />
                                        </button>

                                        <button className={Styles.delete}>
                                            <FiTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
                <div className={Styles.footer}>
                    <p>© 2026 StockFlow. Todos os direitos reservados.</p>

                    <span>Gestão de produtos e estoque</span>
                </div>
            </article>
        </section>
    )
}

export default NewProduct;