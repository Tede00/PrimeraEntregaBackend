import { Router } from 'express'
import fs from 'fs';
import ProductManager from '../../ProductManager.js';

const router = Router()

const path= './src/Routes/carrito.json'

const startServer = async () => {
    try {
        const productManager = new ProductManager(path);
        const carts = await productManager.getProduct();
        router.post('/', (req, res) => {
            const newCart = {
                id: carts.length ? carts[carts.length - 1].id + 1 : 1,
                products: [],
            };
            carts.push(newCart);
            res.send({ status: 'success', payload: newCart });
        });
        
        router.get('/:cid', (req,res)=>{
            const {cid} = req.params
            const cart =  productManager.getProductById(cid);
            if (!cart) {
                return res.status(404).send({ error: 'Cart not found' });
            }
            res.send({status:'success', payload: cart})
        })
        
        router.post('/:cid/product/:pid', (req, res) => {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            if (typeof quantity !== 'number' || quantity < 1) {
                return res.status(400).send({ message: 'La cantidad debe ser un numero positivo' });
            }
        
            const cart = productManager.addProduct(cid, pid, quantity);
            res.send({ status: 'success', payload: cart });
        });
    }
    catch (err) {
        console.error('Error al leer el archivo:', err);
    }
}

startServer()
export default router