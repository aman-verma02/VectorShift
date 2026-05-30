// App.js
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="app-container">
      
      {/* App Header */}
      <header className="app-header">
        <h1>Vector<span>Shift</span> Pipeline Editor</h1>
        <p> Drag and Drop odes to construct your AI agent workflow pipelines, extract variables, and test for cycles.</p>
      </header>
      
      {/* Interactive toolbar for pipeline construction */}
      <PipelineToolbar />

      {/* Main Flow Editor Canvas */}
      <PipelineUI />

      {/* Floating Graph Submit trigger */}
      <SubmitButton />
    </div>
  );
}

export default App;