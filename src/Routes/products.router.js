import { Router } from 'express'
import ProductManager from '../Managers/ProductManager.js';

const router = Router()
const path= './src/files/products.json'
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
            const product = productManager.getProductById(pid);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
            res.send(product);
        })
        // Carga de productos
        router.post('/', (req, res) => {
            const newProduct = req.body;
            const product = productManager.addProduct(newProduct)
            res.send({ status: 'success', payload: product })
        })
        // Actualizar producto
        router.put('/:pid', (req, res) => {
            const productId = req.params.pid;
            const updatedFields = req.body;
            const product = productManager.updateProduct(productId, updatedFields);
            res.send({ status: 'success', payload: product });
        });

        //Borra producto
        router.delete('/:pid', (req, res) => {
            const productId = req.params.pid;
            productManager.deleteProduct(productId);            
            res.send({ status: 'success', message: 'Product deleted successfully' });
        });
    }
    catch (err) {
        console.error('Error al leer el archivo:', err);
    }
}

startServer()

export default router