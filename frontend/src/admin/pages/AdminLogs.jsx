import React, { useEffect, useState } from "react";
import API from "../../utils/axios";
import "./adminLogs.css";

export default function AdminLogs() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchLogs = async () => {

      try {

        const res = await API.get("/admin/logs");
        setLogs(res.data);

      } catch (err) {

        console.log("Failed to fetch logs:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchLogs();

  }, []);

  return (

    <div className="admin-logs-page">

      <h2 className="admin-logs-title">
        Admin Activity Logs
      </h2>

      {loading && (
        <p className="logs-loading">Loading logs...</p>
      )}

      {!loading && logs.length === 0 && (
        <p className="logs-empty">No activity recorded yet.</p>
      )}

      {!loading && logs.length > 0 && (

        <div className="logs-table-container">

          <table className="logs-table">

            <thead>

              <tr>
                <th>Admin</th>
                <th>Action</th>
                <th>Description</th>
                <th>Date</th>
              </tr>

            </thead>

            <tbody>

              {logs.map(log => (

                <tr key={log._id}>

                  <td className="log-admin">
                    {log.admin?.name || "Admin"}
                  </td>

                  <td>
                    <span className={`log-action ${log.action}`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="log-description">
                    {log.description}
                  </td>

                  <td className="log-date">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}