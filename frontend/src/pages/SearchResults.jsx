import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../utils/axios";
import "../styles/search.css";
import { useNavigate } from "react-router-dom";

export default function SearchResults() {

    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");

    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [maxPrice, setMaxPrice] = useState(50000);
    const [minRating, setMinRating] = useState(0);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [sort, setSort] = useState("");
    const navigate = useNavigate();

    /* FETCH PRODUCTS */

    useEffect(() => {

        const fetchProducts = async () => {

            const res = await API.get(`/products/search?q=${query}`);

            setProducts(res.data);
            setFiltered(res.data);

        };

        fetchProducts();

    }, [query]);



    /* FILTER LOGIC */

    useEffect(() => {

        let result = [...products];

        result = result.filter(p => p.price <= maxPrice);

        result = result.filter(p => p.rating >= minRating);

        if (selectedSizes.length > 0) {
            result = result.filter(p =>
                p.sizes?.some(s => selectedSizes.includes(s))
            );
        }

        if (selectedColors.length > 0) {
            result = result.filter(p =>
                p.colors?.some(c => selectedColors.includes(c))
            );
        }


        /* SORT */

        if (sort === "low") {
            result.sort((a, b) => a.price - b.price);
        }

        if (sort === "high") {
            result.sort((a, b) => b.price - a.price);
        }

        if (sort === "rating") {
            result.sort((a, b) => b.rating - a.rating);
        }

        setFiltered(result);

    }, [maxPrice, minRating, selectedSizes, selectedColors, sort, products]);



    /* SIZE SELECT */

    const toggleSize = size => {

        if (selectedSizes.includes(size)) {

            setSelectedSizes(selectedSizes.filter(s => s !== size));

        } else {

            setSelectedSizes([...selectedSizes, size]);

        }

    };



    /* COLOR SELECT */

    const toggleColor = color => {

        if (selectedColors.includes(color)) {

            setSelectedColors(selectedColors.filter(c => c !== color));

        } else {

            setSelectedColors([...selectedColors, color]);

        }

    };



    return (

        <div className="search-page">


            {/* FILTER PANEL */}

            <div className="filter-panel">

                <h3>Filters</h3>


                {/* PRICE */}

                <div className="filter-section">

                    <h4>Price</h4>

                    <input
                        type="range"
                        min="0"
                        max="50000"
                        step="500"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />

                    <p>Up to ₹{maxPrice.toLocaleString()}</p>

                </div>


                {/* RATING */}

                <div className="filter-section">

                    <h4>Rating</h4>

                    <select
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                    >

                        <option value="0">All</option>
                        <option value="4">4★ & above</option>
                        <option value="3">3★ & above</option>
                        <option value="2">2★ & above</option>

                    </select>

                </div>


                {/* SIZE */}

                <div className="filter-section">

                    <h4>Size</h4>

                    <div className="size-filter">

                        {["S", "M", "L", "XL"].map(size => (

                            <button
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={selectedSizes.includes(size) ? "active" : ""}
                            >

                                {size}

                            </button>

                        ))}

                    </div>

                </div>


                {/* COLOR */}

                <div className="filter-section">

                    <h4>Color</h4>

                    <div className="color-filter">

                        {["black", "white", "red", "blue", "green"].map(color => (

                            <button
                                key={color}
                                onClick={() => toggleColor(color)}
                                className={selectedColors.includes(color) ? "active" : ""}
                            >

                                {color}

                            </button>

                        ))}

                    </div>

                </div>


                {/* SORT */}

                <div className="filter-section">

                    <h4>Sort</h4>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >

                        <option value="">Default</option>
                        <option value="low">Price Low → High</option>
                        <option value="high">Price High → Low</option>
                        <option value="rating">Top Rated</option>

                    </select>

                </div>

            </div>



            {/* PRODUCTS */}

            <div className="product-grid">
  {filtered.map(product => (
    <div
      key={product._id}
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
      style={{ cursor: "pointer" }}
    >
      <img src={product.images?.[0]} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <p>{"⭐".repeat(Math.round(product.rating || 0))}</p>
    </div>
  ))}
</div>

        </div>

    );

}