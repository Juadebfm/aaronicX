import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const LoginHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          "https://payment-gray-phi.vercel.app/api/auth/login-history",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        setHistory(data.loginHistory);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Login History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Device</th>
              <th className="px-4 py-2">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {history.map((login, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  {format(new Date(login.timestamp), "PPpp")}
                </td>
                <td className="border px-4 py-2">{login.location}</td>
                <td className="border px-4 py-2">{login.browser}</td>
                <td className="border px-4 py-2">{login.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginHistory;
