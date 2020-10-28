import React, { useState } from 'react'
import { Container, Button, Table, Form, Modal } from 'react-bootstrap'

type PantryItem = {
  name: string
  id: string
  nutrition: string | null
  thumbnail: string | null
}

const renderItemDetailRow = (
  data: PantryItem,
  setModalVisible: (arg: boolean) => void,
  setCurrentEditingItem: (arg: PantryItem) => void
) => {
  return (
    <tr>
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td>{data.nutrition}</td>
      <td>{data.thumbnail}</td>
      <td>
        <Button onClick={() => {
          setCurrentEditingItem(data)
          setModalVisible(true)
        }}
          variant='primary'>
          Edit
        </Button>
      </td>
    </tr>
  )
}

type EditItemProps = {
  item: PantryItem | undefined,
  onConfirm: () => void,
  onCancel: () => void
}

const EditItem: React.FC<EditItemProps> = ({ item, onConfirm, onCancel }) => {
  return (
    <Modal.Dialog>
      <Modal.Header onClick={() => { onCancel() }} closeButton>
        <Modal.Title>Edit {item ? item.name : 'unknown'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='NutritionalFactsURL'>
            <Form.Label>Edit Nutritional Information Label</Form.Label>
            <Form.Control as='input' placeholder={item ? (item.nutrition ? item.nutrition : 'unknown') : 'unknown'} />
          </Form.Group>

          <Form.Group controlId='ThumbnailURL'>
            <Form.Label>Edit Item Thumbnail</Form.Label>
            <Form.Control as='input' placeholder={item ? (item.thumbnail ? item.thumbnail : 'unknown') : 'unknown'} />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={() => { onCancel() }} variant='secondary'>Cancel</Button>
        <Button onClick={() => { onConfirm() }} variant='primary'>Confirm</Button>
      </Modal.Footer>
    </Modal.Dialog>
  )
}

export default function ItemDetails() {
  const data: PantryItem[] = [
    { id: '1', name: 'poptart', nutrition: 'dummy url', thumbnail: 'dummy url' },
    { id: '2', name: 'banana', nutrition: 'dummy url', thumbnail: 'dummy url' }
  ]
  const [currentEditingItem, setCurrentEditingItem] = useState<PantryItem>()
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <Container>
      {modalVisible && <EditItem item={currentEditingItem} onConfirm={() => { setModalVisible(false) }} onCancel={() => { setModalVisible(false) }} />}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>id</th>
            <th>Item Names</th>
            <th>Nutritional Label</th>
            <th>Thumbnail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => renderItemDetailRow(item, setModalVisible, setCurrentEditingItem))}
        </tbody>
      </Table>
    </Container>
  )
}
