import React, { useState } from 'react'
import { Navbar, Tabs, Tab, Container, Row, Col, Button, Jumbotron, Image, Modal } from 'react-bootstrap'

import Announcements from './Announcements'
import Home from './Home'
import ItemDetails from './ItemDetails'
import Members from './Members'

import 'bootstrap/dist/css/bootstrap.css'

function App(): React.ReactElement {
  const [key, setKey] = useState('home')
  const resetHome = () => setKey('home')

  const [loggedIn, setLoggedIn] = useState(false)
  const userLoggingIn = () => setLoggedIn(true)
  const userLoggingOut = () => setLoggedIn(false)

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const summonLogoutModal= () => setLogoutModalVisible(true);
  const closeLogoutModal = () => setLogoutModalVisible(false);

  type AdminUser = {
      firstName: string
      lastName: string
      username: string
  }

  type UserLoginStatusProps = {
    user: AdminUser,
    onConfirm: () => void,
    onCancel: () => void
  }

  const sampleUser: AdminUser =
    { firstName: 'Steve', lastName: 'Fazenbaker', username: 'sfazenbaker420'}


  const LogoutModal:  React.FC<UserLoginStatusProps> = ({ user, onConfirm, onCancel }) => {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Logged in as {user.username} </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you would like to logout?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => { closeLogoutModal(); userLoggingOut(); resetHome() }} variant='primary'>Yes</Button>
          <Button onClick={() => { closeLogoutModal() }} variant='primary'>No</Button>
        </Modal.Footer>
      </Modal.Dialog>
    )
  }

  const logButtonManager = () => {
      loggedIn ? logoutManger() : loginManager()
  }

  const loginManager = () => {
      userLoggingIn()
  }

  const logoutManger = () => {
      summonLogoutModal()
  }

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
              <Button variant='danger'
                onClick= {() => {logButtonManager()}} >
                {loggedIn ? 'Log Out' : 'Login'}
              </Button>
            </Container>
          </Col>
        </Row>
        {logoutModalVisible && <LogoutModal user={sampleUser} onConfirm={() => { setLogoutModalVisible(false) }} onCancel={() => { setLogoutModalVisible(false) }} />}

        {loggedIn ? (
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
          ) : (
          <Jumbotron>
            <Row className='d-flex justify-content-around'>
              <p>Welcome to the Klemis Kitchen Admin Dashboard.
                 This dashboard contains the tools necessary to manage the Klemis inventory system.</p>
              <p>Please do not try to access this dashboard if you are not a Klemis Kitchen staff member.</p>
              <p>If you are one, you may login to access the dashboard through the login button at the top right.</p>
            </Row>
          </Jumbotron>
          )
        }

      </Container>
    </Container>
  )
}

export default App
