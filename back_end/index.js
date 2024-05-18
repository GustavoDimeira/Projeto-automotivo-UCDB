const mongoose = require("mongoose");
const { app } = require("./app.js");

const PORT = 5000;

(
    async () => {
        try {
            // mongoose.connect("mongodb://localhost:27017/gitsetup");

            // console.log("DB CONNECTED");

            app.listen(PORT, () => {
                console.log(`Servidor Express está rodando na porta ${PORT}.`);
            })
        } catch (e) {
            console.error("fail :(", e)
        }
    }
)()