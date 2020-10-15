import React, { useState } from 'react'
import { Navbar, Tabs, Tab, Container, Row, Col, Button } from 'react-bootstrap'

import Home from './Home'
import Members from './Members'
import ItemDetails from './ItemDetails'

import 'bootstrap/dist/css/bootstrap.css'

function App() {
  const [key, setKey] = useState('home')

  return (
    <Container className='App'>
      <Container>
        <Row>
          <Col>
            <Navbar bg='primary' expand='lg' variant='dark'>
              <Navbar.Brand>Klemis Kitchen Dashboard</Navbar.Brand>
            </Navbar>
          </Col>
          <Col>
            <Container className='float-right'>
              <Button variant='danger'>
                Log Out
              </Button>
            </Container>
          </Col>
        </Row>

        <Tabs activeKey={key} onSelect={(k: any) => setKey(k)}>
          <Tab eventKey='home' title='Home'>
            <Home />
          </Tab>
          <Tab eventKey='members' title='Members'>
            <Members />
          </Tab>
          <Tab eventKey='details' title='ItemDetails'>
            <ItemDetails />
          </Tab>
          <Tab eventKey='announcements' title='Announcements'>
            4
          </Tab>
        </Tabs>
      </Container>
    </Container>
  )
}

export default App
