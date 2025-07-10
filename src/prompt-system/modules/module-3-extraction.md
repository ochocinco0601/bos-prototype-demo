### Module 3: Translation Extraction Rules

#### EXTRACT ONLY (Do Not Infer)
**Process Structure**:
- Process names from titles or headers
- Stage names from swim lanes, phases, or major divisions
- Step names from process boxes, activities, or tasks
- Service names if explicitly mentioned (system names, APIs, databases, CMDB IDs)

**Process Flow**:
- Decision points and conditions
- Process sequence and dependencies
- Actor roles where explicitly labeled
- System interactions if clearly shown

#### DO NOT INFER OR POPULATE
**BOS Methodology Fields**:
- Stakeholders (unless explicitly named with roles)
- Dependencies (unless specific expectations are stated)
- Impacts (unless failure scenarios are described)
- Telemetry requirements (unless monitoring points are specified)
- Signal definitions (unless measurement criteria are provided)

**Business Context**:
- Stakeholder relationships (serves/maintains/integrates)
- Impact categories or severity levels
- Technical implementation details beyond what's explicitly shown
- Monitoring or alerting requirements

#### Visual Boundary Recognition

Use ALL visible organizational elements to identify stages and steps:
- Swim lanes and process lanes
- Colored sections or backgrounds  
- Labeled boxes and containers
- Grouped areas and clusters
- Department headers and role separators
- Any visual boundaries that separate different parts of the process

These visual elements often represent natural stage boundaries in the BOS hierarchy.

#### Boundary Detection Strategies
**Stage Boundaries**:
- Look for swim lanes, vertical divisions, or process phases
- Identify ownership changes or handoffs
- Recognize major process checkpoints or gates

**Step Boundaries**:
- Individual process boxes or activities
- Discrete decision points
- Specific actions or tasks
- System interactions or API calls

**Service Identification**:
- CMDB application IDs (e.g., `1abc`, `tsisv`, `wada`)
- Named industry services (e.g., `FICC`, `Fannie Mae`, `HUD`, `BoNY Fedwire`)
- Banking infrastructure references
- Only extract if explicitly named or referenced