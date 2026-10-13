import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import Styles from "./ModalSales.module.css";

function ModalSales({
  id_venda,
  produto_venda = [],
  carregando = false,
  onClose,
}) {
  const [aberto, setAberto] = useState(false);
  const [fechando, setFechando] = useState(false);
  const temporizador = useRef(null);

  // Garante que o modal seja pintado no estado inicial (invisível)
  // antes de receber a classe "open", para a transição de abertura rodar.
  useEffect(() => {
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAberto(true));
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  useEffect(() => {
    return () => clearTimeout(temporizador.current);
  }, []);

  function fecharModal() {
    if (fechando) return;

    setFechando(true);

    temporizador.current = setTimeout(() => {
      onClose();
    }, 250);
  }

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className={`${Styles.bg} ${aberto && !fechando ? Styles.open : ""}`}>
      <section className={Styles.container_page}>
        <section className={Styles.container}>
          <div className={Styles.nav}>
            <div className={Styles.id_venda}>
              <p>Número da Venda:</p>
              <p>{id_venda}</p>
            </div>

            <button onClick={fecharModal} disabled={fechando}>
              <FiX />
            </button>
          </div>

          <div className={Styles.container_products_table}>
            <table className={Styles.products_table}>
              <thead className={Styles.products_thead}>
                <tr>
                  <th className={Styles.products_th}>ID</th>
                  <th className={Styles.products_th}>Nome do produto</th>
                  <th className={Styles.products_th}>Valor de venda</th>
                  <th className={Styles.products_th}>Quantidade</th>
                  <th className={Styles.products_th}>Subtotal</th>
                </tr>
              </thead>

              <tbody className={Styles.products_tbody}>
                {carregando ? (
                  <tr>
                    <td colSpan={5} className={Styles.products_td_empty}>
                      Carregando produtos...
                    </td>
                  </tr>
                ) : produto_venda.length > 0 ? (
                  produto_venda.map((p) => (
                    <tr key={p.id}>
                      <td className={Styles.products_td}>{p.produto_id}</td>
                      <td className={Styles.products_td}>{p.produto_nome}</td>
                      <td className={Styles.products_td}>
                        {formatarMoeda(p.preco_venda)}
                      </td>
                      <td className={Styles.products_td}>{p.quantidade}</td>
                      <td className={Styles.products_td}>
                        {formatarMoeda(
                          Number(p.preco_venda || 0) *
                            Number(p.quantidade || 0),
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={Styles.products_td_empty}>
                      Nenhum produto encontrado nesta venda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}

export default ModalSales;