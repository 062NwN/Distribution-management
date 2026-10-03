import { useState } from "react";
import { FiX, FiImage } from "react-icons/fi";

import Styles from './ModalNewProduct.module.css';

function ModalNewProduct({onClose}) {
    const [active, setActive] = useState(0);

    const [closing, setClosing] = useState(false);

    function handleClose() {
        setClosing(true);
    
        setTimeout(() => {
            onClose();
        }, 250);
    }

    const form = [
        'Informações básicas',
        'Detalhes',
        'Valores',
        'Estoque',
        'Fiscal',
        'Fornecimento',
        'Validade e Lote'
    ];

    function Identification() {
        const [image, setImage] = useState(null);

        function handleImage(e) {
            const file = e.target.files[0];

            if (file) {
                setImage(URL.createObjectURL(file));
            }
        }

        return (
            <form className={Styles.container_main}>
                <p>{form[0]}</p>

                <label htmlFor='image'>Selecione uma imagem:</label>
                <label className={Styles.uploadImage}>
                    {image ? (
                        <img src={image} alt="Preview do produto" />
                    ) : (
                        <FiImage />
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />
                </label>

                <label htmlFor='name'>Nome:</label>
                <input type='text' id='name' placeholder='Ex: Coca-Cola Original 2L' />

                <label htmlFor='sku'>SKU:</label>
                <input type='text' id='sku' placeholder='Ex: 001' />

                <label htmlFor='codebar'>Código de barras:</label>
                <input type='text' id='codebar' placeholder='Ex: 7901875487590' />

                <label htmlFor='descrition'>Descrição:</label>
                <textarea className={Styles.description} id='descrition' placeholder='Ex: Refrigerante de cola, 
                gaseificado e refrescante, com sabor característico da Coca-Cola' />
            </form>
        );
    }

    function Classification() {
        return (
            <form className={Styles.container_main}>
                <p>{form[1]}</p>

                <label htmlFor='marca'>Marca:</label>
                <input type='text' id='marca' placeholder='Ex: Coca-Cola' />

                <label htmlFor='category'>Categoria:</label>
                <input type='text' id='category' placeholder='Ex: Bebidas' />

                <label htmlFor='subcategory'>SubCategoria:</label>
                <input type='text' id='subcategory' placeholder='Ex: Refrigerantes' />

                <label htmlFor='unMedida'>Unidade de Medída:</label>
                <select name="unidade" id="unMedida">
                    <option value="">Selecione uma unidade de medida</option>
                    <option value="Un">UN</option>
                    <option value="Un">KG</option>
                    <option value="Un">CX</option>
                    <option value="Un">LT</option>
                    <option value="Un">FD</option>
                    <option value="Un">PCT</option>
                    <option value="Un">GF</option>
                </select>

                <label htmlFor='conversion'>Fator de Conversão:</label>
                <input type='text' id='conversion' placeholder='Ex: 12' />

                <label htmlFor='typeProduct'>Tipo de Produto:</label>
                <select name="typeProduct" id="typeProduct">
                    <option value="">Selecione um tipo de produto</option>
                    <option value="revenda">Produto para revenda</option>
                    <option value="consumo">Produto de consumo interno</option>
                    <option value="Materia">Matéria-prima</option>
                    <option value="Kit">Kit / Combo</option>
                    <option value="sobEncomenda">Produto sob encomenda</option>
                </select>

            </form>
        );
    }

    function Price() {
        return (
            <form className={Styles.container_main}>
                <p>{form[2]}</p>

                <label htmlFor='priceShop'>Preço de compra:</label>
                <input type='number' id='priceShop' placeholder='Ex: R$ 6.00' />

                <label htmlFor='priceAdd'>Custos adicionais:</label>
                <input type='number' id='priceAdd' placeholder='Ex: R$ 2.00' />

                <label htmlFor='priceSale'>Preço de Venda:</label>
                <input type='number' id='priceSale' placeholder='Ex: R$ 12.00' />

                <label htmlFor='pricePromotion'>Preço Promocional:</label>
                <input type='number' id='pricePromotion' placeholder='Ex: R$ 10.00' />

                <label htmlFor='cost'>Custo total:</label>
                <input type='text' id='cost' placeholder='Calculado Automaticamente' readOnly />

                <label htmlFor='margin'>Margem de lucro:</label>
                <input type='number' id='margin' placeholder='Calculado Automaticamente' readOnly />
            </form>
        );
    }

    function Stock() {
        return (
            <form className={Styles.container_main}>
                <p>{form[3]}</p>

                <label htmlFor='initial'>Estoque Inicial:</label>
                <input type='number' id='initial' placeholder='Ex: 12' />

                <label htmlFor='minimum'>Estoque Mínimo:</label>
                <input type='number' id='minimum' placeholder='Ex: 20' />

                <p className={Styles.lote}>{form[6]}</p>

                <label htmlFor='manufacturingDate'>Data de Fabricação:</label>
                <input
                    type='date'
                    id='manufacturingDate'
                />

                <label htmlFor='expiration'>Data de Validade:</label>
                <input
                    type='date'
                    id='expiration'
                />

                <label htmlFor='batch'>Lote:</label>
                <input
                    type='text'
                    id='batch'
                    placeholder='Ex: L20260915'
                />

            </form>

        );
    }

    function Tax() {
        return (
            <form className={Styles.container_main}>
                <p>{form[4]}</p>

                <label htmlFor='ncm'>NCM:</label>
                <input type='text' id='ncm' placeholder='Ex: 2202.10.00' />

                <label htmlFor='cest'>CEST:</label>
                <input type='text' id='cest' placeholder='Ex: 03.007.00' />

                <label htmlFor='origin'>Origem:</label>
                <input type='text' id='origin' placeholder='Ex: 0 - Nacional' />

                <label htmlFor='cfop'>CFOP:</label>
                <input type='text' id='cfop' placeholder='Ex: 5102' />

                <label htmlFor='cst'>CST:</label>
                <input type='text' id='cst' placeholder='Ex: 00' />

                <label htmlFor='csosn'>CSOSN:</label>
                <input type='text' id='csosn' placeholder='Ex: 102' />
            </form>
        );
    }

    function Control() {
        return (
            <form className={Styles.container_main}>
                <p>{form[5]}</p>

                <label htmlFor='supplier'>Fornecedor:</label>
                <select name="unidade" id="unMedida">
                    <option value="">Selecione um fornecedor</option>
                </select>

                <label htmlFor='minimumOrder'>Quantidade Mínima de Compra:</label>
                <input
                    type='number'
                    id='minimumOrder'
                    placeholder='Ex: 10'
                />

                <label htmlFor='purchaseUnit'>Unidade de Compra:</label>
                <select name="unidade" id="unMedida">
                    <option value="">Selecione uma unidade de compra</option>
                    <option value="Un">UN</option>
                    <option value="Un">KG</option>
                    <option value="Un">CX</option>
                    <option value="Un">LT</option>
                    <option value="Un">FD</option>
                    <option value="Un">PCT</option>
                    <option value="Un">GF</option>
                </select>

                <label htmlFor='purchaseConversion'>Quantidade por Unidade de Compra:</label>
                <input
                    type='number'
                    id='purchaseConversion'
                    placeholder='Ex: 12'
                />

                <label htmlFor='freight'>Frete:</label>
                <input
                    type='number'
                    id='freight'
                    placeholder='Ex: R$ 50,00'
                />

                <label htmlFor='paymentTerms'>Condição de Pagamento:</label>
                <input
                    type='text'
                    id='paymentTerms'
                    placeholder='Ex: 30 dias'
                />
            </form>
        );
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

                    {active === 0 && <Identification />}

                    {active === 1 && <Classification />}

                    {active === 2 && <Stock />}

                    {active === 3 && <Price />}

                    {active === 4 && <Tax />}

                    {active === 5 && <Control />}

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
                        className={Styles.continue}
                        onClick={() => {
                            if (active < 5) {
                                setActive(active + 1);
                            }
                        }}
                    >
                        {active < 5 ? 'Continuar' : 'Cadastrar'}
                    </button>
                </div>

            </section>

        </div>
    );
}

export default ModalNewProduct;