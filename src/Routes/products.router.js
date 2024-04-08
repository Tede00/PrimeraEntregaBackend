import { Router } from 'express'
import ProductManager from '../../ProductManager.js';

const router = Router()
const path= './src/Routes/products.json'
const startServer = async () => {
    try {
        const productManager = new ProductManager(path);
        const products = await productManager.getProduct();
        // Todos los productos incluyendo limit
        router.get('/', (req, res) => {
            const { limit }=req.query  
            if (!limit) return res.send({status:'success', payload:products})
            const limitedProducts = products.slice(0, parseInt(limit));
            res.send({ status: 'success', payload: limitedProducts })
        })
        // Prod por ID
        router.get('/:pid', (req, res) => {
            const { pid } = req.params;
            const product = products.find(p => p.id === parseInt(pid));
            res.send(product);
        })
        // Carga de productos
        router.post('/', (req, res) => {
            const { title, description, code, price, stock, category, thumbnails} = req.body
            if(!title || !description || !code || !price || !stock || category) return res.send({status: 'error', error: 'faltan campos'})

            const newProduct = {
                id: products[products.length - 1].id + 1,
                title, 
                description, 
                code, 
                price, 
                status: true,
                stock, 
                category, 
                thumbnails
            }
            products.push(newProduct)
            res.send({ status: 'success', payload: newProduct })
        })
        // Actualizar producto
        router.put('/:pid', (req, res) => {
            const { pid } = req.params;
            const productoToUpdate = req.body;

            const productIndex = products.findIndex(product => product.id === parseInt(pid));
            if (productIndex === -1) return res.status(404).send({ status: 'error', error: 'Product not found' });

            products[productIndex] = { ...products[productIndex], ...productoToUpdate }; // Actualiza solo los campos proporcionados
            res.send({ status: 'success', payload: products[productIndex] });
        });

        //Borra producto
        router.delete('/:pid', (req, res) => {
            const { pid } = req.params;
            const productIndex = products.findIndex(product => product.id === parseInt(pid));
            if (productIndex === -1) return res.status(404).send({ status: 'error', error: 'Product not found' });

            products.splice(productIndex, 1); // Elimina el producto del array
            res.send({ status: 'success', message: 'Product deleted successfully' });
        });
    }
    catch (error) {
        console.error('Error al leer el archivo:', err);
        products = []; 
    }
}

startServer()

export default router