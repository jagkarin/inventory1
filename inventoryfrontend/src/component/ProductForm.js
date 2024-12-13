const ProductForm = ({ newProduct, setNewProduct, isEditing, handleProduct }) => {
    // กำหนดค่าเริ่มต้นให้กับ newProduct ถ้าไม่มีค่า
    
    const handleChange = (e) => {
        const { productsName, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [productsName]: value }));
    };
    console.log('Current newProduct:', newProduct); // เพิ่มการตรวจสอบ
    const product = newProduct || { 
        productsName: '', 
        category: '', 
        quantity: 0, 
        description: '' 
    };

    return (
        <div className="container">
            <h4 className="form-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h4>
            <div className="form-grid">
                <div className="input-group">
                <label htmlFor="id">รหัสสินค้า:</label>
<input
    type="text"
    id="id"
    value={newProduct.productsID || 'รหัสสินค้า. . .'}  // กำหนดค่ารหัสสินค้าเมื่อยังไม่มีค่า
    readOnly  // ทำให้ไม่สามารถแก้ไขได้
/>

                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={newProduct.productsName}  // ตรวจสอบการแสดงชื่อสินค้า
                        onChange={(e) => setNewProduct({ ...newProduct, productsName: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        value={product.category}
                        onChange={(e) => setNewProduct({ ...product, category: e.target.value })}
                    >
                        <option value="">กรุณาเลือก. . .</option>
                        <option value="electronics">Electronics</option>
                        <option value="furniture">Furniture</option>
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={product.quantity}
                        onChange={(e) => setNewProduct({ ...product, quantity: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        rows="4"
                        value={product.description}
                        onChange={(e) => setNewProduct({ ...product, description: e.target.value })}
                    />
                </div>
            </div>
            <div className="btn-group">
    <button 
        type="button" 
        className="btnpro btn-success" 
        onClick={handleProduct}
    >
        {isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}
    </button>
</div>

        </div>
    );
};

export default ProductForm;
