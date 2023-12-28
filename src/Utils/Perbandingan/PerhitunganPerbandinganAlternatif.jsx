import { Button, Modal, notification } from "antd";
import PerhitunganFinalAlternatif from "./PerhitunganFinalAlternatif";
import { useEffect, useState } from "react";
import axios from "axios";
import { indexRatio } from "../../IR";
import { useNavigate, useParams } from "react-router-dom";

function PerhitunganPerbandinganAlternatif({kriteria}){
    const [load, setLoad] = useState(false);
    const [alternatif, setAlternatif] = useState([]);
    const [konsis, setKonsis] = useState(false);
        const nav = useNavigate();
    const {id} = useParams();

    const cekKonsistensi = () => {
        const alternative = JSON.parse(localStorage.getItem(`a${kriteria._id}`));
        if(!alternative){
            notification.error({message: `Mohon isi pernilaian alternatif pada kriteria ${kriteria.nama} terlebih dahulu`});
            return;
        }

        const newArr = alternative.map(e => {
            e.nilai.splice(e.id,0,1);
            return e;
        })
        console.log("new Arr", newArr);
        const hasAddone = [];
        for(let i=0; i< newArr.length; i++){
            let jmlh = 0.00;
            const eigen = [];
            for(let j=0; j< newArr.length; j++){
                jmlh += parseFloat(newArr[j].nilai[i]);
            }
            for(let e=0; e< newArr.length; e++){
                const eige = parseFloat(parseFloat(newArr[e].nilai[i]) / parseFloat(jmlh));
                eigen.push(eige);
            }
            hasAddone.push({id: newArr[i].id, nama: newArr[i].nama, nilai: newArr[i].nilai, jumlah: jmlh, eigen: eigen});
        }
        console.log("add One",hasAddone)
        const finalArr=[];
        let total = 0.00;
        for(let i=0; i <hasAddone.length; i++){
            let jumlahEigen = 0.00;
            for(let j=0; j < hasAddone.length; j++){
                jumlahEigen += hasAddone[j].eigen[i]
            }
            const rataRata = parseFloat(parseFloat(jumlahEigen) / alternatif.length);
            const lamdaMax = parseFloat(parseFloat(hasAddone[i].jumlah) * rataRata);
            finalArr.push({
                id: hasAddone[i].id,
                nama: hasAddone[i].nama,
                nilai: hasAddone[i].nilai,
                jumlah: hasAddone[i].jumlah,
                eigen: hasAddone[i].eigen,
                jumlahEigen: jumlahEigen,
                rataRata: rataRata,
                lamdaMax: lamdaMax
            })
            total += parseFloat(lamdaMax);
        }
        console.log("Final Arr",finalArr);
        const CI = parseFloat((parseFloat(total) - alternatif.length) / (alternatif.length - 1));
        const ir = indexRatio.filter(e => e.total === alternatif.length);
        const CR = CI === 0 ? 0 : CI / (ir[0].nilai)
        if(parseFloat(CR) > 0.1){
            notification.error({message: `nilai CR = ${CR}. CR lebih dari 0,1. mohon lakukan penilaian alternatif pada kriteria ${kriteria.nama} kembali`});
        }else{
            notification.success({message: "Bobot alternatif konsisten"});
            setKonsis(true);
            const cekAda = localStorage.getItem(id);
            const result = alternatif.map(e => {
                const res = finalArr.filter(f => f.id === e.id);
                res.push({id_alternatif: e._id});
                return {
                    id_alternatif: e._id,
                    nama: e.nama,
                    nilai_rata_rata: res[0].rataRata
                };
            })
            const saved = {
                id_kriteria: kriteria._id,
                nama_kriteria: kriteria.nama,
                data: result
            };
            console.log("Result",saved);
            if(!cekAda){
                localStorage.setItem(id, JSON.stringify([saved]));
            }else{
                const json = JSON.parse(cekAda);
                const filterJson = json.filter(e => e.id_kriteria !== kriteria._id);
                filterJson.push(saved);
                localStorage.removeItem(id);
                localStorage.setItem(id, JSON.stringify(filterJson));
            }
        }
        localStorage.removeItem(`a${kriteria._id}`);
    }

    useEffect(() => {
        setLoad(true);
        axios.get("http://localhost:5000/semua-alternatif")
        .then(re => {
            const result = re.data.data.map((e,i) => {
                return {id: i, _id: e.id, nama: e.nama}
            })
            console.log(result);
            setAlternatif(result);
            setLoad(false);
        })
        .catch(err => {
            notification.error({message: err.response.data.msg});
            setLoad(false);
        })
    }, [])
    
    return(
        <>
            <div>
                <div>
                    <div style={{border: '1px solid black'}}>
                        <p style={{fontWeight: 'bold', textAlign: "center"}}>{kriteria.nama}</p>
                        <div>
                            {alternatif && alternatif.map((e,i) => (
                                <div key={i}>
                                    <PerhitunganFinalAlternatif alter={e} idKrit={kriteria._id} alternatives={alternatif} konsisten={konsis} />
                                </div>
                            ))}
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                            <Button loading={load} onClick={() => cekKonsistensi()} disabled={konsis} type="primary" ghost>{konsis ? "Konsisten" : "Cek Konsistensi"}</Button>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default PerhitunganPerbandinganAlternatif;