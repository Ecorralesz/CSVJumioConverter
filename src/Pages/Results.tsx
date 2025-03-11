import { useLocation, useNavigate } from 'react-router-dom';
import {  Container, Button } from 'react-bootstrap';
import ResultsTable from '../Components/ResultTable';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const file = location.state?.file as File | undefined;

  if (!file) {
    return (
      <Container className="text-center mt-5">
        <h1 className='mb-5'>No File Uploaded</h1>
        <Button onClick={() => navigate('/')} className='jumio-button'>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <ResultsTable file={file} />
    </Container>
  );
};

export default Results;
