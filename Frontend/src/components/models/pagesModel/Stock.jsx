import Styles from '../ModalNewProduct.module.css';

function Stock({ estoqueInicial, setEstoqueInicial, estoqueMinimo, setEstoqueMinimo, dataFabricacao, setDataFabricacao, dataValidade, setDataValidade, lote, setLote }) {

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
            <p>{form[3]}</p>

            <label htmlFor='initial'>Estoque Inicial:</label>
            <input type='number' id='initial' placeholder='Ex: 12' value={estoqueInicial} onChange={(e) => setEstoqueInicial(e.target.value)} />

            <label htmlFor='minimum'>Estoque Mínimo:</label>
            <input type='number' id='minimum' placeholder='Ex: 20' value={estoqueMinimo} onChange={(e) => setEstoqueMinimo(e.target.value)} />

            <p className={Styles.lote}>{form[6]}</p>

            <label htmlFor='manufacturingDate'>Data de Fabricação:</label>
            <input
                type='date'
                id='manufacturingDate'
                value={dataFabricacao}
                onChange={(e) => setDataFabricacao(e.target.value)}
                className={dataFabricacao ? Styles.dateFilled : Styles.dateEmpty}
            />

            <input
                type='date'
                id='expiration'
                value={dataValidade}
                onChange={(e) => setDataValidade(e.target.value)}
                className={dataValidade ? Styles.dateFilled : Styles.dateEmpty}
            />

            <label htmlFor='batch'>Lote:</label>
            <input
                type='text'
                id='batch'
                placeholder='Ex: L20260915'
                value={lote}
                onChange={(e) => setLote(e.target.value)}
            />

        </form>

    );
}

export default Stock;