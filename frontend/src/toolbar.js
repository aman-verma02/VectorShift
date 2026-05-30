// toolbar.js
// Renders the categorized node palette panel allowing drag-and-drop actions.
// ------------------------------------------------------------------------

import { DraggableNode } from './draggableNode';
import {Inbox, ArrowUpFromLine, Bot, Calculator, Braces, Globe, Sparkles, Timer , FileText} from 'lucide-react';  // for icons

export const PipelineToolbar = () => {
    return (
        <div className="toolbar-container">
            <h3 className="toolbar-title">Pipeline Building Palette</h3>
            
            <div className="toolbar-sections">
                
                {/* Category 1: Core Flow Nodes */}
                <div className="toolbar-section">
                    <span className="toolbar-section-title">Core Elements</span>
                    <div className="toolbar-nodes-row">
                        <DraggableNode type="customInput" label="Input" icon={<Inbox size={14} />} />
                        <DraggableNode type="customOutput" label="Output" icon={<ArrowUpFromLine size={14} />} />
                        <DraggableNode type="llm" label="LLM" icon={<Bot size={14} />} />
                        <DraggableNode type="text" label="Text"  icon={<FileText size={14} />} />
                    </div>
                </div>

                {/* Category 2: Logic & Templates */}
                <div className="toolbar-section">
                    <span className="toolbar-section-title">Logic & Templates</span>
                    <div className="toolbar-nodes-row">
                        <DraggableNode type="promptNode" label="Prompt" icon={<Sparkles size={14} />}/>
                        <DraggableNode type="mathNode" label="Math" icon={<Calculator size={14} />}/>
                        <DraggableNode type="jsonNode" label="JSON" icon={<Braces size={14} />}/>
                    </div>
                </div>

                {/* Category 3: Integrations & Time */}
                <div className="toolbar-section">
                    <span className="toolbar-section-title">Integrations & Time</span>
                    <div className="toolbar-nodes-row">
                        <DraggableNode type="apiNode" label="API Call" icon={<Globe size={14} />} />
                        <DraggableNode type="delayNode" label="Delay" icon={<Timer size={14} />} />
                    </div>
                </div>

            </div>
        </div>
    );
};