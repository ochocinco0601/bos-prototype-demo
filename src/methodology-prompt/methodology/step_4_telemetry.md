# Step 4: WHAT telemetry (Telemetry Mapping)

## Objective
Map existing and required telemetry sources needed to detect the impacts identified in Step 3, ensuring comprehensive observability coverage.

## Telemetry Framework

### Telemetry Types
- **Business Telemetry**: Data that reflects business outcomes and KPIs
- **Process Telemetry**: Data about workflow execution and process performance
- **System Telemetry**: Infrastructure and technical system health data
- **User Telemetry**: User behavior and experience data

### Telemetry Sources
- **Application Logs**: Structured application event data
- **Metrics**: Time-series numerical data (counters, gauges, histograms)
- **Traces**: Request flow and timing data
- **Events**: Discrete business or system events
- **Database Queries**: Data state and transaction information
- **External APIs**: Third-party service responses and status

## Data Collection Structure

```json
{
  "telemetry": {
    "existing_sources": [
      {
        "source_name": "Name of telemetry source",
        "source_type": "logs|metrics|traces|events|database|api",
        "data_format": "JSON|CSV|binary|etc.",
        "coverage_scope": "Which impacts/scenarios this covers",
        "quality_level": "high|medium|low",
        "availability": "real-time|batch|on-demand",
        "retention_period": "How long data is kept",
        "access_method": "How to access this data",
        "responsible_team": "Who owns this telemetry"
      }
    ],
    "telemetry_gaps": [
      {
        "gap_description": "What telemetry is missing",
        "required_for_impact": "Which impact from Step 3 needs this",
        "gap_type": "missing_source|insufficient_quality|access_limitation",
        "implementation_effort": "high|medium|low",
        "implementation_approach": "How to fill this gap",
        "priority": "P0|P1|P2|P3",
        "responsible_persona": "Who should implement this"
      }
    ],
    "impact_coverage": [
      {
        "impact_scenario": "From Step 3 impact analysis",
        "impact_category": "financial|legal|operational|customer_experience",
        "detection_telemetry": ["List of telemetry sources"],
        "detection_confidence": "high|medium|low",
        "detection_latency": "real-time|minutes|hours|days",
        "false_positive_risk": "high|medium|low",
        "coverage_assessment": "complete|partial|insufficient"
      }
    ]
  }
}
```

## Persona-Specific Guidance

### Product Owner Focus
- **Supporting Role**: Validate business telemetry requirements
- **Key Questions**:
  - What business data exists that shows these impacts?
  - Are there business metrics that already track these outcomes?
  - What business telemetry gaps would prevent impact detection?
  - Which telemetry is most critical for business decision-making?
- **Validation**: Business impact detection is feasible with identified telemetry

### Developer Focus
- **Primary Responsibility**: Map technical telemetry sources and gaps
- **Key Questions**:
  - What application telemetry exists for these scenarios?
  - Where are the gaps in current instrumentation?
  - What telemetry can be added to detect these impacts?
  - How can we instrument the observable units to provide needed data?
- **Validation**: Technical telemetry supports comprehensive impact detection

### Platform SRE Focus
- **Primary Responsibility**: Assess infrastructure telemetry and capabilities
- **Key Questions**:
  - What infrastructure telemetry exists for these scenarios?
  - Are there platform-level telemetry gaps?
  - What system telemetry can detect these impacts?
  - How can we improve telemetry collection and retention?
- **Validation**: Platform telemetry infrastructure supports requirements

## Validation Criteria

### Completeness Requirements
- [ ] All impact scenarios from Step 3 have telemetry coverage assessed
- [ ] Existing telemetry sources are catalogued with quality levels
- [ ] Telemetry gaps are identified with implementation plans
- [ ] Detection confidence levels are assessed
- [ ] Responsible teams/personas are assigned for gaps

### Quality Indicators
- **High Quality**: Comprehensive telemetry coverage with high detection confidence
- **Medium Quality**: Partial coverage with some gaps identified
- **Low Quality**: Insufficient coverage with many unaddressed gaps

### Common Validation Errors
- Missing telemetry assessment for impact scenarios
- Undefined telemetry quality or access methods
- No implementation plan for identified gaps
- Unrealistic detection confidence assessments

## Guided Prompts by Persona

### Product Owner Prompts
```
Let's identify what business telemetry exists for the impacts from Step 3:

**For each impact scenario:**

1. **Business Data Sources**:
   - What business systems track data related to this impact?
   - Are there existing business metrics or KPIs?
   - What reports or dashboards show this type of impact?

2. **Business Telemetry Quality**:
   - How reliable is this business data?
   - How quickly is it available after an event?
   - Who has access to this data?

3. **Business Telemetry Gaps**:
   - What business impact data is missing?
   - What would help business stakeholders detect problems faster?
   - What business metrics would be most valuable to add?

4. **Business Priority**:
   - Which telemetry is most critical for business decisions?
   - What's the business value of filling each gap?
```

### Developer Prompts
```
Let's map the technical telemetry for impact detection:

**For each impact scenario from Step 3:**

1. **Existing Application Telemetry**:
   - What logs, metrics, or traces exist for this scenario?
   - Are there existing application monitors or alerts?
   - What telemetry do the observable units currently produce?

2. **Telemetry Quality Assessment**:
   - How reliable is the existing telemetry?
   - What's the data quality and completeness?
   - Are there sampling or retention issues?

3. **Technical Telemetry Gaps**:
   - What technical telemetry is missing for impact detection?
   - Where should we add more instrumentation?
   - What would improve detection confidence?

4. **Implementation Planning**:
   - How difficult would it be to add missing telemetry?
   - What code changes would be required?
   - Are there performance implications?

5. **Observable Unit Mapping**:
   - Which observable units need better instrumentation?
   - What telemetry should each unit produce?
   - How can we standardize telemetry across units?
```

### Platform SRE Prompts
```
Let's assess the infrastructure telemetry for impact detection:

**For each impact scenario:**

1. **Infrastructure Telemetry**:
   - What system-level telemetry exists for this scenario?
   - Are there platform metrics that would detect this impact?
   - What infrastructure monitoring is already in place?

2. **Platform Telemetry Quality**:
   - How reliable is the infrastructure telemetry?
   - What's the collection frequency and retention?
   - Are there telemetry pipeline issues?

3. **System Telemetry Gaps**:
   - What infrastructure telemetry is missing?
   - Where are the blind spots in system monitoring?
   - What would improve system observability?

4. **Platform Implementation**:
   - How can we improve telemetry collection infrastructure?
   - What telemetry aggregation or processing is needed?
   - Are there scalability or cost implications?

5. **Cross-System Correlation**:
   - How can we correlate telemetry across systems?
   - What telemetry standards should we enforce?
   - How can we improve telemetry discoverability?
```

## Step Completion Criteria

### Ready to Proceed When:
- [ ] All impact scenarios have telemetry coverage assessed
- [ ] Existing telemetry sources are catalogued with quality assessments
- [ ] Telemetry gaps are identified with implementation plans
- [ ] Detection confidence levels are realistic
- [ ] Implementation responsibilities are assigned
- [ ] Cross-persona telemetry requirements are validated

### Validation Score Calculation:
- **Coverage**: (Impact scenarios with telemetry coverage / Total scenarios) × 40%
- **Quality**: (High-quality telemetry sources / Total sources) × 30%
- **Gap Analysis**: (Gaps with implementation plans / Total gaps) × 30%

Target: >80% for high-quality step completion

## Transition to Step 5
Once telemetry is mapped, Step 5 will define specific signals that can be extracted from this telemetry to detect impacts and trigger responses, using the telemetry sources and coverage assessments established here.