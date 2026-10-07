import Styles from '../ModalNewProduct.module.css';

function Price({ precoCoompra, precoAdicional, precoVenda, precoPromocional, setPrecoCompra, setPrecoAdicional, setPrecoVenda, setPrecoPromocional }) {

    const form = [
        'Informações básicas',
        'Detalhes',
        'Valores',
        'Estoque',
        'Fiscal',
        'Fornecimento',
        'Validade e Lote'
    ];

    function calcularCustoTotal() {
        return parseFloat(precoCoompra || 0) + parseFloat(precoAdicional || 0);
    }

    function calcularMargemLucro() {
        const custoTotal = calcularCustoTotal();
        const precoVendaNum = parseFloat(precoVenda || 0);

        if (custoTotal === 0 || precoVendaNum === 0) {
            return 0;
        }

        const margem = (((precoVendaNum - custoTotal) / precoVendaNum) * 100).toFixed(2);

        console.log("Custo Total:", custoTotal);
        console.log("Preço de Venda:", precoVendaNum);
        console.log("Margem de Lucro:", margem);

        return margem;
    }

    const margemLucroCalculada = calcularMargemLucro();

    const newMargemLucro = `${margemLucroCalculada}%`;

    const custoTotalCalculado = calcularCustoTotal();

    const newCustoTotalCalculado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(custoTotalCalculado);

    return (
        <form className={Styles.container_main}>
            <p>{form[2]}</p>

            <label htmlFor='priceShop'>Preço de compra:</label>
            <input type='number' id='priceShop' placeholder='Ex: R$ 6.00' value={precoCoompra} onChange={(e) => setPrecoCompra(e.target.value)} />

            <label htmlFor='priceAdd'>Custos adicionais:</label>
            <input type='number' id='priceAdd' placeholder='Ex: R$ 2.00' value={precoAdicional} onChange={(e) => setPrecoAdicional(e.target.value)} />

            <label htmlFor='priceSale'>Preço de Venda:</label>
            <input type='number' id='priceSale' placeholder='Ex: R$ 12.00' value={precoVenda} onChange={(e) => setPrecoVenda(e.target.value)} />

            <label htmlFor='pricePromotion'>Preço Promocional:</label>
            <input type='number' id='pricePromotion' placeholder='Ex: R$ 10.00' value={precoPromocional} onChange={(e) => setPrecoPromocional(e.target.value)} />

            <label htmlFor='cost'>Custo total:</label>
            <input type='text' id='cost' placeholder='Calculado Automaticamente' value={newCustoTotalCalculado} readOnly />

            <label htmlFor='margin'>Margem de lucro:</label>
            <input type='text' id='margin' placeholder='Calculado Automaticamente' value={newMargemLucro} readOnly />
        </form>
    );
}

export default Price;