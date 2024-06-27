import React, { useState, useEffect } from 'react';
import { Table, Button, DatePicker, } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';




const AvailableRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
 
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://v1.nocodeapi.com/elegantstakric/google_sheets/UGatsGIxeYVQOJHT?tabId=Rooms');
        console.log('API Response:', response.data); // Verinin yapısını kontrol etmek için ekleyin
        const data = response.data.data; // Gelen verinin uygun formatını kontrol edin
        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          throw new Error('Unexpected API response format');
        }
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
    },
    
    {
      title: 'Start Date',
      dataIndex: 'StartofDate',
      key: 'StartofDate',
    },
    {
      title: 'End Date',
      dataIndex: 'Date',
      key: 'Date',
    },
  ];

  return (
    <div>
      <div className='showRoom'>
      <DatePicker onChange={handleDateChange} />
      <Button onClick={filterRoomsByDate} type="primary" style={{ marginLeft: 8 }}>
        Check Availability
      </Button>
      <Table dataSource={filterRoomsByDate()} columns={columns} loading={loading} rowKey="row_id" />
      </div>
      
      <Link to="/dashboard" className='dashboard'>Geri Dön</Link>
      
    
    </div>
  );
};

export default AvailableRoom;
