import { useEffect } from "react";
import { stopSignalR } from "../common/signalrClient"; // đường dẫn tùy cấu trúc thư mục

const Logout = () => {
    useEffect(() => {
        stopSignalR();
        localStorage.removeItem("user");
        window.location.href = "/login";
    }, []);

    return null; // không render gì
};

export default Logout;
