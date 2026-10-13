import { useState, useEffect } from "react";

import {
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiShoppingBag,
  FiBarChart2,
  FiSearch,
  FiMenu,
} from "react-icons/fi";

import { MdAttachMoney } from "react-icons/md";

import Styles from "../pages_css/Sales.module.css";

import Notifications from "../components/Notifications";
import salvarNotificacao from "../components/functions/salvarNotificacao";

import Select from "../pagesComponents/Select";

import Loading from "../components/Loading";

import ModalSales from "../components/models/ModalSales";

function Sales() {
  const [loading, setLoading] = useState(false);

  const [vendas, setVendas] = useState([]);

  const [notification, setNotification] = useState(null);
  const [timerNotificacao, setTimerNotificacao] = useState(null);

  const mostrarNotificacao = (mensagem, tipo) => {
    clearTimeout(timerNotificacao);

    setNotification({ mensagem, tipo });

    salvarNotificacao(mensagem, tipo);

    setTimerNotificacao(setTimeout(() => setNotification(null), 2500));
  };

  async function buscarVendas() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/vendas");

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setVendas(data);
      } else if (Array.isArray(data.vendas)) {
        setVendas(data.vendas);
      } else {
        throw new Error("A API nao retornou uma lista de vendas");
      }
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      mostrarNotificacao("Erro ao buscar vendas.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarVendas();
  }, []);

  const date = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const hoje = new Date();

  const vendasHoje = vendas.filter((venda) => {
    return new Date(venda.data_criacao).toDateString() === hoje.toDateString();
  });

  const vendasMes = vendas.filter((venda) => {
    const data = new Date(venda.data_criacao);

    return (
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    );
  });

  const somar = (lista) => {
    return lista.reduce(
      (total, venda) => total + Number(venda.total_compra || 0),
      0,
    );
  };

  const totalHoje = somar(vendasHoje);
  const totalMes = somar(vendasMes);

  const ticketMedio = vendasMes.length > 0 ? totalMes / vendasMes.length : 0;

  const metodosFiltrados = [
    ...new Set(vendas.map((venda) => venda.metodo_compra)),
  ];

  const outroMetodosFiltrados = [
    ...new Set(
      vendas
        .map((venda) => venda.outro_metodo_compra)
        .filter((metodo) => metodo !== ""),
    ),
  ];

  const opcoesValores = [
    "Compras maiores ou iguais a",
    "Compras menores ou iguais a",
  ];

  const [metodo, setMetodo] = useState("");
  const [outroMetodo, setOutroMetodo] = useState("");

  const [maiorMenor, setMaiorMenor] = useState("");
  const [valorPesquisa, setValorPesquisa] = useState("");

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const outros = metodo === "Outros";

  function pesquisarVendas() {
    return vendas.filter((venda) => {
      // Filtro por data inicial
      const dataVenda = new Date(venda.data_criacao);

      if (dataInicio) {
        const inicio = new Date(`${dataInicio}T00:00:00`);

        if (dataVenda < inicio) {
          return false;
        }
      }

      // Filtro por data final
      if (dataFim) {
        const fim = new Date(`${dataFim}T23:59:59.999`);

        if (dataVenda > fim) {
          return false;
        }
      }

      // Filtro por método de pagamento
      if (metodo && venda.metodo_compra !== metodo) {
        return false;
      }

      // Filtro por outro método de pagamento
      if (outros && outroMetodo && venda.outro_metodo_compra !== outroMetodo) {
        return false;
      }

      // Filtro por valor da compra
      const valor = Number(valorPesquisa);

      if (valorPesquisa.trim() !== "" && !Number.isNaN(valor)) {
        const totalCompra = Number(venda.total_compra || 0);

        if (maiorMenor === "Compras maiores ou iguais a") {
          if (totalCompra < valor) {
            return false;
          }
        }

        if (maiorMenor === "Compras menores ou iguais a") {
          if (totalCompra > valor) {
            return false;
          }
        }
      }

      return true;
    });
  }

  const vendasFiltradas = pesquisarVendas();

  const [vendaSelecionada, setVendaSelecionada] = useState(null);

  return (
    <section className={Styles.container}>
      <div className={Styles.container_header}>
        <div className={Styles.title}>
          <h1>Vendas</h1>
          <p>Visualise todo seu histórico de vendas.</p>
        </div>

        <div className={Styles.date}>
          <FiCalendar /> {date}
        </div>
      </div>

      <div className={Styles.container_main}>
        <div className={Styles.container_sales}>
          <div className={Styles.container_cards}>
            <div className={Styles.cards}>
              <div className={Styles.cards_svg}>
                <FiDollarSign />
              </div>
              <div className={Styles.cards_infor}>
                <h4 className={Styles.cards_title}>Vendas hoje</h4>
                <h3 className={Styles.cards_value}>
                  {formatarMoeda(totalHoje)}
                </h3>
              </div>
            </div>

            <div className={Styles.cards}>
              <div className={Styles.cards_svg}>
                <FiTrendingUp />
              </div>
              <div className={Styles.cards_infor}>
                <h4 className={Styles.cards_title}>Vendas no mês</h4>
                <h3 className={Styles.cards_value}>
                  {formatarMoeda(totalMes)}
                </h3>
              </div>
            </div>

            <div className={Styles.cards}>
              <div className={Styles.cards_svg}>
                <FiShoppingBag />
              </div>
              <div className={Styles.cards_infor}>
                <h4 className={Styles.cards_title}>Pedidos Realizados</h4>
                <h3 className={Styles.cards_value}>{vendasMes.length}</h3>
              </div>
            </div>

            <div className={Styles.cards}>
              <div className={Styles.cards_svg}>
                <FiBarChart2 />
              </div>
              <div className={Styles.cards_infor}>
                <h4 className={Styles.cards_title}>Ticket Médio</h4>
                <h3 className={Styles.cards_value}>
                  {formatarMoeda(ticketMedio)}
                </h3>
              </div>
            </div>
          </div>

          <div className={Styles.container_filters}>
            <div className={Styles.date_search}>
              <p>Inicio: </p>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div className={Styles.date_search}>
              <p>Fim: </p>
              <input
                type="date"
                value={dataFim}
                min={dataInicio || undefined}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>

            <Select
              className={Styles.select}
              text="Selecione um Filtro"
              name="metodo"
              options={metodosFiltrados}
              value={metodo}
              handleOnChange={(e) => setMetodo(e.target.value)}
            />

            {outros && (
              <Select
                className={Styles.select}
                text="Selecione um Filtro"
                name="outroMetodo"
                options={outroMetodosFiltrados}
                value={outroMetodo}
                handleOnChange={(e) => setOutroMetodo(e.target.value)}
              />
            )}
            <div className={Styles.container_search}>
              <Select
                className={Styles.select}
                text="Selecione um Filtro"
                name="metodo"
                options={opcoesValores}
                value={maiorMenor}
                handleOnChange={(e) => setMaiorMenor(e.target.value)}
              />
              <div className={Styles.money}>
                <FiSearch />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="100.00"
                  value={valorPesquisa}
                  onChange={(e) => setValorPesquisa(e.target.value)}
                />
                <MdAttachMoney />
              </div>
            </div>
          </div>

          <div className={Styles.container_tables}>
            <table className={Styles.table}>
              <thead className={Styles.thead}>
                <tr className={Styles.tr}>
                  <th className={Styles.th}>ID</th>
                  <th className={Styles.th}>Total Produtos</th>
                  <th className={Styles.th}>Subtotal</th>
                  <th className={Styles.th}>Descontos</th>
                  <th className={Styles.th}>Total Compra</th>
                  <th className={Styles.th}>Método de pagamento</th>
                  <th className={Styles.th}>Outro Método</th>
                  <th className={Styles.th}>Data da Venda</th>
                  <th className={Styles.th}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {vendasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={8}>Nenhuma venda encontrada.</td>
                  </tr>
                ) : (
                  vendasFiltradas.map((venda) => (
                    <tr key={venda.id}>
                      <td>{venda.id}</td>
                      <td>{venda.quantidade_produto}</td>
                      <td>{formatarMoeda(venda.sub_total)}</td>
                      <td>{formatarMoeda(venda.desconto)}</td>
                      <td>{formatarMoeda(venda.total_compra)}</td>
                      <td>{venda.metodo_compra}</td>
                      <td>{venda.outro_metodo_compra || "-"}</td>
                      <td>
                        {new Date(venda.data_criacao).toLocaleDateString(
                          "pt-BR",
                        )}{" "}
                        às{" "}
                        {new Date(venda.data_criacao).toLocaleTimeString(
                          "pt-BR",
                        )}
                      </td>
                      <td>
                        <button onClick={() => setVendaSelecionada(venda)}>
                          <FiMenu />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={Styles.footer}>
            <p>© 2026 StockFlow. Todos os direitos reservados.</p>

            <span>Gestão de produtos e estoque</span>
          </div>
        </div>
      </div>

      <Notifications notification={notification} />
      {vendaSelecionada && (
        <ModalSales
          id_venda={vendaSelecionada.id}
          produto_venda={vendaSelecionada.itens || []}
          onClose={() => setVendaSelecionada(null)}
        />
      )}
      {loading && <Loading />}
    </section>
  );
}

export default Sales;
