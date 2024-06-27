import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const RoomFilter = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://v1.nocodeapi.com/elegantstakrices/google_sheets/DypVvtYrvyvHRjOR?tabId=Rooms');
        setRooms(response.data);
        setFilteredRooms(response.data); // Initialize with all rooms
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const onFinish = (values) => {
    const { roomType, price } = values;
    const filtered = rooms.filter(room => {
      return (
        (roomType ? room['Room Type'] === roomType : true) &&
        (price ? room.Price <= price : true)
      );
    });
    setFilteredRooms(filtered);
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
      <Form name="filterRooms" onFinish={onFinish}>
        <Form.Item name="roomType">
          <Select placeholder="Select Room Type">
            <Option value="single">Single</Option>
            <Option value="double">Double</Option>
            <Option value="family">Family</Option>
          </Select>
        </Form.Item>
        <Form.Item name="price">
          <Input placeholder="Max Price" type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Filter
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={filteredRooms} columns={columns} loading={loading} rowKey="Room Number" />
    </div>
  );
};

export default RoomFilter;
