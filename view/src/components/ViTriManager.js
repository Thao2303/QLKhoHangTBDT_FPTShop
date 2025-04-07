import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViTriManager = () => {
    const [viTriList, setViTriList] = useState([]);
    const [newViTri, setNewViTri] = useState({
        day: '',
        cot: '',
        tang: '',
        sucChua: '',
        daDung: '',
    });

    useEffect(() => {
        axios.get('https://localhost:5288/api/vitri')
            .then(res => setViTriList(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleAdd = () => {
        axios.post('https://localhost:5288/api/vitri', newViTri)
            .then(res => {
                setViTriList([...viTriList, res.data]);
                setNewViTri({
                    day: '',
                    cot: '',
                    tang: '',
                    sucChua: '',
                    daDung: '',
                });
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h2>Quản lý Vị trí Kho</h2>
            <div>
                <input type="text" value={newViTri.day} onChange={(e) => setNewViTri({ ...newViTri, day: e.target.value })} placeholder="Dãy" />
                <input type="number" value={newViTri.cot} onChange={(e) => setNewViTri({ ...newViTri, cot: e.target.value })} placeholder="Cột" />
                <input type="number" value={newViTri.tang} onChange={(e) => setNewViTri({ ...newViTri, tang: e.target.value })} placeholder="Tầng" />
                <input type="number" value={newViTri.sucChua} onChange={(e) => setNewViTri({ ...newViTri, sucChua: e.target.value })} placeholder="Sức chứa" />
                <input type="number" value={newViTri.daDung} onChange={(e) => setNewViTri({ ...newViTri, daDung: e.target.value })} placeholder="Đã dùng" />
                <button onClick={handleAdd}>Thêm vị trí</button>
            </div>
            <div>
                <h3>Danh sách Vị trí</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Dãy</th>
                            <th>Cột</th>
                            <th>Tầng</th>
                            <th>Sức chứa</th>
                            <th>Đã dùng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viTriList.map((viTri, index) => (
                            <tr key={index}>
                                <td>{viTri.day}</td>
                                <td>{viTri.cot}</td>
                                <td>{viTri.tang}</td>
                                <td>{viTri.sucChua}</td>
                                <td>{viTri.daDung}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViTriManager;
