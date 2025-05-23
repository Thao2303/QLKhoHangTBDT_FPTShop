﻿import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

let connection = null;

export const connectSignalR = (onMessage) => {
    if (connection && connection.state === "Connected") return;

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.idTaiKhoan;
    if (!userId) return;

    connection = new HubConnectionBuilder()
        .withUrl(`https://localhost:5288/hub/thongbao?userId=${userId}`)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

    connection.on("NhanThongBao", (msg) => {
        if (onMessage) onMessage(msg);
    });


    connection.onclose(err => {
        console.warn("❌ SignalR connection closed", err);
        connection = null;
    });

    connection.onreconnecting(err => {
        console.warn("🔄 SignalR reconnecting...", err);
    });

    connection.onreconnected(id => {
        console.log("✅ SignalR reconnected:", id);
    });

    connection.start()
        .then(() => console.log("✅ SignalR connected"))
        .catch(err => {
            console.error("❌ SignalR connection error:", err);
            connection = null;
        });
};

export const stopSignalR = () => {
    if (connection && connection.state !== "Disconnected") {
        connection.stop().then(() => {
            console.log("🛑 SignalR stopped");
            connection = null;
        });
    }
};
