import { Button, Table, Spin, Input, notification } from "antd";
import { useEffect, useState } from "react";
import TambahAlternaitf from "./Utils/TambahAlternatif";
import axios from "axios";
import TambahAlternatif from "./Utils/TambahAlternatif";

function KelolaAlternatif(){
    const [load, setLoad] = useState(false);
    const [alternatif, setAlternatif] = useState([]);
    const [nama, setNama] = useState();
    const columns = [
        {title: "Nama Alternatif", key:'nama', dataIndex: 'nama'},
        {title: "Kode Nama", key:'kode_nama', dataIndex: 'kode_nama'},
        {title: "Aksi", key:'id', dataIndex: 'id', render: (id) => (
            <div style={{display: "flex", gap: 5}}>
                <TambahAlternatif info={"Edit"} id={id} funct={getAlternatif} />
                <Button loading={load} danger onClick={() => hapusAlternaitf(id)}>Hapus</Button>
            </div>
        )}
    ]
    const hapusAlternaitf = (id) => {
        setLoad(true);
        axios.delete(`http://localhost:5000/hapus-alternatif/${id}`)
        .then(res => {
            notification.success({message: "Alternatif berhasil dihapus"});
            setLoad(false);
        })
        .catch(err => {
            notification.error({message: err.response.data.msg});
            setLoad(false);
        })
        setLoad(false);
    }
    const getAlternatif = () => {
        setLoad(true);
        axios.get("http://localhost:5000/semua-alternatif")
        .then(res => {
            setAlternatif(res.data.data);
            setLoad(false);
        })
        .catch(err => {
            notification.error({message: err.response.data.msg});
            setLoad(false);
        })
        setLoad(false);
    }
    useEffect(() => {
        if(!nama){
            getAlternatif();
        }else{
            axios.get(`http://localhost:5000/cari-alternatif?nama=${nama}`)
            .then(res=>{
                setAlternatif(res.data.data);
            }).catch(err => {
                notification.error({message: err.response.data.msg});
            })
        }
    }, [getAlternatif, nama]);
    return(
        <>
            <div>
                <Spin spinning={load}>
                <div style={{width: "80vw", margin: '20px auto'}}>
                    <div style={{display: 'flex', justifyContent: "space-around", marginBottom: 10}}>
                        <div>
                            <TambahAlternaitf funct={getAlternatif}/>
                        </div>
                        <div >
                            <Input.Search onChange={(e) => setNama(e.target.value)} />
                        </div>
                    </div>
                    <Table columns={columns} dataSource={alternatif} total={alternatif.length} />
                </div>
            </Spin>
            </div>
        </>
    )
}

export default KelolaAlternatif;