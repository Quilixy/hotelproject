import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, DatePicker, Select, Button, List, message, Menu, Layout } from 'antd';
import axios from 'axios';
import moment from 'moment';
import "./ReservationForm.css";
import useLogout from '../hooks/Logout';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Header, Content } = Layout;


const ReservationForm = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const logout = useLogout();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsResponse = await axios.get('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Rooms');
        setRooms(roomsResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      }
    };

    const fetchReservations = async () => {
      try {
        const reservationsResponse = await axios.get('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Reservations');
        setReservations(reservationsResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch reservations', error);
      }
    };

    fetchRooms();
    fetchReservations();
  }, []);

  const handleSearch = (values) => {
    setLoading(true);
    const [startDate, endDate] = values.dates;
    const roomType = values.roomType;

    const available = rooms.filter(room => {
      if (room.roomType !== roomType) return false;

      const isReserved = reservations.some(reservation => {
        const resStart = moment(reservation.startDate);
        const resEnd = moment(reservation.endDate);

        return (
          reservation.roomNumber === room.roomNumber &&
          ((startDate.isBetween(resStart, resEnd, 'days', '[]') ||
          endDate.isBetween(resStart, resEnd, 'days', '[]')) ||
          (resStart.isBetween(startDate, endDate, 'days', '[]') ||
          resEnd.isBetween(startDate, endDate, 'days', '[]')))
        );
      });

      return !isReserved;
    });

    if (available.length === 0) {
      message.warning('No rooms available for the selected dates and room type.');
    }

    setAvailableRooms(available);
    setLoading(false);
  };

  return (
    <div className='appReservation'>
      <Layout className="layout">
      <Header>
        <div className="Header" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
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
      <Content className='reservationContent'>
      <Form layout="vertical" className='FilterForm' onFinish={handleSearch}>
        <Form.Item name="dates" label="Select Dates" rules={[{ required: true, message: 'Please select the dates!' }]}>
          <RangePicker />
        </Form.Item>
        <Form.Item name="roomType" label="Room Type" rules={[{ required: true, message: 'Please select the room type!' }]}>
          <Select placeholder="Select a room type">
            <Option value="Single">Single, 1 Person</Option>
            <Option value="Double">Double, 2 Persons</Option>
            <Option value="Family">Family, 3-6 Persons</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Search
          </Button>
        </Form.Item>
      </Form>
      <List
        itemLayout="horizontal"
        dataSource={availableRooms}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={`Room Number: ${item.roomNumber}`}
              description={`Room Type: ${item.roomType}`}
            />
          </List.Item>
        )}
      /></Content>
    </Layout>
    </div>
  );
};

export default ReservationForm;
