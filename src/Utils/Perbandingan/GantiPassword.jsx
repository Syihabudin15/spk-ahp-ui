import { Button, Form, Input, Modal, Spin, notification } from "antd";
import { useState } from "react";
import axios from "axios";

function GantiPassword(){
    const [open, setOpen] = useState(false);
    const [load, isLoad] = useState(false);
    const [feed, setFeed] = useState();
    const handleClick = (e) => {
        isLoad(true);
        if(!e.password || !e.new_password || !e.conf_new_password){
            setFeed("Mohon isi semua yang berlabel *");
            isLoad(false);
            return;
        }else{
            const token = JSON.parse(localStorage.getItem("token"));
            axios.patch("http://localhost:5000/ganti-password", {
                id: token._id, password: e.password, new_password: e.new_password
            }).then(res => {
                notification.success({message: "Ganti password berhasil"});
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
            <Spin spinning={load}>
                <div>
                    <Button type="primary" ghost onClick={() => setOpen(true)}>Ganti Password</Button>
                    <Modal footer={[]} open={open} onCancel={() => setOpen(false)} title="Ganti Password">
                        <div>
                            <p style={{color: 'red', textAlign: 'center', fontStyle: 'italic'}}>{feed && feed}</p>
                        </div>
                        <Form labelCol={{span: 7}} onFinish={handleClick}>
                            <Form.Item label="Password Baru" name={"new_password"} required>
                                <Input.Password onChange={() => setFeed(null)} />
                            </Form.Item>
                            <Form.Item label="Konfirmasi" name={"conf_new_password"} required>
                                <Input.Password onChange={() => setFeed(null)} />
                            </Form.Item>
                            <Form.Item label="Password Sekarang" name="password" required>
                                <Input.Password onChange={() => setFeed(null)} />
                            </Form.Item>
                            <Form.Item style={{display: "flex", justifyContent: "center"}}>
                                <Button loading={load} htmlType="submit" type="primary">Kirim</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </Spin>
        </>
    )
}

export default GantiPassword;