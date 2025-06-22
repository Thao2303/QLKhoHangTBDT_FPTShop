import { useEffect } from "react";
import { stopSignalR } from "../common/signalrClient";

const AutoLogout = () => {
    useEffect(() => {
        let timeout;

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                stopSignalR();
                localStorage.removeItem("user");
                alert("🕒 Bạn đã bị đăng xuất do không hoạt động trong 15 phút.");
                window.location.href = "/login";
            }, 15 * 60 * 1000); // 15 phút
        };

        // Gọi lần đầu
        resetTimer();

        // Sự kiện người dùng tương tác
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
        };
    }, []);

    return null; // Không render gì
};

export default AutoLogout;
