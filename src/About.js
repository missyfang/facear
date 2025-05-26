import './About.css';
import { Container, Card, Button } from 'react-bootstrap';
import Anisha from './img/Anisha.jpg';
import Nithisha from './img/Nithisha.jpg';
import Melissa from './img/Melissa.jpg';
import Haihan from './img/Haihan.jpg';
import youtubeVideo from './img/youtubeVideo.png';
import skilledProfessionals from './img/skilledProfessionals.png';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LinkedinLogo from './img/linkedinLogo.png';
import Showcase from './img/showcase.png';
import { Link } from 'react-router-dom';

function Problems() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 inner-card-bg h-100 d-flex flex-column">
              <div className="card-body d-flex flex-column">
                <div className="card-text card-text-color fs-5 inner-card-text-color">
                  Performing exercises through video or written instructions can be 
                  improved as it lacks interactivity & customized feedback.
                </div>
                <div className="mt-auto">
                  <img src={youtubeVideo} className="card-img-bottom mt-2" alt="Exercise YouTube Video" />
                </div>
              </div>
              <div className='card-footer w-100'>Source: <Link 
              to="https://www.proquest.com/docview/2137840500?pq-origsite=gscholar&fromopenview=true" 
              className='card-footer-text-color' target="_blank" rel="noopener noreferrer">
                Journal of Alternative Medicine Research</Link></div>
            </div>
          </div>
          <div className="col-md-6 mt-md-0 mt-3">
            <div className="card border-0 inner-card-bg h-100 d-flex flex-column">
              <div className="card-body d-flex flex-column">
                <div className="card-text card-text-color fs-5 inner-card-text-color">
                  Shortage of skilled professionals in facial paralysis makes info about 
                  how to perform right exercises less accessible + costly.
                </div>
                <div className="mt-auto">
                  <img src={skilledProfessionals} className="card-img-bottom mt-2" alt="Skilled Medical Professionals" />
                </div>
              </div>
              <div className='card-footer w-100'>Source: <Link 
              to="https://dataintelo.com/report/facial-paralysis-treatment-market/" 
              className='card-footer-text-color' target="_blank" rel="noopener noreferrer">Dataintelo Facial Paralysis Market Report</Link></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Team() {
    return (
      <Container fluid>
        <Row xs={1} sm={2} md={4} className="g-4">
          <Col>
            <Card className='border-0 inner-card-bg'>
              <Card.Body className='d-flex flex-column justify-content-between'>
                <Card.Title  className='inner-card-text-color'>Nithisha Kumar</Card.Title>
                <img src={Nithisha} className="card-img-bottom mt-3" alt="Nithisha Nantha Kumar" />
                <Button href='https://www.linkedin.com/in/nithishakumar/' className='mt-3 border-0 outer-card-bg' 
                target="_blank" rel="noopener noreferrer">
                    <img src={LinkedinLogo} width='20' height='auto' alt="Image" className="img-fluid"/>
                </Button>{' '}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='border-0 inner-card-bg'>
              <Card.Body className='d-flex flex-column justify-content-between'>
                <Card.Title className='inner-card-text-color'>Melissa Fang</Card.Title>
                <img src={Melissa} className="card-img-bottom mt-3" alt="Melissa Fang" />
                <Button  href='https://www.linkedin.com/in/melissa-fang-04a76a20a/' className='mt-3 border-0 outer-card-bg' 
                target="_blank" rel="noopener noreferrer">
                    <img src={LinkedinLogo} width='20' height='auto' alt="Image" className="img-fluid"/>
                </Button>{' '}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='border-0 inner-card-bg'>
              <Card.Body className='d-flex flex-column justify-content-between'>
                <Card.Title className='inner-card-text-color'>Anisha Nahta</Card.Title>
                <img src={Anisha} className="card-img-bottom mt-3" alt="Anisha Nahta" />
                <Button href='https://www.linkedin.com/in/anishanahta/' className='mt-3 border-0 outer-card-bg' 
                target="_blank" rel="noopener noreferrer">
                    <img src={LinkedinLogo} width='20' height='auto' alt="Image" className="img-fluid"/>
                </Button>{' '}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='border-0 inner-card-bg'>
              <Card.Body className='d-flex flex-column justify-content-between'>
                <Card.Title className='inner-card-text-color'>Haihan Gao</Card.Title>
                <img src={Haihan} className="card-img-bottom mt-3" alt="Haihan Gao" />
                <Button href='https://www.linkedin.com/in/haihan--gao/' className='mt-3 border-0 outer-card-bg' 
                target="_blank" rel="noopener noreferrer">
                    <img src={LinkedinLogo} width='20' height='auto' alt="Image" className="img-fluid"/>
                </Button>{' '}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
  
  function About() {
    return (
      <Container className='px-4'> 
        <Container className="d-flex align-items-center justify-content-center about-banner">
          <h1 className="text-center font-weight-bold">
            <b>FaceAR is a mobile AR app <span className='gradient-text'>with potential to revolutionize </span> 
            the facial rehabilitation space.</b>
          </h1>
        </Container>
        <Row className="justify-content-center">
            <Col className="my-4"> {/* Equal space between title and cards */}
                <Card className='outer-card-bg border-0'>
                <Card.Body className='p-3'>
                    <div className='fs-4 outer-card-text-color'>
                    Several studies show that facial muscle exercises help patients with 
                    facial weakness & paralysis, but there are issues associated with performing 
                    these exercises:
                    </div>
                </Card.Body>
                <Card.Body className="d-flex justify-content-center align-items-center">
                    <Problems />
                </Card.Body>
                <Card.Body className='p-3'>
                    <div className='fs-4 outer-card-text-color'>
                FaceAR is an accessible, cost-effective, and expert-backed solution that 
                uses real-time AR feedback with engaging games to make the facial 
                rehabilitation process more interactive.
                    </div>
                </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="justify-content-center">
            <Col className="my-4"> {/* Equal space between title and cards */}
                <Card className='outer-card-bg border-0'>
                <Card.Body className='p-3'>
                    <div className='fs-4 outer-card-text-color'>
                    The FaceAR team consists of 4 University of Michigan graduates who are 
                    eager to use their XR development skills to create social impact:
                    </div>
                </Card.Body>
                <Card.Body className="d-flex justify-content-center align-items-center">
                    <Team />
                </Card.Body>
                <Card.Body className='p-3'>
                    <div className='fs-4 outer-card-text-color'>
                    What started as a capstone project for a college course is now being further developed and 
                    tested in the University of Michigan's <Link to="https://neurro-lab.engin.umich.edu/" 
                    className='outer-card-text-color' target="_blank" rel="noopener noreferrer">NeuRRo Lab</Link> under the supervision of Dr. Chandramouli Krishnan with funding from Snap, Inc.<br/> 
                    The FaceAR team is iteratively improving the app by actively applying feedback on the app from facial 
                    disorder patients at Michigan Medicine.
                    </div>
                </Card.Body>
                <img src={Showcase} className="card-img-bottom" alt="Showcase" />
                </Card>
            </Col>
        </Row>
        
      </Container>
    );
  }
  
  export default About;