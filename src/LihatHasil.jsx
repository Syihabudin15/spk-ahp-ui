import { Spin, Table, notification } from "antd"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import PdfButton from "./PdfButton";

function LihatHasil(){
    const [load, setLoad] = useState(false);
    const [datas, setDatas] = useState([]);
    const [kriteria, setKriteria] = useState([]);
    const [rank, setRank] = useState([]);
    const {id} = useParams();
    
    const colum = kriteria.map((e) => {
        return {
            title: e.nama,
            key: e.id.toString(),
            dataIndex: e.id.toString()
        }
    })
    colum.unshift({title: "Nama Alternatif", key: 'nama_alternatif', dataIndex: 'nama_alternatif'});
    colum.push({title: "Jumlah", key: 'jumlah', dataIndex: 'jumlah'})
    
    const columRank = [
        {title: "Nama", key: 'nama_alternatif', dataIndex: 'nama_alternatif'},
        {title: "Nilai", key: 'jumlah', dataIndex: 'jumlah'},
        {title: "Ranking", key: 'index', dataIndex: 'index'}
    ]
    useEffect(() => {
        setLoad(true);
        axios.get("http://localhost:5000/semua-kriteria")
        .then(res => {
            setKriteria(res.data.data);
        })
        .catch(err => {
            notification.error({message: err.response.data.msg});
            setLoad(false);
        })
        axios.get(`http://localhost:5000/lihat-hasil-perhitungan/${id}`)
        .then(res => {
            setDatas(res.data.data);
            const resultRank = res.data.data.result;
            resultRank.sort((a,b) => b.jumlah - a.jumlah);
            console.log(resultRank);
            const mapped = resultRank.map((e,i) => {
                return {
                    nama_alternatif: e.nama_alternatif,
                    jumlah: e.jumlah,
                    index: i+1
                };
            });
            setRank(mapped);
        })
        .catch(err => {
            notification.error({message: err.response.data.msg});
            console.log(err);
        })
        setLoad(false);
    }, []);
    return(
        <>
            <Spin spinning={load}>
                <div style={{marginBottom: 200}}>
                    <h3 style={{textAlign: 'center'}}>Teknisi Madya</h3>
                    <div>
                        <div >
                            <p style={{color: 'green'}}>Tanggal Perhitungan : {datas.tanggal}</p>
                            <Table columns={colum} dataSource={datas.result} pagination={false} />
                            <div style={{width: "50vw", margin: "20px auto"}}>
                                <h3 style={{textAlign: 'center'}}>Ranking</h3>
                                <Table columns={columRank} dataSource={rank} pagination={false} />
                            </div>
                        </div>
                        <PdfButton dataKriteria={colum} dataJumlah={datas.result} tanggal={datas.tanggal} columRank={columRank} dataRank={rank}/>
                    </div>
                    {/* <div style={{width: 200, margin: '50px auto', border: '1px solid black', padding: 10, borderRadius: 10}}>
                        {ranking && ranking.map(e => (
                            <div style={{display: 'flex', justifyContent: 'space-evenly', borderBottom: '1px solid black'}}>
                                <p>Ranking {e.rank}</p>
                                <p>{e.nama}</p>
                            </div>
                        ))}
                    </div> */}
                </div>
            </Spin>
        </>
    )
}

export default LihatHasil;