import { useState, useEffect, useRef } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import { PiBeerBottle } from "react-icons/pi";
import { FiHome, FiBox, FiChevronRight, FiInbox, FiShoppingCart, FiShoppingBag } from 'react-icons/fi';
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

                if (!resp.ok) {
                    const erro = await resp.json();
                    throw new Error(
                        erro.mensagem || `Erro HTTP: ${resp.status}`
                    );
                }

                const data = await resp.json();

                const notificacoes = Array.isArray(data)
                    ? data
                    : data.notificacoes;

                if (!Array.isArray(notificacoes)) {
                    throw new Error(
                        'A resposta da API não contém uma lista de notificações.'
                    );
                }

                if (!primeiraBusca.current) {
                    const encontrouNova = notificacoes.some(
                        (item) =>
                            !notificacoesConhecidas.current.has(item.id)
                    );

                    if (encontrouNova) {
                        setHasNewNotification(true);
                    }
                }

                notificacoes.forEach((item) => {
                    notificacoesConhecidas.current.add(item.id);
                });

                setNotification(notificacoes);
                primeiraBusca.current = false;

            } catch (error) {
                console.error('Erro ao buscar notificações:', error);
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
                            <PiBeerBottle />
                            Produtos
                        </NavLink>
                    </div>

                    <div className={Styles.link2}>
                        <NavLink to="/stock"
                            className={({ isActive }) =>
                                `${Styles.home} ${isActive ? Styles.active : ''}`
                            }>
                            <FiBox />
                            Estoque
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

                    <div className={Styles.link2}>
                        <NavLink to="/sales"
                            className={({ isActive }) =>
                                `${Styles.home} ${isActive ? Styles.active : ''}`
                            }>
                            <FiShoppingBag />
                            Vendas
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