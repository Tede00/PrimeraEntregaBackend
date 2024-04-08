import { Router } from 'express'
import fs from 'fs';

const router = Router()

const path= './src/Routes/carrito.json'
let carts

// Leer el archivo JSON
try {
    const data = fs.readFileSync(path, 'utf8');
    carts = JSON.parse(data);
} catch (err) {
    console.error('Error al leer el archivo:', err);
    carts = []; 
}

router.post('/', (req, res) => {
    const newCart = {
        id: carts[carts.length - 1].id + 1,
        products: [],
    };
    carts.push(newCart);
    res.send({ status: 'success', payload: newCart });
});

router.get('/:cid', (req,res)=>{
    const {cid} = req.params
    const cart = carts.find(c => c.id === parseInt(cid))
    if (!cart) return res.status(404).send({ status: 'error', error: 'Cart not found' });
    const productsInCart = cart.products.map(product =>{
        return{
            product: product.product,
            quantity: product.quantity
        }
    })
    res.send({status:'success', payload: productsInCart})
})

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const cartIndex = carts.findIndex(c => c.id === parseInt(cid));
    if (!carts[cartIndex]) return res.status(404).send({ status: 'error', error: 'Cart not found' });
    
    const productIndex = carts[cartIndex].products.findIndex(p => p.product === parseInt(pid));
    if (productIndex === -1) {
        carts[cartIndex].products.push({ product: parseInt(pid), quantity: 1 });
    } else {
        carts[cartIndex].products[productIndex].quantity++;
    }
    res.send({ status: 'success', message: 'Product added to cart' });
});




export default router