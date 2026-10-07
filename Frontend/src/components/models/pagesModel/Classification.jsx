import Styles from '../ModalNewProduct.module.css';

import Select from './Select';

function Classification({ marca, setMarca, categoria, setCategoria, subCategoria, setSubCategoria, unMedidaVD, fatorConversao, setFatorConversao, tipoProduto, unidadeMedidaVD, setUnidadeMedidaVD, typeProduct, setTypeProduct }) {
    const form = [
        'Informações básicas',
        'Detalhes',
        'Valores',
        'Estoque',
        'Fiscal',
        'Fornecimento',
        'Validade e Lote'
    ];

    return (
        <form className={Styles.container_main}>
            <p>{form[1]}</p>

            <label htmlFor='marca'>Marca:</label>
            <input type='text' id='marca' placeholder='Ex: Coca-Cola' value={marca} onChange={(e) => setMarca(e.target.value)} />

            <label htmlFor='category'>Categoria:</label>
            <input type='text' id='category' placeholder='Ex: Bebidas' value={categoria} onChange={(e) => setCategoria(e.target.value)} />

            <label htmlFor='subcategory'>SubCategoria:</label>
            <input type='text' id='subcategory' placeholder='Ex: Refrigerantes' value={subCategoria} onChange={(e) => setSubCategoria(e.target.value)} />

            <Select
                className={Styles.typeProduct}
                name='un_medida'
                text='Selecione a Unidade de Medida'
                options={unMedidaVD} atribute="medida"
                value={unidadeMedidaVD}
                handleOnChange={(e) => setUnidadeMedidaVD(e.target.value)}
            />

            <label htmlFor='conversion'>Fator de Conversão:</label>
            <input type='text' id='conversion' placeholder='Ex: 12' value={fatorConversao} onChange={(e) => setFatorConversao(e.target.value)} />

            <Select
                className={Styles.typeProduct}
                name='tipoProduct'
                text='Tipo de Produto'
                options={tipoProduto}
                atribute="tipoDoProduto"
                value={typeProduct}
                handleOnChange={(e) => setTypeProduct(e.target.value)}
            />

        </form>
    );
}

export default Classification;