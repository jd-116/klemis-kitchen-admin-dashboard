import React, { useEffect, useState } from 'react'
import { Container, Row, Button, Table, Form, Modal } from 'react-bootstrap'

import { APIFETCHLOCATION } from './constants'

type Announcement = {
  id: string
  title: string
  body: string
  timestamp: string
}

const renderAnnouncementRow = (
  announcement: Announcement,
  setModalVisible: (arg: boolean) => void,
  setCurrentEditingItem: (arg: Announcement) => void
) => {
  return (
    <tr key={announcement.id}>
      <td>{announcement.id}</td>
      <td>{announcement.title}</td>
      <td>{announcement.body}</td>
      <td>{announcement.timestamp}</td>
      <td>
        <Button
          onClick={() => {
            setCurrentEditingItem(announcement)
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

type AddAnnouncementProp = {
  onConfirm: () => void
  onCancel: () => void
  show: boolean
}

const AddAnnouncement: React.FC<AddAnnouncementProp> = ({
  onConfirm,
  onCancel,
  show,
}) => {
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementBody, setAnnouncementBody] = useState('')

  const requestURL = `${APIFETCHLOCATION}/announcements`

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header
        onClick={() => {
          onCancel()
        }}
        closeButton
      >
        <Modal.Title>Add Announcement</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='Title'>
            <Form.Label>Announcement Title</Form.Label>
            <Form.Control
              as='input'
              placeholder={
                announcementTitle === '' ? 'Title' : announcementTitle
              }
              onChange={(e) => setAnnouncementTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='Body'>
            <Form.Label>Announcement Body</Form.Label>
            <Form.Control
              as='input'
              placeholder={announcementBody === '' ? 'Body' : announcementBody}
              onChange={(e) => setAnnouncementBody(e.target.value)}
            />
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
            const timestamp = new Date().toISOString()
            const request = new Request(requestURL, {
              method: 'POST',
              body: JSON.stringify(`"id": "${announcementTitle}", 
              "title": "${announcementTitle}", 
              "body": ${announcementBody}, 
              "timestamp": ${timestamp}`),
              headers: {
                'Content-Type': 'application/json',
              },
            })
            fetch(request)
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

type EditAnnouncementProps = {
  announcement: Announcement | undefined
  onConfirm: () => void
  onCancel: () => void
  show: boolean
}

const EditAnnouncement: React.FC<EditAnnouncementProps> = ({
  announcement,
  onConfirm,
  onCancel,
  show,
}) => {
  const [titleValue, setTitleValue] = useState('unknown')
  const [bodyValue, setBodyValue] = useState('unknown')
  const requestURL = `${APIFETCHLOCATION}/announcements/${announcement?.id}`
  const [requestBody, setRequestBody] = useState('{}')

  useEffect(() => {
    const titleChanged = titleValue !== announcement?.title ?? 'unknown'
    const bodyChanged = bodyValue !== announcement?.body ?? 'unknown'

    if (bodyChanged && titleValue) {
      setRequestBody(`{"title": "${titleValue}", "body": "${bodyValue}"}`)
    } else if (titleChanged) {
      setRequestBody(`{"title": "${titleValue}"}`)
    } else if (bodyChanged) {
      setRequestBody(`{"body": "${bodyValue}"}`)
    }
  }, [titleValue, bodyValue])

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      onEntering={() => {
        setTitleValue(announcement?.title ?? 'unknown')
        setBodyValue(announcement?.body ?? 'unknown')
      }}
    >
      <Modal.Header
        onClick={() => {
          onCancel()
        }}
        closeButton
      >
        <Modal.Title>
          Edit Announcement {announcement ? announcement.id : 'unknown'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='titlesURL'>
            <Form.Label>Edit Announcement Title</Form.Label>
            <Form.Control
              as='input'
              placeholder={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='bodyURL'>
            <Form.Label>Edit Announcement body</Form.Label>
            <Form.Control
              as='input'
              placeholder={bodyValue}
              onChange={(e) => setBodyValue(e.target.value)}
            />
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
            fetch(request)
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

export default function Announcements(): React.ReactElement {
  const [announcementList, setAnnouncementList] = useState<Announcement[]>([])

  const [
    addAnnouncementModalVisible,
    setAddAnnouncementModalVisible,
  ] = useState(false)
  const [
    editAnnouncementModalVisible,
    setEditAnnouncementModalVisible,
  ] = useState(false)
  const [currentEditingAnnouncement, setCurrentEditingAnnouncement] = useState<
    Announcement
  >()

  // see ./constants.tsx
  const apiEndpointURL = `${APIFETCHLOCATION}/announcements`

  useEffect(() => {
    fetch(apiEndpointURL)
      .then((response) => response.json())
      .then((json) => setAnnouncementList(json.announcements))
      .catch((error) => console.error(error))
  }, [])

  return (
    <Container>
      <Row className='d-flex justify-content-around'>
        <h3>Klemis Kitchen Announcements</h3>
        <Button onClick={() => setAddAnnouncementModalVisible(true)}>
          + Add
        </Button>
      </Row>
      <AddAnnouncement
        onConfirm={() => {
          setAddAnnouncementModalVisible(false)
        }}
        onCancel={() => {
          setAddAnnouncementModalVisible(false)
        }}
        show={addAnnouncementModalVisible}
      />
      <EditAnnouncement
        announcement={currentEditingAnnouncement}
        onConfirm={() => {
          setEditAnnouncementModalVisible(false)
        }}
        onCancel={() => {
          setEditAnnouncementModalVisible(false)
        }}
        show={editAnnouncementModalVisible}
      />
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {announcementList.map((announcement) =>
            renderAnnouncementRow(
              announcement,
              setEditAnnouncementModalVisible,
              setCurrentEditingAnnouncement
            )
          )}
        </tbody>
      </Table>
    </Container>
  )
}
