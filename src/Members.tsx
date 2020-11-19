import React, { useEffect, useState } from 'react'
import { Container, Row, Button, Table, Form, Modal } from 'react-bootstrap'

import { APIFETCHLOCATION } from './constants'

type Member = {
  username: string
  admin_access: boolean
}

function getDefaultString(defaultPermission: boolean) {
  if (defaultPermission) {
    return 'Yes'
  }
  return 'No'
}

const renderMemberRow = (
  member: Member,
  setModalVisible: (arg: boolean) => void,
  setCurrentEditingMember: (arg: Member) => void,
  setDeleteModalVisible: (arg: boolean) => void
) => {
  return (
    <tr key={member.username}>
      <td>{member.username}</td>
      <td>{getDefaultString(member.admin_access)}</td>
      <td>
        <Button
          onClick={() => {
            setCurrentEditingMember(member)
            setModalVisible(true)
          }}
          variant='primary'
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            setCurrentEditingMember(member)
            setDeleteModalVisible(true)
          }}
          variant='danger'
        >
          Delete
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

const AddMember: React.FC<AddMemberProp> = ({
  onConfirm,
  onCancel,
  show,
  rerender,
}) => {
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
              placeholder={memberUsername === '' ? 'username' : memberUsername}
              onChange={(e) => setMemberUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='Permissions'>
            <Form.Label>Permissions</Form.Label>
            <Form.Control
              as='select'
              defaultValue={String(memberPermissions)}
              onChange={(e) => setMemberPermissions(Boolean(e.target.value))}
            >
              <option>true</option>
              <option>false</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={() => {
            onCancel()
          }}
          variant='primary'
        >
          Cancel
        </Button>
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
      setRequestBody({ username: usernameValue, admin_access: permissionValue })
    } else if (usernameChanged) {
      setRequestBody({ username: usernameValue })
    } else if (permissionChanged) {
      console.log(true)
      setRequestBody({ admin_access: permissionValue })
    }
  }, [usernameValue, permissionValue])

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      onEntering={() => {
        setUsernameValue(member?.username ?? 'unknown')
        setPermissionValue(member?.admin_access ?? false)
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
          Edit Member {member ? member.username : 'unknown'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='bodyURL'>
            <Form.Label>Edit User Permissions</Form.Label>
            <Form.Control
              as='select'
              defaultValue={getDefaultString(permissionValue)}
              onChange={(e) => {
                setPermissionValue(Boolean(e.target.value))
                setPermissionChanged(true)
              }}
            >
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

type DeleteAnnouncementProps = {
  member: Member | undefined
  onConfirm: () => void
  onCancel: () => void
  show: boolean
  rerender: () => void
}

const DeleteAnnouncement: React.FC<DeleteAnnouncementProps> = ({
  member,
  onConfirm,
  onCancel,
  show,
  rerender,
}) => {
  const requestURL = `${APIFETCHLOCATION}/memberships/${member?.username}`

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header
        onClick={() => {
          onCancel()
        }}
        closeButton
      >
        <Modal.Title>
          Delete Member {member ? member.username : 'unknown'}?
        </Modal.Title>
      </Modal.Header>
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
            const request = new Request(requestURL, { method: 'DELETE' })
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

  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false)
  const [editMemberModalVisible, setEditMemberModalVisible] = useState(false)
  const [currentEditingMember, setCurrentEditingMember] = useState<Member>()
  const [deleteModalVisible, setDeleteEditModalVisible] = useState(false)

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

      <DeleteAnnouncement
        member={currentEditingMember}
        onConfirm={() => {
          setDeleteEditModalVisible(false)
        }}
        onCancel={() => {
          setDeleteEditModalVisible(false)
        }}
        show={deleteModalVisible}
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
              setCurrentEditingMember,
              setDeleteEditModalVisible
            )
          )}
        </tbody>
      </Table>
    </Container>
  )
}
