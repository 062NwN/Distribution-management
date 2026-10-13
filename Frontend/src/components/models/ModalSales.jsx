import Styles from "./ModalSales.module.css";

function ModalSales({ id_venda, produto_venda = [], onClose }) {
  return (
    <div className={Styles.bg}>
      <section className={Styles.container_page}>
        <setion className={Styles.container}>
          <div className={Styles.nav}>
            <div className={Styles.id_venda}>{id_venda}</div>
          </div>

          <button onClick={onClose}>Fechar</button>

          {produto_venda.map((p) => (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>produto nome</th>
                  <th>valor de venda</th>
                  <th>quantidade</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.preco_venda}</td>
                  <td>{p.quantidade}</td>
                </tr>
              </tbody>
            </table>
          ))}
        </setion>
      </section>
    </div>
  );
}

export default ModalSales;
