import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, Button, Layout, Menu } from 'antd';
import axios from 'axios';
import ReservationCalendar from '../Reservation/ReservationCalendar';
import moment from 'moment';
import "./RoomList.css";
import useLogout from '../hooks/Logout';

const { Header, Content } = Layout;

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const today = moment().format('YYYY-MM-DD');
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
        const reservationsResponse = await axios.get('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO??tabId=Reservations');
        const todayReservations = reservationsResponse.data.data.filter(res => {
          const start = moment(res.startDate).format('YYYY-MM-DD');
          const end = moment(res.endDate).format('YYYY-MM-DD');
          return today >= start && today <= end;
        });
        setReservations(todayReservations);
      } catch (error) {
        console.error('Failed to fetch reservations', error);
      }
    };

    fetchRooms();
    fetchReservations();
  }, [today]);

  return (
  <div className='appList'>
    <Layout className="layout">
      <Header>
        <div className="Header" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['3']}>
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
    <Content className='listContent'> 
    <List
      itemLayout="horizontal"
      dataSource={rooms}
      renderItem={item => {
        const roomReservation = reservations.find(res => res.roomNumber === item.roomNumber);
        return (
          <List.Item
            actions={[<ReservationCalendar roomNumber={item.roomNumber} />]}
          >
            <List.Item.Meta
              title={`Room Number: ${item.roomNumber}`}
              description={`Room Type: ${item.roomType}`}
            />
          </List.Item>
        );
      }}
    />
    </Content>
    </Layout>
  </div>
  );
};

export default RoomList;
