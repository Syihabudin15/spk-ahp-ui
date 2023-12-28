import { Button, Radio } from "antd";

function PerhitunganPerbandinganKriteria({kriteria, kriterias}){
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
    const handleChange = (id1, id2, index, value) => {
        const cleft = localStorage.getItem(id1);
        const cright = localStorage.getItem(id2);
        if(cleft){
            const cLeftResult = `${cleft},${index}`;
            localStorage.removeItem(id1);
            localStorage.setItem(id1, cLeftResult);
            if(cright){
                if(index < value){
                    const cRightResult = `${cright},${value}`;
                    localStorage.removeItem(id2);
                    localStorage.setItem(id2, cRightResult);
                }else{
                    const cRightResult = `${cright},${parseFloat(1/index)}`;
                    localStorage.removeItem(id2);
                    localStorage.setItem(id2, cRightResult);
                }
            }else{
                if(index < value){
                    localStorage.setItem(id2, value);
                }else{
                    localStorage.setItem(id2, parseFloat(1/index));
                }
            }
        }else{
            localStorage.setItem(id1, index)
            if(cright){
                if(index < value){
                    const cRightResult = `${cright},${value}`;
                    localStorage.removeItem(id2);
                    localStorage.setItem(id2, cRightResult);
                }else{
                    const cRightResult = `${cright},${parseFloat(1/index)}`;
                    localStorage.removeItem(id2);
                    localStorage.setItem(id2, cRightResult);
                }
            }else{
                if(index < value){
                    localStorage.setItem(id2, value);
                }else{
                    localStorage.setItem(id2, parseFloat(1/index));
                }
            }
        }
    };
    return(
        <>
            <div style={{display: "flex", justifyContent: 'center', gap: 20}}>
                <div className="per-pertama">
                    {kriterias && kriterias.map((ek,i) =>(
                        <div key={i} style={{display: kriteria.id <= ek.id ? "none" : "flex", justifyContent: 'space-between', marginBottom: 10, gap:10, borderBottom: '1px solid black'}}>
                            {kriteria.nama}
                            <div style={{display: 'flex'}}>
                                <Radio.Group>
                                    {values && values.map((ev,ind) => (
                                        <Radio key={ind} onChange={(e) => handleChange(kriteria.id, ek.id, ev.index, ev.value)} value={ev.index}>{ev.value}</Radio>
                                    ))}
                                </Radio.Group>
                            </div>
                            {ek.nama}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default PerhitunganPerbandinganKriteria;