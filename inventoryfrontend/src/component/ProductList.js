const ProductList = ({ products, editProduct, deleteProduct }) => {
    return (
        <div className="product-list">
            <h2>Product List</h2>
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product.productsID} className="product-card">
                        <p>รหัสสินค้า: {product.productsID}</p>
                        <p>ชื่อ: {product.productsName || 'ไม่มีชื่อสินค้า'}</p>
                        <p>ประเภท: {product.categoriesName}</p>
                        <p>จำนวน: {product.quantity}</p>
                        <p>{product.description}</p>
                        <p>{product.adddate}</p>
                        <div>
                            <button className="btn btn-edit" onClick={() => editProduct(product)}>แก้ไข</button>
                            <button className="btn btn-danger" onClick={() => deleteProduct(product.productsID)}>ลบ</button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-products">No products found</div>
            )}
        </div>
    );
};

export default ProductList;
