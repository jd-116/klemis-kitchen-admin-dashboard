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
  Figure,
} from 'react-bootstrap'

import Announcements from './Announcements'
import { APIFETCHLOCATION } from './constants'
import Home from './Home'
import ItemDetails from './ItemDetails'
import Locations from './Locations'
import Members from './Members'

import 'bootstrap/dist/css/bootstrap.css'

type UserLoginStatusProps = {
  user: AdminUser | null
  onConfirm: () => void
  onCancel: () => void
  show: boolean
}

type AdminUser = {
  firstName: string
  lastName: string
  username: string
  authToken: string
}

const LogoutModal: React.FC<UserLoginStatusProps> = ({
  user,
  onConfirm,
  onCancel,
  show,
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header>
        <Modal.Title>
          Logged in as {user ? user.username : 'Unknown'}{' '}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Are you sure you would like to logout?</p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={() => {
            onConfirm()
          }}
          variant='primary'
        >
          Yes
        </Button>
        <Button
          onClick={() => {
            onCancel()
          }}
          variant='primary'
        >
          No
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function App(): React.ReactElement {
  const [key, setKey] = useState('home')

  const [loggedIn, setLoggedIn] = useState(false)
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)
  const [loginErrorModalVisible, setLoginErrorModalVisible] = useState(false)

  const lolNotRealUser: AdminUser = {
    firstName: 'George',
    lastName: 'Burdell',
    username: 'gburdell3',
    authToken: '',
  }
  const [loggedInUser, setLoggedInUser] = useState<AdminUser>(lolNotRealUser)

  const authURL = `${APIFETCHLOCATION}/auth/login?redirect_uri=${window.location.href}`
  const sessionCheckURL = `${APIFETCHLOCATION}/auth/session`

  useEffect(() => {
    if (window.location.href.includes('?code=')) {
      const authcode = window.location.href.substring(
        window.location.href.indexOf('?code=') + 6
      )
      const tokenURL = `${APIFETCHLOCATION}/auth/token-exchange`
      const request = new Request(tokenURL, {
        method: 'POST',
        body: `${authcode}`,
      })
      fetch(request)
        .then((response) => response.json())
        .then((json) => {
          const url: any = new URL(window.location.href)
          url.searchParams.set('code', 'code')
          window.history.pushState(
            null,
            '',
            window.location.href.substring(
              0,
              window.location.href.indexOf('?code=')
            )
          )
          localStorage.setItem('authorization', JSON.stringify(json))
          setLoggedInUser({
            firstName: json.session.first_name,
            lastName: json.session.last_name,
            username: json.session.username,
            authToken: json.token,
          })
          if (loggedInUser && loggedInUser.authToken !== undefined) setLoggedIn(true)
          else setLoginErrorModalVisible(true)
        })
        .catch((error) => console.error(error))
    }
  }, [])

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
                  if (!loggedIn) {
                    if (localStorage.getItem('authorization')) {
                      const request = new Request(sessionCheckURL, {
                        method: 'GET',
                        headers: {
                          Authorization: `Bearer ${
                            JSON.parse(
                              localStorage.getItem('authorization') ?? ''
                            ).token
                          }`,
                        },
                      })
                      fetch(request)
                        .then((response) => response.json())
                        .then((json) => {
                          if (json.permissions.admin_access) {
                            const currUser: AdminUser = {
                              firstName: JSON.parse(
                                localStorage.getItem('authorization') ?? ''
                              ).session.first_name,
                              lastName: JSON.parse(
                                localStorage.getItem('authorization') ?? ''
                              ).session.last_name,
                              username: JSON.parse(
                                localStorage.getItem('authorization') ?? ''
                              ).session.username,
                              authToken: JSON.parse(
                                localStorage.getItem('authorization') ?? ''
                              ).token,
                            }
                            setLoggedInUser(currUser)
                            if (
                              loggedInUser &&
                              loggedInUser.authToken !== undefined
                            )
                              setLoggedIn(true)
                            else setLoginErrorModalVisible(true)
                          }
                        })
                        .catch((error) => window.open(authURL, '_self'))
                    } else window.open(authURL, '_self')
                  } else {
                    localStorage.removeItem('authorization')
                    setLogoutModalVisible(true)
                  }
                }}
              >
                {loggedIn ? 'Log Out' : 'Login'}
              </Button>
            </Container>
          </Col>
        </Row>
        <Modal show={loginErrorModalVisible} centered>
          <Modal.Header>
            <Modal.Title>
              Error Logging In. You may need to reload the page.
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              onClick={() => setLoginErrorModalVisible(false)}
              variant='danger'
            >
              dismiss
            </Button>
          </Modal.Footer>
        </Modal>
        <LogoutModal
          user={loggedInUser}
          onConfirm={() => {
            setLoggedIn(false)
            setLoggedInUser(lolNotRealUser)
            setLogoutModalVisible(false)
          }}
          onCancel={() => setLogoutModalVisible(false)}
          show={logoutModalVisible}
        />

        {loggedIn ? (
          <Tabs
            activeKey={key}
            onSelect={(k: string | null) => setKey(k ?? 'home')}
          >
            <Tab eventKey='home' title='Home'>
              <Home />
            </Tab>
            <Tab eventKey='members' title='Members'>
              <Members authToken={loggedInUser.authToken} />
            </Tab>
            <Tab eventKey='locations' title='Locations'>
              <Locations authToken={loggedInUser.authToken} />
            </Tab>
            <Tab eventKey='details' title='Item Details'>
              <ItemDetails authToken={loggedInUser.authToken} />
            </Tab>
            <Tab eventKey='announcements' title='Announcements'>
              <Announcements authToken={loggedInUser.authToken} />
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
                Klemis Kitchen is the Georgia Tech campus&apos; food pantry, and its
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
