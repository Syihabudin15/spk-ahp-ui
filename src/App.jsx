import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./Login"
import "./style.css";
import { useEffect, useState } from "react";
import DashboardAdmin from "./DashboardAdmin";
import KelolaKriteria from "./KelolaKriteria";
import KelolaAlternatif from "./KelolaAlternatif";
import KelolaPerhitungan from "./KelolaPerhitungan";
import PerbandinganKriteria from "./Utils/Perbandingan/PerbandinganKriteria";
import PerbandinganAlternatif from "./Utils/Perbandingan/PerbandinganAlternatif";
import LihatHasil from "./LihatHasil";
import Modal from "antd/es/modal/Modal";
import { Button, Image } from "antd";

function App() {
  const [login, setLogin] = useState(false);
  const [show, isShow] = useState(false);
  const [menu, setMenu] = useState();
  
  useEffect(() => {
    if(localStorage.getItem('token')){
      setLogin(true);
      setMenu(<><Route path="/dashboard" element={<DashboardAdmin/>} />
      <Route path="/kriteria" element={<KelolaKriteria/>} />
      <Route path="/alternatif" element={<KelolaAlternatif/>} />
      <Route path="/perhitungan" element={<KelolaPerhitungan/>} />
      <Route path="per-kriteria/:id" element={<PerbandinganKriteria/>} />
      <Route path="/per-alternatif/:id" element={<PerbandinganAlternatif />} />
      <Route path="/lihat-hasil/:id" element={<LihatHasil/>} /></>);
    }else{
      setLogin(false);
      setMenu(<>
        <Route path="/*" element={<div>
          <h2 style={{
          textAlign: 'center', marginTop: 100, color: 'red', fontStyle: 'italic'
        }}>Mohon login untuk mengakses halaman ini</h2>
        <div style={{display: "flex", justifyContent: "center", width: 200, margin: "auto"}}><a href="/" style={{width: '100%'}}><Button block type="primary">Login</Button></a></div>
        </div>} />
      </>);
    }
  }, []);
  return (
    <>
    <BrowserRouter>
    <div style={{display: "flex", justifyContent: "space-between", padding: 20}}>
      <div style={{fontWeight: 'bold', fontSize: "1.2em"}}><p><a href="/dashboard" style={{textDecoration: "none", color: 'black'}}>Dashboard</a></p></div>
      <div>
        <ul style={{display: login ? "flex" : "none", justifyContent: "center", gap: 20, listStyle: "none"}} className="menu">
          <li><a href="/kriteria">Kriteria</a></li>
          <li><a href="/alternatif">Alternatif</a></li>
          <li><a href="/perhitungan">Perhitungan</a></li>
          <li><a style={{color: 'red'}} href="#logout" onClick={() => isShow(true)}>Logout</a></li>
        </ul>
      </div>
    </div>
    <Routes>
      <Route path="/" element={<Login/>} />
      {menu}
    </Routes>
    </BrowserRouter>
    <div style={{position: 'fixed', bottom: 0,backgroundColor: 'lightgray', width: "99vw", padding: 10, textAlign: 'center', fontStyle: 'italic'}}>
    Sistem Pendukung Keputusan Pemilihan Teknisi Madya
    </div>
    <Modal footer={[]} title="Konfirmasi" open={show} onCancel={() => isShow(false)}>
      <p>Lanjutkan Logout?</p>
      <div style={{display: "flex", justifyContent: 'flex-end'}}>
        <a href="/" onClick={() => localStorage.removeItem("token")}>
        <Button type="primary">Ya</Button>
        </a>
      </div>
    </Modal>
    </>
  )
}

export default App
