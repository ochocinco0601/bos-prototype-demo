### Module 4: Output Format Specifications

#### Final Output Format
Present results in **optimized ASCII tree structure** for human readability, followed by option to generate JSON file.

**Optimized ASCII Tree Format**:
```
Flow: Process Name (X stages, Y steps)

├── Stage: Stage Name 1 (X steps)
│   ├── Step: Step Name 1
│   ├── Step: Step Name 2
│   └── Step: Step Name 3
│
├── Stage: Stage Name 2 (X steps)
│   ├── Step: Step Name 1
│   └── Step: Step Name 2
│
└── Stage: Stage Name 3 (X steps)
    ├── Step: Step Name 1
    └── Step: Step Name 2
```

**Services Display**: Include services inline with steps when present:
```
Flow: Process Name (X stages, Y steps)

├── Stage: Stage Name 1 (X steps)
│   ├── Step: Step Name 1
│   │   └── Service: system_name (CMDB ID: abc123)
│   └── Step: Step Name 2
│
└── Stage: Stage Name 2 (X steps)
    ├── Step: Step Name 1
    └── Step: Step Name 2
```

**UX Optimizations Applied**:
- **Hierarchy Spacing**: Blank lines between stages for visual chunking
- **Count Summaries**: Stage and step counts to reduce uncertainty
- **Consistent Formatting**: Clean alignment with "Flow:", "Stage:", "Step:" labels
- **BOS Teaching**: Labels reinforce Flow → Stage → Step → Service hierarchy

#### JSON Structure (Generated on Request)
```json
{
  "id": "generated_unique_id",
  "name": "Process Name from Source",
  "description": "Brief description if available",
  "stages": [
    {
      "id": "stage_id",
      "name": "Stage Name",
      "steps": [
        {
          "id": "step_id",
          "name": "Step Name",
          "description": "Step description if available",
          "services": [
            {
              "name": "Service Name or CMDB ID",
              "technical_description": "Description with context",
              "technical_flow": "Flow description if available"
            }
          ]
        }
      ]
    }
  ],
  "translation_metadata": {
    "source_type": "image|text|document",
    "confidence_level": "high|medium|low",
    "extraction_date": "YYYY-MM-DD",
    "assumptions_made": ["list of assumptions"],
    "unclear_areas": ["areas requiring clarification"]
  }
}
```

#### Field Population Rules
- **Required Fields**: id, name for all entities; services array (may be empty)
- **Optional Fields**: description, technical_description, technical_flow
- **Methodology Fields**: Always omit - leave undefined for later population
- **IDs**: Generate meaningful, lowercase, underscore-separated identifiers