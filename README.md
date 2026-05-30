# VectorShift Pipeline Editor — Frontend Technical 

**Author:** Aman Verma  
**Project:** VectorShift - Frontend Technical   
**Stack:** React - ReactFlow - FastAPI - Python

---

## Overview

A visual, drag-and-drop AI pipeline editor built on ReactFlow. Users can construct workflows by connecting typed nodes on an interactive canvas, then submit the pipeline to a FastAPI backend that analyzes the graph structure and verifies whether it forms a Directed Acyclic Graph (DAG).

---

## Getting Started

### Prerequisites
- Node.js v16+
- Python 3.9+

### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Backend
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
# Runs on http://localhost:8000
```

-------------------------------------------------------------------------------------------

## Project Structure

```
├── frontend/
│   └── src/
│       ├── nodes/
│       │   ├── BaseNode.js          # Core node abstraction
│       │   ├── BaseNode.css         # Unified node styling
│       │   ├── inputNode.js
│       │   ├── outputNode.js
│       │   ├── llmNode.js
│       │   ├── textNode.js
│       │   ├── promptNode.js        # New
│       │   ├── mathNode.js          # New
│       │   ├── jsonNode.js          # New
│       │   ├── apiNode.js           # New
│       │   └── delayNode.js         # New
│       ├── App.js
│       ├── toolbar.js
│       ├── ui.js
│       ├── store.js                 # Zustand global state
│       ├── draggableNode.js
│       ├── submit.js                # Pipeline submission + modal
│       └── index.css                # Global styles
└── backend/
    ├── main.py                      # FastAPI DAG analysis endpoint
    ├── requirements.txt             # List external packages and libraries
```

--------------------------------------------------------------------------------------

## Part 1 — Node Abstraction

### Problem
The four original nodes (`InputNode`, `OutputNode`, `LLMNode`, `TextNode`) each duplicated the same structural code — wrapper div, header, handle rendering, and inline styles. Adding a new node meant copying and modifying an entire file.





### Solution — `BaseNode.js`

`BaseNode` is a single React component that owns everything shared across all node types:

- Outer container with consistent styling and color scheme
- Header with icon, title, and node ID badge
- Body slot via `children` prop
- Handle rendering from a declarative `handles` array
- Delete button removes the node and all connected edges simultaneously

Each node only defines what is unique to it — its state, its fields, and its handle configuration.

```javascript
// Every node now looks like this:
<BaseNode
  id={id}
  title="Input node"
  icon={<"icon name" size={14} strokeWidth={2} />}
  colorScheme="math"
  handles={handles}
>
  {/* node-specific fields only */}
</BaseNode>
```





### Key Design Decisions

**`colorScheme` prop** — Each node type passes a string like `"input"` or `"llm"`. BaseNode applies `base-node-${colorScheme}` as a CSS class. Each class overrides CSS custom properties (`--border-node`, `--accent-color`) so the entire color theme of a node changes with a single prop value — no conditional rendering, no inline style overrides.

**Declarative `handles` array** — Instead of hardcoding `<Handle>` components inside each node, every node defines an array of handle config objects. BaseNode maps over them. This means handle positioning, type, and style are data, not markup.

**`style` passthrough prop** — BaseNode accepts a `style` prop applied to the wrapper div. This is essential for the TextNode auto-resize feature in Part 3, where the container width must change dynamically via inline style.





### Five New Nodes

| Node | Purpose | Handles |
|---|---|---|
| `PromptNode` | Template prompt with `{{variable}}` extraction | Dynamic targets (left) + source (right) |
| `MathNode` | Mathematical operations (add, subtract, multiply, divide) | 2 targets for operands A/B + source for result |
| `JsonNode` | JSON parse, stringify, and beautify operations | 1 target + 1 source |
| `ApiNode` | HTTP API call configuration (GET/POST/PUT/DELETE) | 1 target for payload + 1 source for response |
| `DelayNode` | Configurable millisecond delay for workflow timing | 1 target + 1 source |

-------------------------------------------------------------------------------------------






## Part 2 — Styling

### Design System

A unified dark theme built entirely with CSS custom properties. All colors, borders, and accent values are defined as variables so changing a node's `colorScheme` cascades automatically across border, glow, focus ring, and handle colors.

**Color palette:**
- Background: `#0d1117` (page), `#161b22` (panels/nodes)
- Accent: `#7c3aed` (purple) as the primary interactive color
- Handle colors: Rose (`#f43f5e`) for target inputs, Emerald (`#10b981`) for source outputs

**Node color schemes:** Each of the 9 node types has its own accent color — sky blue for Input, violet for LLM, emerald for Output, amber for Text, pink for Prompt, teal for API, indigo for Math, fuchsia for Delay, blue for JSON.

**Interactions:** All interactive elements have transitions — nodes lift on hover, handles scale on hover with a colored glow, toolbar cards lift and glow, the submit button brightens.

### ReactFlow Overrides
MiniMap, Controls, and edge styles are overridden to match the dark theme. Connection lines use `#818cf8` with `smoothstep` routing.

--------------------------------------------------------------------------------------------------





## Part 3 — Text Node Logic

### Auto-Resize

The TextNode dynamically computes its width and height based on the current text content on every keystroke.

```javascript
const lines = currText.split('\n');
const maxLineLength = Math.max(...lines.map((l) => l.length), 15);
const lineCount = Math.max(lines.length, 2);

const textWidth = Math.max(180, Math.min(450, maxLineLength * 7.5 + 24));
const textHeight = Math.max(60, Math.min(300, lineCount * 18 + 16));
```

Width is clamped between 180px and 450px. Height is clamped between 60px and 300px. The `7.5px` character width estimate is accurate for monospace fonts. Both the textarea and the node container (via the `style` prop on BaseNode) resize together so handles stay correctly positioned.

### Dynamic Variable Handles

A `useEffect` runs whenever `currText` changes. It applies a regex against the text to extract all valid JavaScript variable names wrapped in double curly braces:

```javascript
const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
```

The regex enforces valid JS identifier rules — must start with a letter, underscore, or `$`. Numbers, spaces, and special characters are rejected. Duplicates are filtered before setting state, so typing `{{input}} {{input}}` creates only one handle.

Each extracted variable becomes a `target` handle on the left side of the node. Handles are evenly distributed vertically using the formula:

```javascript
const topPosition = ((index + 1) * 100) / (variables.length + 1);
```

Variable names are also displayed as styled badges inside the node body for visibility.

-------------------------------------------------------------------------------------------




## Part 4 — Backend Integration

### Frontend (`submit.js`)

On submit, the pipeline state is read from the Zustand store and serialized to a minimal payload:

```javascript
{
  nodes: [{ id, type }],
  edges: [{ id, source, target }]
}
```

The payload is sent as a POST request to `http://localhost:8000/pipelines/parse`. The response is displayed in a custom modal — not a browser `alert()` — with human-readable labels and color-coded DAG status badges.

Empty pipeline guard prevents submission with zero nodes.

### Backend (`main.py`)

The `/pipelines/parse` endpoint accepts the pipeline payload, validated by Pydantic schemas with `extra = 'allow'` to handle ReactFlow's additional fields gracefully.

**DAG Detection — DFS 3-Coloring Algorithm**

I chose DFS 3-coloring over Kahn's algorithm (topological sort via in-degree) 
because it is more direct for pure cycle detection — Kahn's algorithm is better 
suited when you also need the topological order of nodes, which this use case 
does not require.

- `0` (White) — node not yet visited
- `1` (Gray) — node currently being explored (on the DFS stack)
- `2` (Black) — node fully explored

If during DFS we encounter a Gray node, we have found a back edge — proof of a cycle. The graph is not a DAG.



```python
def has_cycle(node_id: str) -> bool:
    color[node_id] = 1  # Mark Gray
    for neighbor in adj.get(node_id, []):
        if color.get(neighbor, 0) == 1:  # Back edge found
            return True
        if color.get(neighbor, 0) == 0:
            if has_cycle(neighbor):
                return True
    color[node_id] = 2  # Mark Black
    return False
```

DFS is run from every unvisited node to handle disconnected graph components correctly. A disconnected graph with no cycles is still a valid DAG.

**CORS** is configured to allow requests from `http://localhost:3000` only, which is the correct production-safe approach (as opposed to allowing all origins with `"*"`).

**Response format:**
```json
{ "num_nodes": 4, "num_edges": 3, "is_dag": true }
```

---

## Edge Cases Handled

| Case | Behavior |
|---|---|
| Empty pipeline | Blocked at frontend — alert shown before submission |
| Single node, no edges | Correctly identified as a DAG |
| Self-loop | Detected as cycle — not a DAG |
| Cyclic graph | Detected as cycle — not a DAG |
| Disconnected components | DFS runs from all unvisited nodes — correctly identified as DAG if acyclic |
| Duplicate `{{variables}}` in TextNode | Deduplicated — only one handle created per unique name |
| Invalid variable names in TextNode | Regex enforces JS identifier rules — rejected silently |
| Extra ReactFlow fields in payload | Pydantic `extra = 'allow'` handles gracefully |

---

## What I Would Improve With More Time

**Code quality:**
- Extract a `useVariableExtractor` custom hook shared between `TextNode` and `PromptNode` — both currently duplicate the same regex logic
- The provided `store.js` `updateNodeField` function mutates node objects directly rather than returning new references. In production this can cause React to miss re-renders. I would return `{ ...node, data: { ...node.data, [fieldName]: fieldValue } }` instead
- Add PropTypes or migrate to TypeScript for type safety on BaseNode props

**Features:**
- Undo/redo via Zustand middleware
- Export pipeline as JSON and reimport
- Validate that all target handles are connected before submission
- Real backend execution of pipeline steps, not just graph analysis

**Testing:**
- Unit tests for DAG detection covering all edge cases
- React Testing Library tests for TextNode variable extraction
- Cypress end-to-end test for the full submit flow

-------------------------------------------------------------------------------------------

## Technical Decisions Summary

| Decision | Rationale |
|---|---|
| CSS custom properties for theming | Single `colorScheme` prop cascades to all visual elements without conditional logic |
| DFS 3-coloring over Kahn's algorithm | More direct for pure cycle detection — Kahn's is better when you also need topological order |
| Zustand over Redux | Lighter API, no boilerplate, sufficient for this scale |
| Declarative handles array in BaseNode | Handle config becomes data not markup - easier to extend and test |
| Custom modal over `window.alert()` | Browser alerts block the UI thread and cannot be styled |
| Pydantic `extra = 'allow'` | ReactFlow nodes carry many fields beyond `id` and `type` — strict validation would reject valid payloads |