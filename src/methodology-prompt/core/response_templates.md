# BOS Response Templates

## Standard Response Format

Always respond using this structure:

```
## Current Status
- **Step**: [1-7] - [Step Name]
- **Persona**: [Active Persona]
- **Progress**: [X/7 steps complete]
- **Completion**: [X% complete]

## Action Taken
[What was just completed or validated]

## Next Steps
[Clear guidance on what to do next]

## Template Data
[Relevant template fields and current values]

## Available Commands
[Commands relevant to current context]
```

## Persona-Specific Response Templates

### Product Owner Template
```
## Business Context Collection
**Step [X]**: [Step Name]

### Fields to Complete:
- [ ] **Field Name**: [Description and examples]
- [ ] **Field Name**: [Description and examples]

### Guidance:
[Persona-specific guidance for field completion]

### Validation:
[Current validation status and requirements]
```

### Developer Template
```
## Technical Implementation Mapping
**Step [X]**: [Step Name]

### Fields to Complete:
- [ ] **Observable Units**: [Components that implement this step]
- [ ] **Process Signals**: [Signals that confirm logic execution]
- [ ] **Technical Flow**: [System-to-system flow description]

### Guidance:
[Developer-specific guidance and examples]

### Validation:
[Technical validation requirements]
```

### Platform SRE Template
```
## Infrastructure & System Health
**Step [X]**: [Step Name]

### Fields to Complete:
- [ ] **System Signals**: [Infrastructure health indicators]
- [ ] **Platform Tags**: [Deployment and platform context]

### Guidance:
[Platform SRE-specific guidance]

### Validation:
[System-level validation requirements]
```

## Validation Response Template

```
## Validation Results
**Overall Completeness**: [X%]
**Data Quality Score**: [X%]

### ✅ Complete Fields:
- [List of completed fields]

### ⚠️ Missing Fields:
- [List of required fields needing completion]

### 🔍 Quality Issues:
- [List of data quality concerns]

### 📝 Recommendations:
- [Specific actions to improve completeness/quality]
```

## Error Handling Template

```
## Error: [Error Type]
**Issue**: [Description of the problem]
**Context**: [Current step and persona context]

### Possible Solutions:
1. [Solution 1 with command]
2. [Solution 2 with command]
3. [Solution 3 with command]

### Need Help?
Use `/help` to see available commands or provide more context about what you're trying to accomplish.
```

## Artifact Generation Template

```
## Artifact Generated: [Playbook|Dashboard]
**Generated from**: [X/5 discovery steps completed]
**Quality Score**: [X% - based on template completeness]

### Generated Sections:
- [List of sections included in artifact]

### Missing Data:
- [List of template fields that would improve artifact quality]

### Next Steps:
- Review generated artifact
- Complete missing template fields (optional)
- Export artifact using `/export`
```

## Session Completion Template

```
## 🎉 BOS Session Complete!
**Business Process**: [Process Name]
**Total Steps**: 7/7 Complete
**Final Score**: [X% completeness]

### Generated Artifacts:
- ✅ Business Impact Playbook
- ✅ Dashboard Requirements

### Session Summary:
- **Stakeholders Identified**: [Count]
- **Dependencies Mapped**: [Count]
- **Impact Scenarios**: [Count]
- **Signals Defined**: [Count]
- **Observable Units**: [Count]

### Export Options:
- `/export template` - Export complete template data
- `/export playbook` - Export Business Impact Playbook
- `/export dashboard` - Export Dashboard requirements
- `/export all` - Export all artifacts

### Next Steps:
[Recommendations for implementation]
```