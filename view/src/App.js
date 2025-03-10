import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import "./App.css";


const App = () => {
    return (
        <div className="app">
            <Navbar />
            <Sidebar />
            <div className="content">
                <Dashboard />
            </div>
        </div>
    );
};

export default App;
