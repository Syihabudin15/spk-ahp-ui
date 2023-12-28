import { Button, Form, Input, Modal, Spin, notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function TambahAlternatif({info, id, funct}){
    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(false);
    const [currAlter, setCurrAlter] = useState();
    
    const handleOk = (e) => {
        setLoad(true)
        if(id){
            axios.patch("http://localhost:5000/edit-alternatif", {
                id: id, nama: e.nama, kode_nama: e.kode_nama 
            }).then(res => {
                notification.success({message: "Edit alternatif berhasil"});
                setShow(false);
                setLoad(false);
            })
            .catch(err => {
                notification.error({message: err.response.data.msg});
                setLoad(false);
            })
        }else{
            axios.post("http://localhost:5000/buat-alternatif", {
                nama: e.nama,
                kode_nama: e.kode_nama
            }).then(res => {
                notification.success({message: "Alternatif berhasil ditambahkan"});
                setShow(false);
                setLoad(false);
                funct();
            })
            .catch(err => {
                notification.error({message: err.response.data.msg});
                setLoad(false);
            })
        }
        setLoad(false);
    }
    useEffect(() => {
        setLoad(true)
        if(id){
            axios.get(`http://localhost:5000/alternatif-by-id/${id}`)
        .then(res => {
            setCurrAlter(res.data.data);
            setLoad(false);
        })
        .catch(err => {
            notification.error({message: err.response.data.msg});
            setLoad(false);
        })
        }
        setLoad(false)
    }, [id]);
    return(
        <>
        <Button ghost={info ? true : false} onClick={() => setShow(true)} type="primary">{info || "Tambah"}</Button>
        <Modal open={show} onCancel={() => setShow(false)} title={`${info ? "Edit" : "Tambah"} Alternatif`} footer={[]}>
            <Spin spinning={load}>
                <Form labelCol={{span: 6}} onFinish={handleOk}>
                    <Form.Item label="Nama Alternatif" name={"nama"} required>
                        <Input defaultValue={currAlter && currAlter.nama} />
                    </Form.Item>
                    <Form.Item label="Kode Nama" name={"kode_nama"}>
                        <Input placeholder="Ax" defaultValue={currAlter && currAlter.kode_nama || null} />
                    </Form.Item>
                    <Form.Item>
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10}}>
                            <Button>Cancel</Button>
                            <Button loading={load} type="primary" htmlType="submit">OK</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
        </>
    )
}

export default TambahAlternatif;