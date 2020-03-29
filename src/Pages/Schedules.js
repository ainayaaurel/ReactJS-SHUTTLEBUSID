import React, {Component} from 'react'
import config from '../utils/config'
import axios from 'axios'
import { 
  Table, Row, Col, FormGroup, Form, Input, Button, 
  Modal, ModalHeader, ModalBody, ModalFooter, Container, Pagination } 
  from 'reactstrap'

class Schedules extends Component{
  constructor(props){
    super(props)
    this.state = {
      schedules: [],
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
    const results = await axios.get(config.APP_BACKEND.concat(`schedules?page=${2}`))
    const {data} = results.data
    const {pageInfo} = results.data
    this.setState({schedules:data, pageInfo, startFrom: this.state.startFrom + pageInfo.perPage})
  }
  this.prevData = async() => {
    const results = await axios.get(config.APP_BACKEND.concat(`schedules?page=${1}`))
    const {data} = results.data
    const {pageInfo} = results.data
    this.setState({schedules:data, pageInfo, startFrom: this.state.startFrom - pageInfo.perPage})
  }
  this.updateData = async()=> {
    const results = await axios.update(config.APP_BACKEND.concat(`schedules/${this.state.selectedId}`))
    if(results.data.success){
      console.log('test')
      const newData = await axios.get(config.APP_BACKEND.concat('schedules'))
      const {data} = newData.data
      const {pageInfo} = newData.data
      this.setState({schedules:data, selectedId:0, pageInfo})
    }else {
      console.log(results.data)
      console.log("yes")
    }
  }
  this.deleteData = async()=> {
  const results = await axios.delete(config.APP_BACKEND.concat(`schedules/${this.state.selectedId}`))
  if(results.data.success){
    console.log('test')
    const newData = await axios.get(config.APP_BACKEND.concat('schedules'))
    const {data} = newData.data
    const {pageInfo} = newData.data
    this.setState({schedules:data, selectedId:0, pageInfo})
  }else {
    console.log(results.data)
    console.log("yes")
  }
}
}
async componentDidMount(){
  const results = await axios.get(config.APP_BACKEND.concat('schedules'))
  console.log('ini schedules', results)
  const {data} = results.data
  const {pageInfo} = results.data
  this.setState({schedules:data, pageInfo})
}
  render(){
    console.log('data', this.state.schedules)
    return(
      <>
      <Container>
        <Row>
          <Col md={12}>
            <Form>
              <FormGroup>
                <Input type='text' placeholder='Search Schedules ...'/>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Table bordered>
        <thead>
          <tr>
            <th>No</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Name Bus</th>
            <th>Time</th>
            <th>Class Bus</th>
            <th>Capasity Consument</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
                {this.state.schedules.length && this.state.schedules.map((v,i)=>(
                  <tr key={this.state.schedules[i].id}>
                    <td>{(this.state.startFrom + i)}</td>
                    <td>{this.state.schedules[i].departure_at}</td>
                    <td>{this.state.schedules[i].arrival_at}</td>
                    <td>{this.state.schedules[i].name}</td>
                    <td>{this.state.schedules[i].time}</td>
                    <td>{this.state.schedules[i].class}</td>
                    <td>{this.state.schedules[i].sheets}</td>
                    <td>{this.state.schedules[i].price}</td>
                    <td>
                      <Button className='btn btn-warning' onClick={()=>this.setState({showModal: true, selectedId: this.state.schedules[i].id})} color='green'>
                        Edit
                      </Button>
                      <Button className='ml-2' onClick={()=>this.setState({showModal: true, selectedId: this.state.schedules[i].id})} color='danger'>
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
                <Pagination  onClick={this.prevData} color='primary'>Prev</Pagination>
              </Col>
              <Col md={6} className='text-center'>
                <Pagination  onClick={this.nextData} color='primary'>Next</Pagination>
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
export default Schedules