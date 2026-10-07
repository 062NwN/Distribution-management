import Styles from './Notifications.module.css';

function Notifications({ notification }) {
    return (
        <section
            className={`${Styles.container}
        ${notification ? Styles.active : Styles.hide}
        ${notification?.tipo === "success" ? Styles.success : ""}
        ${notification?.tipo === "error" ? Styles.error : ""}
        ${notification?.tipo === "warning" ? Styles.warning : ""}
    `}
        >
            {notification?.mensagem}
        </section>
    );
}

export default Notifications;