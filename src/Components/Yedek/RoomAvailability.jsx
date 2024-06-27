import React, { useState, useEffect } from 'react';
import { Table, Button, DatePicker, message } from 'antd';
import axios from 'axios';

const RoomAvailability = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://v1.nocodeapi.com/elegantstakric/google_sheets/UGatsGIxeYVQOJHT?tabId=Rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filterRoomsByDate = () => {
    if (!selectedDate) return rooms;
    // Assuming the room status can be available or booked, filter by availability on the selected date
    return rooms.filter(room => room.Status === 'available');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const columns = [
    {
      title: 'Room Number',
      dataIndex: 'Room Number',
      key: 'roomNumber',
    },
    {
      title: 'Room Type',
      dataIndex: 'Room Type',
      key: 'roomType',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'price',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'status',
    },
  ];

  return (
    <div>
      <DatePicker onChange={handleDateChange} />
      <Button onClick={filterRoomsByDate} type="primary" style={{ marginLeft: 8 }}>
        Check Availability
      </Button>
      <Table dataSource={filterRoomsByDate()} columns={columns} loading={loading} rowKey="Room Number" />
    </div>
  );
};

export default RoomAvailability;
