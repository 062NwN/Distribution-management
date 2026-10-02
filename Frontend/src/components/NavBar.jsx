import { NavLink, useNavigate } from 'react-router-dom';

import { FiHome, FiBox, FiLogOut, FiChevronRight } from 'react-icons/fi';
import { HiMiniUserCircle } from 'react-icons/hi2';

import Styles from './NavBar.module.css';

import Logo from '../img/logo.png';

function NavBar() {
    const navigator = useNavigate();

    function exit() {
        navigator('/login')
    }

    return (
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

            </div>

            <div className={Styles.logout} onClick={exit}>

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
    );
}

export default NavBar;