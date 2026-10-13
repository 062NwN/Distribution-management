import { useState } from 'react';

import { FiCheck, FiX } from "react-icons/fi";

import Styles from './ModalDiscount.module.css';

import Notifications from '../Notifications';
import salvarNotificacao from '../functions/salvarNotificacao';

function ModalDiscount({ onAplicar, onResposta, total }) {
    const [notification, setNotification] = useState(null);
    const [desconto, setDesconto] = useState('');
    const [valorDesconto, setValorDesconto] = useState(0);

    const mostrarNotificacao = (mensagem, tipo) => {
        setNotification({ mensagem, tipo });

        salvarNotificacao(mensagem, tipo);

        setTimeout(() => {
            setNotification(null);
        }, 2500);
    };

    const onClose = (resp) => {
        onResposta(resp);
    };

    function applyDiscount(valor) {
        if (valor <= 0) {
            mostrarNotificacao(
                "Selecione um valor maior que zero(0) para aplicar!",
                'error'
            );
            return;
        }

        if (total <= 0) {
            mostrarNotificacao(
                "Adicione um produto ao carrinho para adicionar um desconto!",
                'error'
            );
            return;
        }

        if (valor >= total) {
            mostrarNotificacao(
                "Adicione um valor válido para aplicar o desconto!",
                'error'
            );
            return;
        }

        setValorDesconto(Number(valor));

        onAplicar(Number(valor));
        onResposta(false);
    }

    return (
        <section className={Styles.container}>
            <div className={Styles.ModalDiscount}>

                <div className={Styles.view}>
                    <p>SubTotal:</p>

                    <h2>
                        R$ {
                            total > 0 || valorDesconto >= total
                                ? Math.max(
                                    0,
                                    total - Number(desconto)
                                ).toFixed(2)
                                : '0.00'
                        }
                    </h2>
                </div>

                <div className={Styles.input_discount}>
                    <input
                        type="number"
                        placeholder="Desconto de R$:"
                        value={desconto}
                        onChange={(e) => setDesconto(e.target.value)}
                    />
                </div>

                <div className={Styles.container_buttons}>

                    <button
                        className={Styles.cancel}
                        onClick={() => onClose(false)}
                    >
                        <FiX /> Cancelar
                    </button>

                    <button
                        className={Styles.apply}
                        onClick={() => applyDiscount(desconto)}
                    >
                        <FiCheck /> Aplicar
                    </button>

                </div>
            </div>

            <Notifications notification={notification} />
        </section>
    );
}

export default ModalDiscount;