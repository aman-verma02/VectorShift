// submit.js
// Handles pipeline graph submission, backend verification, and displays
// showing node/edge counts and DAG cycle checks.
// ------------------------------------------------------------------------

import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);   
    const edges = useStore((state) => state.edges);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // Local state for the backend response modal

    const handleSubmit = async () => {
        if (nodes.length === 0) {
            alert('Add at least one node before submitting.');
            return;
        }
        setLoading(true);
        setResult(null);

        // Build the payload with nodes and edges     and will be send to the backend
        const payload = {
            nodes: nodes.map((node) => ({
                id: node.id,
                type: node.type,
            })),
            edges: edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
            })),
        };

        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),    // sending to the bakcend
            });

            if (!response.ok) {
                throw new Error(`Server returned HTTP error ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Submission failed:', error);
            // Fallback user feedback
            alert(`Pipeline Parsing Failed:\n${error.message}\nMake sure your backend server is running!`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="submit-section">
            <button 
                type="button" 
                onClick={handleSubmit} 
                disabled={loading}
                className="submit-btn"
            >
                {loading ? (
                <>
                    <span className="spinner"></span> Parsing Pipeline...
                </>
                ):(
                <>
                    Submit Pipeline
                </>
                )}
            </button>

            {/* Custom alert will be shown for the graph assessment details */}
            {result && (
                <div className="custom-alert-overlay" onClick={() => setResult(null)}>
                    <div className="custom-alert-box" onClick={(e) => e.stopPropagation()}>
                        <div className="custom-alert-header">
                        📊 Assessment Analytics
                        </div>
                        
                        <div className="custom-alert-content">
                            <div className="custom-alert-item">
                                <span className="custom-alert-label">Total Nodes:</span>
                                <span className="custom-alert-value">{result.num_nodes}</span>
                            </div>

                            <div className="custom-alert-item">
                                <span className="custom-alert-label">Total Edges:</span>
                                <span className="custom-alert-value">{result.num_edges}</span>
                            </div>

                            <div className="custom-alert-item">
                                <span className="custom-alert-label">Acyclic Check (DAG):</span>
                                <span className="custom-alert-value">
                                {result.is_dag ? (
                                    <span className="badge-dag-true">Yes (No Cycles)</span>
                                ) : (
                                    <span className="badge-dag-false">No (Contains Cycles)</span>
                                )}
                                </span>
                            </div>
                        </div>

                        <button 
                            type="button" 
                            onClick={() => setResult(null)}
                            className="custom-alert-close"
                            >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
  );
};