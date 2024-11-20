import React, { useState } from "react";
import "../../components/admin/styles/QueryBox.css"; 

const serverUrl = process.env.REACT_APP_API_URL



function QueryBox() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const executeQuery = async () => {
        try {
            const response = await fetch(serverUrl+"/admin/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (response.ok) {
                setResults(data.data);
                setError(null);
            } else {
                setResults(null);
                setError(data.error || "Query execution failed.");
            }
        } catch (err) {
            setResults(null);
            setError("An error occurred while executing the query.");
        }
    };

    return (
        <div className="query-box">
            <h2>Query Box</h2>
            <textarea
                placeholder="Enter your SQL query here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows="5"
                cols="50"
                className="query-input"
            ></textarea>
            <br />
            <button onClick={executeQuery} className="execute-button">
                Execute Query
            </button>

            {error && <div className="error">{error}</div>}

            {results && (
                <div className="results-table">
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(results[0] || {}).map((column) => (
                                    <th key={column}>{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, i) => (
                                        <td key={i}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default QueryBox;
