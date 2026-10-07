import { useState, useEffect, useRef } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import { FiHome, FiBox, FiChevronRight, FiInbox } from 'react-icons/fi';
import { HiMiniUserCircle } from 'react-icons/hi2';
import { FaBell, FaBellSlash } from "react-icons/fa";

import Styles from './NavBar.module.css';

import Logo from '../img/logo.png';
import ModalConfirm from '../components/models/ModalConfirm';

import ModalNotifications from '../components/models/ModalNotificacoes';

function NavBar() {
    const navigator = useNavigate();

    function exit() {
        navigator('/login')
    }

    const [showModalNotifications, setShowModalNotifications] = useState(false);

    const [confirmLogout, setConfirmLogout] = useState(false);

    const [notification, setNotification] = useState([]);
    const [hasNewNotification, setHasNewNotification] = useState(false);

    const notificacoesConhecidas = useRef(new Set());
    const primeiraBusca = useRef(true);

    useEffect(() => {
        const buscarNotifications = async () => {
            try {
                const resp = await fetch('http://localhost:8081/notificacoes');

                const data = await resp.json();

                const novasNotificacoes = data.filter(
                    (notificacao) =>
                        !notificacoesConhecidas.current.has(notificacao.id)
                );

                // Não considera as notificações existentes
                // quando o sistema é aberto
                if (!primeiraBusca.current && novasNotificacoes.length > 0) {

                    setHasNewNotification(true);
                }

                // Guarda os IDs conhecidos
                data.forEach((notificacao) => {
                    notificacoesConhecidas.current.add(notificacao.id);
                });

                setNotification(data);
                primeiraBusca.current = false;

            } catch (error) {
                console.log('Erro ao buscar notificações', error);
            }
        };

        buscarNotifications();

        const interval = setInterval(buscarNotifications, 5000);

        return () => clearInterval(interval);
    }, []);

    return (

        <div>
            <div className={Styles.container}>

                <div className={Styles.logo}>
                    <img src={Logo} alt="Logo" />
                    <h3>StockFlow</h3>
                </div>

                <div className={Styles.menu}>

                    <div className={Styles.link}>
                        <NavLink to="/"
                            className={({ isActive }) =>
                                `${Styles.home} ${isActive ? Styles.active : ''}`
                            }>
                            <FiHome />
                            Dashboard
                        </NavLink>
                    </div>

                    <div className={Styles.link2}>
                        <NavLink to="/products"
                            className={({ isActive }) =>
                                `${Styles.home} ${isActive ? Styles.active : ''}`
                            }>
                            <FiBox />
                            Produtos
                        </NavLink>
                    </div>

                    <div className={Styles.link2}>
                        <NavLink to="/box"
                            className={({ isActive }) =>
                                `${Styles.home} ${isActive ? Styles.active : ''}`
                            }>
                            <FiInbox />
                            Caixa
                        </NavLink>
                    </div>

                </div>

                <div className={Styles.logout}>

                    {showModalNotifications}
                    <div
                        className={Styles.notifications}
                        onClick={() => {
                            setShowModalNotifications(!showModalNotifications);
                            setHasNewNotification(false);
                        }}
                    >
                        <h4>
                            {showModalNotifications
                                ? <FaBellSlash />
                                : <FaBell />
                            }
                        </h4>

                        {hasNewNotification && (
                            <span className={Styles.notificationBadge}></span>
                        )}
                    </div>

                    <div className={Styles.line} onClick={() => setConfirmLogout(true)}>
                        <div className={Styles.admin}>
                            <HiMiniUserCircle />
                        </div>

                        <div className={Styles.title}>
                            <h3>Admin</h3>
                            <h4>Administrador</h4>
                        </div>

                        <FiChevronRight className={Styles.arrow} />
                    </div>


                </div>

                {confirmLogout && (
                    <ModalConfirm
                        mensagem="Tem certeza que deseja sair?"
                        onResposta={(resp) => {
                            if (resp === "confirm") {
                                setConfirmLogout(false);
                                exit();
                            } else {
                                setConfirmLogout(false);
                            }
                        }}
                    />
                )}

            </div>

            {showModalNotifications && (
                <ModalNotifications onClose={() => setShowModalNotifications(false)} />
            )}
        </div>
    );
}

export default NavBar;