import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuanLyTaiKhoan = () => {
    const [taiKhoans, setTaiKhoans] = useState([]);
    const [chucVus, setChucVus] = useState([]);
    const [newTaiKhoan, setNewTaiKhoan] = useState({
        tenTaiKhoan: '',
        matKhau: '',
        email: '',
        idChucVu: ''
    });
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchTaiKhoanList();
        fetchChucVuList();
    }, []);

    const fetchTaiKhoanList = async () => {
        try {
            const response = await axios.get('https://localhost:5288/api/taikhoan');
            setTaiKhoans(response.data);
        } catch (error) {
            console.error('Lỗi lấy danh sách tài khoản:', error);
        }
    };

    const fetchChucVuList = async () => {
        try {
            const response = await axios.get('https://localhost:5288/api/chucvu');
            setChucVus(response.data);
        } catch (error) {
            console.error('Lỗi lấy danh sách chức vụ:', error);
        }
    };

    const handleAddTaiKhoan = async () => {
        if (!newTaiKhoan.tenTaiKhoan || !newTaiKhoan.matKhau || !newTaiKhoan.email || !newTaiKhoan.idChucVu) {
            setErrorMsg('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            const selectedChucVu = chucVus.find(cv => cv.idChucVu === newTaiKhoan.idChucVu);

            const payload = {
                tenTaiKhoan: newTaiKhoan.tenTaiKhoan,
                matKhau: newTaiKhoan.matKhau,
                email: newTaiKhoan.email,
                idChucVu: newTaiKhoan.idChucVu,
                ngayCap: new Date().toISOString(),
                trangThai: true
            };


            await axios.post('https://localhost:5288/api/taikhoan', payload);

            setNewTaiKhoan({ tenTaiKhoan: '', matKhau: '', email: '', idChucVu: '' });
            setErrorMsg('');
            fetchTaiKhoanList();
        } catch (error) {
            console.error('Lỗi thêm tài khoản:', error);
            const errData = error.response?.data;

            if (typeof errData === 'string') {
                setErrorMsg(errData);
            } else if (errData?.title) {
                setErrorMsg(errData.title);
            } else {
                setErrorMsg('Lỗi không xác định!');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá tài khoản này?')) {
            await axios.delete(`https://localhost:5288/api/taikhoan/${id}`);
            fetchTaiKhoanList();
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h2>📋 Quản lý tài khoản</h2>

            <div style={{ marginBottom: '20px' }}>
                <h3>➕ Thêm tài khoản mới</h3>
                <input
                    placeholder="Tên tài khoản"
                    value={newTaiKhoan.tenTaiKhoan}
                    onChange={(e) => setNewTaiKhoan({ ...newTaiKhoan, tenTaiKhoan: e.target.value })}
                /><br />
                <input
                    placeholder="Mật khẩu"
                    type="password"
                    value={newTaiKhoan.matKhau}
                    onChange={(e) => setNewTaiKhoan({ ...newTaiKhoan, matKhau: e.target.value })}
                /><br />
                <input
                    placeholder="Email"
                    value={newTaiKhoan.email}
                    onChange={(e) => setNewTaiKhoan({ ...newTaiKhoan, email: e.target.value })}
                /><br />
                <select
                    value={newTaiKhoan.idChucVu}
                    onChange={(e) => setNewTaiKhoan({ ...newTaiKhoan, idChucVu: Number(e.target.value) })}
                >
                    <option value="">-- Chọn chức vụ --</option>
                    {chucVus.map((cv) => (
                        <option key={cv.idChucVu} value={cv.idChucVu}>
                            {cv.tenChucVu}
                        </option>
                    ))}
                </select><br />

                <button onClick={handleAddTaiKhoan} style={{ marginTop: '10px' }}>Thêm</button>
                {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            </div>

            <h3>📑 Danh sách tài khoản</h3>
            <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tài khoản</th>
                        <th>Email</th>
                        <th>Ngày cấp</th>
                        <th>Trạng thái</th>
                        <th>Chức vụ</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {taiKhoans.map((tk) => (
                        <tr key={tk.idTaiKhoan}>
                            <td>{tk.idTaiKhoan}</td>
                            <td>{tk.tenTaiKhoan}</td>
                            <td>{tk.email}</td>
                            <td>{new Date(tk.ngayCap).toLocaleDateString()}</td>
                            <td>{tk.trangThai ? 'Hoạt động' : 'Vô hiệu'}</td>
                            <td>{tk.idChucVu}</td>
                            <td>
                                <button onClick={() => handleDelete(tk.idTaiKhoan)}>🗑 Xoá</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuanLyTaiKhoan;
