import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import axios from 'axios';

const RoomStatus = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://v1.nocodeapi.com/elegantstakrices/google_sheets/DypVvtYrvyvHRjOR?tabId=Rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

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
      <Table dataSource={rooms} columns={columns} loading={loading} rowKey="Room Number" />
    </div>
  );
};

export default RoomStatus;
