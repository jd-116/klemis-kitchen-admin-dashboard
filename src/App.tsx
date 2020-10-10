import React, { Component } from 'react';
import './App.css';
import { Navbar, Tabs, Tab, Container, Row, Col, Button, Table, Overlay, Form } from 'react-bootstrap';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function App() {

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <Navbar bg="primary" expand="lg" variant="dark">
              <Navbar.Brand>Klemis Kitchen Dashboard</Navbar.Brand>
            </Navbar>
          </Col>
          <Col>
            <Button variant="danger">
              Log Out
            </Button>
          </Col>
        </Row>
        {RenderTabs()}
      </Container>
    </div>
  );
}

function RenderTabs() {
  const [key, setKey] = useState('home');

  const [addMemberShow, setAddMemberShow] = useState(false);

  const tempMembers = [
      {lastName: 'a', firstName: 'b', GTUsername:'ba1'},
      {lastName: 'c', firstName: 'd', GTUsername:'dc2'}
  ]

  return (
    <Tabs
      activeKey={key}
      onSelect={(k: any) => setKey(k)}
    >
      <Tab eventKey="home" title="Home">
        1
      </Tab>
      <Tab eventKey="members" title="Members">
        <Container>
          <Row className="d-flex justify-content-around">
            Klemis Kitchen Student Members
            <Button onClick={() => setAddMemberShow(!addMemberShow)}>
              + Add
            </Button>
          </Row>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Last Name</th>
                <th>First Name</th>
                <th>GT Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </Table>
          <Overlay target={null} show={addMemberShow} placement="bottom">
            {({ placement, arrowProps, show: _show, popper, ...props }) => (
            <div
              {...props}
              style={{
                backgroundColor: 'rgba(100, 255, 100, 0.85)',
                color: 'black',
                ...props.style,
              }}>
              <Col>
                <Form>
                  <Form.Group controlId = "formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="lastName"/>
                  </Form.Group>
                  <Form.Group controlId = "formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="firstName"/>
                  </Form.Group>
                  <Form.Group controlId = "formGTUsername">
                    <Form.Label>GT Username</Form.Label>
                    <Form.Control type="GTUsername"/>
                  </Form.Group>
                </Form>
                <Row className="d-flex justify-content-between">
                  <Button onClick={() => setAddMemberShow(!addMemberShow)}>
                    Confirm
                  </Button>
                  <Button onClick={() => setAddMemberShow(!addMemberShow)}>
                    Cancel
                  </Button>
                </Row>
              </Col>
            </div>
            )}
          </Overlay>
        </Container>
      </Tab>
      <Tab eventKey="details" title="ItemDetails">
        3
      </Tab>
      <Tab eventKey="announcements" title="Announcements">
        4
      </Tab>
    </Tabs>

  );
}

export default App;
