import React, { useEffect, useState } from 'react'
import { Container, Button } from 'react-bootstrap'

import { APIFETCHLOCATION } from './constants'

type Announcement = {
  id: string
  title: string
  body: string
  timestamp: string
}

export default function Announcements(): React.ReactElement {
  const [announcementList, setAnnouncementList] = useState<Announcement[]>([])

  // see ./constants.tsx
  let apiEndpointURL = ''
  if (APIFETCHLOCATION === 'localhost')
    apiEndpointURL = `http://localhost:8080/api/v1/announcements`
  else apiEndpointURL = 'unknown'

  useEffect(() => {
    fetch(apiEndpointURL)
      .then((response) => response.json())
      .then((json) => setAnnouncementList(json.announcements))
      .catch((error) => console.error(error))
  }, [])

  return (
    <Container>
      <p>lole</p>
      <p>{announcementList}</p>
    </Container>
  )
}
