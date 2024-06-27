import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import "./LoginForm.css";
import loginimg from "../Assets/night(100x100).png";
import axios from 'axios';


const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.get('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Login');
      const users = response.data.data;

      const user = users.find(user => user.username === values.username && user.password === values.password);

      if (user) {
        const token = 'randomtoken';
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Layout >

    <div className='appLogin'>

      <Form name="login" onFinish={onFinish} className='Form'>
        <img className="loginlogo" src={loginimg} alt=""  />
        <Typography.Title>
          Hotel Transylvania
        </Typography.Title>
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Checkbox name="remember">Remember me</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
      </div>
    </Layout>
  );
};

export default LoginForm;
