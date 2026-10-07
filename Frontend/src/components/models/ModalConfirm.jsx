import Styles from './ModalConfirm.module.css';

function ModalConfirm({ mensagem, onResposta }) {
    return (
        <section className={Styles.container}>
            <div className={Styles.confirm}>
                <p>{mensagem}</p>

                <div className={Styles.buttons}>
                    <button onClick={() => onResposta("confirm")} className={Styles.confirmBtn}>
                        Confirmar
                    </button>

                    <button onClick={() => onResposta("cancel")} className={Styles.cancelBtn}>
                        Cancelar
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ModalConfirm;