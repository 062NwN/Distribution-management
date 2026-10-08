import { useState, useEffect } from 'react';

import { FiX, FiTrash2 } from "react-icons/fi";

import Styles from './ModalNotificacoes.module.css';

import salvarNotificacao from '../../components/functions/salvarNotificacao';

function ModalNotificacoes({ onClose }) {

    const [notificacoes, setNotificacoes] = useState([]);

    const [showModal, setShowModal] = useState(true);

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
                const notificacoesOrdenadas = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
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
                } else {
                    console.error('Erro ao limpar notificações');
                }
            })
            .catch((error) => console.error('Erro ao limpar notificações: ' + error.message));
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
                        {notificacoes.length > 0 ? (
                            notificacoes.map((notificacao) => (
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
                            ))
                        ) : (
                            <div className={Styles.notNotifications}>
                                <li>Nenhuma notificação...</li>
                            </div>
                            
                        )}
                    </ul>

                    <div className={Styles.modalFooter}>
                        <button onClick={() => {
                            handleLimparNotificacoes();
                            handleCloseModal();
                        }}>
                            <FiTrash2 />
                            Limpar Notificações
                        </button>
                    </div>

                </div>

            </div>

        </section>
    )
}

export default ModalNotificacoes;