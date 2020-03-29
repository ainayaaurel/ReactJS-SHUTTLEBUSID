import React, {Component} from 'react'
import config from '../utils/config'
import axios from 'axios'
import { 
  Table, Row, Col, FormGroup, Form, Input, Button, 
  Modal, ModalHeader, ModalBody, ModalFooter, Container, Pagination } 
  from 'reactstrap'

class Routes extends Component{
  constructor(props){
    super(props)
    this.state = {
      routes: [],
      pageInfo: {
        page: 0,
        perPage: 0,
        totalData: 0,
        totalPage: 0,
        nextLink: null,
        prevLink: null
      },
      currentPage: 1,
      showModal: false,
      selectedId: 0,
      startFrom: 1
  }
  this.nextData = async() => {
    console.log('XSSSSSS')
    const results = await axios.get(config.APP_BACKEND.concat(`routes?page=${2}`))
    const {data} = results.data
    const {pageInfo} = results.data
    this.setState({routes:data, pageInfo, startFrom: this.state.startFrom + pageInfo.perPage})
  }
  this.prevData = async() => {
    const results = await axios.get(config.APP_BACKEND.concat(`routes?page=${1}`))
    const {data} = results.data
    const {pageInfo} = results.data
    this.setState({routes:data, pageInfo, startFrom: this.state.startFrom - pageInfo.perPage})
  }
  this.searchRoutes = async (e) => {
    const results = await axios.get(config.APP_BACKEND.concat(`routes?search[routes]=${e.target.value}`))
    const {data} = results.data
    const {pageInfo} = results.data
    this.setState({routes:data, pageInfo})
  }
  this.updateData = async()=> {
    const results = await axios.update(config.APP_BACKEND.concat(`routes/${this.state.selectedId}`))
    if(results.data.success){
      console.log('test')
      const newData = await axios.get(config.APP_BACKEND.concat('routes'))
      const {data} = newData.data
      const {pageInfo} = newData.data
      this.setState({routes:data, selectedId:0, pageInfo})
    }else {
      console.log(results.data)
      console.log("yes")
    }
  }
  this.deleteData = async()=> {
  const results = await axios.delete(config.APP_BACKEND.concat(`routes/${this.state.selectedId}`))
  if(results.data.success){
    console.log('test')
    const newData = await axios.get(config.APP_BACKEND.concat('routes'))
    const {data} = newData.data
    const {pageInfo} = newData.data
    this.setState({routes:data, selectedId:0, pageInfo})
  }else {
    console.log(results.data)
    console.log("yes")
  }
}
}
async componentDidMount(){
  const results = await axios.get(config.APP_BACKEND.concat('routes'))
  console.log('ini rute', results)
  const {data} = results.data
  this.setState({routes:data})
}
  render(){
    console.log('data', this.state.routes)
    return(
      <>
      <Container>
        <Row>
          <Col md={12}>
            <Form>
              <FormGroup>
                <Input type='text' placeholder='Search Routes ...' onChange={this.searchRoutes} />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Table bordered>
        <thead>
          <tr>
            <th>No</th>
            <th>Departure_at</th>
            <th>Arrival_at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
                {this.state.routes.length && this.state.routes.map((v,i)=>(
                  <tr key={this.state.routes[i].id}>
                    <td>{this.state.routes[i].id}</td>
                    <td>{this.state.routes[i].departure_at}</td>
                    <td>{this.state.routes[i].arrival_at}</td>
                    <td>
                      <Button className='btn btn-warning' onClick={()=>this.setState({showModal: true, selectedId: this.state.routes[i].id})} color='green'>
                        Edit
                      </Button>
                      <Button className='ml-2' onClick={()=>this.setState({showModal: true, selectedId: this.state.routes[i].id})} color='danger'>
                          Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
        </Table>
        <Row>
              <Col md={12} className='text-right'>
                  Page {this.state.pageInfo.page}/{this.state.pageInfo.totalPage} Total Data {this.state.pageInfo.totalData} Limit {this.state.pageInfo.perPage}
              </Col>
            </Row>
            <Row>
              <Col md={6} className='text-center'>
                <Pagination  onClick={this.prevData} >Prev</Pagination>
              </Col>
              <Col md={6} className='text-center'>
                <Pagination  onClick={this.nextData} >Next</Pagination>
              </Col>
        </Row>
      </Container>
      <Modal isOpen={this.state.showModal}>
      <ModalHeader>Edit User</ModalHeader>
      <ModalBody>Want to Edit User?</ModalBody>
      <ModalFooter>
        <Button color='success' onClick={this.updateData}>OK</Button>
        <Button color='danger' onClick={()=>this.setState({showModal: false, selectedId: 0})}>Cancel</Button>
      </ModalFooter>
    </Modal>
    <Modal isOpen={this.state.showModal}>
      <ModalHeader>Delete User</ModalHeader>
      <ModalBody>Really want to delete?</ModalBody>
      <ModalFooter>
        <Button color='success' onClick={this.deleteData}>OK</Button>
        <Button color='danger' onClick={()=>this.setState({showModal: false, selectedId: 0})}>Cancel</Button>
      </ModalFooter>
    </Modal>
    </>
    )
  }
}
export default Routes