import Styles from "./PurchaseConfirmed.module.css";

import { useEffect, useRef, useState } from "react";

import Notifications from "../Notifications";
import salvarNotificacao from "../functions/salvarNotificacao";

function PurchaseConfirmed({
  carrinho,
  quantidade_produto,
  sub_total,
  desconto,
  total_compra,
  metodo_compra,
  outro_metodo_compra,
  onFinish,
}) {
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState(false);
  const [mensagemError, setMensagemError] = useState("");

  const vendaEnviada = useRef(false);

  const [notification, setNotification] = useState(false);

  const [timerNotificacao, setTimerNotificacao] = useState(null);

  const mostrarNotificacao = (mensagem, tipo) => {
    clearTimeout(timerNotificacao);

    setNotification({ mensagem, tipo });

    salvarNotificacao(mensagem, tipo);

    setTimerNotificacao(setTimeout(() => setNotification(null), 2500));
  };

  useEffect(() => {
    if (vendaEnviada.current) {
      return;
    }

    vendaEnviada.current = true;

    async function handleUpdateProduct(movimentacao) {
      try {
        const response = await fetch(
          `http://localhost:8081/movimentacoes/${movimentacao.id}/estoque`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tipo: movimentacao.tipo,
              quantidade: movimentacao.quantidade,
              motivo: movimentacao.motivo,
              descricao: movimentacao.descricao,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.mensagem || "Erro ao movimentar estoque.");
        }

        mostrarNotificacao?.(
          "Estoque atualizado e movimentação registrada!",
          "success",
        );
      } catch (error) {
        console.error("Erro ao movimentar estoque:", error);

        mostrarNotificacao?.(
          error.message || "Erro ao atualizar estoque.",
          "error",
        );
      }
    }

    const produtosVenda = carrinho.map((produto) => ({
      id: produto.id,
      quantidade: produto.quantidade,
      preco_venda: Number(produto.preco_venda),
      quantidade: produto.quantidade,
    }));

    fetch("http://localhost:8081/vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        produtos: produtosVenda,
        quantidade_produto,
        sub_total,
        desconto,
        total_compra,
        metodo_compra,
        outro_metodo_compra,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          setMensagemError(data.mensagem);
          setError(true);

          const error = data.mensagem;

          mostrarNotificacao("Erro, " + error.toString(), "error");

          setTimeout(() => {
            onFinish();
          }, 2500);

          throw new Error(data.mensagem);
        }

        for (const produto of produtosVenda) {
          await handleUpdateProduct({
            id: produto.id,
            tipo: "SAIDA",
            quantidade: Number(produto.quantidade),
            motivo: "Venda",
            descricao: "Venda de produto ao cliente.",
          });
        }

        return data;
      })
      .then((data) => {
        setTimeout(() => {
          setConfirm(true);

          mostrarNotificacao("Venda Registrada com sucesso!", "success");

          setTimeout(() => {
            onFinish();
          }, 2500);
        }, 1000);
      })
      .catch((error) => {
        console.error("Erro ao registrar venda:", error);
      });
  }, [carrinho]);

  return (
    <section className={Styles.bg}>
      <div className={Styles.loading}>
        <div className={Styles.container}>
          <div className={Styles.spinner}>
            {!confirm && !error && (
              <div className={Styles.loadingSpinner}></div>
            )}

            {confirm && <h1 className={Styles.success}>OK!</h1>}

            {error && <h1 className={Styles.error}>X</h1>}
          </div>

          {confirm && <p>Compra confirmada!</p>}

          {error && <p>{mensagemError}</p>}
        </div>
      </div>

      <Notifications notification={notification} />
    </section>
  );
}

export default PurchaseConfirmed;
