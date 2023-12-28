import { Button, Form, Input, Modal, Spin, notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function TambahKriteria({info, id, func}){
    const [show, setShow] = useState(false);
    const [load, isLoad] = useState(false);
    const [feed, setFeed] = useState();
    const [currKriteria, setCurrKriteria] = useState();
    const handleOk = (e) => {
        isLoad(true)
        if(info){
            axios.patch("http://localhost:5000/edit-kriteria", {
                id: id, nama: e.nama, kode_nama: e.kode_nama, deskripsi: e.deskripsi
            }).then(res => {
                notification.success({message: "Edit kriteria berhasil"})
                setShow(false);
                func();
            })
            .catch(err => {
                notification.error({message: err.response.data.msg});
            })
        }else{
            if(!e.nama || !e.deskripsi){
                setFeed("Mohon isi semua yang berlabel bintang")
                isLoad(false);
                return;
            }
            axios.post("http://localhost:5000/buat-kriteria", {
                nama: e.nama, kode_nama: e.kode_nama, deskripsi: e.deskripsi
            }).then(res => {
                setShow(false)
                notification.success({message: "Tambah kriteria berhasil"});
                func();
                setShow(false);
            })
            .catch(err => {
                notification.error({message: err.response.data.msg});
            })
        }
        isLoad(false);
    }
    useEffect(() => {
        isLoad(true);
        if(id){
            axios.get(`http://localhost:5000/kriteria-by-id/${id}`)
            .then(res => {
                setCurrKriteria(res.data.data);
                isLoad(false);
            })
            .catch(err => {
                notification.error({message: err.response.data.msg});
                isLoad(false);
            })
        }
        isLoad(false);
    }, [id]);
    return(
        <>
        <Button ghost={info ? true : false} onClick={() => setShow(true)} type="primary">{info || "Tambah"}</Button>
        <Modal open={show} onCancel={() => setShow(false)} footer={[]} title={`${info ? "Edit" : "Tambah"} Kriteria`}>
            <Spin spinning={load}>
                <div>
                    <p style={{color: 'red', textAlign: 'center', fontStyle: 'italic'}}>{feed && feed}</p>
                </div>
                <Form labelCol={{span: 5}} onFinish={handleOk}>
                    <Form.Item label="Nama Kriteria" name={"nama"} required>
                        <Input defaultValue={currKriteria && currKriteria.nama} />
                    </Form.Item>
                    <Form.Item label="Kode Nama" name={"kode_nama"} >
                        <Input placeholder="Cx" defaultValue={currKriteria && currKriteria.kode_nama} />
                    </Form.Item>
                    <Form.Item label="Deskripsi" name={"deskripsi"} required>
                        <Input.TextArea defaultValue={currKriteria && currKriteria.deskripsi} />
                    </Form.Item>
                    <Form.Item>
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10}}>
                            <Button onClick={() => setShow(false)}>Cancel</Button>
                            <Button htmlType="submit" type="primary">OK</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
        </>
    )
}

export default TambahKriteria;