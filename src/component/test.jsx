import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./apiIntercepter";
import './css/info.css';

const Test = () => {
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      axiosInstance
        .get("/actuator/metrics/jvm.memory.used", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setMetrics(response.data);
        })
    }
  }, [navigate]);

  const MemoryCommit = () => {
    const token = localStorage.getItem("token");
    axiosInstance
        .get("/actuator/metrics/jvm.memory.committed", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
        setMetrics(response.data);
        })
  }
  const MemoryUse = () => {
    const token = localStorage.getItem("token");
    axiosInstance
        .get("/actuator/metrics/jvm.memory.used", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
        setMetrics(response.data);
        })
  }
  const ProcessUseCpu = () => {
    const token = localStorage.getItem("token");
    axiosInstance
        .get("/actuator/metrics/process.cpu.usage", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
        setMetrics(response.data);
        })
  }
  const MemoryHeap = () => {
    const token = localStorage.getItem("token");
    axiosInstance
        .get("/actuator/metrics/jvm.memory.used?tag=area:heap", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
        setMetrics(response.data);
        })
  }
  const MemoryNoHeap = () => {
    const token = localStorage.getItem("token");
    axiosInstance
        .get("/actuator/metrics/jvm.memory.used?tag=area:nonheap", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
        setMetrics(response.data);
        })
  }
  const ServerRequest = () => {
    const token = localStorage.getItem("token");
    axiosInstance
        .get("/actuator/metrics/http.server.requests", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
        setMetrics(response.data);
        })
  }
  const ServerRequestFile = () => {
    const token = localStorage.getItem("token");
    axiosInstance
        .get("/actuator/metrics/http.server.requests?tag=uri:/file/upload", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            try{
                setMetrics(response.data);
            } catch(error){
                setMetrics("NOT FOUND DATA");
            }
        })
  }
  const HeapDump = () => {
    const token = localStorage.getItem("token");
    axiosInstance
        .get("/actuator/heapdump", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
        setMetrics(response.data);
        })
  }

  return (
    <div style={{ marginTop: '73.5px' }}>
        <button onClick={MemoryCommit}>momory - commitited</button>
        <button onClick={MemoryUse}>memory - use</button>
        <button onClick={MemoryHeap}>memory - useHeap</button>
        <button onClick={MemoryNoHeap}>memory - useNoHeap</button>
        <button onClick={ProcessUseCpu}>process - useCpu</button>
        <button onClick={ProcessUseCpu}>process - useCpu</button>
        <button onClick={ServerRequest}>server - request</button>
        <button onClick={ServerRequestFile}>server - request - file</button>
        <button onClick={HeapDump}>server - heapdump</button>
        <pre>{JSON.stringify(metrics, null, 2)}</pre>
    </div>
  );
};

export default Test;
