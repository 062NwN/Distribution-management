import { useState } from "react";
import { FiX } from "react-icons/fi";

import Styles from './ModalNewProduct.module.css';

function ModalNewProduct() {
    const [active, setActive] = useState(0);

    const form = [
        'Informações básicas',
        'Detalhes',
        'Controle Fiscal',
        'Estoque',
        'Fiscal',
        'Fornecimento',
        'Validade e Lote'
    ];
    
    function Identification() {
        return (
            <p>{form[0]}</p>
        );
    }

    function Classification() {
        return (
            <p>{form[1]}</p>
        );
    }

    return (
        <div className={Styles.bg}>

            <section className={Styles.container}>

                <article className={Styles.container_header}>

                    <div className={Styles.title}>
                        <h1>Novos Produtos</h1>

                        <button className={Styles.exit_container}>
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
                            <p>Preços</p>
                        </div>


                        <div
                            className={`${Styles.links} ${active === 3 ? Styles.active : ""
                                }`}
                            onClick={() => setActive(3)}
                        >
                            <p>Estoque</p>
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

                </div>

            </section>

        </div>
    );
}

export default ModalNewProduct;