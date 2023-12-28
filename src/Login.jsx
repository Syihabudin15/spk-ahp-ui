import { Button, Form, Image, Input, Spin, notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoLogin from "./assets/Logo TA PNG KECIL.png";
import logoMadya from "./assets/sisca-madya-high-resolution-logo-color-on-transparent-background.png";

function Login(){
    const [load, isLoad] = useState(false);
    const nav = useNavigate();
    const handleClick = (e) => {
        isLoad(true);
        axios.post("http://localhost:5000/login", {username: e.username, password: e.password})
        .then(res => {
            notification.success({message: "Login berhasil"});
            localStorage.setItem("token", JSON.stringify(res.data.data));
            isLoad(false);
            nav("/dashboard");
            window.location.reload();
        })
        .catch(err => {
            notification.error({message: err.response.data.msg || "Error!"});
            isLoad(false);
        });
        isLoad(false);
    }
    useEffect(() => {
        if(localStorage.getItem("token")){
            nav("/dashboard");
        }
    }, []);
    return (
        <div>
            <Spin spinning={load}>
                <div className="login-wrapper">
                    <div className="gambar-login">
                        <div>
                            <Image width={"100%"} height={"100%"} src={logoMadya} />
                            <Image width={"100%"} height={"40vh"} src={logoLogin} />
                        </div>
                    </div>
                    <div className="login">
                        <Form onFinish={handleClick}>
                            <Form.Item label="Username" name="username">
                                <Input placeholder="example182" />
                            </Form.Item>
                            <Form.Item label="Password" name="password">
                                <Input.Password placeholder="" />
                            </Form.Item>
                            <Form.Item className="button-center">
                                <Button loading={load} type="primary" htmlType="submit">Login</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Spin>
        </div>
    )
}

export default Login;