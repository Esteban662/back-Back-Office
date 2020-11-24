//Coneccion con mongodb
const connectionString = "mongodb+srv://guayerd:guayerd.2020@cluster0.jufx9.mongodb.net/La-Veloz-Muebles?retryWrites=true&w=majority"

//Puerto
const PORT = "4500"
const Producto = require('./Models/Producto')
const User = require('./Models/User')
const Banner = require('./Models/Banner')
const Categoria = require('./Models/Categorias')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

//Registro
const BCRYPT_SALT_ROUNDS = 12
app.post('/registrer', (req, res, next) => {

    let username = req.body.username
    let password = req.body.password

    bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
        .then((hashedPassword) => {
            let newUser = new User({
                username: username,
                password: hashedPassword
            })
            newUser.save()
        })
        .then((userSaved) => {
            res.status(200).send(userSaved)
        }).catch((err) => {
            console.log("Error saving user: ", err)
            next()
        })
})

//Login
const llave = "llavesecreta123"
app.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).then((user) => {
        console.log({ "userFinded": user })
        if (!user) {
            return res.status(404).send({ "Error": "404 Not Found" })
        } else {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                console.log("result", result)
                if (result === true) {
                    const payload = {
                        check : true
                    }
                    const token = jwt.sign(payload, llave,{
                        expiresIn:1440
                    })
                    return res.status(200).send({
                        aut:true,
                        token:token
                    })
                } else {
                    return res.status(404).send({ "Error": "Not Found or Incorrect Password" })
                }

            })
        }
    }).catch(err => { return res.status(500).send({ err }) })
})


app.get('/user', (req, res) => {
    User.find().then((usersFinded) => {
        usersFinded.forEach((userFinded) => {
            if (userFinded.username == "user") {
                return console.log({
                    username: userFinded.username,
                    password: userFinded.password
                })
            }
            return res.status(200).send(usersFinded)
        })
    }).catch(err => { return res.status(500).send(err) })
})


//Productos
app.get('/productos', (req, res) => {
    Producto.find().then((productoFinded) => {
        //console.log(productoFinded)
        return res.status(200).send(productoFinded)
    }).catch(err => { return res.status(500).send(err) })
})
app.get('/productos/:producto/:id', (req,res)=>{
    const ID = req.params.id
    Producto.findById(ID).then((productoFinded)=>{      
     console.log(productoFinded)
   return res.status(200).send(productoFinded)})
   .catch((err)=>{return res.status(500).send({"Error":err})})
})
//Buscador de Productos

app.get('/productos/:producto', (req, res) => {
    const producto = req.params.producto[0].toUpperCase() + req.params.producto.slice(1)

    Producto.find({ producto: producto })
        .then((productoFinded) => {
            console.log({ "Producto": productoFinded })
            if (!productoFinded) {
                return res.status(404).send({ "Not Finded": `404 ${req.body.producto} Not Finded` })
            } else {
                return res.status(200).send(productoFinded)
            }
        }).catch((err) => {
            console.log({ "Error": err })
            return res.status(500).send({ "Error": err })
        })
})
app.post('/productos', (req, res) => {
    let newProduct = new Producto({
        categoria: req.body.categoria,
        codigo: req.body.codigo,
        producto: req.body.producto,
        descripcion: req.body.descripcion,
        marketing: req.body.marketing,
        dimension: req.body.dimension,
        color: req.body.color,
        precio: req.body.precio,
        descuento: req.body.descuento,
        imgUrl: req.body.imgUrl
    })
    newProduct.save().then((productSaved) => {
        //console.log(productSaved)
        return res.status(200).send(productSaved)
    }).catch(err => { return res.status(500).send(err) })
})

app.put('/productos/:id',(req,res)=>{
    const ID = req.params.id
    const update = req.body
    Producto.findByIdAndUpdate(ID,update,(err,productUpdated)=>{
        if(err){return res.status(500).send({"Erro":err})}

        res.status(200).send(productUpdated)
    })
})

//Banner
app.get('/banners', (req, res) => {
    Banner.find().then((bannerFinded) => {
        //console.log(bannerFinded)
        return res.status(200).send(bannerFinded)
    }).catch(err => { return res.status(500).send(err) })
})
app.get('/banners/:banner', (req, res) => {
    const banner = req.params.banner[0].toUpperCase() + req.params.banner.slice(1)

    Banner.find({ texto: banner })
        .then((bannerFinded) => {
            console.log({ "Banner": bannerFinded })
            if (!bannerFinded) {
                return res.status(404).send({ "Not Finded": `404 ${req.body.banner} Not Finded` })
            } else {
                return res.status(200).send(bannerFinded)
            }
        }).catch((err) => {
            console.log({ "Error": err })
            return res.status(500).send({ "Error": err })
        })
})

app.get('/banners/:banner/:id', (req,res)=>{
    const ID = req.params.id
    Banner.findById(ID).then((bannerFinded)=>{      
     console.log(bannerFinded)
   return res.status(200).send(bannerFinded)})
   .catch((err)=>{return res.status(500).send({"Error":err})})
})

app.post('/banners', (req, res) => {
    let newBanner = new Banner({
        texto: req.body.texto,
        imgUrl: req.body.imgUrl
    })
    newBanner.save().then((bannerSaved) => {
        console.log(bannerSaved)
        return res.status(200).send(bannerSaved)
    }).catch(err => { return res.status(500).send(err) })
})
app.put('/banners/:id',(req,res)=>{
    const ID = req.params.id
    const update = req.body
    Categoria.findByIdAndUpdate(ID,update,(err,bannerUpdated)=>{
        if(err){return res.status(500).send({"Erro":err})}

        res.status(200).send(bannerUpdated)
    })
})
//Categorias
app.get('/categorias', (req,res)=>{
    Categoria.find().then((categoriaFinded)=>{
        console.log(categoriaFinded)
        return res.status(200).send(categoriaFinded)
    }).catch((err)=>{
        console.log("Error", err)
        return res.status(500).send({"Error":err})})
})

app.get('/categorias/:categoria', (req, res) => {
    const categoria = req.params.categoria[0].toUpperCase() + req.params.categoria.slice(1)

    Categoria.find({ categoria: categoria })
        .then((categoriaFinded) => {
            console.log({ "Categoria": categoriaFinded })
            if (!categoriaFinded) {
                return res.status(404).send({ "Not Finded": `404 ${req.body.categoria} Not Finded` })
            } else {
                return res.status(200).send(categoriaFinded)
            }
        }).catch((err) => {
            console.log({ "Error": err })
            return res.status(500).send({ "Error": err })
        })
})

app.get('/categorias/:categoria/:id', (req,res)=>{
    const ID = req.params.id
    Categoria.findById(ID).then((categoriaFinded)=>{      
     console.log(categoriaFinded)
   return res.status(200).send(categoriaFinded)})
   .catch((err)=>{return res.status(500).send({"Error":err})})
})

app.put('/categorias/:id', (req,res)=>{
    const ID = req.params.id
    const update = req.body
    Categoria.findByIdAndUpdate(ID,update,(err,categoriaUpdated)=>{
        if(err){return res.status(500).send({"Erro":err})}

        res.status(200).send(categoriaUpdated)
    })
})

app.post('/categorias', (req,res)=>{
    let newCategoria = new Categoria({
        categoria:req.body.categoria
    })
    newCategoria.save().then((categoriaSaved) => {
        console.log(categoriaSaved)
        return res.status(200).send(categoriaSaved)
    }).catch(err => { return res.status(500).send(err) })
})




mongoose.connect(connectionString, function (err) {
    if (err) {
        console.log(err.mensaje)
    } else {
        console.log("Conexion establecida")
        app.listen(PORT, function () {
            console.log("Server Express Listening")
        })
    }
})