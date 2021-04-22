const porta = 3003
const express = require("express")
const app = express()
const bodyParse = require("body-parser")

const connection = require('./database/database')
const pergunta = require("./database/pergunta")
const Resposta = require("./database/Resposta")
const resposta = require("./database/Resposta")





app.use(bodyParse.urlencoded({ extended: true }))
app.use(bodyParse.json())


app.set('view engine', 'ejs')
app.use(express.static('public'))

connection.authenticate()
    .then(() => {
        console.log("conexão com banco de dados realizado com sucesso")
    })
    .catch((e) => {
        console.log(e)
    })

app.get("/", (req, res) => {
    pergunta.findAll({
        raw: true, order: [
            ['id', 'desc']
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        })
    })

})

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) => {
    const titulo = req.body.titulo
    const descricao = req.body.descricao
    pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })

})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id
    pergunta.findOne({
        where: { id: id },
    }).then(pergunta => {
        if (pergunta != undefined) {
                Resposta.findAll({
                    where: {perguntaId: pergunta.id},
                    order:[
                        ['id', 'DESC']
                    ]
                }).then((resposta) => {
                    res.render("pergunta", {
                        pergunta: pergunta,
                        resposta: resposta
                    })
                })
        } else {
            res.redirect("/")
        }
    })

})

app.post("/responder", (req, res) => {
   const corpo = req.body.corpo
   const perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId)
    })
})

    app.listen(porta, () => {
        console.log(`servidor rodando na porta ${porta}`)
    })