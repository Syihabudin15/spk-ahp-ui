import { Button, Modal, Spin, notification } from "antd";
import PerhitunganPerbandinganKriteria from "./PerhitunganPerbandinganKriteria";
import { useState, useEffect } from "react";
import axios from "axios";
import { values, indexRatio } from "../../IR";
import { useNavigate, useParams } from "react-router-dom";

function PerbandinganKriteria(){
    const [load, setLoad] = useState(false);
    const [kriteria, setKriteria] = useState([]);
    const nav = useNavigate();
    const {id} = useParams();
    const handleClick = () => {
        setLoad(true);
        if(!localStorage.getItem(kriteria[kriteria.length-1].id)){
            setLoad(false);
            localStorage.clear();
            notification.error({message: "Mohon isi semua perbandingan terlebih dahulu"});
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            return;
        }
        const hasAddOne = kriteria.map(e => {
            const arrKriteria = localStorage.getItem(e.id).split(',');
            arrKriteria.splice(e.id, 0, 1);
            return {
                nama: e.nama,
                _id: e._id,
                id: e.id,
                nilai: arrKriteria,
            }
        })
        const newArr = [];
        for(let i=0; i<hasAddOne.length; i++){
            let jmlh = 0.00;
            const eigen = [];
            
            for(let j=0; j<hasAddOne.length;j++){
                jmlh += parseFloat(hasAddOne[j].nilai[i]);
            }
            for(let j=0; j<hasAddOne.length;j++){
                eigen.push(parseFloat(hasAddOne[j].nilai[i]) / parseFloat(jmlh));
            }
            newArr.push({
                id: hasAddOne[i].id,
                _id: hasAddOne[i]._id,
                nilai: hasAddOne[i].nilai,
                jmlh: jmlh,
                eigen: eigen
            });
        }
        const finalArr = [];
        
        let total = 0.00;
        for(let i = 0; i< newArr.length; i++){
            let jumlahEigen = 0.00;
            for(let j = 0; j < newArr.length; j++){
                jumlahEigen += parseFloat(newArr[j].eigen[i]);
            }
            let rataRata = parseFloat(jumlahEigen)/ newArr.length;
            let lamdaMax = parseFloat(newArr[i].jmlh) * parseFloat(rataRata);
            total += lamdaMax;
            finalArr.push({
                _id: newArr[i]._id,
                id: newArr[i].id,
                jumlah: newArr[i].jmlh,
                jumlahEigen: jumlahEigen,
                rata_rata: rataRata,
                lamdaMax: lamdaMax
            });
        }
        const ir = indexRatio.filter((e) => e.total === finalArr.length);
        const ci = parseFloat(parseFloat(parseFloat(total) - finalArr.length) / (finalArr.length -1));
        const cr = parseFloat(ci) / parseFloat(ir[0].nilai);
        if(parseFloat(cr) > 0.1){
            notification.error({message: `Nilai CR = ${cr}. CR lebih dari 0,1. mohon lakukan penilaian kriteria kembali`});
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }else{
            const result = finalArr.map(e => {
                return{
                    id_perhitungan: id,
                    id_kriteria: e._id,
                    nilai_rata_rata: e.rata_rata
                }
            })
            console.log(result);
            axios.post("http://localhost:5000/buat-bobot-kriteria", {
                id_perhitungan: id, data:result
            }).then(res => {
                notification.success({message: "Berhasil"});
                nav(`/per-alternatif/${id}`)
            })
            .catch(err => {
                notification.error({message: err.response.data.msg});
            })
        }
        kriteria.forEach(e => {     
            localStorage.removeItem(e.id);
        });
        setLoad(false);
    }
    const getKriteria = () => {
        setLoad(true);
        axios.get("http://localhost:5000/semua-kriteria")
        .then(res => {
            const result = res.data.data.map((e,i) => {
                return {id: i, nama: e.nama, _id: e.id}
            })
            setKriteria(result);
            setLoad(false)
        })
        .catch(err => {
            notification.error({message: err.response.data.msg})
            setLoad(false);
        })
        setLoad(false);
    }
    
    useEffect(() => {
        
        axios.get(`http://localhost:5000/cek-bobot-kriteria/${id}`)
        .then(res => {
            getKriteria();
            console.log(res);
        })
        .catch(err => {
            setShow(true);
        })
    }, []);
    const [show, setShow] = useState(false)
    const handleOk = () => {
        setShow(false);
        nav(`/per-alternatif/${id}`)
    }
    return(
        <>
            <Spin spinning={load}>
                <div>
                    <div style={{width: '50vw', margin: '50px auto', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2em'}}>
                        <p>Perbandingan Kriteria</p>
                    </div >
                    <div style={{display: 'flex', flexWrap: 'wrap-reverse', justifyContent: 'space-evenly', gap: 10}}>
                        <div style={{width: '90vw'}}>
                            {kriteria && kriteria.map((e,i) => (
                                <div style={{margin: "10px auto"}} key={i}>
                                    <PerhitunganPerbandinganKriteria  kriterias={kriteria} kriteria={e} values={values}/>
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
            <Modal open={show} title={"Penting"} onCancel={() =>{
                 setShow(false);
                 nav('/perhitungan');
            }} onOk={() => handleOk()}>
                <p>Data bobot kriteria untuk perhitungan ini sudah tersedia.</p>
                <p>Apakah anda ingin melanjutkan ke perhitungan alternatif?</p>
            </Modal>
        </>
    )
}
const getIr = (infoLength) => {
    
}

export default PerbandinganKriteria;