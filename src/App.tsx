import React, { useState, useEffect } from 'react'
import {
  Navbar,
  Tabs,
  Tab,
  Container,
  Row,
  Col,
  Button,
  Jumbotron,
  Modal,
  Image,
  Figure,
} from 'react-bootstrap'

import Announcements from './Announcements'
import { APIFETCHLOCATION } from './constants'
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

  const [logoutModalVisible, setLogoutModalVisible] = useState(false)
  const summonLogoutModal = () => setLogoutModalVisible(true)
  const closeLogoutModal = () => setLogoutModalVisible(false)

  type AdminUser = {
    firstName: string
    lastName: string
    username: string
  }

  type UserLoginStatusProps = {
    user: AdminUser
    onConfirm: () => void
    onCancel: () => void
  }

  const sampleUser: AdminUser = {
    firstName: 'Steve',
    lastName: 'Fazenbaker',
    username: 'sfazenbaker420',
  }

  useEffect(() => {
    if (window.location.href.includes('?code=')) {
      const authcode = window.location.href.substring(
        window.location.href.indexOf('?code=') + 6
      )
      console.log(authcode)
      const tokenURL = `${APIFETCHLOCATION}/auth/token-exchange`
      const request = new Request(tokenURL, {
        method: 'POST',
        body: `${authcode}`,
      })
      fetch(request).then((response) => {
        console.log(response)
        // window.location.href = window.location.href.substring(0, window.location.href.indexOf('?code='))
      })
    }
  }, [])

  const LogoutModal: React.FC<UserLoginStatusProps> = ({
    user,
    onConfirm,
    onCancel,
  }) => {
    return (
      <Modal show={logoutModalVisible} onHide={onCancel} centered>
        <Modal.Header>
          <Modal.Title>Logged in as {user.username} </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you would like to logout?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={() => {
              logoutManager()
            }}
            variant='primary'
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              closeLogoutModal()
            }}
            variant='primary'
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const logButtonManager = () => {
    loggedIn ? summonLogoutModal() : loginManager()
  }

  const loginManager = () => {
    userLoggingIn()
  }

  const logoutManager = () => {
    closeLogoutModal()
    userLoggingOut()
    resetHome()
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
              <Button
                variant='danger'
                onClick={() => {
                  const authURL = `${APIFETCHLOCATION}/auth/login?redirect_uri=${window.location.href}`
                  window.open(authURL)
                }}
              >
                {loggedIn ? 'Log Out' : 'Login'}
              </Button>
            </Container>
          </Col>
        </Row>
        {logoutModalVisible && (
          <LogoutModal
            user={sampleUser}
            onConfirm={() => {
              setLogoutModalVisible(false)
            }}
            onCancel={() => {
              setLogoutModalVisible(false)
            }}
          />
        )}

        {loggedIn ? (
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
            <Tab eventKey='details' title='Item Details'>
              <ItemDetails />
            </Tab>
            <Tab eventKey='announcements' title='Announcements'>
              <Announcements />
            </Tab>
          </Tabs>
        ) : (
          <Container>
            <Jumbotron>
              <Row className='d-flex justify-content-around'>
                <p>
                  Welcome to the Klemis Kitchen Admin Dashboard. This dashboard
                  contains the tools necessary to manage the Klemis inventory
                  system.
                </p>
                <p>
                  Please do not try to access this dashboard if you are not a
                  Klemis Kitchen staff member.
                </p>
                <p>
                  If you are one, you may login to access the dashboard through
                  the login button at the top right.
                </p>
              </Row>
            </Jumbotron>
            <h1>About Klemis Kitchen</h1>
            <p>
              Klemis Kitchen is the Georgia Tech campus's food pantry, and its
              goal is to let no Georgia Tech student go hungry.
            </p>
            <Row className='d-flex justify-content-around'>
              <Figure>
                <Figure.Image
                  width={684}
                  height={720}
                  alt='171x180'
                  src='https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/10710410_364416363723947_4010932865751888_o.jpg?_nc_cat=101&ccb=2&_nc_sid=19026a&_nc_ohc=SdK1bbkdtagAX_C8VrX&_nc_ht=scontent-lga3-1.xx&oh=01327dc74d8b06050feb729bf36586de&oe=5FC158E9'
                />
                <Row className='d-flex justify-content-around'>
                  <Figure.Caption>
                    Klemis Kitchen representatives receiving the 2014 Georgia
                    Tech SAA Gift to Tech
                  </Figure.Caption>
                </Row>
              </Figure>
            </Row>
          </Container>
        )}
      </Container>
    </Container>
  )
}

export default App
