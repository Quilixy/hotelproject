import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Typography, Form, Input, Button, Select, DatePicker, message, Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import "./Dashboard.css";
import useLogout from '../hooks/Logout';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const logout = useLogout();

  const fetchData = async () => {
    setLoading(true);
    try {
      const roomsResponse = await axios.get('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Rooms');
      const reservationsResponse = await axios.get('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Reservations');
      
      const roomsData = roomsResponse.data.data;
      const reservationsData = reservationsResponse.data.data;

      if (Array.isArray(roomsData) && Array.isArray(reservationsData)) {
        const updatedRooms = roomsData.map(room => {
          const today = moment().startOf('day');
          const matchingReservations = reservationsData.filter(reservation => reservation.roomNumber === room.roomNumber);
          const currentPrice = matchingReservations.length > 0 ? matchingReservations[0].Price : room.Price;
          const startDate = matchingReservations.length > 0 ? moment(matchingReservations[0].startDate) : null;
          const endDate = matchingReservations.length > 0 ? moment(matchingReservations[0].endDate) : null;
          const roomAvailable = (!startDate || today.isSameOrAfter(startDate)) && (!endDate || today.isSameOrBefore(endDate));
          const updatedStatus = roomAvailable ? 'available' : 'unavailable';

          return {
            ...room,
            Price: currentPrice,
            Status: updatedStatus,
          };
        });

        setRooms(updatedRooms);
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const roomNumber = values.roomNumber;
      const roomToUpdate = rooms.find(room => room.roomNumber === roomNumber);
      const newReservation = {
        roomNumber: values.roomNumber,
        roomType: values.roomType,
        Price: values.Price, // This price should affect the Reservations table
        Status: 'available',
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD')
      };

      if (roomToUpdate) {
        const updatedRoom = {
          ...roomToUpdate,
          roomType: values.roomType,
          Status: 'available'
        };
        await axios.put(`https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Rooms&rowId=${roomToUpdate.row_id}`, updatedRoom);
        message.success('Room updated successfully!');
      } else {
        // Add new room
        await axios.post('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Rooms', [
          [values.roomNumber, values.roomType, 'available']
        ]);
        message.success('Room added successfully!');
      }
      
      // Add reservation to reservations table with the selected price
      await axios.post('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Reservations', [
        [values.roomNumber, values.startDate.format('YYYY-MM-DD'), values.endDate.format('YYYY-MM-DD'), values.Price]
      ]);

      // Refresh rooms data
      fetchData();
    } catch (error) {
      console.error('Failed to add/update room', error);
      message.error('Failed to add/update room');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Room Number',
      dataIndex: 'roomNumber', 
      key: 'roomNumber',
    },
    {
      title: 'Room Type',
      dataIndex: 'roomType', 
      key: 'roomType',
    },
    {
      title: 'Price',
      dataIndex: 'Price', 
      key: 'Price',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (text, record) => (
        <span className={record.Status === 'available' ? 'available-status' : 'unavailable-status'}>
          {record.Status}
        </span>
      ),
    },
  ];

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="Header" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
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
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Table 
            dataSource={rooms} 
            columns={columns} 
            loading={loading} 
            rowKey="row_id"
            pagination={false}
            rowClassName={(record) => record.Status === 'unavailable' ? 'unavailable-row' : 'available-row'} 
          />
          <div className={`addRoom ${isFormOpen ? 'open' : ''}`}>
            <div onClick={toggleForm} style={{ cursor: 'pointer' }}>
              <Typography.Title level={2}>
                Room Management
              </Typography.Title>
            </div>
            {isFormOpen && (
              <Form name="addRoom" onFinish={onFinish}>
                <Form.Item name="roomNumber" rules={[{ required: true, message: 'Please input room number!' }]}>
                  <Input placeholder="Room Number" />
                </Form.Item>
                <Form.Item name="roomType" rules={[{ required: true, message: 'Please select room type!' }]}>
                  <Select placeholder="Select Room Type">
                    <Option value="Single">Single</Option>
                    <Option value="Double">Double</Option>
                    <Option value="Family">Family</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="Price" rules={[{ required: true, message: 'Please input price!' }]}>
                  <Input placeholder="Price" type="number" />
                </Form.Item>
                <Form.Item name="startDate" rules={[{ required: true, message: 'Please select start date!' }]}>
                  <DatePicker placeholder="Start Date" />
                </Form.Item>
                <Form.Item name="endDate" rules={[{ required: true, message: 'Please select end date!' }]}>
                  <DatePicker placeholder="End Date" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} className='addButton'>
                    Add / Update
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'left' }}>Transylvania Hotel</Footer>
    </Layout>
  );
};

export default Dashboard;
