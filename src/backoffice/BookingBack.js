import React, { useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Form, InputGroup, FormControl, Button, Card, Modal, Row } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import './css/ActivityBack.css';
import axios from 'axios';
import Swal from 'sweetalert2';



const DateThai = (date) => {
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

var setTimeOut;
const BookingBack = () => {
    const [rowData, setRowData] = useState([]);
    useEffect(() => {
        updateRows();
    }, []);

    const BookingSuccess = async (id) => {
        axios
            .put(`/booking/success/${id}`)
            .then((res) => {
                if (res.status == 200) {
                    updateRows();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [showSlip, setShowSlip] = useState(false);
    const [imgSilp, setImgSilp] = useState(null);
    
    const onClickSlipShow = () => setShowSlip(true);
    const onClickSlipClose = () => setShowSlip(false);

    const setRow = (data) => {
        // ใส่ชื่อ column ทั้งหมดตาม table
        return (
            <tr>
                <td>{data.booking_id}</td>
                <td>{data.booking_name}</td>
                <td>{data.member_name}</td>
                <td>{data.tel}</td>
                <td>{data.location}</td>
                <td>{DateThai(new Date(data.date))}</td>
                <td>
                {data.slip ? (<Button variant='primary' onClick={() => {onClickSlipShow(); setImgSilp(data.slip)}}>
                            ดู Slip
                        </Button>) : ''}
                </td>
                <td>
                    {data.is_success ? (
                        <Button variant='warning' disabled>
                            เรียบร้อย
                        </Button>
                    ) : (
                        <Button
                            variant='success'
                            onClick={() => {
                                BookingSuccess(data.booking_id);
                            }}
                        >
                            สำเร็จ
                        </Button>
                    )}
                </td>
                <td>
                    <Button 
                        onClick={() => {
                            confirm(()=> {cancelBooking(data.id);})
                        }}
                        variant='outline-danger'
                    >
                        <BsTrash/>
                    </Button>
                </td>
            </tr>
        );
    };

    const [search, setSearch] = useState('');
    useEffect(() => {
        clearTimeout(setTimeOut);

        setTimeOut = setTimeout(() => {
            updateRows(search ? search : '');
        }, 500);
    }, [search]);

    const updateRows = async () => {
        let data = {
            foundation: localStorage.getItem('foundation'),
            search: search
        }
        axios
            .post(`/booking/foundation/`,data)
            .then((res) => {
                if (res.data) {
                    setRowData(res.data.map((v) => setRow(v)));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    
    const confirm = (methed) => {
        Swal.fire({
            title: 'ยืนยัน',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0062cc',
            cancelButtonColor: '#ccc',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                methed();
            }
        });
    };

    const cancelBooking = async (id) => {
        await axios.delete(`/booking/${id}/`).then((res) => {
            Swal.fire({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
                confirmButtonColor: 'Green',
                confirmButtonText: 'Ok',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        });
    }
    return (
        <div
            className='all-font'
            style={{
                width: 'calc(100%-300px;)',
                height: '100vh',
                overflow: 'scroll',
            }}
        >
            <div style={{ padding: '3rem' }}>
                <Card style={{ padding: '1.5rem' }}>
                    <Card.Title>การจอง</Card.Title>
                    <Form inline>
                        <FormControl
                            type='text'
                            placeholder='ค้นหาชื่อผู้จอง'
                            className=' mr-sm-2'
                            style={{ marginLeft: '2%', marginTop: '1.5%' }}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                        />
                        {/* <Button type='submit'>Submit</Button> */}
                    </Form>

                    <Table striped hover style={{ marginTop: '1.5%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ชื่อกิจกรรม</th>
                                <th>ชื่อผู้จอง</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>สถานที่</th>
                                <th>วันและเวลา</th>
                                <th></th>
                                <th>ตัวเลือก</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>{rowData}</tbody>
                    </Table>
                </Card>
            </div>
            <Modal show={showSlip} onHide={onClickSlipClose}>
                <Modal.Header closeButton>
                    {/* <Modal.Title>เพิ่ม</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    <div className="img_slip" style={{backgroundImage: `url(../resources/uploads/${imgSilp})`}}></div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default BookingBack;
