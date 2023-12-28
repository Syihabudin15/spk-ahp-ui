import { Spin, Button, notification, Modal } from "antd";
import { useEffect, useState } from "react";
import PerhitunganPerbandinganAlternatif from "./PerhitunganPerbandinganAlternatif";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function PerbandinganAlternatif(){
    const [load, setLoad] = useState(false);
    const [kriteria, setKriteria] = useState([]);
    const [show, setShow] = useState(false);
    const nav = useNavigate();
    const {id} = useParams();
    const values = [
        {value: 1, keterangan: "Kedua elemen sama pentingnya"},
        {value: 2, keterangan: "Nilai tengah diantara 2 elemen yang berdampingan"},
        {value: 3, keterangan: "Elemen yang satu sedikit lebih penting daripada elemen lainnya"},
        {value: 4, keterangan: "Nilai tengah diantara 2 elemen yang berdampingan"},
        {value: 5, keterangan: "Elemen yang satu lebih penting daripada elemen lainnya"},
        {value: 6, keterangan: "Nilai tengah diantara 2 elemen yang berdampingan"},
        {value: 7, keterangan: "Satu elemen jelas lebih mutlak penting daripada elemen lainnya"},
        {value: 8, keterangan: "Nilai tengah diantara 2 elemen yang berdampingan"},
        {value: 9, keterangan: "Satu elemen mutlak penting daripada elemen lainnya"},
    ];
    const handleClick = () => {
        setLoad(true);
        const datas = localStorage.getItem(id);
        const json = JSON.parse(datas);
        if(!json || json.length < kriteria.length){
            setLoad(false);
            return notification.error({message: "Mohon lakukan penilaian alternatif terlebih dahulu"});
        }
        console.log(json);
        axios.post('http://localhost:5000/buat-bobot-alternatif', {
            id_perhitungan: id,
            datas: json
        }).then(res => {
            notification.success({message: "Perbandingan alternatif berhasil"});
            nav(`/lihat-hasil/${id}`);
        })
        .catch(err => {
            notification.error({message: err.response.data.msg});
        })
        setLoad(false);
        localStorage.removeItem(id);
    }
    useEffect(() => {
        setLoad(true);
        axios.get(`http://localhost:5000/cek-bobot-alternatif/${id}`)
        .then(re => {
            axios.get("http://localhost:5000/semua-kriteria")
            .then(res => {
                const result = res.data.data.map((e,i) => {
                    return{id: i, _id: e.id, nama: e.nama}
                })
                setKriteria(result);
                setLoad(false)
            })
            .catch(err => {
                notification.error({message: err.response.data.msg})
                setLoad(false);
            })
        })
        .catch(err => {
            setShow(true);
            setLoad(false)
        });
        setLoad(false);
    }, [])
    const handleOK = () => {
        nav(`/lihat-hasil/${id}`);
    }
    return(
        <>
            <Spin spinning={load}>
            <div>
                    <div style={{width: '50vw', margin: '50px auto', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2em'}}>
                        <p>Perbandingan Alternatif Terhadap Setiap Kriteria</p>
                    </div >
                    <div style={{display: 'flex', flexWrap: 'wrap-reverse', justifyContent: 'space-evenly', gap: 20}}>
                        <div style={{width: '90vw'}}>
                            {kriteria && kriteria.map((e,i) => (
                                <div key={i} style={{marginBottom: 20}}>
                                    <PerhitunganPerbandinganAlternatif kriteria={e} />
                                </div>
                            ))}
                            <div style={{width: '30vw', margin: '10px auto', display: 'flex', justifyContent: 'center'}}>
                            <Button type="primary" block style={{marginBottom: 200}} onClick={() => handleClick()}>Kirim</Button>
                            </div>
                        </div>
                        <div style={{height:300, lineHeight: 0.7, border: '1px solid black', borderRadius: 10, padding: 2, marginRight: 2}}>
                            {values.map((e,i) => (
                                <p key={i}>{e.value}. {e.keterangan}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </Spin>
            <Modal open={show} title={"INFO"} onCancel={() => {
                setShow(false)
                nav("/perhitungan");
                }} onOk={() => handleOK()}>
                <p>Perhitungan ini sudah berhasil dilakukan. Anda bisa lihat hasil dengan menekan tombol OK</p>
            </Modal>
        </>
    )
}
export default PerbandinganAlternatif;