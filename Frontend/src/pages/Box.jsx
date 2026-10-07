import { useState, useEffect } from 'react';

import { FiCalendar, FiSearch, FiTrash, FiTag, FiCreditCard, FiImage, FiMinus, FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { LiaMoneyBillAlt } from "react-icons/lia";
import { RiPixLine } from "react-icons/ri";
import { CiBarcode } from "react-icons/ci";

import Styles from '../pages_css/Box.module.css';

import FilterProducts from '../components/FilterProducts';

function Box() {

    const [method, setMethod] = useState('');

    const [produto, setProduto] = useState([]);

    const [busca, setBusca] = useState('');

    useEffect(() => {
        fetch('http://localhost:8081/produtos')
            .then((resp) => {
                return resp.json();
            })
            .then((data) => {
                setProduto(data.produtos);
            })
            .catch((error) => {
                console.error("ERRO AO BUSCAR PRODUTOS:", error);
            });
    }, []);

    const produtosFiltrados = FilterProducts(produto, {
        busca2: busca
    })

    const date = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })

    return (
        <section className={Styles.container}>
            <div className={Styles.container_header}>
                <div>
                    <h1>Caixa</h1>
                    <p>Realize vendas e gerencie o caixa da sua loja.</p>
                </div>


                <div className={Styles.date}>
                    <FiCalendar /> {date}
                </div>
            </div>

            <div className={Styles.main}>
                <div className={Styles.container_shop_products}>
                    <h1>Adicionar Produtos</h1>
                    <div className={Styles.container_search}>
                        <div className={Styles.search_container}>
                            <div className={Styles.search}>
                                <FiSearch />

                                <input
                                    type="text"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    placeholder='Digite o nome, sku ou código de barras'
                                />

                                <CiBarcode />

                            </div>

                            <button>Adicionar ao Carrinho</button>
                        </div>

                        {busca && (
                        <div className={Styles.container_search_product}>
                            <table>
                                <tbody>
                                    {produtosFiltrados.map((produto) => (
                                        <tr key={produto.id}>
                                            <td>{produto.nome}</td>
                                            <td>{produto.codigo_barras}</td>
                                            <td>{produto.sku}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    </div>

                    <div className={Styles.container_tables}>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        PRODUTO
                                    </th>
                                    <th>
                                        PREÇO
                                    </th>
                                    <th>
                                        QTD.
                                    </th>
                                    <th>
                                        TOTAL
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>
                                        <div className={Styles.product}>
                                            <div className={Styles.container_image}>
                                                <FiImage />
                                            </div>
                                            Produto
                                        </div>
                                    </td>
                                    <td>
                                        R$ 20,00
                                    </td>
                                    <td>
                                        <div className={Styles.qtd}>
                                            <button className={Styles.menos}><FiMinus /></button>
                                            3
                                            <button className={Styles.mais}><FiPlus /></button>
                                        </div>
                                    </td>
                                    <td>
                                        R$ 60,00
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={Styles.footer}>
                        <button><FiTrash /> Limpar Carrinho</button>
                        <button><FiTag /> Aplicar Desconto</button>
                        <button><FiCreditCard /> Finalizar Venda</button>
                    </div>
                </div>

                <div className={Styles.container_invoicing}>
                    <div className={Styles.summary}>
                        <div className={Styles.title}>
                            <h1>Resumo da Venda</h1>
                        </div>

                        <div className={Styles.infor}>
                            <p>SubTotal (3 itens)</p>
                            <h2>R$ 00,00</h2>
                        </div>

                        <div className={Styles.infor}>
                            <p>Descontos</p>
                            <h2>R$ 00,00</h2>
                        </div>

                        <div className={Styles.inforTotal}>
                            <p>Total</p>
                            <h2>R$ 00,00</h2>
                        </div>
                    </div>

                    <div className={Styles.payment}>
                        <div className={Styles.title2}>
                            <h3>Pagamento</h3>
                        </div>

                        <div className={Styles.select_payment}>

                            <div
                                className={`${Styles.method} ${method === 'Dinheiro' ? Styles.selected : ''}`}
                                onClick={() => setMethod('Dinheiro')}
                            >
                                <LiaMoneyBillAlt />
                                <p>Dinheiro</p>
                            </div>

                            <div
                                className={`${Styles.method} ${method === 'Cartão' ? Styles.selected : ''}`}
                                onClick={() => setMethod('Cartão')}
                            >
                                <FiCreditCard />
                                <p>Cartão</p>
                            </div>

                            <div
                                className={`${Styles.method} ${method === 'Pix' ? Styles.selected : ''}`}
                                onClick={() => setMethod('Pix')}
                            >
                                <RiPixLine />
                                <p>Pix</p>
                            </div>

                            <div
                                className={`${Styles.method} ${method === 'Outros' ? Styles.selected : ''}`}
                                onClick={() => setMethod('Outros')}
                            >
                                <FiMoreHorizontal />
                                <p>Outros</p>
                            </div>

                        </div>

                        {method === "Dinheiro" && (
                            <div className={Styles.select}>
                                <input
                                    type='number'
                                    placeholder='Digite o valor pago...'
                                    id='valorPago'
                                />
                                <label htmlFor='valorPago'>Troco de R$ 00.00</label>
                            </div>
                        )}

                        {method === "Outros" && (
                            <div className={Styles.selectOther}>
                                <input
                                    type='text'
                                    placeholder='Digite qual foi o metodo de pagamento...'
                                    id='otherMethod'
                                />
                            </div>
                        )}

                        <button> <FiCreditCard /> Finalizar Venda </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Box;