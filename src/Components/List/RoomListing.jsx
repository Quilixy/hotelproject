import React, { useState, useEffect } from 'react';
import { Button, List, Radio, Layout, Menu } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import "./RoomListing.css"
import useLogout from '../hooks/Logout';

const { Header, Content } = Layout;

const RoomListing = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('available');
  const [filteredRooms, setFilteredRooms] = useState([]);
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
        const reservationsResponse = await axios.get('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Reservations');
        setReservations(reservationsResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch reservations', error);
      }
    };

    fetchRooms();
    fetchReservations();
  }, []);

  useEffect(() => {
    const filterRooms = () => {
      if (filter === 'available') {
        const availableRooms = rooms.filter(room => {
          return !reservations.some(reservation => {
            const resStart = moment(reservation.startDate).format('YYYY-MM-DD');
            const resEnd = moment(reservation.endDate).format('YYYY-MM-DD');
            return (
              reservation.roomNumber === room.roomNumber &&
              (today >= resStart && today <= resEnd)
            );
          });
        });
        setFilteredRooms(availableRooms);
      } else {
        const occupiedRooms = reservations
          .filter(reservation => {
            const resStart = moment(reservation.startDate).format('YYYY-MM-DD');
            const resEnd = moment(reservation.endDate).format('YYYY-MM-DD');
            return (
              today >= resStart && today <= resEnd
            );
          })
          .map(reservation => {
            const room = rooms.find(room => room.roomNumber === reservation.roomNumber);
            return { ...room, endDate: reservation.endDate };
          });
        setFilteredRooms(occupiedRooms);
      }
    };

    filterRooms();
  }, [filter, rooms, reservations, today]);

  return (
    <div className='appListing'>
      <Layout className="layout">
      <Header>
        <div className="Header" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['4']}>
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
      <Content className='listingContent'>
      <Radio.Group value={filter} className='Buttons' onChange={(e) => setFilter(e.target.value)} style={{ marginBottom: 16 }}>
        <Radio.Button value="available">Boş Odalar</Radio.Button>
        <Radio.Button value="occupied">Dolu Odalar</Radio.Button>
      </Radio.Group>
      <List
        itemLayout="horizontal"
        dataSource={filteredRooms}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={`Oda Numarası: ${item.roomNumber}`}
              description={
                filter === 'occupied'
                  ? `Oda Türü: ${item.roomType}, Fiyat: ${item.Price}, Bitiş Tarihi: ${moment(item.endDate).format('YYYY-MM-DD')}`
                  : `Oda Türü: ${item.roomType}, Fiyat: ${item.Price}`
              }
            />
          </List.Item>
        )}
      />
      </Content>
    </Layout>
    </div>
  );
};

export default RoomListing;
