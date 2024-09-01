import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './bidCreator.css'; // Import the custom CSS file
import axios from 'axios';

const App = () => {
  const [title, setTitle] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [endTime, setEndTime] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    try {
      let reqObj = {
          title,
          createdBy,
          startingPrice,
          endTime,
      }
      let response = await axios.post('http://localhost:8000/create-bid', reqObj);
      if(response.status === 201 ) {
        setTitle('');
        setCreatedBy('');
        setStartingPrice('');
        setEndTime(null)
      }
    } catch(e) {
      console.error(e);
      throw e;
    }
  };

  return (
    <div className="container mt-5 form-container">
      <h2 className="form-title">Create a Bid</h2>
      <Form onSubmit={handleSubmit} className="form-content">
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formTitle">
              <Form.Label>Bid Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formCreatedBy">
              <Form.Label>Created By</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter creator's name"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formStartingPrice">
              <Form.Label>Starting Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter starting price"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                required
                className="custom-input"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formEndTime" className='d-flex flex-column'>
              <Form.Label>Bid End Time</Form.Label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                dateFormat="Pp"
                className="form-control custom-input"
                placeholderText="Select end time"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="custom-button">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default App;

