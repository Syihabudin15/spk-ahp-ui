import { Button, Table, Spin, Input, notification } from "antd";
import { useEffect, useState } from "react";
import TambahPerhitungan from "./Utils/TambahPerhitungan";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function KelolaPerhitungan(){
    const [load, setLoad] = useState(false);
    const [perhitungan, setPerhitungan] = useState([]);
    const [nama, setNama] = useState();
    const nav = useNavigate();
    const columns = [
        {title: "Nama Perhitungan", key:'nama', dataIndex: 'nama'},
        {title: "Deksripsi", key:'deskdripsi', dataIndex: 'deskripsi'},
        {title: "Status", key: "selesai", dataIndex: 'selesai', render: (selesai) => (
            <>
                <p>{selesai ? "Selesai" : "Prosess"}</p>
            </>
        )},
        {title: "Aksi", key:'id', dataIndex: 'id', render: (id, data) => (
            <div style={{display: 'flex', gap: 5}}>
                {data.selesai ? <Button type="primary" onClick={() => nav(`/lihat-hasil/${id}`)} ghost>Lihat Hasil</Button> : <Button type="primary" onClick={() => nav(`/per-kriteria/${id}`)} ghost>Hitung</Button>}
            </div>
        )}
    ]


    const getPerhitungan = () => {
        setLoad(true)
        axios.get("http://localhost:5000/semua-perhitungan")
        .then(res => {
            setPerhitungan(res.data.data);
        })
        .catch(err => {
            notification.error({message: err.response.data.msg});
        })
        setLoad(false);
    }
    useEffect(() => {
        if(!nama){
            getPerhitungan();
        }else{
            axios.get(`http://localhost:5000/cari-perhitungan?nama=${nama}`)
            .then(res=>{
                setPerhitungan(res.data.data);
            }).catch(err => {
                notification.error({message: err.response.data.msg});
            })
        }
    }, [getPerhitungan, nama]);
    return(
        <>
            <div>
                <Spin spinning={load}>
                <div style={{width: "80vw", margin: '20px auto'}}>
                    <div style={{display: 'flex', justifyContent: "space-around", marginBottom: 10}}>
                        <div>
                            <TambahPerhitungan funct={getPerhitungan}/>
                        </div>
                        <div>
                            <Input.Search onChange={(e) => setNama(e.target.value)}/>
                        </div>
                    </div>
                    <Table columns={columns} dataSource={perhitungan} total={perhitungan.length} pagination />
                </div>
            </Spin>
            </div>
        </>
    )
}

export default KelolaPerhitungan;