import { Button, Form, Input, Modal, Spin, notification } from "antd";
import axios from "axios";
import { useState } from "react";

function TambahPerhitungan({funct}){
    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(false);
    const [feed, setFeed] = useState();
    const handleClik = (e) => {
        setLoad(true)
        if(!e.nama || !e.deskripsi){
            setFeed("Mohon isi semua yang berlabel *");
            setLoad(false);
            return;
        }
        axios.post("http://localhost:5000/buat-perhitungan", {
            nama: e.nama, deskripsi: e.deskripsi
        }).then(res => {
            notification.success({message: "Perhitungan berhasil ditambahkan"})
            setShow(false);
            funct();
        })
        .catch(err => {
            notification.error({message: err.response.data.msg});
        })
        setLoad(false);
    };
    return(
        <>
        <Button onClick={() => setShow(true)} type="primary" loading={load}>{"Tambah"}</Button>
        <Modal open={show} onCancel={() => setShow(false)} title={`Tambah Perhitungan`} footer={[]}>
            <Spin spinning={load}>
                <div>
                    <p style={{color: 'red', textAlign: 'center', fontStyle: 'italic'}}>{feed && feed}</p>
                </div>
                <Form labelCol={{span: 7}} onFinish={handleClik}>
                    <Form.Item label="Nama Perhitungan" name={"nama"} required>
                        <Input onChange={() => setFeed(null)} />
                    </Form.Item>
                    <Form.Item label="Deskripsi" name={"deskripsi"} required>
                        <Input.TextArea onChange={() => setFeed(null)} />
                    </Form.Item>
                    <Form.Item style={{display: 'flex', justifyContent: 'center'}}>
                        <Button htmlType="submit" loading={load} type="primary">Kirim</Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
        </>
    )
}

export default TambahPerhitungan;