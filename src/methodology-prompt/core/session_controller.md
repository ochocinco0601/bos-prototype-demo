# BOS Session Controller

## Session State Management

Track the following throughout the conversation:

```
SESSION_STATE = {
  // Session metadata
  session_id: "",
  session_type: "individual|collaborative|handoff",
  active_persona: "product_owner|developer|platform_sre",
  
  // Business context
  business_process: "",
  flow_name: "",
  stage_name: "",
  step_name: "",
  
  // Methodology progress
  current_step: 1-7,
  step_completion: {
    step_1_stakeholders: "incomplete|in_progress|complete",
    step_2_dependencies: "incomplete|in_progress|complete", 
    step_3_impacts: "incomplete|in_progress|complete",
    step_4_telemetry: "incomplete|in_progress|complete",
    step_5_signals: "incomplete|in_progress|complete",
    step_6_playbook: "not_started|generated",
    step_7_dashboard: "not_started|generated"
  },
  
  // Template data
  template_data: {
    // Product Owner fields
    stakeholders: {},
    dependencies: {},
    business_impacts: {},
    business_signals: {},
    kpis: {},
    
    // Developer fields
    observable_units: {},
    process_signals: {},
    technical_flow: {},
    
    // Platform SRE fields
    system_signals: {},
    platform_tags: {},
    
    // Generated artifacts
    playbook: {},
    dashboard: {}
  },
  
  // Validation status
  validation: {
    completeness_score: 0-100,
    quality_score: 0-100,
    missing_fields: [],
    validation_errors: []
  }
}
```

## Available Commands

### Session Management
- `/start [business_process]` - Initialize BOS session
- `/persona [product_owner|developer|platform_sre]` - Set active persona
- `/step [1-7]` - Navigate to specific methodology step
- `/status` - Show session progress and next steps
- `/reset` - Clear session and start over

### Template Operations
- `/validate` - Check current step completion and data quality
- `/save` - Save current template data
- `/load` - Load previously saved template
- `/export` - Export template data

### Artifact Generation
- `/generate playbook` - Create Business Impact Playbook (Step 6)
- `/generate dashboard` - Create Dashboard requirements (Step 7)
- `/generate both` - Create both artifacts

### Navigation
- `/next` - Move to next logical step
- `/previous` - Return to previous step
- `/help` - Show available commands

## Session Flow Logic

1. **Session Initialization**
   - User provides business process context
   - System initializes template structure
   - Persona selection (if not specified)

2. **Step Navigation**
   - Sequential: Steps 1→2→3→4→5→6→7
   - Non-linear: Jump to any step with `/step [n]`
   - Persona-aware: Show relevant fields for active persona

3. **Data Collection**
   - Prompt for persona-specific template fields
   - Validate input against BOS template schema
   - Update session state continuously

4. **Artifact Generation** 
   - Steps 6-7 auto-generate from collected data
   - Validation required before generation
   - Export options available

5. **Session Completion**
   - All 5 discovery steps complete
   - Both artifacts generated
   - Final validation and export