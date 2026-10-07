import { useState, useEffect } from 'react';

import { FiX, FiTrash2 } from "react-icons/fi";

import Styles from './ModalNotificacoes.module.css';

import Notifications from '../../components/Notifications';
import salvarNotificacao from '../../components/functions/salvarNotificacao';

function ModalNotificacoes({ onClose }) {

    const [notificacoes, setNotificacoes] = useState([]);

    const [notification, setNotification] = useState(null);

    const [showModal, setShowModal] = useState(true);

    const mostrarNotificacao = (mensagem, tipo) => {
        setNotification({ mensagem, tipo });

        salvarNotificacao(mensagem, tipo);

        setTimeout(() => {
            setNotification(null);
        }, 2500);
    };

    function handleCloseModal() {
        setShowModal(false);

        setTimeout(() => {
            onClose();
        }, 250);
    }

    useEffect(() => {
        fetch('http://localhost:8081/notificacoes')
            .then((resp) => resp.json())
            .then((data) => {
                const notificacoesOrdenadas = [...data].sort((a,b) => new Date(b.date) - new Date(a.date));
                setNotificacoes(notificacoesOrdenadas)
            })
            .catch((error) => console.error('Erro ao buscar notificações:', error));
    }, []);

    const handleLimparNotificacoes = () => {
        fetch('http://localhost:8081/notificacoes', {
            method: 'DELETE',
        })
            .then((resp) => {
                if (resp.ok) {
                    setNotificacoes([]);
                    mostrarNotificacao('Notificações limpas com sucesso!', 'success');
                } else {
                    console.error('Erro ao limpar notificações');
                }
            })
            .catch((error) => mostrarNotificacao('Erro ao limpar notificações: ' + error.message, 'error'));
    };

    return (
        <section>

            <div className={`${Styles.modalContainer} ${!showModal ? Styles.close : ''
                }`}>
                <div className={Styles.modal}>

                    <div className={Styles.modalHeader}>
                        <h3>Notificações</h3>

                        <button onClick={handleCloseModal}>
                            <FiX />
                        </button>
                    </div>

                    <ul className={Styles.notificacoesList}>
                        {notificacoes.map((notificacao) => (
                            <li
                                key={notificacao.id}
                                className={`
                    ${Styles.notificacao}
                    ${notificacao.tipo === 'success' ? Styles.success : ''}
                    ${notificacao.tipo === 'error' ? Styles.error : ''}
                    ${notificacao.tipo === 'warning' ? Styles.warning : ''}
                `}
                            >
                                {notificacao.mensagem}
                            </li>
                        ))}
                    </ul>

                    <div className={Styles.modalFooter}>
                        <button onClick={handleLimparNotificacoes}>
                            <FiTrash2 />
                            Limpar Notificações
                        </button>
                    </div>

                </div>

            </div>

            <Notifications notification={notification} />

        </section>
    )
}

export default ModalNotificacoes;