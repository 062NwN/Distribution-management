import Styles from './Loading.module.css';

function Loading() {
    return (
        <section className={Styles.bg}>
            <div className={Styles.loading}>
                <div className={Styles.spinner}></div>
                <p>Carregando...</p>
            </div>
        </section>
    )
}

export default Loading;