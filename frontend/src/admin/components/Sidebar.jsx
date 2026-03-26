import { Link } from "react-router-dom";
import "../../styles/admin.css";

export default function AdminSidebar() {

    return (

        <div className="admin-sidebar">

            <h2>Admin</h2>

            <Link to="/admin">Dashboard</Link>

            <Link to="/admin/products">Products</Link>

            <Link to="/admin/coupons">🎟 Coupons</Link>

            <Link to="/admin/orders">Orders</Link>

            <Link to="/admin/users">Users</Link>

            <li>
                <a href="/admin/notifications">
                    🔔 Notifications
                </a>
            </li>

            <Link to="/admin/reviews">Reviews</Link>

            <Link to="/admin/review-analytics">
                Review Analytics
            </Link>

            <Link to="/admin/logs">Activity Logs</Link>

            <Link to="/admin/refund-logs">Refund Logs</Link>

            <Link to="/admin/top-products">📦 Top Products</Link>

            <Link to="/admin/export">Export</Link>

        </div>

    );

}