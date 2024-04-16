import { Router } from 'express'
import {CartManager} from '../Managers/CartsManager.js';

const router = Router()

const path= './src/files/carrito.json'

const startServer = async () => {
    try {
        const cartManager = new CartManager(path);

        router.post('/', (req, res) => {
            const newCart = cartManager.createCart();
            res.send({ status: 'success', payload: newCart });
        });
        
        router.get('/:cid', (req,res)=>{
            const {cid} = req.params
            const cart =  cartManager.getCartById(cid);
            if (!cart) {
                return res.status(404).send({ error: 'Cart not found' });
            }
            res.json(cart);
        })
        
        router.post('/:cid/product/:pid', (req, res) => {
            const { cid, pid } = req.params;
            const cart = cartManager.addProductToCart(cid, pid);
            res.send({ status: 'success', payload: cart });
        });
    }
    catch (err) {
        console.error('Error al leer el archivo:', err);
    }
}

startServer()
export default router