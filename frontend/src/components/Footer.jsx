import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {

    // CHECK LOGIN
    const user = JSON.parse(localStorage.getItem("user"));

    // SCROLL TO TOP
    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (

        <footer className="footer">

            <div className="footer-container">


                {/* ABOUT */}

                <div className="footer-col">

                    <h3>DJKavod</h3>

                    <p>
                        Modern fashion and trending products at the best price.
                        Shop the latest styles and discover new trends everyday.
                    </p>

                </div>


                {/* SHOP */}

                <div className="footer-col">

                    <h4>Shop</h4>

                    <Link to="/" onClick={scrollTop}>Home</Link>

                    <Link to="/wishlist" onClick={scrollTop}>Wishlist</Link>

                    <Link to="/cart" onClick={scrollTop}>Cart</Link>

                    <Link to="/orders" onClick={scrollTop}>Orders</Link>

                </div>


                {/* ACCOUNT */}

                <div className="footer-col">

                    <h4>Account</h4>

                    {user ? (

                        <>

                            <Link to="/account" onClick={scrollTop}>My Account</Link>

                            <Link to="/orders" onClick={scrollTop}>Track Order</Link>

                        </>

                    ) : (

                        <>

                            <Link to="/login" onClick={scrollTop}>Login</Link>

                            <Link to="/register" onClick={scrollTop}>Register</Link>

                        </>

                    )}

                </div>


                {/* HELP */}

                <div className="footer-col">

                    <h4>Help</h4>

                    <Link to="/shipping">Shipping Info</Link>

                    <Link to="/privacy">Privacy Policy</Link>

                    <Link to="/terms">Terms & Conditions</Link>

                </div>


            </div>


            {/* BOTTOM BAR */}

            <div className="footer-bottom">

                <p>

                    © {new Date().getFullYear()} DJKavod. All rights reserved.

                </p>

            </div>

        </footer>

    );

}