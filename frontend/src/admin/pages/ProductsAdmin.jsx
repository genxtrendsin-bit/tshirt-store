import React, { useState, useEffect } from "react";
import API from "../../utils/axios";
import "../../styles/admin.css";
import { useNavigate } from "react-router-dom";

export default function ProductsAdmin() {

    const token = localStorage.getItem("token");

    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const [search, setSearch] = useState("");

    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);
    const [codAvailable, setCodAvailable] = useState(true);

    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",

        category: "",
        brand: "",
        material: "",
        fit: "",
        neckline: "",
        sleeveType: "",
        fabricWeight: "",
        pattern: "",
        gender: "",

        tags: []
    });

    const colorOptions = [
        "Black", "White", "Red", "Blue", "Green",
        "Yellow", "Orange", "Purple", "Pink", "Brown",
        "Gray", "Navy", "Maroon", "Beige", "Olive",
        "Cyan", "Magenta", "Gold", "Silver"
    ];

    /* FETCH PRODUCTS */

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {

        try {

            const res = await API.get("/products");

            setProducts(res.data);
            setFiltered(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    /* SEARCH */

    useEffect(() => {

        const filteredProducts = products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );

        setFiltered(filteredProducts);

    }, [search, products]);

    /* IMAGE PREVIEW */

    const handleImageChange = (files) => {

        const fileArray = Array.from(files);

        setImages(fileArray);

        const previews = fileArray.map(file =>
            URL.createObjectURL(file)
        );

        setPreview(previews);

    };

    /* RESET FORM */

    const resetForm = () => {

        setForm({
            name: "",
            price: "",
            stock: "",
            description: "",
            category: "",
            brand: "",
            material: "",
            fit: "",
            neckline: "",
            sleeveType: "",
            fabricWeight: "",
            pattern: "",
            gender: "",
            tags: []
        });

        setSizes([]);
        setColors([]);
        setImages([]);
        setPreview([]);
        setCodAvailable(true);   // ✅ FIX
        setEditing(null);

    };

    /* ADD PRODUCT */

    const addProduct = async () => {

        try {

            const formData = new FormData();

            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            formData.append("codAvailable", codAvailable);
            formData.append("sizes", JSON.stringify(sizes));
            formData.append("colors", JSON.stringify(colors));

            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }

            if (!form.name || !form.price || !form.stock) {
                alert("Please fill required fields");
                return;
            }

            if (sizes.length === 0) {
                alert("Select at least one size");
                return;
            }

            if (colors.length === 0) {
                alert("Select at least one color");
                return;
            }

            await API.post("/products/add", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Product Added");

            resetForm();
            setShowForm(false);
            fetchProducts();

        } catch (err) {

            console.log(err);

        }

    };

    /* UPDATE PRODUCT */

    const updateProduct = async () => {

        try {

            const formData = new FormData();

            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            formData.append("codAvailable", codAvailable);
            formData.append("sizes", JSON.stringify(sizes));
            formData.append("colors", JSON.stringify(colors));

            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }

            if (!form.name || !form.price || !form.stock) {
                alert("Please fill required fields");
                return;
            }

            if (sizes.length === 0) {
                alert("Select at least one size");
                return;
            }

            if (colors.length === 0) {
                alert("Select at least one color");
                return;
            }

            await API.put(
                `/products/update/${editing._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Product Updated");

            resetForm();
            setShowForm(false);
            fetchProducts();

        } catch (err) {

            console.log(err);

        }

    };

    /* DELETE */

    const deleteProduct = async (id) => {

        if (!window.confirm("Delete product?")) return;

        await API.delete(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        fetchProducts();

    };

    /* EDIT */

    const editProduct = (p) => {

        setEditing(p);

        setForm({
            name: p.name || "",
            price: p.price || "",
            stock: p.stock || "",
            description: p.description || "",

            category: p.category || "",
            brand: p.brand || "",
            material: p.material || "",
            fit: p.fit || "",
            neckline: p.neckline || "",
            sleeveType: p.sleeveType || "",
            fabricWeight: p.fabricWeight || "",
            pattern: p.pattern || "",
            gender: p.gender || "",

            tags: p.tags || []
        });

        setSizes([...(p.sizes || [])]);   // ✅ FORCE NEW ARRAY
        setColors([...(p.colors || [])]); // ✅ FORCE NEW ARRAY
        setCodAvailable(p.codAvailable ?? true);


        setPreview(p.images || []);

        setShowForm(true);

    };

    const navigate = useNavigate();

    return (

        <div className="admin-page">

            <div className="admin-header">

                <h2>Products</h2>

                <div className="admin-tools">

                    <input
                        placeholder="Search product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        className="admin-add-btn"
                        onClick={() => {
                            resetForm();
                            setTimeout(() => setShowForm(true), 0);
                        }}
                    >
                        + Add Product
                    </button>

                </div>

            </div>

            {showForm && (

                <div className="admin-modal">

                    <div className="admin-form">

                        <h3>{editing ? "Edit Product" : "Add Product"}</h3>

                        <input
                            placeholder="Product Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <input
                            placeholder="Price"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                        />

                        <input
                            placeholder="Stock"
                            value={form.stock}
                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        />

                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />

                        <input
                            type="file"
                            multiple
                            onChange={(e) => handleImageChange(e.target.files)}
                        />

                        <input
                            type="text"
                            placeholder="Brand"
                            value={form.brand}
                            onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        />

                        <input
                            type="text"
                            placeholder="Material"
                            value={form.material}
                            onChange={(e) => setForm({ ...form, material: e.target.value })}
                        />

                        <select
                            value={form.fit}
                            onChange={(e) => setForm({ ...form, fit: e.target.value })}
                        >
                            <option value="">Fit</option>
                            <option>Oversized</option>
                            <option>Regular</option>
                            <option>Slim</option>
                        </select>

                        <select
                            value={form.neckline}
                            onChange={(e) => setForm({ ...form, neckline: e.target.value })}
                        >
                            <option value="">Neckline</option>
                            <option>Round Neck</option>
                            <option>V Neck</option>
                            <option>Polo</option>
                        </select>

                        <select
                            value={form.sleeveType}
                            onChange={(e) => setForm({ ...form, sleeveType: e.target.value })}
                        >
                            <option>Half Sleeve</option>
                            <option>Full Sleeve</option>
                            <option>Sleeveless</option>
                        </select>

                        <select
                            value={form.fabricWeight}
                            onChange={(e) => setForm({ ...form, fabricWeight: e.target.value })}
                        >
                            <option>120 GSM</option>
                            <option>160 GSM</option>
                            <option>180 GSM</option>
                            <option>200 GSM</option>
                            <option>220 GSM</option>
                            <option>240 GSM</option>
                        </select>

                        <select
                            value={form.pattern}
                            onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                        >
                            <option>Solid</option>
                            <option>Graphic</option>
                            <option>Printed</option>
                            <option>Striped</option>
                        </select>

                        <select
                            value={form.gender}
                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        >
                            <option>Men</option>
                            <option>Women</option>
                            <option>Unisex</option>
                        </select>

                        <div className="image-preview">
                            {preview.map((img, i) => (
                                <img key={i} src={img} alt="" />
                            ))}
                        </div>

                        <label>Sizes</label>

                        <div className="size-grid">
                            {["XS", "S", "M", "L", "XL", "XXL"].map(size => {

                                const isActive = sizes.includes(size);

                                return (
                                    <div
                                        key={size}
                                        className={`size-option ${isActive ? "active" : ""}`}
                                        onClick={() => {
                                            setSizes(prev => {
                                                if (prev.includes(size)) {
                                                    return prev.filter(s => s !== size);
                                                } else {
                                                    return [...prev, size];
                                                }
                                            });
                                        }}
                                    >
                                        {size}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="color-grid">
                            {colorOptions.map(c => {

                                const isActive = colors.includes(c);

                                return (
                                    <div
                                        key={c}
                                        className={`color-option ${isActive ? "active" : ""}`}
                                        onClick={() => {
                                            setColors(prev => {
                                                if (prev.includes(c)) {
                                                    return prev.filter(x => x !== c);
                                                } else {
                                                    return [...prev, c];
                                                }
                                            });
                                        }}
                                    >

                                        <span style={{ background: c.toLowerCase() }}></span>
                                        <p>{c}</p>

                                    </div>
                                );
                            })}
                        </div>

                        <label>Cash on Delivery</label>

                        <div className="cod-toggle">

                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={codAvailable}
                                    onChange={(e) => setCodAvailable(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>

                            <span style={{ marginLeft: "10px" }}>
                                {codAvailable ? "Enabled" : "Disabled"}
                            </span>

                        </div>


                        <div className="admin-form-actions">

                            {editing ? (


                                <button onClick={updateProduct}>
                                    Update Product
                                </button>

                            ) : (

                                <button onClick={addProduct}>
                                    Add Product
                                </button>

                            )}

                            <button
                                className="cancel-btn"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

            <table className="admin-table">

                <thead>

                    <tr>

                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {filtered.map(p => (

                        <tr
                            key={p._id}
                            onClick={() => navigate(`/product/${p._id}`)}
                            style={{
                                cursor: "pointer",
                                transition: "background 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#1a1a1a";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                            }}
                        >

                            <td>
                                <img
                                    src={p.images?.[0]}
                                    className="admin-product-img"
                                    alt={p.name}
                                />
                            </td>

                            <td>{p.name}</td>

                            <td>₹{p.price}</td>

                            <td>{p.stock}</td>

                            <td>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // ✅ prevent redirect
                                        editProduct(p);
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation(); // ✅ prevent redirect
                                        deleteProduct(p._id);
                                    }}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}