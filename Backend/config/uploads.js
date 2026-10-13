const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const pasta = path.join(__dirname, "../uploads/produtos");

fs.mkdirSync(pasta, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pasta);
    },

    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname).toLowerCase();
        const nomeArquivo = crypto.randomUUID() + extensao;

        cb(null, nomeArquivo);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (tiposPermitidos.includes(file.mimetype)) {
            return cb(null, true);
        }

        cb(new Error("Formato de imagem não permitido."));
    }
});

module.exports = upload;
