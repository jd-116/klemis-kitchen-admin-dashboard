import React from 'react';
import './App.css';
import { Navbar, Tabs, Tab, Container, Row, Col, Button } from 'react-bootstrap';
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

  return (
    <Tabs
      activeKey={key}
      onSelect={(k: any) => setKey(k)}
    >
      <Tab eventKey="home" title="Home">
        1
      </Tab>
      <Tab eventKey="members" title="Members">
        2
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
