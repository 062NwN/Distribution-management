import { useState } from "react";
import { FiX, FiImage } from "react-icons/fi";
import Styles from "./ModalEditProduct.module.css";

function ModalEditProduct({ produto, onClose, onSave }) {
    const [closing, setClosing] = useState(false);

    const [imagem, setImagem] = useState(produto?.imagem ?? "");
    const [status, setStatus] = useState(produto?.status ?? "ativo");
    const [nome, setNome] = useState(produto?.nome ?? "");
    const [descricao, setDescricao] = useState(produto?.descricao ?? "");
    const [marca, setMarca] = useState(produto?.marca ?? "");
    const [categoria, setCategoria] = useState(produto?.categoria ?? "");
    const [subcategoria, setSubcategoria] = useState(produto?.subcategoria ?? "");
    const [fatorConversao, setFatorConversao] = useState(produto?.fator_conversao ?? "");
    const [estoqueMinimo, setEstoqueMinimo] = useState(produto?.estoque_minimo ?? "");

    const [precoCompra, setPrecoCompra] = useState(produto?.preco_compra ?? "");
    const [precoAdicional, setPrecoAdicional] = useState(produto?.preco_adicional ?? "");
    const [precoVenda, setPrecoVenda] = useState(produto?.preco_venda ?? "");
    const [precoPromocional, setPrecoPromocional] = useState(produto?.preco_promocional ?? "");

    const [ncm, setNcm] = useState(produto?.ncm ?? "");
    const [cest, setCest] = useState(produto?.cest ?? "");
    const [origem, setOrigem] = useState(produto?.origem ?? "");
    const [cfop, setCfop] = useState(produto?.cfop ?? "");
    const [cst, setCst] = useState(produto?.cst ?? "");
    const [csosn, setCsosn] = useState(produto?.csosn ?? "");

    const [quantidadeMinimaCompra, setQuantidadeMinimaCompra] =
        useState(produto?.quantidade_minima_compra ?? "");

    const [quantidadeUnidadeCompra, setQuantidadeUnidadeCompra] =
        useState(produto?.quantidade_unidade_compra ?? "");

    const [frete, setFrete] = useState(produto?.frete ?? "");
    const [condicaoPagamento, setCondicaoPagamento] =
        useState(produto?.condicao_pagamento ?? "");

    function handleImage(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const maxWidth = 400;
                const maxHeight = 400;

                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                let quality = 0.7;
                let compressedImage = canvas.toDataURL("image/jpeg", quality);

                while (compressedImage.length > 80000 && quality > 0.1) {
                    quality -= 0.1;
                    compressedImage = canvas.toDataURL("image/jpeg", quality);
                }

                setImagem(compressedImage);
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }

    function handleClose() {
        setClosing(true);
        setTimeout(() => onClose(), 250);
    }

    async function handleSave() {
        const custoTotal =
            Number(precoCompra || 0) + Number(precoAdicional || 0);

        const margemLucro =
            Number(precoVenda) > 0
                ? ((Number(precoVenda) - custoTotal) / Number(precoVenda)) * 100
                : 0;

        const produtoAtualizado = {
            ...produto,

            imagem,
            nome,
            descricao,
            status,

            marca,
            categoria,
            subcategoria,
            fator_conversao: fatorConversao,

            estoque_minimo: estoqueMinimo,

            preco_compra: precoCompra,
            preco_adicional: precoAdicional,
            preco_venda: precoVenda,
            preco_promocional: precoPromocional,
            custo_total: custoTotal,
            margem_lucro: Number(margemLucro.toFixed(2)),

            ncm,
            cest,
            origem,
            cfop,
            cst,
            csosn,

            quantidade_minima_compra: quantidadeMinimaCompra,
            quantidade_unidade_compra: quantidadeUnidadeCompra,
            frete,
            condicao_pagamento: condicaoPagamento,

            data_alteracao: new Date().toISOString()
        };

        if (onSave) {
            await onSave(produtoAtualizado);
        }
    }

    return (
        <div className={`${Styles.bg} ${closing ? Styles.closing : ""}`}>
            <section className={Styles.container}>

                <header className={Styles.header}>
                    <div>
                        <h1>Editar produto</h1>
                        <p>Altere as informações do produto</p>
                    </div>

                    <button
                        type="button"
                        className={Styles.close}
                        onClick={handleClose}
                    >
                        <FiX />
                    </button>
                </header>

                <div className={Styles.content}>

                    <div className={Styles.section}>
                        <h2>Informações básicas</h2>

                        <div className={Styles.imageArea}>
                            <label htmlFor="productImage" className={Styles.uploadImage}>
                                {imagem ? <img src={imagem} alt="Produto" /> : <FiImage />}

                                <input
                                    id="productImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                />
                            </label>

                            <div className={Styles.imageInfo}>
                                <strong>Imagem do produto</strong>
                                <span>Clique para alterar a imagem</span>

                                <label className={Styles.activeProduct}>
                                    <input
                                        type="checkbox"
                                        checked={status === "ativo"}
                                        onChange={(e) => setStatus(e.target.checked ? "ativo" : "inativo")}
                                    />
                                    Produto ativo
                                </label>
                            </div>
                        </div>

                        <div className={Styles.field}>
                            <label htmlFor="nome">Nome</label>
                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                placeholder="Ex: Coca-Cola Original 2L"
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div className={Styles.field}>
                            <label htmlFor="descricao">Descrição</label>
                            <textarea
                                id="descricao"
                                value={descricao}
                                placeholder="Descrição do produto"
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={Styles.section}>
                        <h2>Classificação</h2>

                        <div className={Styles.grid}>
                            <div className={Styles.field}>
                                <label htmlFor="marca">Marca</label>
                                <input
                                    id="marca"
                                    type="text"
                                    value={marca}
                                    placeholder="Ex: Coca-Cola"
                                    onChange={(e) => setMarca(e.target.value)}
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="categoria">Categoria</label>
                                <input
                                    id="categoria"
                                    type="text"
                                    value={categoria}
                                    placeholder="Ex: Bebidas"
                                    onChange={(e) => setCategoria(e.target.value)}
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="subcategoria">Subcategoria</label>
                                <input
                                    id="subcategoria"
                                    type="text"
                                    value={subcategoria}
                                    placeholder="Ex: Refrigerantes"
                                    onChange={(e) => setSubcategoria(e.target.value)}
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="fatorConversao">
                                    Fator de conversão
                                </label>
                                <input
                                    id="fatorConversao"
                                    type="number"
                                    min="0"
                                    value={fatorConversao}
                                    placeholder="Ex: 12"
                                    onChange={(e) =>
                                        setFatorConversao(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className={Styles.section}>
                        <h2>Estoque</h2>

                        <div className={Styles.field}>
                            <label htmlFor="estoqueMinimo">
                                Estoque mínimo
                            </label>
                            <input
                                id="estoqueMinimo"
                                type="number"
                                min="0"
                                value={estoqueMinimo}
                                placeholder="Ex: 10"
                                onChange={(e) =>
                                    setEstoqueMinimo(e.target.value)
                                }
                            />
                            <small>O estoque atual não é alterado aqui.</small>
                        </div>
                    </div>

                    <div className={Styles.section}>
                        <h2>Preços</h2>

                        <div className={Styles.grid}>
                            <div className={Styles.field}>
                                <label htmlFor="precoCompra">
                                    Preço de compra
                                </label>
                                <input
                                    id="precoCompra"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={precoCompra}
                                    placeholder="Ex: 6.00"
                                    onChange={(e) =>
                                        setPrecoCompra(e.target.value)
                                    }
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="precoAdicional">
                                    Preço adicional
                                </label>
                                <input
                                    id="precoAdicional"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={precoAdicional}
                                    placeholder="Ex: 2.00"
                                    onChange={(e) =>
                                        setPrecoAdicional(e.target.value)
                                    }
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="precoVenda">
                                    Preço de venda
                                </label>
                                <input
                                    id="precoVenda"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={precoVenda}
                                    placeholder="Ex: 12.00"
                                    onChange={(e) =>
                                        setPrecoVenda(e.target.value)
                                    }
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="precoPromocional">
                                    Preço promocional
                                </label>
                                <input
                                    id="precoPromocional"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={precoPromocional}
                                    placeholder="Ex: 10.00"
                                    onChange={(e) =>
                                        setPrecoPromocional(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className={Styles.section}>
                        <h2>Informações fiscais</h2>

                        <div className={Styles.grid}>
                            <div className={Styles.field}>
                                <label htmlFor="ncm">NCM</label>
                                <input
                                    id="ncm"
                                    type="text"
                                    value={ncm}
                                    placeholder="Ex: 22021000"
                                    onChange={(e) => setNcm(e.target.value)}
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="cest">CEST</label>
                                <input
                                    id="cest"
                                    type="text"
                                    value={cest}
                                    placeholder="Ex: 0300100"
                                    onChange={(e) => setCest(e.target.value)}
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="origem">Origem</label>
                                <select
                                    id="origem"
                                    value={origem}
                                    onChange={(e) => setOrigem(e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    <option value="0">0 - Nacional</option>
                                    <option value="1">1 - Estrangeira</option>
                                </select>
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="cfop">CFOP</label>
                                <input
                                    id="cfop"
                                    type="text"
                                    value={cfop}
                                    placeholder="Ex: 5102"
                                    onChange={(e) => setCfop(e.target.value)}
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="cst">CST</label>
                                <input
                                    id="cst"
                                    type="text"
                                    value={cst}
                                    placeholder="Ex: 00"
                                    onChange={(e) => setCst(e.target.value)}
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="csosn">CSOSN</label>
                                <input
                                    id="csosn"
                                    type="text"
                                    value={csosn}
                                    placeholder="Ex: 102"
                                    onChange={(e) => setCsosn(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={Styles.section}>
                        <h2>Fornecimento</h2>

                        <div className={Styles.grid}>
                            <div className={Styles.field}>
                                <label htmlFor="quantidadeMinimaCompra">
                                    Quantidade mínima de compra
                                </label>
                                <input
                                    id="quantidadeMinimaCompra"
                                    type="number"
                                    min="0"
                                    value={quantidadeMinimaCompra}
                                    placeholder="Ex: 10"
                                    onChange={(e) =>
                                        setQuantidadeMinimaCompra(e.target.value)
                                    }
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="quantidadeUnidadeCompra">
                                    Quantidade por unidade
                                </label>
                                <input
                                    id="quantidadeUnidadeCompra"
                                    type="number"
                                    min="0"
                                    value={quantidadeUnidadeCompra}
                                    placeholder="Ex: 12"
                                    onChange={(e) =>
                                        setQuantidadeUnidadeCompra(e.target.value)
                                    }
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="frete">Frete</label>
                                <input
                                    id="frete"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={frete}
                                    placeholder="Ex: 50.00"
                                    onChange={(e) => setFrete(e.target.value)}
                                />
                            </div>

                            <div className={Styles.field}>
                                <label htmlFor="condicaoPagamento">
                                    Condição de pagamento
                                </label>
                                <input
                                    id="condicaoPagamento"
                                    type="text"
                                    value={condicaoPagamento}
                                    placeholder="Ex: 30 dias"
                                    onChange={(e) =>
                                        setCondicaoPagamento(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <footer className={Styles.footer}>
                    <button
                        type="button"
                        className={Styles.cancel}
                        onClick={handleClose}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className={Styles.save}
                        onClick={handleSave}
                    >
                        Salvar alterações
                    </button>
                </footer>

            </section>
        </div>
    );
}

export default ModalEditProduct;