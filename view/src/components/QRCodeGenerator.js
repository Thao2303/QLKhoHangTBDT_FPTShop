import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = ({ value, label }) => (
    <div style={{ margin: "10px", textAlign: "center" }}>
        <QRCodeCanvas value={value} size={120} />
        <div style={{ fontSize: 12, marginTop: 4 }}>{label}</div>
    </div>
);

export default QRCodeGenerator;
