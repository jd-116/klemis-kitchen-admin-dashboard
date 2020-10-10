import React, { Component } from 'react';
import './App.css';
import { Navbar, Tabs, Tab, Container, Row, Col, Button, Table, Form, Modal, Overlay } from 'react-bootstrap';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const data: BodyItem[] = [{id: '1', names: ['poptart'], nutrition: "dummy url", thumbnail: "dummy url"},
{id: '2', names: ['banana'], nutrition: "dummy url", thumbnail: "dummy url"}]

export type BodyItem = {
  names: string[]
  id: string
  nutrition: string | null
  thumbnail: string | null
}



function App() {
  const [displayForm, setDisplayForm] = useState(false)
  return (
    <div className='App'>
      <Container>
        <Row>
          <Col>
            <Navbar bg='primary' expand='lg' variant='dark'>
              <Navbar.Brand>Klemis Kitchen Dashboard</Navbar.Brand>
            </Navbar>
          </Col>
          <Col>
            <Button variant='danger'>
              Log Out
            </Button>
          </Col>
        </Row>
        {RenderTabs(setDisplayForm)}
        {displayForm ? EditForm(setDisplayForm) : undefined}
      </Container>
    </div>
  );
}

function RenderTabs(editFormHandler: (arg: boolean) => void) {
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
      <Tab eventKey='home' title='Home'>
        Welcome to the Klemis Kitchen Dashboard. This dashboard contains the tools necessary to manage the klemis inventory system
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
      <Tab eventKey='details' title='ItemDetails'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Item Names</th>
              <th>Nuitritional Label</th>
              <th>Thumbnail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => bodyRender(item, editFormHandler))}
          </tbody>
        </Table>
      </Tab>
      <Tab eventKey='announcements' title='Announcements'>
        4
      </Tab>
    </Tabs>

  );
}

const bodyRender = (data: BodyItem, editFormHandler: (arg: boolean) => void) => {
    return(
      <tr>
        <td>{data.id}</td>
        <td>{data.names}</td>
        <td>{data.nutrition}</td>
        <td>{data.thumbnail}</td>
        <td><Button onClick ={() => {editFormHandler(true)}} variant="primary">Edit</Button></td>
      </tr>
    );
}

function EditForm(editFormHandler: (arg: boolean) => void) {
  return(
    <Modal.Dialog>
      <Modal.Header onClick ={() => {editFormHandler(false)}} closeButton>
        <Modal.Title>Edit Detail</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>New Nutritional url</Form.Label>
            <Form.Control type="email" placeholder= 'hmm'  />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>New Thumbnail Url</Form.Label>
            <Form.Control type="password" placeholder= 'hmm'/>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick ={() => {editFormHandler(false)}} variant="secondary">Cancel</Button>
        <Button onClick ={() => {editFormHandler(false)}} variant="primary">Confirm</Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
}

export default App;
