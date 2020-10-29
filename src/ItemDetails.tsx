import React, { useEffect, useState } from 'react'
import { Container, Button, Table, Form, Modal } from 'react-bootstrap'

import { APIFETCHLOCATION } from './constants'

type PantryItem = {
  name: string
  id: string
  nutrition: string | null
  thumbnail: string | null
}

type APIPantryItem = {
  name: string
  id: string
  thumbnail: string | null
  nutritional_facts: string | null
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
        <Button
          onClick={() => {
            setCurrentEditingItem(data)
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

type EditItemProps = {
  item: PantryItem | undefined
  onConfirm: () => void
  onCancel: () => void
  show: boolean
}

const EditItem: React.FC<EditItemProps> = ({
  item,
  onConfirm,
  onCancel,
  show,
}) => {
  const [nutritionalFactValue, setNutritionalFactValue] = useState('unknown')
  const [thumbnailValue, setThumbnailValue] = useState('unknown')
  const requestURL = `placeholder/product-metadata/${item?.id}`
  const [requestBody, setRequestBody] = useState('{}')

  useEffect(() => {
    const thumbnailChanged = thumbnailValue !== item?.nutrition ?? 'unknown'
    const nutritionalFactChanged =
      nutritionalFactValue !== item?.nutrition ?? 'unknown'

    if (thumbnailChanged && nutritionalFactValue) {
      setRequestBody(
        `{"nutrition": "${nutritionalFactValue}", "thumbnail": "${thumbnailValue}"}`
      )
    } else if (nutritionalFactChanged) {
      setRequestBody(`{"nutrition": "${nutritionalFactValue}"}`)
    } else if (thumbnailChanged) {
      setRequestBody(`{"thumbnail": "${thumbnailValue}"}`)
    }
  }, [nutritionalFactValue, thumbnailValue])

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      onEntering={() => {
        setNutritionalFactValue(item?.nutrition ?? 'unknown')
        setThumbnailValue(item?.thumbnail ?? 'unknown')
      }}
    >
      <Modal.Header
        onClick={() => {
          onCancel()
        }}
        closeButton
      >
        <Modal.Title>Edit {item ? item.name : 'unknown'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='NutritionalFactsURL'>
            <Form.Label>Edit Nutritional Information Label</Form.Label>
            <Form.Control
              as='input'
              placeholder={nutritionalFactValue}
              onChange={(e) => setNutritionalFactValue(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='ThumbnailURL'>
            <Form.Label>Edit Item Thumbnail</Form.Label>
            <Form.Control
              as='input'
              placeholder={thumbnailValue}
              onChange={(e) => setThumbnailValue(e.target.value)}
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
              body: requestBody,
            })
            console.log(requestBody)
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

export default function ItemDetails(): React.ReactElement {
  const [pantryItemList, setPantryItemList] = useState<PantryItem[]>([])
  const [currentEditingItem, setCurrentEditingItem] = useState<PantryItem>()
  const [modalVisible, setModalVisible] = useState(false)

  // see ./constants.tsx
  let apiEndpointURL = ''
  if (APIFETCHLOCATION === 'localhost')
    apiEndpointURL = `http://localhost:8080/api/v1/products`
  else apiEndpointURL = 'unknown'

  useEffect(() => {
    fetch(apiEndpointURL)
      .then((response) => response.json())
      .then((json) =>
        setPantryItemList(() => {
          const temp: PantryItem[] = []
          json.products.forEach((product: APIPantryItem) => {
            temp.push({
              name: product.name,
              id: product.id,
              thumbnail: product.thumbnail,
              nutrition: product.nutritional_facts,
            })
          })
          return temp
        })
      )
      .catch((error) => console.error(error))
  }, [])

  return (
    <Container>
      <EditItem
        item={currentEditingItem}
        onConfirm={() => {
          setModalVisible(false)
        }}
        onCancel={() => {
          setModalVisible(false)
        }}
        show={modalVisible}
      />
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
          {pantryItemList.map((item) =>
            renderItemDetailRow(item, setModalVisible, setCurrentEditingItem)
          )}
        </tbody>
      </Table>
    </Container>
  )
}
