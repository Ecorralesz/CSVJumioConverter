import { useEffect, useState } from "react";
import { Table, Button, Form, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faRectangleXmark , faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons"; 
import { GridLoader } from "react-spinners"; 
import JumioImage from "../assets/Jumio-Logo-grayscale/Jumio Logo-grayscale.svg";

interface ResultsTableProps {
  file: File;
}

interface RowData {
  [key: string]: any;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ file }) => {
  const [parsedRows, setParsedRows] = useState<RowData[]>([]);
  const [scanReference, setScanReference] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); 
  const navigate = useNavigate();

  const toggleExpand = (rowIndex: number) => {
    setExpandedRows((prev) =>
      prev.includes(rowIndex) ? prev.filter((i) => i !== rowIndex) : [...prev, rowIndex]
    );
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return ""; // Return an empty string for invalid dates
  
    return parsedDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    });
  };
  

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split("\n").filter(Boolean);
      if (lines.length < 2) return;

      const headerTokens = lines[0].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      const headers = headerTokens.map((token) => token.trim().replace(/^"|"$/g, ""));

      const rawData: RowData[] = lines.slice(1).map((line) => {
        const tokens = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        const rowObj: RowData = {};
        tokens.forEach((token, idx) => {
          let val = token.trim().replace(/^"|"$/g, "").replace(/""/g, '"');
          const header = headers[idx] || `col${idx}`;
          if (header === "payload") {
            try {
              val = JSON.parse(val);
            } catch (err) {
              console.error("Invalid JSON in payload:", val);
            }
          }
          rowObj[header] = val;
        });
        return rowObj;
      });

      if (rawData.length > 0 && rawData[0]["scanreference"]) {
        setScanReference(rawData[0]["scanreference"]);
      }
      setParsedRows(rawData);
      setLoading(false); 
    };

    reader.readAsText(file);
  }, [file]);

  const columns =
    parsedRows.length > 0
      ? Object.keys(parsedRows[0])
          .filter((col) => col !== "scanreference")
          .sort((a, b) => (a === "payload" ? 1 : b === "payload" ? -1 : 0))
      : [];

  const filteredRows = parsedRows.filter((row) =>
    Object.values(row).some((value) => {
      let stringValue = "";

      if (typeof value === "object" && value !== null) {
        stringValue = JSON.stringify(value);
      } else {
        stringValue = String(value);
      }

      return stringValue.toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

  return (
    <div style={{ width: "auto", margin: "0 auto", overflowX: "hidden" }}>
      {loading ? (
        // Show the spinner while loading
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <GridLoader color="#1db068" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div className="d-flex gap-3 align-items-center">
              <Image src={JumioImage} alt="Jumio Logo" fluid className="image-corner"/>
              <h3>
                <FontAwesomeIcon 
                  icon={scanReference ? faExpand : faRectangleXmark} 
                  className="me-2" 
                  style={{ color: scanReference ? "#28a745" : "#dc3545" }} 
                />
                {scanReference ? `Scan Ref: ${scanReference}` : "No Scan Ref available"}
              </h3>
            </div>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "300px" }}
              />
              <Button onClick={() => navigate('/')} className="jumio-button">
                Go Back
              </Button>
            </div>
          </div>

          <Table striped bordered hover responsive style={{ width: "auto", tableLayout: "fixed" }}>
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} style={{ wordWrap: "break-word", width: col === "payload" ? "40%" : "auto" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => {
                    const cellValue = row[col];

                    // Format date or timestamp columns
                    let displayValue = cellValue;
                    if ((col.toLowerCase().includes("date") || col.toLowerCase().includes("timestamp")) && typeof cellValue === "string") {
                      displayValue = formatDate(cellValue);
                    }
                    

                    if (col === "payload" && cellValue) {
                      const isExpanded = expandedRows.includes(rowIndex);
                      return (
                        <td
                          key={colIndex}
                          style={{
                            verticalAlign: "top",
                            width: "40%",
                            overflow: "hidden",
                            wordWrap: "break-word",
                          }}
                        >
                          <div style={{ position: "relative" }}>
                            <pre
                              style={{
                                maxHeight: isExpanded ? "none" : "200px",
                                overflowY: isExpanded ? "visible" : "auto",
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                margin: 0,
                              }}
                            >
                              {JSON.stringify(cellValue, null, 2)}
                            </pre>
                            <div style={{ marginTop: "0.5rem" }}>
                              <Button variant="link" size="sm" onClick={() => toggleExpand(rowIndex)}>
                                <FontAwesomeIcon icon={isExpanded ? faCaretUp : faCaretDown} className="icon-border" />
                              </Button>
                            </div>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={colIndex} style={{ whiteSpace: "normal", wordWrap: "break-word", verticalAlign: "top" }}>
                        {String(displayValue || "")}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default ResultsTable;
