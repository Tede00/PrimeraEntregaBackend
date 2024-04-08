import express from 'express'
import productsRouter from './src/Routes/products.router.js'
import cartRouter from './src/Routes/cart.router.js'
const app = express()

app.use(express.json())

app.use('/api/products', productsRouter)

app.use('/api/carts', cartRouter)


app.listen(8080, error => {
    if(error) console.log(error)
    console.log('Server escuchando en el puerto 8080')
})