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
  const apiEndpointURL = `${APIFETCHLOCATION}/api/v1/announcements`

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
