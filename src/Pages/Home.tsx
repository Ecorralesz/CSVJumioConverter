import FileUpload from "../Components/FileUpload";
import { Container, Row, Col, Image } from "react-bootstrap";
import JumioImage from "../assets/Jumio Logo-color/Jumio23-RGB.png";

const Home: React.FC = () => {
  return (
    <Container className="mt-4">
      <Row className="align-items-center">
        {/* Left: Image */}
        <Col md={6} className="text-center">
          <Image src={JumioImage} alt="Jumio Logo" fluid />
        </Col>

        {/* Right: Description */}
        <Col md={6}>
        <h2>CSV Converter for Jumio</h2>
<p>
  Our CSV Converter for Jumio is a powerful tool designed to
  streamline the processing of CSV files generated from Jumio scans.
  Whether you’re managing a large volume of scan data or performing
  detailed data analysis, this app transforms raw CSV files into
  well-organized, searchable, and easily interpretable data.
</p>
<p>
  With advanced features, the converter automatically extracts key
  information such as scan references, converts any payload columns
  into structured JSON, and supports a dynamic column structure—making
  it highly adaptable to different CSV formats. Its intelligent
  parsing engine ensures that even complex, nested JSON data is
  handled seamlessly, providing you with clear, formatted output every
  time.
</p>
<ul>
  <li>
    <strong>Payload Formatting:</strong> Automatically detects and
    converts JSON payloads, ensuring that detailed information is
    preserved and presented in an easy-to-read format.
  </li>
  <li>
    <strong>Scan Reference Extraction:</strong> Efficiently extracts
    scan references and displays them prominently, allowing for quick
    identification and reference management.
  </li>
  <li>
    <strong>Dynamic Column Support:</strong> Designed to work with any
    CSV column structure, making it a versatile solution for varied
    data sources.
  </li>
  <li>
    <strong>Search & Filtering:</strong> Integrated search
    functionality lets you quickly locate and filter rows based on any
    keyword across all columns, including within JSON data.
  </li>
  <li>
    <strong>Date Formatting:</strong> Automatically detects columns
    named "timestamp" or "date" and formats them to the "YYYY-MM-DD HH:MM:SS"
    format, ensuring consistent and clean date output.
  </li>
  <li>
    <strong>User-Friendly Interface:</strong> Enjoy an intuitive
    interface for CSV uploads and instant data visualization, enabling
    smooth data handling and analysis.
  </li>
</ul>
<p>
  Whether you are in quality control, data management, or any field
  requiring rapid processing of scan data, this tool enhances
  productivity and accuracy by automating repetitive tasks and
  ensuring data consistency.
</p>

        </Col>
      </Row>

      {/* File Upload Component */}
      <Row className="mt-4">
        <Col>
          <FileUpload />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
