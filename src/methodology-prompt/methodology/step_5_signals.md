# Step 5: WHAT signals (Signal Definitions)

## Objective
Define specific, actionable signals that can be extracted from the telemetry sources identified in Step 4 to detect impacts and trigger appropriate responses.

## BOS Signal Framework

### Signal Types
- **Business Signals**: Reflect business outcomes, KPIs, and business logic results
- **Process Signals**: Indicate workflow execution, process performance, and procedural success
- **System Signals**: Show infrastructure health, system performance, and technical status

### Signal Characteristics
- **Actionable**: Each signal should trigger a specific response
- **Measurable**: Based on quantifiable telemetry data
- **Threshold-based**: Clear boundaries between normal and abnormal states
- **Owner-assigned**: Clear responsibility for signal response
- **Context-aware**: Includes relevant business and technical context

## Data Collection Structure

```json
{
  "signals": {
    "business_signals": [
      {
        "signal_name": "Descriptive name of the signal",
        "signal_purpose": "What business outcome this indicates",
        "telemetry_source": "From Step 4 telemetry mapping",
        "measurement_method": "How the signal is calculated",
        "threshold_definition": "Normal vs abnormal boundaries",
        "threshold_values": {
          "normal": "Normal range values",
          "warning": "Warning threshold",
          "critical": "Critical threshold"
        },
        "response_action": "What should happen when signal fires",
        "signal_owner": "Who responds to this signal",
        "stakeholder_impact": "Which stakeholders are affected",
        "related_kpi": "Business KPI this signal supports"
      }
    ],
    "process_signals": [
      {
        "signal_name": "Process execution indicator",
        "signal_purpose": "What process state this indicates",
        "telemetry_source": "From Step 4 telemetry mapping",
        "measurement_method": "How the signal is calculated",
        "threshold_definition": "Process success vs failure boundaries",
        "threshold_values": {
          "success": "Process success criteria",
          "degraded": "Process degradation threshold",
          "failed": "Process failure threshold"
        },
        "response_action": "Process response or escalation",
        "signal_owner": "Who manages this process",
        "observable_unit": "Which observable unit produces this signal",
        "downstream_impact": "What depends on this process"
      }
    ],
    "system_signals": [
      {
        "signal_name": "System health indicator",
        "signal_purpose": "What system state this indicates",
        "telemetry_source": "From Step 4 telemetry mapping",
        "measurement_method": "How the signal is calculated",
        "threshold_definition": "System health boundaries",
        "threshold_values": {
          "healthy": "Normal system state",
          "degraded": "System degradation threshold",
          "unhealthy": "System failure threshold"
        },
        "response_action": "System response or remediation",
        "signal_owner": "Who manages this system",
        "platform_context": "Infrastructure dependencies",
        "business_impact": "How system issues affect business"
      }
    ],
    "signal_correlations": [
      {
        "correlation_name": "Related signal group",
        "primary_signal": "Main signal to monitor",
        "secondary_signals": ["Supporting signals"],
        "correlation_logic": "How signals relate to each other",
        "combined_action": "Response when multiple signals fire",
        "escalation_criteria": "When to escalate based on correlations"
      }
    ]
  }
}
```

## Persona-Specific Guidance

### Product Owner Focus
- **Primary Responsibility**: Define business signals and KPI relationships
- **Key Questions**:
  - What business signals indicate the impacts from Step 3?
  - How do these signals relate to business KPIs?
  - What business actions should these signals trigger?
  - Who in the business should respond to these signals?
- **Validation**: Business signals are actionable and tied to business outcomes

### Developer Focus
- **Primary Responsibility**: Define process signals and implementation details
- **Key Questions**:
  - What process signals indicate successful step execution?
  - How can we extract these signals from the telemetry?
  - What technical thresholds indicate process problems?
  - Which observable units should produce these signals?
- **Validation**: Process signals are technically feasible and comprehensive

### Platform SRE Focus
- **Primary Responsibility**: Define system signals and infrastructure context
- **Key Questions**:
  - What system signals indicate infrastructure health?
  - How do system signals correlate with business impacts?
  - What infrastructure responses should these signals trigger?
  - How can we automate system signal responses?
- **Validation**: System signals provide comprehensive infrastructure visibility

## Validation Criteria

### Completeness Requirements
- [ ] All impact scenarios from Step 3 have corresponding signals
- [ ] Each signal type (business, process, system) is represented
- [ ] All signals have clear thresholds and response actions
- [ ] Signal owners are assigned from appropriate personas
- [ ] Signals are linked to telemetry sources from Step 4

### Quality Indicators
- **High Quality**: Specific, actionable signals with clear thresholds and owners
- **Medium Quality**: General signals with some actionable elements
- **Low Quality**: Vague signals without clear thresholds or actions

### Common Validation Errors
- Signals without clear thresholds or measurement methods
- Missing signal owners or response actions
- Signals not linked to telemetry sources
- No correlation between signal types
- Unrealistic or unmeasurable thresholds

## Guided Prompts by Persona

### Product Owner Prompts
```
Let's define business signals for the impacts identified in Step 3:

**For each business impact scenario:**

1. **Business Signal Definition**:
   - What business signal would indicate this impact is occurring?
   - How would this signal be measured or calculated?
   - What business data from Step 4 supports this signal?

2. **Business Thresholds**:
   - What values indicate normal business performance?
   - At what threshold should business stakeholders be concerned?
   - What threshold indicates a critical business issue?

3. **Business Response**:
   - What business action should this signal trigger?
   - Who in the business should respond to this signal?
   - What escalation path should be followed?

4. **KPI Relationship**:
   - How does this signal relate to business KPIs?
   - What business outcomes does this signal predict?
   - How can this signal improve business decision-making?

5. **Stakeholder Impact**:
   - Which stakeholders from Step 1 are affected by this signal?
   - How should stakeholders be notified of signal changes?
```

### Developer Prompts
```
Let's define process signals for technical execution:

**For each observable unit and process:**

1. **Process Signal Definition**:
   - What signal indicates successful process execution?
   - What signal shows process degradation or failure?
   - How can we extract these signals from telemetry?

2. **Technical Thresholds**:
   - What values indicate successful process completion?
   - At what point should the process be considered degraded?
   - What threshold indicates process failure?

3. **Implementation Details**:
   - Which telemetry sources from Step 4 provide this signal?
   - How should the signal be calculated or aggregated?
   - What's the signal frequency and latency requirements?

4. **Process Response**:
   - What technical action should this signal trigger?
   - Should there be automated responses or manual escalation?
   - How does this signal relate to other process signals?

5. **Observable Unit Mapping**:
   - Which observable units should produce this signal?
   - How can we standardize signal production across units?
   - What signal correlation patterns should we monitor?
```

### Platform SRE Prompts
```
Let's define system signals for infrastructure health:

**For each system and platform component:**

1. **System Signal Definition**:
   - What signal indicates healthy system operation?
   - What signal shows system degradation or failure?
   - How can we extract these signals from infrastructure telemetry?

2. **System Thresholds**:
   - What values indicate healthy system performance?
   - At what point should the system be considered degraded?
   - What threshold indicates system failure requiring intervention?

3. **Infrastructure Context**:
   - Which infrastructure telemetry from Step 4 provides this signal?
   - How should system signals be aggregated across instances?
   - What's the signal collection and processing architecture?

4. **System Response**:
   - What infrastructure action should this signal trigger?
   - Can responses be automated or require manual intervention?
   - How do system signals correlate with business impacts?

5. **Platform Integration**:
   - How do these signals integrate with existing monitoring?
   - What alerting and notification systems should be used?
   - How can we improve signal correlation across platforms?
```

## Step Completion Criteria

### Ready to Proceed When:
- [ ] All impact scenarios have corresponding signals defined
- [ ] Signals are distributed across all three types (business, process, system)
- [ ] All signals have clear thresholds and measurement methods
- [ ] Signal owners are assigned from appropriate personas
- [ ] Response actions are defined for all signals
- [ ] Signals are linked to telemetry sources from Step 4
- [ ] Signal correlations are identified where relevant

### Validation Score Calculation:
- **Coverage**: (Impact scenarios with signals / Total scenarios) × 30%
- **Completeness**: (Signals with full definitions / Total signals) × 30%
- **Actionability**: (Signals with clear owners and actions / Total signals) × 25%
- **Feasibility**: (Signals with telemetry sources / Total signals) × 15%

Target: >85% for high-quality step completion

## Transition to Steps 6-7
Once signals are defined, the system will automatically generate:
- **Step 6**: Business Impact Playbook using stakeholder, dependency, impact, and signal data
- **Step 7**: Dashboard Requirements using telemetry and signal specifications

The signal definitions provide the foundation for both automated artifact generation processes.