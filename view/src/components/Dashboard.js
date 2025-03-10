import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
    const [taiKhoanList, setTaiKhoanList] = useState([]);

    useEffect(() => {
        const fetchTaiKhoan = async () => {
            try {
                const response = await axios.get('https://localhost:5288/api/TaiKhoan');
                setTaiKhoanList(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tài khoản:", error);
            }
        };

        fetchTaiKhoan();
    }, []);

    return (
        <div>
            <h2>Danh sách tài khoản</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên tài khoản</th>
                        <th>Email</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {taiKhoanList.map((taiKhoan) => (
                        <tr key={taiKhoan.idTaiKhoan}>
                            <td>{taiKhoan.idTaiKhoan}</td>
                            <td>{taiKhoan.tenTaiKhoan}</td>
                            <td>{taiKhoan.email}</td>
                            <td>{taiKhoan.trangThai ? "Kích hoạt" : "Vô hiệu hóa"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
