import { Button, Input, Spin, Table, notification } from "antd";
import { useEffect, useState } from "react";
import TambahKriteria from "./Utils/TambahKriteria";
import axios from "axios";

function KelolaKriteria(){
    const [load, setLoad] = useState(false);
    const [kriteria, setKriteria] = useState([]);
    const [nama, setNama] = useState();

    const columns = [
        {title: "Nama Kriteria", key: "nama", dataIndex: "nama"},
        {title: "Deskripsi", key: "deskripsi", dataIndex: "deskripsi"},
        {title: "Aksi", key: "id", dataIndex: 'id', render: (id) => (
            <div style={{display: "flex", gap: 5}}>
                <TambahKriteria info={"Edit"} id={id} func={getKriteria} />
                <Button danger onClick={() => hapusKriteria(id)}>Hapus</Button>
            </div>
        )}
    ]
    const hapusKriteria = (id) => {
        setLoad(true);
        axios.delete(`http://localhost:5000/hapus-kriteria/${id}`)
        .then(res => {
            notification.success({message: "Berhasil dihapus"})
            setLoad(false);
            getKriteria();
        })
        .catch(err => {
            notification.error({message: err.response.data.msg});
            setLoad(false);
        })
        setLoad(false);
    }
    const getKriteria = () => {
        setLoad(true);
        axios.get("http://localhost:5000/semua-kriteria")
        .then(res => {
            setKriteria(res.data.data);
            setLoad(false)
        })
        .catch(err => {
            notification.error({message: err.response.data.msg})
            setLoad(false);
        })
        setLoad(false);
    }
    
    useEffect(() => {
        if(!nama){
            getKriteria();
        }else{
            axios.get(`http://localhost:5000/cari-kriteria?nama=${nama}`)
            .then(res=>{
                setKriteria(res.data.data);
            }).catch(err => {
                notification.error({message: err.response.data.msg});
            })
        }
    }, [getKriteria, nama]);
    return(
        <>
            <Spin spinning={load}>
                <div style={{width: "80vw", margin: '20px auto'}}>
                    <div style={{display: 'flex', justifyContent: "space-around", marginBottom: 10}}>
                        <div>
                            <TambahKriteria func={getKriteria}/>
                        </div>
                        <div>
                            <Input.Search onChange={(e) => setNama(e.target.value)} />
                        </div>
                    </div>
                    <Table columns={columns} dataSource={kriteria} pagination={true} total={kriteria.length} />
                </div>
            </Spin>
        </>
    )
}

export default KelolaKriteria;