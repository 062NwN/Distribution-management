import { useState, useEffect } from 'react';

import { FiCalendar, FiSearch, FiTrash, FiTag, FiCreditCard, FiImage, FiMinus, FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { PiBroom } from "react-icons/pi";
import { LiaMoneyBillAlt } from "react-icons/lia";
import { RiPixLine } from "react-icons/ri";
import { CiBarcode } from "react-icons/ci";

import Styles from '../pages_css/Box.module.css';

import FilterProducts from '../components/FilterProducts';
import ModalConfirm from '../components/models/ModalConfirm';
import ModalDiscount from '../components/models/ModalDiscount';

import Notifications from '../components/Notifications';
import salvarNotificacao from '../components/functions/salvarNotificacao';

import CompraConfirmada from '../components/models/PurchaseConfirmed';

function Box() {

    const [method, setMethod] = useState('');
    const [otherMethod, setOtherMethod] = useState('');

    const [produto, setProduto] = useState([]);

    const [busca, setBusca] = useState('');

    const [showResults, setShowResults] = useState(false);

    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [carrinho, setCarrinho] = useState([]);

    const [confirm, setConfirm] = useState(false);
    const [confirmCompra, setConfirmCompra] = useState(false);

    const [troco, setTroco] = useState('');

    const [notification, setNotification] = useState(false);

    const [modalDiscount, setModalDiscount] = useState(false);

    const [desconto, setDesconto] = useState(0);

    const [compraConfirmada, setCompraConfirmada] = useState(false);

    const mostrarNotificacao = (mensagem, tipo) => {
        setNotification({ mensagem, tipo });

        salvarNotificacao(mensagem, tipo);

        setTimeout(() => {
            setNotification(null);
        }, 2500);
    };

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

    const adicionarAoCarrinho = () => {
        if (!produtoSelecionado) {
            mostrarNotificacao(
                'Erro, selecione um produto primeiro.',
                'error'
            )
            return;
        }

        const produtoExistente = carrinho.find(
            (item) => item.id === produtoSelecionado.id
        );

        if (produtoExistente) {
            setCarrinho(
                carrinho.map((item) =>
                    item.id === produtoSelecionado.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                )
            );
        } else {
            setCarrinho([
                ...carrinho,
                {
                    ...produtoSelecionado,
                    quantidade: 1
                }
            ]);

            mostrarNotificacao(
                'Produto adicionado ao carrinho!',
                'success'
            )
        }
    };

    const subTotal = carrinho.reduce((total, produto) => {
        return total + (
            Number(produto.preco_venda) * produto.quantidade
        );
    }, 0);

    const totalCarrinho = Math.max(
        0,
        subTotal - Number(desconto)
    );

    const quantidadeTotal = carrinho.reduce(
        (total, produto) => total + produto.quantidade,
        0
    );

    function confirmarCompra() {
        if(carrinho.length >= 1) {
            if(method !== "") {
                setCompraConfirmada(true);
            } else {
                mostrarNotificacao(
                    'Error... Selecione um método de pagamento para continuar!',
                    'error'
                )
            }
        } else {
            mostrarNotificacao(
                'Error... Adicione um produto ao carrinho para continuar!',
                'error'
            )
        }
    }

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

                            <div className={Styles.div_1}>
                                <div className={Styles.search}>
                                    <FiSearch />

                                    <input
                                        type="text"
                                        value={busca}
                                        onChange={(e) => {
                                            setBusca(e.target.value);
                                            setShowResults(true);
                                        }}
                                        placeholder="Digite o nome, sku ou código de barras"
                                        onFocus={() => setShowResults(true)}
                                        onBlur={() => setShowResults(false)}
                                    />

                                    <CiBarcode />

                                </div>

                                <div className={Styles.search_results}>
                                    {busca && showResults && (
                                        <div className={Styles.container_search_product}>
                                            <table>
                                                <tbody>
                                                    {produtosFiltrados.map((produto) => (
                                                        <tr key={produto.id} onMouseDown={(e) => {
                                                            setProdutoSelecionado(produto)
                                                            setBusca(produto.nome);
                                                            setShowResults(false);
                                                        }}>
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
                            </div>

                            <button
                                onClick={adicionarAoCarrinho}
                            >Adicionar ao Carrinho </button>

                        </div>
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
                                {carrinho.map((produto) => (
                                    <tr key={produto.id}>
                                        <td>
                                            <div className={Styles.product}>
                                                <div className={Styles.container_image}>
                                                    {
                                                        produto.imagem ?
                                                            <img src={produto.imagem} alt={produto.nome}></img> :
                                                            <FiImage />
                                                    }
                                                </div>

                                                {produto.nome}
                                            </div>
                                        </td>

                                        <td>
                                            R$ {Number(produto.preco_venda).toFixed(2)}
                                        </td>

                                        <td>
                                            <div className={Styles.qtd}>

                                                <button
                                                    className={Styles.menos}
                                                    onClick={() => {
                                                        setCarrinho(
                                                            carrinho
                                                                .map((item) =>
                                                                    item.id === produto.id
                                                                        ? {
                                                                            ...item,
                                                                            quantidade: item.quantidade - 1
                                                                        }
                                                                        : item
                                                                )
                                                                .filter((item) => item.quantidade > 0)
                                                        );
                                                    }}
                                                >
                                                    <FiMinus />
                                                </button>

                                                {produto.quantidade}

                                                <button
                                                    className={Styles.mais}
                                                    onClick={() => {
                                                        setCarrinho(
                                                            carrinho.map((item) =>
                                                                item.id === produto.id
                                                                    ? {
                                                                        ...item,
                                                                        quantidade: item.quantidade + 1
                                                                    }
                                                                    : item
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <FiPlus />
                                                </button>

                                            </div>
                                        </td>

                                        <td>
                                            R$ {
                                                (
                                                    Number(produto.preco_venda) *
                                                    produto.quantidade
                                                ).toFixed(2)
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={Styles.footer}>
                        <button onClick={() => {
                            setConfirm(true)
                        }}><FiTrash /> Limpar Carrinho</button>
                        <button onClick={() => setModalDiscount(true)}><FiTag /> Aplicar Desconto</button>
                        <button onClick={confirmarCompra}><FiCreditCard /> Finalizar Venda</button>
                    </div>
                </div>

                <div className={Styles.container_invoicing}>
                    <div className={Styles.summary}>
                        <div className={Styles.title}>
                            <h1>Resumo da Venda</h1>
                        </div>

                        <div className={Styles.infor}>
                            <p>SubTotal ({carrinho.length} {carrinho.length > 1 ? " Produtos" : " Produto"})</p>
                            <h2>R$ {subTotal.toFixed(2)}</h2>
                        </div>

                        <div className={Styles.infor}>
                            <p>Descontos</p>
                            <h2>R$ {Number(desconto).toFixed(2)}</h2>
                        </div>

                        <div className={Styles.inforTotal}>
                            <p>Total</p>
                            <h2>R$ {totalCarrinho.toFixed(2)}</h2>
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
                                    value={troco}
                                    onChange={(e) => setTroco(e.target.value)}
                                />
                                <label htmlFor='valorPago'>Troco de R$ {troco < 0 || troco > totalCarrinho ? (troco - totalCarrinho).toFixed(2) : '0.00'}</label>
                            </div>
                        )}

                        {method === "Outros" && (
                            <div className={Styles.selectOther}>
                                <input
                                    type='text'
                                    placeholder='Digite qual foi o metodo de pagamento...'
                                    id='otherMethod'
                                    value={otherMethod}
                                    onChange={(e) => setOtherMethod(e.target.value)}
                                />
                            </div>
                        )}

                        <div className={Styles.end}>
                            <button onClick={confirmarCompra}> <FiCreditCard /> Finalizar Venda </button>
                            <button className={Styles.button} onClick={() => setDesconto(0)}> <PiBroom /> Desconto </button>
                        </div>
                    </div>
                </div>
            </div>

            {modalDiscount && (
                <ModalDiscount
                    onAplicar={(valor) => {
                        setDesconto(valor);
                    }}
                    onResposta={(res) => {
                        setModalDiscount(res);
                    }}
                    total={totalCarrinho + Number(desconto)}
                />
            )}

            {confirm && (
                <ModalConfirm
                    mensagem='Deseja limpar o carrinho?'
                    onResposta={(resp) => {
                        if (resp == 'confirm') {
                            if (carrinho.length > 0) {
                                setCarrinho([]);
                                setConfirm(false);
                                mostrarNotificacao('Carrinho limpo com sucesso!', 'warning');
                                setDesconto(0)
                            } else {
                                mostrarNotificacao('Erro, nada adicionado ao carrinho!', 'error');
                                setConfirm(false);
                            }
                        } else {
                            setConfirm(false);
                        }
                    }}
                />
            )}

            {confirmCompra && (
                <ModalConfirm
                    mensagem="Deseja confirmar compra?"
                    onResposta={(res) => {
                        setConfirmCompra(false);

                        if (res === 'confirm') {
                            setCompraConfirmada(true);
                        }
                    }}
                />
            )}

            {compraConfirmada && (
                <CompraConfirmada
                    carrinho={carrinho}
                    quantidade_produto={quantidadeTotal}
                    sub_total={subTotal}
                    desconto={desconto}
                    total_compra={totalCarrinho}
                    metodo_compra={method}
                    outro_metodo_compra={otherMethod}
                    onFinish={() => {
                        setCompraConfirmada(false);
                        setCarrinho([]);
                        setDesconto(0);
                        setTroco('');
                        setMethod('');
                        setOtherMethod('');
                    }}
                />
            )}

            <Notifications notification={notification} />
        </section>
    );
}

export default Box;