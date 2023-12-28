import TambahAdmin from "./Utils/TambahAdmin";
import GantiPassword from "./Utils/Perbandingan/GantiPassword";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Spin, notification } from "antd";
import logoMadya from "./assets/sisca-madya-high-resolution-logo-color-on-transparent-background.png";

function DashboardAdmin(){
    const [load, isLoad] = useState(false);
    const [nama, setNama] = useState("Admin");
    const nav = useNavigate();
    useEffect(() => {
        isLoad(true);
        if(localStorage.getItem("token")){
            const token = JSON.parse(localStorage.getItem("token"));
            setNama(token.nama)
            isLoad(false);
        }else{
            notification.error({message: "Maaf anda tidak login. Mohon login telebih dahulu"});
            isLoad(false);
            setTimeout(() => {
                nav("/");
            }, 2000);
        }
        isLoad(false);
    }, []);
    return(
        <Spin spinning={load}>
            <div>
                <div style={{display: "flex", gap: 10}}>
                    <TambahAdmin />
                    <GantiPassword />
                </div>
                <div className="dash-img">
                    <Image src={logoMadya} />
                </div>
                <div style={{width: "50vw", margin: "50px auto", textAlign: "center"}}>
                <p style={{fontWeight: 'bold', fontSize: "2em"}}>Selamat Datang {nama}</p>
                </div>
                <div style={{width: '50vw', margin: "20px auto"}}>
                    <p>Ini adalah halaman Admin, dimana admin dapat melakukan pengelolaan kriteria dengan menekan menu kriteria, pengelolaan Alternaitf dengan menekan menu alternatif, pengelolaan Perhitungan dengan menekan menu perhitungan.</p>
                    <p>Perhitungan untuk Sistem Pengambilan Keputusan ini dilakukan dengan metode Analytical Hierarchy Process, dimana setiap Kriteria akan dilakukan perbandingan untuk menghitung bobot dan alternatif akan dilakukan perbandingan berdasarkan kriteria tersebut, untuk menentukan rangking dari setiap alternatif yang tersedia.</p>
                </div>
            </div>
        </Spin>
    )
}
export default DashboardAdmin;