import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Form, FormControl, Button, Card, Pagination, Row } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import './css/ActivityBack.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const cencelActivity = (id) => {
    Swal.fire({
        title: 'ลบรายการนี้หรือไม่',
        text: 'เมื่อรายการนี้ถูกลบ คุณจะไม่สามารถกู้คืนได้',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`/activity/${id}/`).then((res) => {
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
    });
};

const DateThai = (date) => {
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

var setTimeOut;
const ActivityBack = () => {
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        updateRows();
    }, []);

    const [search, setSearch] = useState('');
    useEffect(() => {
        window.clearTimeout(setTimeOut);

        setTimeOut = setTimeout(() => {
            updateRows(search ? search : '');
        }, 500);
    }, [search]);

    const updateRows = async (search = null) => {
        const searchParam = search ? `&search=${search}` : '';
        console.log(searchParam);
        axios
            .get(`/activities/foundation/${localStorage.getItem('foundation')}${searchParam}`)
            .then((res) => {
                if (res.data) {
                    setRowData(res.data.map((v) => setRow(v)));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const setRow = (data) => {
        // ใส่ชื่อ column ทั้งหมดตาม table
        return (
            <tr>
                <td>{data.id}</td>
                <td>
                    <img src={`../resources/uploads/` + data.image} alt='' style={{ width: '80px' }} />
                </td>
                <td>{data.name}</td>
                <td>{data.tel}</td>
                <td>{data.location}</td>
                <td>
                    {DateThai(new Date(data.start_time))} - {DateThai(new Date(data.end_time))}
                </td>
                <td>{data.person_max}</td>
                <td>
                    <Button variant='warning'>
                        <Link to={`/backend/activity-edit/${data.id}`} style={{ color: 'white' }}>
                            แก้ไข
                        </Link>
                    </Button>
                </td>
                <td>
                    <Button
                        onClick={() => {
                            cencelActivity(data.id);
                        }}
                        variant='outline-danger'
                    >
                        <BsTrash />
                    </Button>
                </td>
            </tr>
        );
    };

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
                    <Card.Title>กิจกรรม</Card.Title>
                    <div>
                        <Button variant='primary'>
                            <Link to='/backend/create-activity' style={{ color: 'white' }}>
                                สร้างกิจกรรม
                            </Link>
                        </Button>
                    </div>

                    <Form inline>
                        <FormControl
                            type='text'
                            placeholder='ค้นหาชื่อกิจกรรม'
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
                                <th>id</th>
                                <th>รูปภาพ</th>
                                <th>ชื่อกิจกรรม</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>สถานที่</th>
                                <th>วันเริ่ม-จบกิจกรรม</th>
                                <th>จำนวนคน</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>{rowData}</tbody>
                    </Table>
                </Card>
            </div>
        </div>
    );
};

export default ActivityBack;
