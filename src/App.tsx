import React, { useState } from 'react'
import { Navbar, Tabs, Tab, Container, Row, Col, Button } from 'react-bootstrap'

import Announcements from './Announcements'
import Home from './Home'
import ItemDetails from './ItemDetails'
import Members from './Members'

import 'bootstrap/dist/css/bootstrap.css'

function App(): React.ReactElement {
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
              <Button variant='danger'>Log Out</Button>
            </Container>
          </Col>
        </Row>

        <Tabs
          activeKey={key}
          onSelect={(k: string | null) => setKey(k ?? 'home')}
        >
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
            <Announcements />
          </Tab>
        </Tabs>
      </Container>
    </Container>
  )
}

export default App
