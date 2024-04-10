import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import React, { useState } from 'react';



const JobsInt = ({modalShow: propModalShow,onHideModal,popover }) => {

    const [modalShow, setModalShow] = useState(propModalShow);
    const [rangeValue, setRangeValue] = useState(0);
    const [questions, setQuestions] = useState(['']);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [internships, setInternships] = useState([]);
    const title = 'Jobs';
    const titleS = 'Job';

    const onHide = () => {
        setModalShow(false);
        onHideModal(false);
        popover(false) // Pass the updated visibility status to the parent
    };




    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
          console.log('totally custom!'),
        );
        return (
          <button
            type="button"
            style={{ backgroundColor: 'pink' }}
            onClick={decoratedOnClick}
          >
            {children}
          </button>
        );
      }
    
    
      function MyVerticallyCenteredModal(props) {
        const [jobFormData, setJobFormData] = useState({
          jobTitle: '',
          location: '',
          salaryMin: '',
          salaryMax: '',
          currency: 'INR',
          duration: 'per day',
          jobType: 'Full-time',
          category: 'Other',
          description: '',
          picture: null,
          questions: [''],
        });
    
        const [internshipFormData, setInternshipFormData] = useState({
          internshipTitle: '',
          location: '',
          salaryMin: '',
          salaryMax: '',
          currency: 'INR',
          duration: 'per day',
          internshipType: 'Full-time',
          category: 'Other',
          description: '',
          picture: null,
          questions: [''],
        });
    
        const handleInputChange = (e) => {
          const { name, value } = e.target;
    
          // Determine which form data to update based on the title
          if (title === 'Jobs') {
            setJobFormData((prevFormData) => ({
              ...prevFormData,
              [name]: value,
            }));
          } else if (title === 'Internships') {
            setInternshipFormData((prevFormData) => ({
              ...prevFormData,
              [name]: value,
            }));
          }
        };
    
        const handleImageChange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (title === 'Jobs') {
    
                setJobFormData({ ...jobFormData, picture: reader.result });
              }
              if (title === 'Internships') {
    
                setInternshipFormData({ ...internshipFormData, picture: reader.result });
              }
    
            };
            reader.readAsDataURL(file);
          }
        };
    
        const handlePublish = async () => {
          try {
            const response = await fetch(`http://localhost:5000/${title}/create`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(title === 'Jobs' ? jobFormData : internshipFormData),
            });
    
            if (response.ok) {
    
              console.log('Data saved successfully');
              toast.success(`${title} successfully created`)
    
              setModalShow(false);
              window.location.reload();
            } else {
    
              console.error('Failed to save data');
            }
          } catch (error) {
    
            console.error('Error:', error);
          }
        };
    
    
    
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ zIndex: "9999"}}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {title === 'Jobs' ? 'Create a Job' : title === 'Internships' ? 'Create an internship' : ''}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Group as={Col} >
                      <Form.Label htmlFor="job">{title} Title</Form.Label>
                      <Form.Control
                        id="job"
                        type="text"
                        placeholder="Enter job title"
                        name={title === 'Jobs' ? 'jobTitle' : 'internshipTitle'}
                        value={title === 'Jobs' ? jobFormData.jobTitle : internshipFormData.internshipTitle}
                        onChange={handleInputChange}
    
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group as={Col} controlId="location">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter location"
                        name="location"
                        value={title === 'Jobs' ? jobFormData.location : internshipFormData.location}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group as={Col} controlId="salaryRange">
                      <Form.Label>Salary Range</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Minimum"
                        name="salaryMin"
                        className='mb-2'
                        value={title === 'Jobs' ? jobFormData.salaryMin : internshipFormData.salaryMin}
                        onChange={handleInputChange}
                      />
    
    
                      To
    
                      <Form.Control
                        type="text"
                        placeholder="Maximum"
                        name="salaryMax"
                        className='mt-2'
                        value={title === 'Jobs' ? jobFormData.salaryMax : internshipFormData.salaryMax}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group as={Col} className='mt-4' controlId="currency">
                      <DropdownButton id="createJob-currency-dropdown" title={title === 'Jobs' ? jobFormData.currency : internshipFormData.currency}
                        onSelect={(eventKey) => {
                          if (title === 'Jobs') {
                            setJobFormData({ ...jobFormData, currency: eventKey });
                          } else if (title === 'Internships') {
                            setInternshipFormData({ ...internshipFormData, currency: eventKey });
                          }
                        }}>
                        <div className="scrollable-dropdown">
                          <Dropdown.Item style={{backgroundColor: '#174873'}} eventKey="INR" href="#/action-1">INR</Dropdown.Item>
                          <Dropdown.Item eventKey="USD" href="#/action-2">USD</Dropdown.Item>
                          <Dropdown.Item eventKey="JPY" href="#/action-3">JPY</Dropdown.Item>
                          <Dropdown.Item eventKey="EUR" href="#/action-4">EUR</Dropdown.Item>
                          <Dropdown.Item eventKey="GBP" href="#/action-5">GBP</Dropdown.Item>
                        </div>
                      </DropdownButton>
                    </Form.Group>
    
    
                    <Form.Group as={Col} className='mt-5' controlId="wages">
                      <DropdownButton id="createJob-timings-dropdown" title={title === 'Jobs' ? jobFormData.duration : internshipFormData.duration}
                        onSelect={(eventKey) => {
                          if (title === 'Jobs') {
                            setJobFormData({ ...jobFormData, duration: eventKey });
                          } else if (title === 'Internships') {
                            setInternshipFormData({ ...internshipFormData, duration: eventKey });
                          }
                        }}>
                        <div className="scrollable-dropdown">
                          <Dropdown.Item eventKey="per day" href="#/action-1">per day</Dropdown.Item>
                          <Dropdown.Item eventKey="per hour" href="#/action-2">per hour</Dropdown.Item>
                          <Dropdown.Item eventKey="per week" href="#/action-3">per week</Dropdown.Item>
                          <Dropdown.Item eventKey="per month" href="#/action-4">per month</Dropdown.Item>
                          <Dropdown.Item eventKey="per year" href="#/action-5">per year</Dropdown.Item>
                        </div>
                      </DropdownButton>
                    </Form.Group>
                  </Col>
                  {/* </Form.Group> */}
                </Row>
                <Form.Group controlId="jobType">
                  <Form.Label>{title} Type</Form.Label>
                  <DropdownButton id="createJob-type-dropdown" title={title === 'Jobs' ? jobFormData.jobType : internshipFormData.internshipType}
                    onSelect={(eventKey) => {
                      if (title === 'Jobs') {
                        setJobFormData({ ...jobFormData, jobType: eventKey });
                      } else if (title === 'Internships') {
                        setInternshipFormData({ ...internshipFormData, internshipType: eventKey });
                      }
                    }}>
                    <div className="scrollable-dropdown">
                      <Dropdown.Item eventKey="Full-time" href="#/action-1">Full-time</Dropdown.Item>
                      <Dropdown.Item eventKey="Part-time" href="#/action-2">Part-time</Dropdown.Item>
                      <Dropdown.Item eventKey="Internship" href="#/action-3">Internship</Dropdown.Item>
                      <Dropdown.Item eventKey="Volunteer" href="#/action-4">Volunteer</Dropdown.Item>
                      <Dropdown.Item eventKey="Contract" href="#/action-5">Contract</Dropdown.Item>
                    </div>
                  </DropdownButton>
                </Form.Group>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <DropdownButton id="createJob-categories-dropdown" title={title === 'Jobs' ? jobFormData.category : internshipFormData.category}
                    onSelect={(eventKey) => {
                      if (title === 'Jobs') {
                        setJobFormData({ ...jobFormData, category: eventKey });
                      } else if (title === 'Internships') {
                        setInternshipFormData({ ...internshipFormData, category: eventKey });
                      }
                    }}>
                    <div className="scrollable-dropdown">
                      <Dropdown.Item eventKey="Other" href="#/action-1">Other</Dropdown.Item>
                      <Dropdown.Item eventKey="Admin & Office" href="#/action-2">Admin & Office</Dropdown.Item>
                      <Dropdown.Item eventKey="Art & Design" href="#/action-3">Art & Design</Dropdown.Item>
                      <Dropdown.Item eventKey="Business Operations" href="#/action-3">Business Operations</Dropdown.Item>
                      <Dropdown.Item eventKey="Cleaning & Facilities" href="#/action-3">Cleaning & Facilities</Dropdown.Item>
                      <Dropdown.Item eventKey="Community & Social Services" href="#/action-3">Community & Social Services</Dropdown.Item>
                      <Dropdown.Item eventKey="Computer & Data" href="#/action-3">Computer & Data</Dropdown.Item>
                      <Dropdown.Item eventKey="Construction & Mining" href="#/action-3">Construction & Mining</Dropdown.Item>
                      <Dropdown.Item eventKey="Education" href="#/action-3">Education</Dropdown.Item>
                      <Dropdown.Item eventKey="Farming & Forestry" href="#/action-3">Farming & Forestry</Dropdown.Item>
                      <Dropdown.Item eventKey="Healthcare" href="#/action-3">Healthcare</Dropdown.Item>
                      <Dropdown.Item eventKey="Installation,Maintenance & Repair" href="#/action-3">Installation,Maintenance & Repair</Dropdown.Item>
                      <Dropdown.Item eventKey="Legal" href="#/action-3">Legal</Dropdown.Item>
                      <Dropdown.Item eventKey="Management" href="#/action-3">Management</Dropdown.Item>
                      <Dropdown.Item eventKey="Manufacturing" href="#/action-3">Manufacturing</Dropdown.Item>
                      <Dropdown.Item eventKey="Media & Communication" href="#/action-3">Media & Communication</Dropdown.Item>
                      <Dropdown.Item eventKey="Personal Care" href="#/action-3">Personal Care</Dropdown.Item>
                      <Dropdown.Item eventKey="Protective Services" href="#/action-3">Protective Services</Dropdown.Item>
                      <Dropdown.Item eventKey="Restaurants & Hospitality" href="#/action-3">Restaurants & Hospitality</Dropdown.Item>
                      <Dropdown.Item eventKey="Retail & Sales" href="#/action-3">Retail & Sales</Dropdown.Item>
                      <Dropdown.Item eventKey="Science & Engineering" href="#/action-3">Science & Engineering</Dropdown.Item>
                      <Dropdown.Item eventKey="Sports & Entertainment" href="#/action-3">Sports & Entertainment</Dropdown.Item>
                      <Dropdown.Item eventKey="Transportation" href="#/action-3">Transportation</Dropdown.Item>
                    </div>
                  </DropdownButton>
                </Form.Group>
                <Accordion defaultActiveKey="0">
                  <Card>
                    <Card.Header>
                      <CustomToggle eventKey="1" style={{ padding: '10px' }}>Add a question</CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body><Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter question"
                        name="question"
                        value={title === 'Jobs' ? jobFormData.questions : internshipFormData.questions}
                        onChange={handleInputChange}
                      /></Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
                <Form.Group controlId="description">
                  <Form.Label>Describe the responsibilities and preferred skills for this {titleS}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter job description"
                    name="description"
                    value={title === 'Jobs' ? jobFormData.description : internshipFormData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="image">
                  <Form.Label>Add an image to help applicants see what it's like to work at this location.</Form.Label>
                  <input className='form-control' type="file" onChange={handleImageChange} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={props.onHide} style={{backgroundColor: '#174873'}}>Close</Button>
              <Button onClick={handlePublish} style={{backgroundColor: '#174873'}}>Publish</Button>
            </Modal.Footer>
          </Modal>
        );
      }







    return (
        <MyVerticallyCenteredModal
            show={modalShow}
            onHide={onHide}
        />

    )
}


export default JobsInt;