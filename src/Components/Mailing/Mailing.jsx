import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import "./Report.css"
import useLogout from '../hooks/Logout';

const { Option } = Select;
const { Header } = Layout;

const ReportForm = () => {
  const [loading, setLoading] = useState(false);
  const logout = useLogout();

  const handleSendReport = async (values) => {
    setLoading(true);
    const { email, reportType } = values;

    try {
      const roomsResponse = await axios.get('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Rooms');
      const reservationsResponse = await axios.get('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Reservations');

      const rooms = roomsResponse.data.data;
      const reservations = reservationsResponse.data.data;

      const today = moment();
      let reportData = [];

      if (reportType === 'daily') {
        reportData = reservations.filter(reservation =>
          today.isSame(moment(reservation.startDate), 'day') ||
          today.isSame(moment(reservation.endDate), 'day')
        );
      } else if (reportType === 'weekly') {
        reportData = reservations.filter(reservation =>
          today.isSame(moment(reservation.startDate), 'week') ||
          today.isSame(moment(reservation.endDate), 'week')
        );
      } else if (reportType === 'monthly') {
        reportData = reservations.filter(reservation =>
          today.isSame(moment(reservation.startDate), 'month') ||
          today.isSame(moment(reservation.endDate), 'month')
        );
      }

      const reportContent = reportData.map(reservation => {
        const room = rooms.find(room => room.roomNumber === reservation.roomNumber);
        return `Oda Numarası: ${reservation.roomNumber}, Oda Türü: ${room.roomType}, Fiyat: ${room.Price}, Başlangıç Tarihi: ${reservation.startDate}, Bitiş Tarihi: ${reservation.endDate}`;
      }).join('\n');

      // Burada raporu e-posta ile göndermek için uygun bir e-posta gönderme API'si kullanabilirsiniz.
      // Aşağıda bir örnek axios.post kullanımı yer almaktadır, bunu uygun API ile değiştirin.
      await axios.post('YOUR_EMAIL_API_ENDPOINT', {
        to: email,
        subject: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        body: reportContent,
      });

      message.success('Rapor başarıyla gönderildi!');
    } catch (error) {
      console.error('Failed to send report', error);
      message.error('Rapor gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='appReport'>
    <Layout className="layout">
      <Header>
        <div className="Header" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['5']}>
          <Menu.Item key="1"><Link to="/Dashboard">Dashboard</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/reservation-form">Reservation</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/rooms">Rooms</Link></Menu.Item>
          <Menu.Item key="4"><Link to="/room-listing">Available Rooms</Link></Menu.Item>
          <Menu.Item key="5"><Link to="/report-form">Report</Link></Menu.Item>
          <Menu.Item key="6">
            <Button type="primary" onClick={logout}>Log Out</Button>
          </Menu.Item>
        </Menu>
      </Header>
      </Layout>
    <Form layout="vertical" onFinish={handleSendReport} className='reportForm'>
      <Form.Item
        name="email"
        label="E-posta"
        rules={[{ required: true, message: 'Lütfen e-posta adresinizi girin!' }, { type: 'email', message: 'Geçerli bir e-posta adresi girin!' }]}
      >
        <Input placeholder="E-posta adresinizi girin" />
      </Form.Item>
      <Form.Item
        name="reportType"
        label="Rapor Türü"
        rules={[{ required: true, message: 'Lütfen bir rapor türü seçin!' }]}
      >
        <Select placeholder="Rapor türü seçin">
          <Option value="daily">Günlük</Option>
          <Option value="weekly">Haftalık</Option>
          <Option value="monthly">Aylık</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Raporu Gönder
        </Button>
      </Form.Item>
    </Form>
    
    </div>
  );
};

export default ReportForm;
