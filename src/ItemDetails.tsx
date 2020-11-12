import React, { useEffect, useState } from 'react'
import { Container, Button, Table, Form, Modal } from 'react-bootstrap'

import { APIFETCHLOCATION } from './constants'

type PantryItem = {
  name: string
  id: string
  nutritional_facts: string | null
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
    <tr key={data.id}>
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td>{data.nutritional_facts}</td>
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
  rerender: () => void
}

const EditItem: React.FC<EditItemProps> = ({
  item,
  onConfirm,
  onCancel,
  show,
  rerender,
}) => {
  const [nutritionalFactValue, setNutritionalFactValue] = useState('unknown')
  const [nutritionalFactChanged, setNutritionalFactChanged] = useState(false)
  const [nutritionalFactDisabled, setNutritionalFactDisabled] = useState(false)
  const [thumbnailValue, setThumbnailValue] = useState('unknown')
  const [thumbnailChanged, setThumbnailChanged] = useState(false)
  const [thumbnailDisabled, setThumbnailDisabled] = useState(false)

  const requestURL = `${APIFETCHLOCATION}/products/${item?.id}`
  const [requestBody, setRequestBody] = useState({})
  const s3URL = `${APIFETCHLOCATION}/upload`

  useEffect(() => {
    if (thumbnailChanged && nutritionalFactChanged) {
      setRequestBody({
        nutritional_facts: nutritionalFactValue,
        thumbnail: thumbnailValue,
      })
    } else if (nutritionalFactChanged) {
      setRequestBody({ nutritional_facts: nutritionalFactValue })
    } else if (thumbnailChanged) {
      setRequestBody({ thumbnail: thumbnailValue })
    }
  }, [nutritionalFactValue, thumbnailValue])

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      onEntering={() => {
        setNutritionalFactValue(item?.nutritional_facts ?? 'unknown')
        setThumbnailValue(item?.thumbnail ?? 'unknown')
        setNutritionalFactChanged(false)
        setThumbnailChanged(false)
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
            <>
              <Form.Control
                as='input'
                placeholder={nutritionalFactValue}
                onChange={(e) => {
                  setNutritionalFactChanged(true)
                  setNutritionalFactValue(e.target.value)
                }}
                disabled={nutritionalFactDisabled}
              />
              <Form.File
                onChange={(e: any) => {
                  const files: string[] = Array.from(e.target.files)
                  const picture = new FormData()
                  picture.append('file', files[0])
                  const request = new Request(s3URL, {
                    method: 'POST',
                    body: picture,
                    headers: {
                      Accept: 'application/json',
                      type: 'formData',
                    },
                  })
                  fetch(request).then((response) => {
                    console.log(response)
                    console.log(response.url)
                    setNutritionalFactValue(response.url)
                    setNutritionalFactDisabled(true)
                  })
                }}
              />
            </>
          </Form.Group>

          <Form.Group controlId='ThumbnailURL'>
            <Form.Label>Edit Item Thumbnail</Form.Label>
            <>
              <Form.Control
                as='input'
                placeholder={thumbnailValue}
                onChange={(e) => {
                  setThumbnailChanged(true)
                  setThumbnailValue(e.target.value)
                }}
                disabled={thumbnailDisabled}
              />
              <Form.File
                onChange={(e: any) => {
                  const files: string[] = Array.from(e.target.files)
                  const picture = new FormData()
                  picture.append('file', files[0])
                  const request = new Request(s3URL, {
                    method: 'POST',
                    body: picture,
                    headers: {
                      type: 'formData',
                    },
                  })
                  fetch(request).then((response) => {
                    setThumbnailValue(response.url)
                    setThumbnailDisabled(true)
                  })
                }}
              />
            </>
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

export default function ItemDetails(): React.ReactElement {
  const [pantryItemList, setPantryItemList] = useState<PantryItem[]>([])
  const [currentEditingItem, setCurrentEditingItem] = useState<PantryItem>()
  const [modalVisible, setModalVisible] = useState(false)

  // see ./constants.tsx
  const apiEndpointURL = `${APIFETCHLOCATION}/products`

  useEffect(() => {
    getItems()
  }, [])

  const getItems = () => {
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
              nutritional_facts: product.nutritional_facts,
            })
          })
          return temp
        })
      )
      .catch((error) => console.error(error))
  }

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
        rerender={getItems}
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
