import React from 'react'
import { Container, Image, Jumbotron, Row } from 'react-bootstrap'

export default function Home(): React.ReactElement {
  return (
    <Container>
      <Jumbotron className='jumbotron bg-dark text-white'>
        <Row className='d-flex justify-content-around'>
          <h1>Welcome Back!</h1>
        </Row>
      </Jumbotron>
      <p>
        This webpage hosts the Klemis Kitchen Dashboard which allows
        administrators to manage the Klemis Kitchen App.
      </p>
      <Row className='d-flex justify-content-around'>
        <Image
          src='https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/10678863_373813009450949_1476119012751122609_n.jpg?_nc_cat=102&ccb=2&_nc_sid=09cbfe&_nc_ohc=DFcfHIHrjXkAX8Spf2x&_nc_ht=scontent-lga3-1.xx&oh=ea7ffb055e9bffceab19b402a2c06ac7&oe=5FC1D43D'
          fluid
        />
      </Row>
    </Container>
  )
}
