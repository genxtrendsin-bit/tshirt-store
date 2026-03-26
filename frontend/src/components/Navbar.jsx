// ===== IMPORTS =====
import React, { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { searchProducts } from "../services/searchService";
import "../styles/navbar.css";
import NotificationBell from "./NotificationBell";

export default function Navbar() {

  const { cartCount } = useContext(CartContext);


  // ===== STATES =====
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  // ===== CHECK LOGIN =====
  useEffect(() => {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token) {
      setIsLoggedIn(true);
      setUserRole(user?.role);
    }

  }, []);

  // ===== LOGOUT =====
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUserRole(null);

    navigate("/");

  };

  // ===== LIVE SEARCH =====
  useEffect(() => {

    const fetchSuggestions = async () => {

      if (search.length < 2) {
        setSuggestions([]);
        return;
      }

      try {

        const data = await searchProducts(search);
        setSuggestions(data.slice(0, 6));

      } catch (err) {

        console.log(err);

      }

    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);

  }, [search]);

  // ===== SEARCH SUBMIT =====
  const handleSearch = () => {

    if (!search.trim()) return;

    navigate(`/search?q=${search}`);
    setSuggestions([]);

  };

  // ===== CLOSE MENU WHEN CLICK OUTSIDE =====
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setShowAccountMenu(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  return (

    <>

      {/* ===== TOP NAVBAR ===== */}
      <nav className="navbar">

        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/")}>
          GenXTrends
        </div>

        {/* SEARCH BAR */}
        <div className="search-container">

          <input
            placeholder="Search GenXTrends"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button onClick={handleSearch}>
            🔍
          </button>

          {/* SEARCH SUGGESTIONS */}
          {suggestions.length > 0 && (

            <div className="search-suggestions">

              {suggestions.map(item => (

                <div
                  key={item._id}
                  className="suggestion-item"
                  onClick={() => {
                    navigate(`/product/${item._id}`);
                    setSearch("");
                    setSuggestions([]);
                  }}
                >

                  <img
                    src={item.image || "/placeholder.png"}
                    alt=""
                  />

                  <div>

                    <p>{item.name}</p>
                    <span>₹{item.price}</span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* NAV LINKS */}
        <div className="nav-right">

          <NotificationBell />

          <Link to="/cart">
            🛒 Cart ({cartCount})
          </Link>

          <Link to="/orders">
            Orders
          </Link>

          <Link to="/wishlist">
            ❤️ Wishlist
          </Link>

          {/* ADMIN */}
          {userRole === "admin" && (
            <Link to="/admin">Admin</Link>
          )}

          {/* ACCOUNT */}
          <div className="account" ref={accountRef}>

            <span
              className="account-btn"
              onClick={() => setShowAccountMenu(!showAccountMenu)}
            >
              Account ▾
            </span>

            {showAccountMenu && (

              <div className="account-menu">

                {/* NOT LOGGED IN */}

                {!isLoggedIn && (

                  <>
                    <Link
                      to="/login"
                      onClick={() => {
                        setShowAccountMenu(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => {
                        setShowAccountMenu(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Register
                    </Link>
                  </>

                )}

                {/* LOGGED IN */}

                {isLoggedIn && (

                  <>
                    <Link
                      to="/account"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      Your Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      Wishlist
                    </Link>

                    

                    <button
                      onClick={() => {
                        handleLogout();
                        setShowAccountMenu(false);
                      }}
                    >
                      Logout
                    </button>
                  </>

                )}

              </div>

            )}

          </div>

        </div>

      </nav>

      {/* ===== CATEGORY BAR ===== */}
      <div className="category-bar">

        <Link to="/">Home</Link>

        <Link to="/top-products">🔥 Top-10 </Link>

        <Link to="/category/new">✨ New Arrivals</Link>

        <Link to="/category/tshirts">👕 T-Shirts</Link>

        <Link to="/category/hoodies">🧥 Hoodies</Link>

        <Link to="/category/jackets">🥼 Jackets</Link>

        <Link to="/category/pants">👖 Pants</Link>

        <Link to="/category/accessories">💼 Accessories</Link>

      </div>

    </>

  );

}