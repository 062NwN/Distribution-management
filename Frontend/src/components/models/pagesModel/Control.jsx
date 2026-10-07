import Styles from '../ModalNewProduct.module.css';

import Select from './Select';

function Control({ fornecedores, fornecedor, setFornecedor, qtdMinimaCP, unMedidaCP, setQtdMinimaCP, qtdUnCompra, setQtdUnCompra, frete, setFrete, condicaoPagamento, setCondicaoPagamento, unidadeMedidaCP, setUnidadeMedidaCP }) {
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
            <p>{form[5]}</p>

            <Select className={Styles.typeProduct} name='fornecedor' text='Selecione um Fornecedor' options={fornecedores} atribute="fornecedor" value={fornecedor} handleOnChange={(e) => setFornecedor(e.target.value)} />

            <label htmlFor='minimumOrder'>Quantidade Mínima de Compra:</label>
            <input
                type='number'
                id='minimumOrder'
                placeholder='Ex: 10'
                value={qtdMinimaCP}
                onChange={(e) => setQtdMinimaCP(e.target.value)}
            />

            <Select className={Styles.typeProduct} name='un_medida' text='Unidade de Compra:' options={unMedidaCP} atribute="medida" value={unidadeMedidaCP} handleOnChange={(e) => setUnidadeMedidaCP(e.target.value)} />

            <label htmlFor='purchaseConversion'>Quantidade por Unidade de Compra:</label>
            <input
                type='number'
                id='purchaseConversion'
                placeholder='Ex: 12'
                value={qtdUnCompra}
                onChange={(e) => setQtdUnCompra(e.target.value)}
            />

            <label htmlFor='freight'>Frete:</label>
            <input
                type='number'
                id='freight'
                placeholder='Ex: R$ 50,00'
                value={frete}
                onChange={(e) => setFrete(e.target.value)}
            />

            <label htmlFor='paymentTerms'>Condição de Pagamento:</label>
            <input
                type='text'
                id='paymentTerms'
                placeholder='Ex: 30 dias'
                value={condicaoPagamento}
                onChange={(e) => setCondicaoPagamento(e.target.value)}
            />
        </form>
    );
}

export default Control;