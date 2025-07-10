# Step 2: WHAT they expect (Dependency Mapping)

## Objective
Map specific expectations and dependencies for each stakeholder identified in Step 1, creating measurable success criteria.

## Dependency Mapping Framework

### Stakeholder Expectations
Transform stakeholder identification into specific, measurable expectations that can be instrumented and validated.

### Dependency Types
- **Functional Dependencies**: What the stakeholder needs the step to accomplish
- **Performance Dependencies**: How fast/reliable the step must be
- **Quality Dependencies**: What level of accuracy/completeness is required
- **Availability Dependencies**: When the step must be accessible

## Data Collection Structure

```json
{
  "dependencies": {
    "stakeholder_expectations": [
      {
        "stakeholder_name": "From Step 1",
        "stakeholder_type": "people|business_entity|vendor",
        "functional_expectation": "What they need accomplished",
        "performance_expectation": "Speed/reliability requirements",
        "quality_expectation": "Accuracy/completeness requirements",
        "availability_expectation": "When they need it available",
        "success_criteria": "How success is measured",
        "failure_definition": "What constitutes failure",
        "measurable_outcome": "Specific metric or indicator"
      }
    ],
    "critical_dependencies": [
      {
        "from_stakeholder": "Who depends",
        "to_stakeholder": "Who they depend on",
        "dependency_type": "functional|data|timing|quality",
        "description": "Nature of the dependency",
        "failure_mode": "What happens if dependency breaks",
        "mitigation": "How to handle failure"
      }
    ],
    "success_metrics": [
      {
        "metric_name": "Name of measurable outcome",
        "metric_type": "business|process|system",
        "measurement_method": "How it's measured",
        "target_value": "Success threshold",
        "stakeholder_owner": "Who cares about this metric"
      }
    ]
  }
}
```

## Persona-Specific Guidance

### Product Owner Focus
- **Primary Responsibility**: Define measurable business expectations
- **Key Questions**:
  - What specific outcome does each stakeholder need?
  - How do we measure success from their perspective?
  - What constitutes failure for each stakeholder?
  - What are the performance/quality thresholds?
- **Validation**: All expectations are measurable and specific

### Developer Focus
- **Supporting Role**: Validate technical feasibility and implementation
- **Key Questions**:
  - Can these expectations be measured technically?
  - What technical dependencies exist between stakeholders?
  - Are there hidden technical dependencies?
  - How can we instrument these expectations?
- **Validation**: Technical implementation supports business expectations

### Platform SRE Focus
- **Supporting Role**: Ensure infrastructure can support dependencies
- **Key Questions**:
  - What infrastructure dependencies support these expectations?
  - Are there platform-level dependencies between stakeholders?
  - What system-level metrics validate these expectations?
  - Are there scalability/reliability implications?
- **Validation**: Platform can reliably deliver expected performance

## Validation Criteria

### Completeness Requirements
- [ ] All stakeholders from Step 1 have defined expectations
- [ ] Expectations include functional, performance, quality, and availability aspects
- [ ] Success criteria are specific and measurable
- [ ] Failure definitions are clear
- [ ] Critical dependencies between stakeholders are mapped

### Quality Indicators
- **High Quality**: Specific, measurable expectations with clear success criteria
- **Medium Quality**: General expectations with some measurable elements
- **Low Quality**: Vague expectations without clear success criteria

### Common Validation Errors
- Vague expectations ("fast", "reliable", "accurate")
- Missing success criteria or measurement methods
- Unrealistic or unmeasurable expectations
- Missing dependencies between stakeholders

## Guided Prompts by Persona

### Product Owner Prompts
```
For each stakeholder from Step 1, let's define WHAT they expect:

**Stakeholder**: [STAKEHOLDER_NAME]

1. **Functional Expectation**: 
   - What specific outcome do they need from this step?
   - What should happen when the step executes successfully?

2. **Performance Expectation**:
   - How fast should this step complete?
   - What's the maximum acceptable delay?

3. **Quality Expectation**:
   - What level of accuracy is required?
   - What level of completeness is needed?

4. **Availability Expectation**:
   - When do they need this step to be available?
   - Are there specific time windows or SLAs?

5. **Success Criteria**:
   - How will we measure success from their perspective?
   - What specific metrics or indicators prove success?

6. **Failure Definition**:
   - What would constitute failure for this stakeholder?
   - At what point would they consider the step "broken"?
```

### Developer Prompts
```
Let's validate the technical feasibility of these expectations:

1. **Implementation Validation**:
   - Can we technically measure these expectations?
   - What telemetry/instrumentation is needed?
   - Are there technical constraints on these expectations?

2. **Technical Dependencies**:
   - Are there technical dependencies between stakeholders?
   - Which systems must work together to meet these expectations?
   - What technical handoffs are required?

3. **Measurement Implementation**:
   - How can we instrument these success criteria?
   - What technical metrics support these business expectations?
   - Are there existing measurements we can leverage?
```

### Platform SRE Prompts
```
Let's ensure the platform can support these dependencies:

1. **Infrastructure Requirements**:
   - What infrastructure is needed to meet these expectations?
   - Are there scalability implications?
   - What are the reliability requirements?

2. **System Dependencies**:
   - Which platform services must be available?
   - Are there cross-system dependencies?
   - What monitoring is needed to validate these expectations?

3. **Performance Validation**:
   - Can the platform deliver the expected performance?
   - What system-level metrics validate these expectations?
   - Are there capacity or resource implications?
```

## Step Completion Criteria

### Ready to Proceed When:
- [ ] All stakeholders have defined expectations in all four categories
- [ ] Success criteria are specific and measurable
- [ ] Failure definitions are clear
- [ ] Critical dependencies are mapped
- [ ] Technical feasibility is validated
- [ ] Platform capabilities are confirmed

### Validation Score Calculation:
- **Completeness**: (Stakeholders with full expectations / Total stakeholders) × 40%
- **Measurability**: (Expectations with specific metrics / Total expectations) × 30%
- **Feasibility**: (Technically feasible expectations / Total expectations) × 30%

Target: >85% for high-quality step completion

## Transition to Step 3
Once dependencies are mapped, Step 3 will analyze what breaks when these expectations aren't met, using the failure definitions and success criteria established here.