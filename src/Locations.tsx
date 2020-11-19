import React, { useEffect, useState } from 'react'
import { Container, Row, Button, Table, Form, Modal } from 'react-bootstrap'

import { APIFETCHLOCATION } from './constants'

type Location = {
  id: string
  name: string
  transact_identifier: string | null
  location: {
    latitude: number
    longitude: number
  } | null
}

const renderLocationRow = (
  location: Location,
  setModalVisible: (arg: boolean) => void,
  setCurrentEditingItem: (arg: Location) => void,
  setDeleteModalVisible: (arg: boolean) => void
) => {
  return (
    <tr key={location.id}>
      <td>{location.name}</td>
      <td>{location.transact_identifier}</td>
      <td>
        {location.location?.longitude}, {location.location?.latitude}
      </td>
      <td>
        <Button
          onClick={() => {
            setCurrentEditingItem(location)
            setModalVisible(true)
          }}
          variant='primary'
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            setCurrentEditingItem(location)
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

type AddLocationProp = {
  onConfirm: () => void
  onCancel: () => void
  show: boolean
  rerender: () => void
}

const AddLocation: React.FC<AddLocationProp> = ({
  onConfirm,
  onCancel,
  show,
  rerender,
}) => {
  const gtLongitude = 0
  const gtLatitude = 0
  const [locationName, setLocationName] = useState('')
  const [locationTransactIdentifier, setLocationTransactIdentifier] = useState(
    ''
  )
  const [locationLocationLatitude, setLocationLocationLatitude] = useState(
    gtLatitude
  )
  const [locationLocationLongitude, setLocationLocationLongitude] = useState(
    gtLongitude
  )

  const requestURL = `${APIFETCHLOCATION}/locations`

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      onEntering={() => {
        setLocationName('')
        setLocationTransactIdentifier('')
        setLocationLocationLatitude(gtLatitude)
        setLocationLocationLongitude(gtLongitude)
      }}
    >
      <Modal.Header
        onClick={() => {
          onCancel()
        }}
        closeButton
      >
        <Modal.Title>Add Location</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='Name'>
            <Form.Label>Location Name</Form.Label>
            <Form.Control
              as='input'
              placeholder={locationName === '' ? 'Name' : locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='TransactIdentifier'>
            <Form.Label>Location Transact Identifier</Form.Label>
            <Form.Control
              as='input'
              placeholder={
                locationTransactIdentifier === ''
                  ? 'Transact Identifier'
                  : locationTransactIdentifier
              }
              onChange={(e) => setLocationTransactIdentifier(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='Latitude'>
            <Form.Label>Location Latitude</Form.Label>
            <Form.Control
              as='input'
              placeholder={
                locationLocationLatitude === gtLatitude
                  ? gtLatitude.toString()
                  : locationLocationLatitude.toString()
              }
              onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value))
                  setLocationLocationLatitude(parseFloat(e.target.value))
                else e.target.value = locationLocationLatitude.toString()
              }}
            />
          </Form.Group>
          <Form.Group controlId='Longitude'>
            <Form.Label>Location Longitude</Form.Label>
            <Form.Control
              as='input'
              placeholder={
                locationLocationLongitude === gtLongitude
                  ? gtLongitude.toString()
                  : locationLocationLongitude.toString()
              }
              onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value))
                  setLocationLocationLongitude(parseFloat(e.target.value))
                else e.target.value = locationLocationLongitude.toString()
              }}
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
              method: 'POST',
              body: JSON.stringify({
                name: locationName,
                transact_identifier: locationTransactIdentifier,
                location: {
                  latitude: locationLocationLatitude,
                  longitude: locationLocationLongitude,
                },
              }),
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

type EditLocationProps = {
  location: Location | undefined
  onConfirm: () => void
  onCancel: () => void
  show: boolean
  rerender: () => void
}

const EditLocation: React.FC<EditLocationProps> = ({
  location,
  onConfirm,
  onCancel,
  show,
  rerender,
}) => {
  const gtLongitude = 0
  const gtLatitude = 0
  const [locationName, setLocationName] = useState('')
  const [locationTransactIdentifier, setLocationTransactIdentifier] = useState(
    ''
  )
  const [locationLocationLatitude, setLocationLocationLatitude] = useState(
    gtLatitude
  )
  const [locationLocationLongitude, setLocationLocationLongitude] = useState(
    gtLongitude
  )
  const [nameChanged, setNameChanged] = useState(false)
  const [transactIdentifierChanged, setTransactIdentifierChanged] = useState(
    false
  )
  const [latitudeChanged, setLatitudeChanged] = useState(false)
  const [longitudeChanged, setLongitudeChanged] = useState(false)

  const requestURL = `${APIFETCHLOCATION}/locations/${location?.id}`
  const [requestBody, setRequestBody] = useState({})

  useEffect(() => {
    const reqBody: any = {}
    if (nameChanged) reqBody.name = locationName
    if (transactIdentifierChanged)
      reqBody.transact_identifier = locationTransactIdentifier
    if (latitudeChanged) reqBody.latitude = locationLocationLatitude
    if (longitudeChanged) reqBody.Longitude = locationLocationLongitude
    if (
      nameChanged ||
      transactIdentifierChanged ||
      latitudeChanged ||
      longitudeChanged
    )
      setRequestBody(reqBody)
  }, [
    locationName,
    locationTransactIdentifier,
    locationLocationLatitude,
    locationLocationLongitude,
  ])

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      onEntering={() => {
        setLocationName(location?.name ?? 'unknown')
        setLocationTransactIdentifier(
          location?.transact_identifier ?? 'unknown'
        )
        setLocationLocationLatitude(location?.location?.latitude ?? 0)
        setLocationLocationLongitude(location?.location?.longitude ?? 0)
      }}
    >
      <Modal.Header
        onClick={() => {
          onCancel()
        }}
        closeButton
      >
        <Modal.Title>
          Edit Location {location ? location.name : 'unknown'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='name'>
            <Form.Label>Edit Location Name</Form.Label>
            <Form.Control
              as='input'
              placeholder={locationName}
              onChange={(e) => {
                setNameChanged(true)
                setLocationName(e.target.value)
              }}
            />
          </Form.Group>
          <Form.Group controlId='transactIdentifier'>
            <Form.Label>Edit Location Transact Identifier</Form.Label>
            <Form.Control
              as='input'
              placeholder={locationTransactIdentifier}
              onChange={(e) => {
                setTransactIdentifierChanged(true)
                setLocationTransactIdentifier(e.target.value)
              }}
            />
          </Form.Group>
          <Form.Group controlId='latitude'>
            <Form.Label>Edit Location Latitude</Form.Label>
            <Form.Control
              as='input'
              placeholder={locationLocationLatitude.toString()}
              onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value)) {
                  setLatitudeChanged(true)
                  setLocationLocationLatitude(parseFloat(e.target.value))
                } else e.target.value = locationLocationLatitude.toString()
              }}
            />
          </Form.Group>
          <Form.Group controlId='longitude'>
            <Form.Label>Edit Location Longitude</Form.Label>
            <Form.Control
              as='input'
              placeholder={locationLocationLongitude.toString()}
              onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value)) {
                  setLongitudeChanged(true)
                  setLocationLocationLongitude(parseFloat(e.target.value))
                } else e.target.value = locationLocationLongitude.toString()
              }}
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

type DeleteLocationProps = {
  location: Location | undefined
  onConfirm: () => void
  onCancel: () => void
  show: boolean
  rerender: () => void
}

const DeleteLocation: React.FC<DeleteLocationProps> = ({
  location,
  onConfirm,
  onCancel,
  show,
  rerender,
}) => {
  const requestURL = `${APIFETCHLOCATION}/locations/${location?.id}`

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header
        onClick={() => {
          onCancel()
        }}
        closeButton
      >
        <Modal.Title>
          Delete Location {location ? location.name : 'unknown'}?
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

export default function Locations(): React.ReactElement {
  const [locationList, setLocationList] = useState<Location[]>([])

  const [addLocationModalVisible, setAddLocationModalVisible] = useState(false)
  const [editLocationModalVisible, setEditLocationModalVisible] = useState(
    false
  )
  const [currentEditingLocation, setCurrentEditingLocation] = useState<
    Location
  >()
  const [deleteModalVisible, setDeleteEditModalVisible] = useState(false)

  // see ./constants.tsx
  const apiEndpointURL = `${APIFETCHLOCATION}/locations`

  useEffect(() => {
    getLocations()
  }, [])

  const getLocations = () => {
    fetch(apiEndpointURL)
      .then((response) => response.json())
      .then((json) => setLocationList(json.locations))
      .catch((error) => console.error(error))
  }

  return (
    <Container>
      <Row className='d-flex justify-content-around'>
        <h3>Klemis Kitchen Locations</h3>
        <Button onClick={() => setAddLocationModalVisible(true)}>+ Add</Button>
      </Row>
      <AddLocation
        onConfirm={() => {
          setAddLocationModalVisible(false)
        }}
        onCancel={() => {
          setAddLocationModalVisible(false)
        }}
        show={addLocationModalVisible}
        rerender={getLocations}
      />
      <EditLocation
        location={currentEditingLocation}
        onConfirm={() => {
          setEditLocationModalVisible(false)
        }}
        onCancel={() => {
          setEditLocationModalVisible(false)
        }}
        show={editLocationModalVisible}
        rerender={getLocations}
      />
      <DeleteLocation
        location={currentEditingLocation}
        onConfirm={() => {
          setDeleteEditModalVisible(false)
        }}
        onCancel={() => {
          setDeleteEditModalVisible(false)
        }}
        show={deleteModalVisible}
        rerender={getLocations}
      />
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Transact Identifier</th>
            <th>Longitude, Latitude</th>
          </tr>
        </thead>
        <tbody>
          {locationList.map((location) =>
            renderLocationRow(
              location,
              setEditLocationModalVisible,
              setCurrentEditingLocation,
              setDeleteEditModalVisible
            )
          )}
        </tbody>
      </Table>
    </Container>
  )
}
