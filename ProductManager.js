const fs = require('fs').promises;

class ProductManager {
    #products;

    constructor(path) {
        this.#products = [];
        this.path = path;
    }

    readFile = async () => {
        try {
            const dataJson = await fs.readFile(this.path);
            return JSON.parse(dataJson);
        } catch (error) {
            return [];
        }
    }
    
    async addProduct(product) {
        try {
            const productsDB = await this.readFile();
            const productFound = productsDB.find(prod => product.code === prod.code);
            if (productFound) {
                return '¡El producto ya existe!';
            }
            
            if (productsDB.length === 0) {
                product.id = 1;
            } else {
                product.id = productsDB[productsDB.length - 1].id + 1;
            }
            
            productsDB.push(product);
            
            await fs.writeFile(this.path, JSON.stringify(productsDB), 'utf-8');
            
            return productsDB;
        } catch (error) {
            console.log(error);
            return 'Ocurrió un error al intentar agregar el producto.';
        }
    }
    
    async getProduct() {
        try {
            return await this.readFile();
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(pid) {
        try {
            const productsDB = await this.readFile();
            const product = productsDB.find(prod => prod.id === pid);
            if (!product) return '¡El producto solicitado no está disponible!';
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(pid, productoToUpdate) {
        try {
            const productsDB = await this.readFile();
            const index = productsDB.findIndex(prod => prod.id === pid);
            if (index === -1) {
                return 'El producto que intenta actualizar no existe.';
            }
            productsDB[index] = {...productsDB[index], ...productoToUpdate};
            await fs.writeFile(this.path, JSON.stringify(productsDB), 'utf-8');
            return productsDB;
        } catch (error) {
            console.log(error);
            return 'Ocurrió un error al intentar actualizar el producto.';
        }
    }

    async deleteProduct(pid) {
        try {
            const productsDB = await this.readFile();
            const index = productsDB.findIndex(prod => prod.id === pid);
            if (index === -1) {
                return 'El producto que intenta eliminar no existe.';
            }
            productsDB.splice(index, 1);
            await fs.writeFile(this.path, JSON.stringify(productsDB), 'utf-8');
            return productsDB;
        } catch (error) {
            console.log(error);
            return 'Ocurrió un error al intentar eliminar el producto.';
        }
    }
}

module.exports = ProductManager;


// const path = './data.json'

// const products = new ProductManager(path);

// const main = async () => {
//     products.addProduct({
//         title: 'Product 1',
//         price: 20,
//         stock: 5,
//         category: 'mesas',
//         code:'0101',
//     })
//     products.addProduct({
//         title: 'Product 2',
//         price: 20,
//         stock: 5,
//         category: 'mesas',
//         code:'0102',
//     })
//     products.addProduct({
//         title: 'Product 3',
//         price: 20,
//         stock: 5,
//         category: 'mesas',
//         code:'0103',
//     })
// }

// // main();

// const get= async () => {
//     const productsDB = await products.getProduct();
//     console.log(productsDB);
// }
//  get();
