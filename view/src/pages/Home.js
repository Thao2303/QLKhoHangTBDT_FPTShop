import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Home = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-5">
                    <h1 className="text-2xl font-bold">Trang chủ nhân viên nhập kho</h1>
                    <p className="mt-3">Chào mừng bạn đến với hệ thống quản lý kho của FPT Shop!</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
