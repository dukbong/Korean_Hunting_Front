import React, { useState, useEffect } from "react";
import axiosInstance from "./apiIntercepter";
import { useNavigate } from "react-router-dom";
import './css/footer.css';

function Metrics() {
    const navigate = useNavigate(); // useHistory 대신 useNavigate 사용
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (!token) {
          navigate("/dashboard");
        } else {
          axiosInstance
            .get("/actuator/metrics/http.server.requests?tag=uri:/file/upload", { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                console.log(response);
                setMetrics(response.data);
            })
        }
    }, [navigate]);

    return (
            <div>
                {metrics && (
                    <pre>{JSON.stringify(metrics, null, 2)}</pre>
                )}
            </div>
    );
}

export default Metrics;