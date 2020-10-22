import React, { useState } from 'react'
import { Container, Row, Button, Table, Form, Modal } from 'react-bootstrap'

type AddMemberProp = {
  onConfirm: () => void
  onCancel: () => void
  show: boolean
}

const AddMember: React.FC<AddMemberProp> = ({ onConfirm, onCancel, show }) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header
        onClick={() => {
          onCancel()
        }}
        closeButton
      >
        <Modal.Title>Add Member</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='GTUsername'>
            <Form.Label>GT Username</Form.Label>
            <Form.Control as='input' placeholder='gburdell3' />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={() => {
            onCancel()
          }}
          variant='secondary'
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm()
          }}
          variant='primary'
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default function Members(): React.ReactElement {
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false)

  return (
    <Container>
      <Row className='d-flex justify-content-around'>
        <h3>Klemis Kitchen Student Members</h3>
        <Button onClick={() => setAddMemberModalVisible(true)}>+ Add</Button>
      </Row>
      <AddMember
        onConfirm={() => {
          setAddMemberModalVisible(false)
        }}
        onCancel={() => {
          setAddMemberModalVisible(false)
        }}
        show={addMemberModalVisible}
      />
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>GT Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </Container>
  )
}
