import { FiCalendar } from "react-icons/fi";

import Styles from "../pages_css/Shop.module.css";

function Shop() {
  const date = new Date();

  const dataFormatada = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section className={Styles.container}>
      <article className={Styles.container_main}>
        <div className={Styles.container_header}>
          <div className={Styles.title}>
            <h1>Compras de Produtos</h1>
            <p>Adicione compras de produtos e gerencie fornecedores.</p>
          </div>

          <div className={Styles.date}>
            <FiCalendar /> {dataFormatada}
          </div>
        </div>

        <div className={Styles.container_main_shop}>
          <div className={Styles.container_shopping}></div>
           <div className={Styles.container_supplier}></div>
        </div>
      </article>
    </section>
  );
}

export default Shop;
