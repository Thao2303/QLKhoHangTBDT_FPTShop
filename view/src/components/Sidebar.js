import { FaHome, FaClipboardList, FaHistory, FaMapMarkedAlt, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><FaHome className="mr-3" /> Dashboard</li>
                <li className="p-2 hover:bg-gray-100 rounded-md flex items-center"><FaClipboardList className="mr-3" /> Quản lý phiếu nhập kho</li>
                <li className="p-2 hover:bg-gray-100 rounded-md flex items-center"><FaHistory className="mr-3" /> Lịch sử nhập kho</li>
                <li className="p-2 hover:bg-gray-100 rounded-md flex items-center"><FaMapMarkedAlt className="mr-3" /> Vị trí trống trong kho</li>
                <li className="p-2 hover:bg-gray-100 rounded-md flex items-center"><FaSignOutAlt className="mr-3" /> Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;
