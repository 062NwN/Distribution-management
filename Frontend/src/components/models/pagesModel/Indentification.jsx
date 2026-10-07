import Styles from '../ModalNewProduct.module.css';
import { FiImage } from "react-icons/fi";

function Identification({ image, nome, sku, codeBar, description, setImage, setNome, setSKU, setCodeBar, setDescription }) {

    const form = [
        'Informações básicas',
        'Detalhes',
        'Valores',
        'Estoque',
        'Fiscal',
        'Fornecimento',
        'Validade e Lote'
    ];

    function handleImage(e) {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement("canvas");

                const maxWidth = 400;
                const maxHeight = 400;

                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0, width, height);

                let quality = 0.7;
                let compressedImage = canvas.toDataURL("image/jpeg", quality);

                while (compressedImage.length > 80000 && quality > 0.1) {
                    quality -= 0.1;
                    compressedImage = canvas.toDataURL("image/jpeg", quality);
                }

                setImage(compressedImage);
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }

    return (
        <form className={Styles.container_main}>
            <p>{form[0]}</p>

            <label htmlFor='image'>Selecione uma imagem:</label>
            <label className={Styles.uploadImage}>
                {image ? (
                    <img src={image} alt="Preview do produto" />
                ) : (
                    <FiImage />
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                />
            </label>

            <label htmlFor='name'>Nome:</label>
            <input type='text' id='name' placeholder='Ex: Coca-Cola Original 2L' value={nome} onChange={(e) => setNome(e.target.value)} />

            <label htmlFor='sku'>SKU:</label>
            <input
                type="text"
                id="sku"
                placeholder='0001'
                value={sku}
                onChange={(e) => {
                    setSKU(e.target.value);
                }}
            />

            <label htmlFor='codebar'>Código de barras:</label>
            <input type='text' id='codebar' placeholder='Ex: 7901875487590' value={codeBar} onChange={(e) => setCodeBar(e.target.value)} />

            <label htmlFor='descrition'>Descrição:</label>
            <textarea className={Styles.description} id='descrition' placeholder='Ex: Refrigerante de cola, gaseificado e refrescante, com sabor característico da Coca-Cola' value={description} onChange={(e) => setDescription(e.target.value)} />
        </form>
    );
}

export default Identification;