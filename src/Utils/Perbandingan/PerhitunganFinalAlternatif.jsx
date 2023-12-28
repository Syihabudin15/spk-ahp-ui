import { Radio } from "antd";

function PerhitunganFinalAlternatif({alter, idKrit, alternatives, konsisten}){
    const values = [
        {index: 9,value: 9},
        {index: 8,value: 8},
        {index: 7,value: 7},
        {index: 6,value: 6},
        {index: 5,value: 5},
        {index: 4,value: 4},
        {index: 3,value: 3},
        {index: 2,value: 2},
        {index: 1,value: 1},
        {index: 0.500, value: 2},
        {index: 0.333, value: 3},
        {index: 0.250, value: 4},
        {index: 0.200, value: 5},
        {index: 0.167, value: 6},
        {index: 0.143, value: 7},
        {index: 0.125, value: 8},
        {index: 0.111, value: 9},
    ];
    const handleChange = (ida1, ida2, index, value, leftNama, rightNama) => {
        const criteria = localStorage.getItem(`a${idKrit}`);
        if(criteria){
            const json = JSON.parse(criteria);
            const filter = json.filter(e => e.id === ida2);
            if(filter.length === 0){
                // const news = json.map(e => {
                //     if(e.id === ida1){
                //         e.nilai.push(parseFloat(index));
                //         return {
                //             id: ida1,
                //             nama: e.nama,
                //             nilai: e.nilai
                //         }
                //     }else if(e.id === ida2){
                //         return {
                //             id: e.id,
                //             nama: e.nama,
                //             nilai: e.nilai
                //         }
                //     }
                // })
                const news = json.map(e => {
                    if(e.id === ida1){
                        e.nilai.push(index);
                    }
                    return e;
                })
                
                if(index < value){
                    news.push({id: ida2, nama:rightNama, nilai: [parseFloat(value)]})
                }else{
                    news.push({id: ida2,nama:rightNama, nilai: [parseFloat(1/index)]})
                }
                localStorage.removeItem(`a${idKrit}`);
                localStorage.setItem(`a${idKrit}`, JSON.stringify(news));
            }else{
                const news = json.map(e => {
                    if(e.id === ida1){
                        e.nilai.push(parseFloat(index))
                        // return{
                        //     id: e.id,
                        //     nama: e.nama,
                        //     nilai: e.nilai
                        // }
                    }else if(e.id === ida2){
                        if(index < value){
                            e.nilai.push(parseFloat(value))
                            // return {id: e.id, nama:e.nama, nilai: e.nilai }
                        }else{
                            e.nilai.push(parseFloat(1/index));
                            // return {id: e.id,nama:e.nama, nilai: e.nilai}
                        }
                    }
                    // return {
                    //     id: e.id,
                    //     nama: e.nama,
                    //     nilai: [parseFloat(e.nilai)]
                    // }
                    return e;
                })
                localStorage.removeItem(`a${idKrit}`);
                localStorage.setItem(`a${idKrit}`, JSON.stringify(news));
            }
        }else{
            let wilSave = [];
            wilSave.push({id: ida1, nama: leftNama, nilai: [index]});
            if(index < value){
                wilSave.push({id: ida2, nama: rightNama, nilai: [parseFloat(value)]});
            }else{
                wilSave.push({id: ida2, nama:rightNama, nilai: [parseFloat(1/index)]});
            }
            localStorage.setItem(`a${idKrit}`, JSON.stringify(wilSave));
        }
    }
    return(
        <>
            <div>
                <div>
                    {alternatives && alternatives.map((e,i) => (
                        <div key={i} style={{display: alter.id >= e.id ? "none" : "flex", borderBottom: '1px solid black', padding: 2}}>
                            <div>{alter.nama}</div>
                            <div>
                                <Radio.Group>
                                    {values && values.map((ev,indv) => (
                                        <Radio disabled={konsisten} onChange={() => handleChange(alter.id, e.id, ev.index, ev.value, alter.nama, e.nama)} value={ev.index}>{ev.value}</Radio>
                                    ))}
                                </Radio.Group>
                            </div>
                            <div>{e.nama}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default PerhitunganFinalAlternatif;