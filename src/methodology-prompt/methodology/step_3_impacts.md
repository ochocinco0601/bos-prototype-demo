# Step 3: WHAT breaks (Impact Analysis)

## Objective
Analyze what happens when the step fails, using the stakeholder dependencies from Step 2 to identify measurable business impacts across the four BOS impact categories.

## BOS Impact Categories

### Financial Impact
**Definition**: Money movement, transactions, revenue impact that systems can track
**Examples**:
- Transaction failures
- Revenue loss
- Processing cost increases
- Application abandonment
- Fee losses
- Penalty costs

### Legal/Compliance Impact
**Definition**: Regulatory violations, compliance check failures, risk thresholds that systems can detect
**Examples**:
- Disclosure deadline violations
- Regulatory reporting gaps
- Compliance check failures
- Audit trail issues
- Risk threshold breaches
- Contractual violations

### Operational Impact
**Definition**: Process performance, throughput, efficiency metrics that systems can measure
**Examples**:
- Processing delays
- Manual intervention increases
- SLA violations
- Productivity loss
- Resource utilization spikes
- Queue backlogs

### Customer Experience Impact
**Definition**: User interaction quality, satisfaction metrics that systems can observe
**Examples**:
- Response time degradation
- Error rates
- Session abandonment
- Support call increases
- User satisfaction drops
- Feature unavailability

## Data Collection Structure

```json
{
  "impacts": {
    "failure_scenarios": [
      {
        "scenario_name": "Descriptive name of failure",
        "trigger_conditions": "What causes this failure",
        "affected_stakeholders": ["List of stakeholders from Step 1"],
        "failure_probability": "high|medium|low",
        "detection_difficulty": "easy|medium|hard",
        "recovery_time": "Estimated time to resolve"
      }
    ],
    "impact_analysis": [
      {
        "scenario_name": "Links to failure scenario",
        "financial_impact": {
          "description": "Specific financial impact",
          "measurement": "How to measure ($, transactions, etc.)",
          "severity": "high|medium|low",
          "time_sensitivity": "immediate|hours|days"
        },
        "legal_compliance_impact": {
          "description": "Regulatory/compliance implications",
          "measurement": "How to measure compliance breach",
          "severity": "high|medium|low",
          "regulatory_body": "Which regulations affected"
        },
        "operational_impact": {
          "description": "Process/efficiency implications",
          "measurement": "How to measure operational impact",
          "severity": "high|medium|low",
          "cascade_effects": "What other processes affected"
        },
        "customer_experience_impact": {
          "description": "User experience implications",
          "measurement": "How to measure customer impact",
          "severity": "high|medium|low",
          "user_segments": "Which users affected"
        }
      }
    ],
    "priority_matrix": [
      {
        "scenario_name": "Failure scenario",
        "business_priority": "high|medium|low",
        "technical_complexity": "high|medium|low",
        "implementation_priority": "P0|P1|P2|P3",
        "rationale": "Why this priority level"
      }
    ]
  }
}
```

## Persona-Specific Guidance

### Product Owner Focus
- **Primary Responsibility**: Define business impact scenarios and priorities
- **Key Questions**:
  - What are the most likely failure scenarios?
  - Which failures have the highest business impact?
  - How do we measure each type of impact?
  - What are the business priorities for prevention?
- **Validation**: All impact categories assessed with measurable outcomes

### Developer Focus
- **Supporting Role**: Validate technical failure modes and detection
- **Key Questions**:
  - What technical failures could cause these business impacts?
  - How can we detect these failures technically?
  - Are there technical failure modes missing?
  - What's the technical complexity of preventing each failure?
- **Validation**: Technical failure modes align with business impact scenarios

### Platform SRE Focus
- **Supporting Role**: Assess infrastructure failure modes and recovery
- **Key Questions**:
  - What infrastructure failures could cause these impacts?
  - How quickly can we detect and recover from each failure?
  - Are there cascade failure scenarios?
  - What's the operational complexity of each failure?
- **Validation**: Infrastructure resilience supports business requirements

## Validation Criteria

### Completeness Requirements
- [ ] All failure scenarios from Step 2 dependencies are analyzed
- [ ] Each scenario has impacts assessed in all four categories
- [ ] Impact measurements are specific and observable
- [ ] Priority levels are assigned with rationale
- [ ] Stakeholder effects are traceable to Step 1 stakeholders

### Quality Indicators
- **High Quality**: Specific, measurable impacts with clear detection methods
- **Medium Quality**: General impacts with some measurable elements
- **Low Quality**: Vague impact descriptions without measurement methods

### Common Validation Errors
- Missing impact categories for failure scenarios
- Vague impact descriptions ("users affected", "business impact")
- No measurement methods for impacts
- Missing priority rationale
- Disconnected from stakeholder dependencies

## Guided Prompts by Persona

### Product Owner Prompts
```
Based on the stakeholder dependencies from Step 2, let's analyze what breaks:

**For each stakeholder expectation that could fail:**

1. **Failure Scenario Definition**:
   - What would cause this expectation to not be met?
   - How likely is this failure to occur?
   - How would we detect this failure?

2. **Financial Impact**:
   - Would this failure affect revenue, costs, or transactions?
   - How much money could be at risk?
   - How would we measure the financial impact?

3. **Legal/Compliance Impact**:
   - Would this failure violate any regulations?
   - Are there compliance requirements that would be missed?
   - What regulatory bodies would be concerned?

4. **Operational Impact**:
   - Would this failure disrupt other business processes?
   - How would productivity or efficiency be affected?
   - What manual work would be required?

5. **Customer Experience Impact**:
   - How would customers be affected?
   - Which user segments would be impacted most?
   - How would we measure customer impact?

6. **Business Priority**:
   - How critical is preventing this failure?
   - What's the business priority for addressing this?
```

### Developer Prompts
```
Let's validate the technical aspects of these failure scenarios:

1. **Technical Failure Modes**:
   - What technical failures could cause these business impacts?
   - Are there code paths that could fail?
   - What about data corruption or integration failures?

2. **Detection Methods**:
   - How can we technically detect these failures?
   - What logs, metrics, or monitoring would show these problems?
   - Are there existing detection mechanisms?

3. **Technical Complexity**:
   - How complex would it be to prevent each failure?
   - What technical changes would be required?
   - Are there architectural implications?

4. **Failure Propagation**:
   - Could these failures cascade to other systems?
   - Are there technical dependencies that could amplify impact?
```

### Platform SRE Prompts
```
Let's assess the infrastructure implications of these failures:

1. **Infrastructure Failure Modes**:
   - What infrastructure failures could cause these impacts?
   - Are there single points of failure?
   - What about capacity or performance degradation?

2. **Recovery Capabilities**:
   - How quickly can we recover from each failure?
   - What's our detection time for each scenario?
   - Are there automated recovery mechanisms?

3. **Operational Complexity**:
   - How complex is each failure to troubleshoot?
   - What operational procedures are needed?
   - Are there on-call implications?

4. **Cascade Effects**:
   - Could these failures affect other systems?
   - Are there platform-wide implications?
   - What's the blast radius of each failure?
```

## Step Completion Criteria

### Ready to Proceed When:
- [ ] All stakeholder dependency failures are analyzed
- [ ] Each failure has impacts in all four categories
- [ ] Impact measurements are specific and observable
- [ ] Business priorities are assigned with rationale
- [ ] Technical feasibility of detection is validated
- [ ] Infrastructure recovery capabilities are assessed

### Validation Score Calculation:
- **Completeness**: (Scenarios with all 4 impact categories / Total scenarios) × 40%
- **Measurability**: (Impacts with specific measurement / Total impacts) × 30%
- **Traceability**: (Impacts linked to stakeholders / Total impacts) × 30%

Target: >85% for high-quality step completion

## Transition to Step 4
Once impacts are analyzed, Step 4 will identify what telemetry must exist to detect these impacts, using the measurement methods and detection requirements established here.