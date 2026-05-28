# FastAPI backend endpoint for parsing pipeline and verifying the 'Direct Acyclic Graph' property. This is a placeholder implementation and should be replaced with actual parsing logic.


from collections import defaultdict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any


app = FastAPI(
    title='Pipeline Parser Parser',
    description='Analyzes pipline structures, nodec counts, edge counts, and checks for acyclic behavior.'
)

## Add CORS middleware to allow seamless req, res handling from the React frontend (running on port: "3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # we can put "*" to allow all origins 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

## Define Pydantic valiation schemas for incoming data 
class NodeSchema(BaseModel): 
    id: str
    type: str

class EdgeSchema(BaseModel):
    id: str
    source: str
    target: str

class PipelineSchema(BaseModel):
    nodes: List[NodeSchema]
    edges: List[EdgeSchema]



## Main function - To chekc whether the pipeline is a DAG (Directed Acyclic Graph) or not, we can use Depth-First Search (DFS) to detect cycles in the graph. If we find a back edge during DFS, it means there is a cycle in the graph, and thus it is not a DAG.
def check_is_dag(nodes: List[NodeSchema], edges: List[EdgeSchema]) -> bool:
    """
    Determine whether the given pipeline is acyclic (DAG) or not. 
    Using the Depth-First Search (DFS) 3 - Coloringalgorithm to detect cycles in the graph.
    - 0: unvisited (White)
    - 1: visiting  (Gray)
    - 2: visited (Black)
    """
   
    # Create adjacency list for all nodees in the graph
    adj : Dict[str, List[str]] = {node.id: [] for node in nodes}

    # Populate the adjacency list with edges 
    for edge in edges:
        if edge.source not in adj: 
            adj[edge.source] = []
        if edge.target not in adj:
            adj[edge.target] = []
        adj[edge.source].append(edge.target)

    # Track DFS state of each node: 0 (unvisited), 1 (visiting), 2 (visited)
    color: Dict[str, int] = {node_id: 0 for node_id in adj.keys()}


    def has_cycle(node_id: str) -> bool:
        color[node_id] = 1  # Mark as visiting (Gray)
        
        for v in adj.get(node_id, []):
            if color.get(v, 0) == 1 : # Found a back edge, pointing to a node currently in the stack (Gray), which indicates a cycle.
                return True
            if color.get(v, 0) == 0: # If the neighbor is unvisited (White), we need to visit it recursively.
                if has_cycle(v):
                    return True
        color[node_id] = 2  # Mark as visited (Black)
        return False

    # Perform DFS for each unvisited node's starting point in the graph
    for node in adj.keys():
        if color.get(node, 0) == 0: # If the node is unvisited (White), we need to start a DFS from it.
            if has_cycle(node):
                return False  # Cycle detected, not a DAG
    return True  # No cycles detected, it's a DAG


@app.get('/')
def read_root():
    return {
                'status': 'Pipeline Parser API is running!',
                'message': 'Use the /pipelines/parse endpoint to analyze your pipeline structure.'
            }

@app.post('/pipelines/dag_compute')
def parse_pipeline(payload: PipelineSchema) -> Dict[str, Any]:
    """
    Calculates tdetails of the submitted graph pipeline including node counts,
    edge counts, and whether the graph is a DAG (Directed Acyclic Graph) or not.
    """

    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)

    # Compute if the pipeline forms a DAG (Directed Acyclic Graph) by checking for cycles in the graph structure.
    is_dag = check_is_dag(payload.nodes, payload.edges)
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag
    }