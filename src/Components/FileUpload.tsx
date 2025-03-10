import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      navigate('/results', { state: { file } });
    }
  };

  return (
    <div className="d-flex justify-content-center flex-column align-items-center">
      <Form.Group controlId="formFile" className="my-3">
        <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
      </Form.Group>
      <Button onClick={handleUpload} className='jumio-button'>Upload</Button>
    </div>
  );
};

export default FileUpload;
