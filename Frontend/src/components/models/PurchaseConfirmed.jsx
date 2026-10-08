import Styles from './PurchaseConfirmed.module.css';

import { useEffect, useRef, useState } from "react";

import Notifications from '../Notifications';
import salvarNotificacao from '../functions/salvarNotificacao';

function PurchaseConfirmed({
    carrinho,
    quantidade_produto,
    sub_total,
    desconto,
    total_compra,
    metodo_compra,
    outro_metodo_compra,
    onFinish
}) {

    const [confirm, setConfirm] = useState(false);
    const [error, setError] = useState(false);
    const [mensagemError, setMensagemError] = useState('');

    const vendaEnviada = useRef(false);

    const [notification, setNotification] = useState(false);

    const mostrarNotificacao = (mensagem, tipo) => {
        setNotification({ mensagem, tipo });

        salvarNotificacao(mensagem, tipo);

        setTimeout(() => {
            setNotification(null);
        }, 2500);
    };

    useEffect(() => {

        if (vendaEnviada.current) {
            return;
        }

        vendaEnviada.current = true;

        const produtosVenda = carrinho.map((produto) => ({
            id: produto.id,
            quantidade: produto.quantidade
        }));

        fetch('http://localhost:8081/vendas', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                produtos: produtosVenda,
                quantidade_produto,
                sub_total,
                desconto,
                total_compra,
                metodo_compra,
                outro_metodo_compra
            })
        })
            .then(async (response) => {

                const data = await response.json();

                if (!response.ok) {
                    setMensagemError(data.mensagem);
                    setError(true);

                    const error = data.mensagem;

                    mostrarNotificacao(
                        "Erro, " + error.toString(),
                        "error"
                    )

                    setTimeout(() => {
                        onFinish();
                    }, 2500);

                    throw new Error(data.mensagem);
                }

                return data;
            })
            .then((data) => {

                setTimeout(() => {
                    setConfirm(true);

                    mostrarNotificacao(
                        "Venda Registrada com sucesso!",
                        "success"
                    )

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

                        {confirm && (
                            <h1 className={Styles.success}>OK!</h1>
                        )}

                        {error && (
                            <h1 className={Styles.error}>X</h1>
                        )}

                    </div>

                    {confirm && (
                        <p>Compra confirmada!</p>
                    )}

                    {error && (
                        <p>{mensagemError}</p>
                    )}

                </div>
            </div>

            <Notifications notification={notification} />
        </section>
    );
}

export default PurchaseConfirmed;