import { Button, Typography } from "antd";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf"
import leftImg from './assets/sisca-madya-high-resolution-logo-color-on-transparent-background.png';
import rightImg from './assets/Logo TA PNG KECIL.png';
import autoTable from "jspdf-autotable";

function PdfButton({dataKriteria, dataJumlah, columRank, dataRank, tanggal}){
    const [load, setLoad] = useState(false);
    const headerKriteria = dataKriteria && dataKriteria.map(e => e.title);
    const valueskriteria = dataJumlah && dataJumlah.map(e => Object.values(e));
    const headerRank = columRank && columRank.map(e => e.title);
    const valuesRank = dataRank && dataRank.map(e => Object.values(e));
        
    const handleDownload = () => {
        setLoad(true)
        const token = JSON.parse(localStorage.getItem('token'));
        const leftImage = new Image();
        const rightImage = new Image();
        leftImage.src = leftImg;
        rightImage.src = rightImg;
        const doc = new jsPDF();
        const finalValueKriteria = [];
        for(let i = 0; i < valueskriteria.length; i++){
            const tmp=[];
            for(let j = 0; j < valueskriteria[i].length; j++){
                if(typeof valueskriteria[i][j] !== typeof "string"){
                    tmp.push(valueskriteria[i][j]);
                }else{
                    tmp.unshift(valueskriteria[i][j]);
                }
            }
            finalValueKriteria.push(tmp);
        }
        doc.addFont('Times New Romans', 'Times New Romans', 'bold');
        doc.addImage(leftImage, "png", 30,17,60, 13);
        doc.addImage(rightImage, "png", 140,10,50, 20);
        doc.setFont("Times New Romans");
        doc.setFontSize(18);
        doc.text("Sisca Madya", 90, 50);
        doc.addFont('Times New Romans', 'Times New Romans', 'normal');
        doc.setFontSize(12);
        doc.text(`Tanggal Perhitungan   :  ${tanggal}`, 20, 60);
        doc.text(`Tanggal Cetak          :  ${new Date().toLocaleDateString()}`, 20, 65);
        doc.addFont('Times New Romans', 'Times New Romans', 'bold');
        doc.setFontSize(12);
        doc.text(`Bobot Alternatif Terhadap Kriteria`, 75, 75);
        doc.autoTable({
            startY: 80,
            theme: 'plain',
            tableLineColor: [0, 0, 0],
            margin: {left: 20, right: 20},
            // columnStyles: {
            //     id: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            //   },
            head: [headerKriteria],
            body: finalValueKriteria,
            styles: {
                cellPadding: 3,
                fontSize: 10,
                valign: 'middle',
                overflow: 'linebreak',
                tableWidth: 'auto',
                lineWidth: .5,
            }
        });
        doc.text(`Ranking Alternatif`, 85, doc.lastAutoTable.finalY+15);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY+20,
            theme: 'plain',
            tableLineColor: 'black',
            head: [headerRank],
            body: valuesRank,
            margin: {left: 50, right: 50},
            styles: {
                cellPadding: 3,
                fontSize: 10,
                valign: 'center',
                overflow: 'linebreak',
                tableWidth: "auto",
                lineWidth: .5,
            }
        });
        doc.text(`ADMIN`, 157, doc.lastAutoTable.finalY+20);
        doc.text(`${token.nama}`, 155, doc.lastAutoTable.finalY+45);

        doc.save('CetakHasil.pdf');
        setLoad(false);
    }
    
    return(
        <>
            <div style={{display: 'flex', justifyContent: 'center', margin: 10, 
                marginTop: 50}}>
                <Button loading={load} onClick={() => handleDownload()} type="primary">Download PDF</Button>
            </div>
        </>
    )
}

export default PdfButton;