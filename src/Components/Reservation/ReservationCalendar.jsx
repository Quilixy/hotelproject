import React, { useState, useEffect } from 'react';
import { Calendar, Button, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';

const ReservationCalendar = ({ roomNumber }) => {
  const [reservations, setReservations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('https://v1.nocodeapi.com/quilixy/google_sheets/brexQRxxkjBVfAvO?tabId=Reservations');
        const roomReservations = response.data.data.filter(res => res.roomNumber === roomNumber);
        setReservations(roomReservations);
      } catch (error) {
        console.error('Failed to fetch reservations', error);
      }
    };

    fetchReservations();
  }, [roomNumber]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const dateCellRender = (value) => {
    const dateString = value.format('YYYY-MM-DD');
    const reservation = reservations.find(res => {
      const start = moment(res.startDate).format('YYYY-MM-DD');
      const end = moment(res.endDate).format('YYYY-MM-DD');
      return dateString >= start && dateString <= end;
    });

    if (reservation) {
      return <div style={{ backgroundColor: '#ff4d4f', color: '#fff', borderRadius: '5px', padding: '5px' }}>{reservation.price}</div>;
    }

    return null;
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>Show Reservations</Button>
      <Modal title={`Reservations for Room ${roomNumber}`} visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Calendar dateCellRender={dateCellRender} />
      </Modal>
    </>
  );
};

export default ReservationCalendar;
