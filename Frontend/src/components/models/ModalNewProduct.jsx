import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

import Styles from './ModalNewProduct.module.css';

//PAGES
import Identification from './pagesModel/Indentification';
import Classification from './pagesModel/Classification';
import Price from './pagesModel/Price';
import Stock from './pagesModel/Stock';
import Tax from './pagesModel/Tax';
import Control from './pagesModel/Control';

import Loading from '../Loading';

function ModalNewProduct({ onClose, onProductCreated }) {
    const salvando = useRef(false);

    const [active, setActive] = useState(0);

    const [closing, setClosing] = useState(false);

    //VARIABEIS DO PRODUTO IDENTIFICACAO
    const [image, setImage] = useState(null);
    const [nome, setNome] = useState("");
    const [sku, setSKU] = useState("");
    const [codeBar, setCodeBar] = useState("");
    const [description, setDescription] = useState("");

    //CLASSIFICAÇÃO
    const [marca, setMarca] = useState("");
    const [categoria, setCategoria] = useState("");
    const [subCategoria, setSubCategoria] = useState("");
    const [unMedidaVD, setUnMedidaVD] = useState([]);
    const [fatorConversao, setFatorConversao] = useState("");
    const [tipoProduto, setTipoProduto] = useState([]);

    const [unidadeMedidaVD, setUnidadeMedidaVD] = useState("");
    const [typeProduct, setTypeProduct] = useState("");

    //ESTOQUE
    const [estoqueInicial, setEstoqueInicial] = useState("");
    const [estoqueMinimo, setEstoqueMinimo] = useState("");
    const [dataFabricacao, setDataFabricacao] = useState("");
    const [dataValidade, setDataValidade] = useState("");
    const [lote, setLote] = useState("");

    //VALORES
    const [precoCoompra, setPrecoCompra] = useState("");
    const [precoAdicional, setPrecoAdicional] = useState("");
    const [precoVenda, setPrecoVenda] = useState("");
    const [precoPromocional, setPrecoPromocional] = useState("");

    //FISCAL
    const [ncm, setNcm] = useState("");
    const [cest, setCest] = useState("");
    const [origin, setOrigin] = useState("");
    const [cfop, setCfop] = useState("");
    const [cst, setCst] = useState("");
    const [csosn, setCsosn] = useState("");

    //CONTROLE
    const [fornecedores, setFornecedores] = useState([]);
    const [fornecedor, setFornecedor] = useState("");
    const [qtdMinimaCP, setQtdMinimaCP] = useState("");
    const [unMedidaCP, setunMedidaCP] = useState([]);
    const [qtdUnCompra, setQtdUnCompra] = useState("");
    const [frete, setFrete] = useState("");
    const [condicaoPagamento, setCondicaoPagamento] = useState("");


    const [unidadeMedidaCP, setUnidadeMedidaCP] = useState("");

    const [loading, setLoading] = useState(false);

    function handleClose() {
        setClosing(true);

        setTimeout(() => {
            onClose();
        }, 250);
    }

    useEffect(() => {
        fetch("http://localhost:8081/cadastros/unMedidaVD")
            .then((resp) => resp.json())
            .then((data) => {
                setUnMedidaVD(data);
            })
            .catch((err) => console.log(err));

        fetch("http://localhost:8081/cadastros/unMedidaCP")
            .then((resp) => resp.json())
            .then((data) => {
                setunMedidaCP(data);
            })
            .catch((err) => console.log(err));

        fetch("http://localhost:8081/cadastros/tipoProduto")
            .then((resp) => resp.json())
            .then((data) => {
                setTipoProduto(data);
            })
            .catch((err) => console.log(err));

        fetch("http://localhost:8081/cadastros/setFornecedor")
            .then((resp) => resp.json())
            .then((data) => {
                setFornecedores(data);
            })
            .catch((err) => console.log(err));
    }, []);

    async function newProduct() {

        const custoTotal =
            parseFloat(precoCoompra || 0) +
            parseFloat(precoAdicional || 0);

        const precoVendaNum = parseFloat(precoVenda || 0);

        const margemLucro =
            custoTotal === 0 || precoVendaNum === 0
                ? 0
                : ((precoVendaNum - custoTotal) / precoVendaNum) * 100;

        try {
            const response = await fetch("http://localhost:8081/produtos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    imagem: image,
                    nome: nome.toUpperCase(),
                    sku: sku,
                    codigo_barras: codeBar,
                    descricao: description,

                    marca: marca.toUpperCase(),
                    categoria: categoria.toUpperCase(),
                    subcategoria: subCategoria.toUpperCase(),
                    unidade_medida: unidadeMedidaVD,
                    fator_conversao: fatorConversao,
                    tipo_produto: typeProduct,

                    estoque_inicial: estoqueInicial,
                    estoque_minimo: estoqueMinimo,
                    data_fabricacao: dataFabricacao,
                    data_validade: dataValidade,
                    lote: lote,

                    preco_compra: precoCoompra,
                    preco_adicional: precoAdicional,
                    preco_venda: precoVenda,
                    preco_promocional: precoPromocional,
                    custo_total: custoTotal,
                    margem_lucro: margemLucro,

                    ncm: ncm,
                    cest: cest,
                    origem: origin,
                    cfop: cfop,
                    cst: cst,
                    csosn: csosn,

                    fornecedor: fornecedor,
                    quantidade_minima_compra: qtdMinimaCP,
                    unidade_medida_compra: unidadeMedidaCP,
                    quantidade_unidade_compra: qtdUnCompra,
                    frete: frete,
                    condicao_pagamento: condicaoPagamento
                })
            });

            const novoProduto = await response.json();

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            onProductCreated(novoProduto);

            return true;

        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);

            return false;
        }
    }

    return (

        <div className={`${Styles.bg} ${closing ? Styles.closing : ''}`}>

            <section className={Styles.container}>

                <article className={Styles.container_header}>

                    <div className={Styles.title}>
                        <h1>Novos Produtos</h1>

                        <button className={Styles.exit_container}
                            onClick={handleClose}>
                            <FiX />
                        </button>
                    </div>


                    <div className={Styles.container_menu}>

                        <div
                            className={`${Styles.links} ${active === 0 ? Styles.active : ""
                                }`}
                            onClick={() => setActive(0)}
                        >
                            <p>Identificação</p>
                        </div>


                        <div
                            className={`${Styles.links} ${active === 1 ? Styles.active : ""
                                }`}
                            onClick={() => setActive(1)}
                        >
                            <p>Classificação</p>
                        </div>

                        <div
                            className={`${Styles.links} ${active === 2 ? Styles.active : ""
                                }`}
                            onClick={() => setActive(2)}
                        >
                            <p>Estoque</p>
                        </div>

                        <div
                            className={`${Styles.links} ${active === 3 ? Styles.active : ""
                                }`}
                            onClick={() => setActive(3)}
                        >
                            <p>Preços</p>
                        </div>


                        <div
                            className={`${Styles.links} ${active === 4 ? Styles.active : ""
                                }`}
                            onClick={() => setActive(4)}
                        >
                            <p>Fiscal</p>
                        </div>


                        <div
                            className={`${Styles.links} ${active === 5 ? Styles.active : ""
                                }`}
                            onClick={() => setActive(5)}
                        >
                            <p>Controle</p>
                        </div>

                    </div>

                </article>

                <div className={Styles.content}>

                    {active === 0 && <Identification
                        image={image}
                        setImage={setImage}
                        nome={nome}
                        setNome={setNome}
                        sku={sku}
                        setSKU={setSKU}
                        codeBar={codeBar}
                        setCodeBar={setCodeBar}
                        description={description}
                        setDescription={setDescription}
                    />}

                    {active === 1 && <Classification
                        marca={marca}
                        setMarca={setMarca}
                        categoria={categoria}
                        setCategoria={setCategoria}
                        subCategoria={subCategoria}
                        setSubCategoria={setSubCategoria}
                        unMedidaVD={unMedidaVD}
                        fatorConversao={fatorConversao}
                        setFatorConversao={setFatorConversao}
                        tipoProduto={tipoProduto}
                        unidadeMedidaVD={unidadeMedidaVD}
                        setUnidadeMedidaVD={setUnidadeMedidaVD}
                        typeProduct={typeProduct}
                        setTypeProduct={setTypeProduct}
                    />}

                    {active === 2 && <Stock
                        estoqueInicial={estoqueInicial}
                        setEstoqueInicial={setEstoqueInicial}
                        estoqueMinimo={estoqueMinimo}
                        setEstoqueMinimo={setEstoqueMinimo}
                        dataFabricacao={dataFabricacao}
                        setDataFabricacao={setDataFabricacao}
                        dataValidade={dataValidade}
                        setDataValidade={setDataValidade}
                        lote={lote}
                        setLote={setLote}
                    />}

                    {active === 3 && <Price
                        precoCoompra={precoCoompra}
                        setPrecoCompra={setPrecoCompra}
                        precoAdicional={precoAdicional}
                        setPrecoAdicional={setPrecoAdicional}
                        precoVenda={precoVenda}
                        setPrecoVenda={setPrecoVenda}
                        precoPromocional={precoPromocional}
                        setPrecoPromocional={setPrecoPromocional}
                    />}

                    {active === 4 && <Tax
                        ncm={ncm}
                        setNcm={setNcm}
                        cest={cest}
                        setCest={setCest}
                        origin={origin}
                        setOrigin={setOrigin}
                        cfop={cfop}
                        setCfop={setCfop}
                        cst={cst}
                        setCst={setCst}
                        csosn={csosn}
                        setCsosn={setCsosn}
                    />}

                    {active === 5 && <Control
                        fornecedores={fornecedores}
                        qtdMinimaCP={qtdMinimaCP}
                        unMedidaCP={unMedidaCP}
                        setQtdMinimaCP={setQtdMinimaCP}
                        qtdUnCompra={qtdUnCompra}
                        setQtdUnCompra={setQtdUnCompra}
                        frete={frete}
                        setFrete={setFrete}
                        condicaoPagamento={condicaoPagamento}
                        setCondicaoPagamento={setCondicaoPagamento}
                        setUnidadeMedidaCP={setUnidadeMedidaCP}
                        unidadeMedidaCP={unidadeMedidaCP}
                        fornecedor={fornecedor}
                        setFornecedor={setFornecedor}
                    />}

                </div>

                <div className={Styles.footer}>
                    {active > 0 && (
                        <button
                            className={Styles.back}
                            onClick={() => setActive(active - 1)}
                        >
                            Voltar
                        </button>
                    )}

                    <button
                        type="button"
                        className={Styles.continue}
                        disabled={loading}
                        onClick={async (event) => {
                            event.preventDefault();

                            if (active < 5) {
                                setActive((prev) => prev + 1);
                                return;
                            }

                            if (salvando.current) {
                                console.warn("Cadastro já está em andamento.");
                                return;
                            }

                            salvando.current = true;
                            setLoading(true);

                            try {
                                const cadastrado = await newProduct();

                                if (cadastrado) {
                                    handleClose();
                                } else {
                                    salvando.current = false;
                                }
                            } catch (error) {
                                console.error("Erro ao cadastrar:", error);
                                salvando.current = false;
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        {loading
                            ? "Cadastrando..."
                            : active < 5
                                ? "Continuar"
                                : "Cadastrar"}
                    </button>
                </div>

            </section>

            {loading && (
                <Loading />
            )}

        </div>
    );
}

export default ModalNewProduct;