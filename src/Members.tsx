import React, { useEffect, useState } from 'react'
import { Container, Row, Button, Table, Form, Modal } from 'react-bootstrap'

import { APIFETCHLOCATION } from './constants'

type Member = {
  username: string
  permissions: boolean
}

function getDefaultString(defaultPermission: boolean) {
  console.log(defaultPermission)
  if (defaultPermission) {
    return "Yes"
  } else {
    return "No"
  }
}

const renderMemberRow = (
  member: Member,
  setModalVisible: (arg: boolean) => void,
  setCurrentEditingItem: (arg: Member) => void
) => {
  return (
    <tr key={member.username}>
      <td>{member.username}</td>
      <td>{getDefaultString(member.permissions)}</td>
      <td>
        <Button
          onClick={() => {
            setCurrentEditingItem(member)
            setModalVisible(true)
          }}
          variant='primary'
        >
          Edit
        </Button>
      </td>
    </tr>
  )
}

type AddMemberProp = {
  onConfirm: () => void
  onCancel: () => void
  show: boolean
  rerender: () => void
}

const AddMember: React.FC<AddMemberProp> = ({ onConfirm, onCancel, show, rerender, }) => {
  const [memberUsername, setMemberUsername] = useState('')
  const [memberPermissions, setMemberPermissions] = useState(Boolean)

  const requestURL = `${APIFETCHLOCATION}/memberships`

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      onEntering={() => {
        setMemberUsername('')
        setMemberPermissions(false)
      }}
    >
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
            <Form.Control 
              as='input' 
              placeholder={
                memberUsername === '' ? 'Title' : memberUsername
              }
              onChange={(e) => setMemberUsername(e.target.value)}
              />
          </Form.Group>
          <Form.Group controlId='Permissions'>
            <Form.Label>Permissions</Form.Label>
            <Form.Control as='input' defaultValue='No' onChange={(e) => {
              if (e.target.value == 'No') {
                setMemberPermissions(false)}
              else {
                setMemberPermissions(true)
              }}}>
              <option>true</option>
              <option>false</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={() => {
            const request = new Request(requestURL, {
              method: 'POST',
              body: JSON.stringify({
                username: memberUsername,
                admin_access: memberPermissions,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            })
            fetch(request).then(() => rerender())
            onConfirm()
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


type EditMemberProps = {
  member: Member | undefined
  onConfirm: () => void
  onCancel: () => void
  show: boolean
  rerender: () => void
}

const EditAnnouncement: React.FC<EditMemberProps> = ({
  member,
  onConfirm,
  onCancel,
  show,
  rerender,
}) => {
  const [usernameValue, setUsernameValue] = useState('unknown')
  const [permissionValue, setPermissionValue] = useState(false)
  const [usernameChanged, setUsernameChanged] = useState(false)
  const [permissionChanged, setPermissionChanged] = useState(false)

  const requestURL = `${APIFETCHLOCATION}/memberships/${member?.username}`
  const [requestBody, setRequestBody] = useState({})

  useEffect(() => {
    if (usernameChanged && permissionChanged) {
      setRequestBody({ username: usernameValue, permission: permissionValue })
    } else if (usernameChanged) {
      setRequestBody({ title: usernameValue })
    } else if (permissionChanged) {
      setRequestBody({ body: permissionValue })
    }
  }, [usernameValue, permissionValue])

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      onEntering={() => {
        setUsernameValue(member?.username ?? 'unknown')
        setPermissionValue(member?.permissions ?? false)
        setUsernameChanged(false)
        setPermissionChanged(false)
      }}
    >
      <Modal.Header
        onClick={() => {
          onCancel()
        }}
        closeButton
      >
        <Modal.Title>
          Edit Announcement {member ? member.username : 'unknown'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='titlesURL'>
            <Form.Label>Edit Announcement Title</Form.Label>
            <Form.Control
              as='input'
              placeholder={usernameValue}
              onChange={(e) => {
                setUsernameChanged(true)
                setUsernameValue(e.target.value)
              }}
            />
          </Form.Group>

          <Form.Group controlId='bodyURL'>
            <Form.Label>Edit Announcement body</Form.Label>
            <Form.Control
              as='input'
              defaultValue={getDefaultString(permissionValue)}
              onChange={(e) => {
                setPermissionChanged(true)
                if (e.target.value == 'No') {
                  setPermissionValue(false)}
                else {
                  setPermissionValue(true)
                }}}>
                  <option>No</option>
                  <option>Yes</option>
            </Form.Control>
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
            const request = new Request(requestURL, {
              method: 'PATCH',
              body: JSON.stringify(requestBody),
              headers: {
                'Content-Type': 'application/json',
              },
            })
            fetch(request).then(() => rerender())
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
  const [memberList, setMemberList] = useState<Member[]>([])

  const [
    addMemberModalVisible,
    setAddMemberModalVisible,
  ] = useState(false)
  const [
    editMemberModalVisible,
    setEditMemberModalVisible,
  ] = useState(false)
  const [currentEditingMember, setCurrentEditingMember] = useState<
    Member
  >()

  // see ./constants.tsx
  const apiEndpointURL = `${APIFETCHLOCATION}/memberships`

  useEffect(() => {
    getMembers()
  }, [])

  const getMembers = () => {
    fetch(apiEndpointURL)
      .then((response) => response.json())
      .then((json) => setMemberList(json.memberships))
      .catch((error) => console.error(error))
  }

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
        rerender={getMembers}
      />

      <EditAnnouncement
        member={currentEditingMember}
        onConfirm={() => {
          setEditMemberModalVisible(false)
        }}
        onCancel={() => {
          setEditMemberModalVisible(false)
        }}
        show={editMemberModalVisible}
        rerender={getMembers}
      />
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>GT Username</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {memberList.map((member) =>
            renderMemberRow(
              member,
              setEditMemberModalVisible,
              setCurrentEditingMember
            )
          )}
        </tbody>
      </Table>
    </Container>
  )
}
