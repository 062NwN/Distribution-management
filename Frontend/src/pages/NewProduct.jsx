import { FiCalendar, FiBell, FiBox } from "react-icons/fi";

import Styles from '../pages_css/NewProduct.module.css';

function NewProduct() {
    const date = new Date();

    const dataFormatada = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return (
        <section className={Styles.container}>
            <article className={Styles.header}>
                <div className={Styles.title}>
                    <h1>Produtos</h1>
                    <p>Visão geral dos seus produtos.</p>
                </div>

                <div className={Styles.date}>
                    <p><FiCalendar /> {dataFormatada}</p>
                    <h4><FiBell /></h4>
                </div>
            </article>

            <article className={Styles.cards_main}>
                <div className={Styles.cards}>
                    <div className={Styles.cards_svg}>
                        <FiBox />
                    </div>
                    <div className={Styles.cards_infor}>
                        <h4 className={Styles.cards_title}>Produtos Cadastrados</h4>
                        <h3 className={Styles.cards_value}>0</h3>
                    </div>
                </div>

                <div className={Styles.cards}>
                    <div className={Styles.cards_svg}>
                        <FiBox />
                    </div>
                    <div className={Styles.cards_infor}>
                        <h4 className={Styles.cards_title}>Produtos Ativos</h4>
                        <h3 className={Styles.cards_value}>0</h3>
                    </div>
                </div>

                <div className={Styles.cards}>
                    <div className={Styles.cards_svg}>
                        <FiBox />
                    </div>
                    <div className={Styles.cards_infor}>
                        <h4 className={Styles.cards_title}>Estoque Baixo</h4>
                        <h3 className={Styles.cards_value}>0</h3>
                    </div>
                </div>

                <div className={Styles.cards}>
                    <div className={Styles.cards_svg}>
                        <FiBox />
                    </div>
                    <div className={Styles.cards_infor}>
                        <h4 className={Styles.cards_title}>Produtos Esgotados </h4>
                        <h3 className={Styles.cards_value}>0</h3>
                    </div>
                </div>
            </article>
        </section>
    )
}

export default NewProduct;