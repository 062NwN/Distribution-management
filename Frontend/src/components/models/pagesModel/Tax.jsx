import Styles from '../ModalNewProduct.module.css';

function Tax({ ncm, setNcm, cest, setCest, origin, setOrigin, cfop, setCfop, cst, setCst, csosn, setCsosn }) {
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
            <p>{form[4]}</p>

            <label htmlFor='ncm'>NCM:</label>
            <input type='text' id='ncm' placeholder='Ex: 2202.10.00' value={ncm} onChange={(e) => setNcm(e.target.value)} />

            <label htmlFor='cest'>CEST:</label>
            <input type='text' id='cest' placeholder='Ex: 03.007.00' value={cest} onChange={(e) => setCest(e.target.value)} />

            <label htmlFor='origin'>Origem:</label>
            <input type='text' id='origin' placeholder='Ex: 0 - Nacional' value={origin} onChange={(e) => setOrigin(e.target.value)} />

            <label htmlFor='cfop'>CFOP:</label>
            <input type='text' id='cfop' placeholder='Ex: 5102' value={cfop} onChange={(e) => setCfop(e.target.value)} />

            <label htmlFor='cst'>CST:</label>
            <input type='text' id='cst' placeholder='Ex: 00' value={cst} onChange={(e) => setCst(e.target.value)} />

            <label htmlFor='csosn'>CSOSN:</label>
            <input type='text' id='csosn' placeholder='Ex: 102' value={csosn} onChange={(e) => setCsosn(e.target.value)} />
        </form>
    );
}

export default Tax;