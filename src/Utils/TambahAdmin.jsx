import { Button, Form, Input, Modal, Spin, notification } from "antd";
import axios from "axios";
import { useState } from "react";

function TambahAdmin(){
    const [open, setOpen] = useState(false);
    const [load, isLoad] = useState(false);
    const [feed, setFeed] = useState();
    const handleClick = (e) => {
        isLoad(true);
        if(!e.nama || !e.username || !e.password){
            setFeed("Mohon isi semua yang berlabel *");
            isLoad(false);
            return;
        }else{
            axios.post("http://localhost:5000/buat-user", {
                nama: e.nama, username: e.username, password: e.password
            }).then(res => {
                notification.success({message: "Admin berhasil ditambahkan"});
                isLoad(false);
                setOpen(false);
            })
            .catch(err => {
                notification.error({message: err.response.data.msg || "Error!"});
                isLoad(false);
            })
        }
        isLoad(false);
    }
    return(
        <>
            <div>
                <Spin spinning={load}>
                    <Button type="primary" ghost onClick={() => setOpen(true)}>Tambah Admin</Button>
                    <Modal footer={[]} open={open} onCancel={() => setOpen(false)} title="Tambah Admin">
                        <div>
                            <p style={{color: 'red', textAlign: 'center', fontStyle: 'italic'}}>{feed && feed}</p>
                        </div>
                        <Form labelCol={{span: 5}} onFinish={handleClick}>
                            <Form.Item label="Nama" name={"nama"} required>
                                <Input onChange={() => setFeed(null)} />
                            </Form.Item>
                            <Form.Item label="Username" name={"username"} required>
                                <Input onChange={() => setFeed(null)} />
                            </Form.Item>
                            <Form.Item label="Password" name={"password"} required>
                                <Input.Password onChange={() => setFeed(null)} />
                            </Form.Item>
                            <Form.Item style={{display: "flex", justifyContent: "center"}}>
                                <Button loading={load} type="primary" htmlType="submit">Kirim</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Spin>
            </div>
        </>
    )
}

export default TambahAdmin;