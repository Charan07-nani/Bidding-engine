import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './bidder.css';

// Styles
const cardStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out',
};

const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
};

const textStyle = {
    fontSize: '1rem',
    textAlign: 'center',
};

const AuctionCards = () => {
    const [sampleData, setSampleData] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [bidValue, setBidValue] = useState('');
    const [bidderName, setBidderName] = useState(null);
    const [refresh,setRefresh] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let response = await axios.get('http://localhost:8000/bids');
            console.log(response.data);
            setSampleData(response.data);
            setRefresh(false);
        }
        fetchData();
    }, [refresh]);

    useEffect(() => {
        if (sampleData.length > 0) {
            const intervalId = setInterval(() => {
                const updatedTimeRemaining = sampleData.map(item => calculateTimeRemaining(new Date(item.endTime)));
                setTimeRemaining(updatedTimeRemaining);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [sampleData]);

    function calculateTimeRemaining(endTime) {
        const now = new Date();
        const timeDiff = endTime - now;

        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
            const seconds = Math.floor((timeDiff / 1000) % 60);

            return `${days}d ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        } else {
            return "Auction Ended";
        }
    }
    const openBid = (index) => {
      setOpenModal(true);
      setSelectedItem(sampleData[index])
    }
    const handleCloseModal = () => {
      setOpenModal(false);
      setSelectedItem(null);
    }
    const submitBid = async () => {
      console.log(selectedItem);
      try{
        let reqObj = {
          name: bidderName,
          bidPrice: Number(bidValue)
        }
        let isDataPresent = selectedItem.bids.find(item => item.name === bidderName);
        console.log(isDataPresent)
        if(isDataPresent) {
          let response = await axios.put(`http://localhost:8000/add-bid/${selectedItem.uniqueId}`, reqObj);
          if(response.status === 200) {
            console.log('Data Modified Succesfully');
            setOpenModal(false);
            setSelectedItem(null);
            setRefresh(true);
            setBidValue(null);
            setBidderName('')
          }
        }
        else {
        let response = await axios.post(`http://localhost:8000/add-bid/${selectedItem.uniqueId}`, reqObj);
          if(response.status === 201) {
            console.log('Data Posted Succesfully');
            setOpenModal(false);
            setSelectedItem(null);
            setRefresh(true);
            setBidValue(null);
            setBidderName('')
          }
       }
      }
      catch(e) {
       console.log(e);
      }
    }

    return (
        <Container fluid style={{ maxHeight: '80vh', overflowY: 'auto', padding: '20px' }}>
            <Row>
                {sampleData.map((item, index) => (
                    <Col key={index} md={3} className="mb-4">
                        <Card style={cardStyle} onClick={() => openBid(index)}>
                            <Card.Body>
                                <Card.Title style={titleStyle}>{item.title}</Card.Title>
                                <Card.Text style={textStyle}><strong>Starting Price:</strong> {item.startingPrice}</Card.Text>
                                <Card.Text style={textStyle}><strong>Created By:</strong> {item.createdBy}</Card.Text>
                                <Card.Text style={textStyle}><strong>Ends In:</strong> {timeRemaining[index]}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal show={openModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedItem?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Created By:</strong> {selectedItem?.createdBy}</p>
                    <p><strong>Starting Price:</strong> {selectedItem?.startingPrice}</p>
                    <p><strong>End Time:</strong> {new Date(selectedItem?.endTime).toLocaleString()}</p>
                    <p><strong>Current Bids:</strong> {selectedItem?.bids.length}</p>
                    {
                      <div className='bids-container'>
                        <h2>Highest Bids</h2>
                        {selectedItem?.bids ? (
                          <div className='bids-list'>
                            {selectedItem.bids.sort((a, b) => b.bidPrice - a.bidPrice).map((item, index) => (
                              <div key={index}>
                                <div>Bidder Name : {item.name}</div>
                                <div>Bid Price: {item.bidPrice}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>No Bids Found</p>
                        )}
                      </div>
                    
                    }
                    <Form>
                      <Form.Group controlId="formTitle">
                        <Form.Label>Bid Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          value={bidderName}
                          onChange={(e) => setBidderName(e.target.value)}
                          required
                          className="custom-input"
                        />
                      </Form.Group>
                      <Form.Group controlId="formTitle">
                        <Form.Label>Bid Amount</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter Bidder Name"
                          value={bidValue}
                          onChange={(e) => setBidValue(e.target.value)}
                          required
                          className="custom-input"
                        />
                      </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={submitBid} disabled={new Date() - new Date(selectedItem?.endTime) > 0 }>
                        Place a Bid
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AuctionCards;
