# Product Owner/Business SME - BOS Persona Guide

## Your Role in BOS Methodology

As a Product Owner or Business SME, you are the **business context authority** for the BOS methodology. Your primary responsibility is defining the business purpose, stakeholder relationships, and business impact scenarios that drive all technical observability decisions.

## Your Template Fields (Canonical Mapping)

| **Field Name** | **BOS Step** | **Your Responsibility** |
|----------------|--------------|-------------------------|
| Flow/Stage/Step Names | Setup | Define business process hierarchy |
| Business Description | Setup | Explain business purpose and value |
| Stakeholder Identification | Step 1 | Identify all who depend on this step |
| Stakeholder Expectations | Step 2 | Define what each stakeholder expects |
| Business Impact Analysis | Step 3 | Analyze business consequences of failure |
| Business Signals | Step 5 | Define business outcome indicators |
| KPI Definitions | Step 5 | Connect signals to business metrics |
| Signal-to-KPI Mapping | Step 5 | Link technical signals to business value |

## Step-by-Step Guidance

### Session Setup
**Your Focus**: Establish business context and process boundaries

**Key Questions**:
- What business process are we analyzing?
- How does this process create business value?
- Who are the key business stakeholders?
- What business outcomes does this process support?

**Success Criteria**:
- Clear business process definition
- Understandable business value proposition
- Stakeholder context established

### Step 1: WHO depends (Stakeholder Identification)
**Your Primary Responsibility**: Identify all stakeholders using BOS framework

**Your Approach**:
1. **People**: Who are the humans affected?
   - Internal users (employees, agents, staff)
   - External users (customers, partners, regulators)
   - Support teams and escalation contacts

2. **Business Entities**: What business objects depend on this?
   - Business processes using this step's output
   - Regulatory requirements that must be met
   - Business objects that must be updated

3. **Vendors**: Which external services are required?
   - Third-party APIs or services
   - External data providers
   - Integration partners

**Quality Indicators**:
- Stakeholders are named specifically, not generically
- Each stakeholder's criticality level is defined
- Impact if stakeholder needs aren't met is clear

### Step 2: WHAT they expect (Dependency Mapping)
**Your Primary Responsibility**: Define measurable expectations for each stakeholder

**Your Approach**:
For each stakeholder, define:
- **Functional Expectation**: What specific outcome they need
- **Performance Expectation**: Speed/reliability requirements
- **Quality Expectation**: Accuracy/completeness requirements
- **Availability Expectation**: When they need it available
- **Success Criteria**: How success is measured
- **Failure Definition**: What constitutes failure

**Quality Indicators**:
- Expectations are specific and measurable
- Success criteria include business metrics
- Failure definitions are clear and actionable

### Step 3: WHAT breaks (Impact Analysis)
**Your Primary Responsibility**: Analyze business consequences of failure

**Your Approach**:
For each failure scenario, analyze:
- **Financial Impact**: Revenue, cost, or transaction effects
- **Legal/Compliance Impact**: Regulatory or compliance implications
- **Operational Impact**: Process or efficiency effects
- **Customer Experience Impact**: User satisfaction or service quality effects

**Quality Indicators**:
- Impacts are quantifiable and measurable
- Each impact category is assessed
- Business priority levels are assigned with rationale

### Step 4: WHAT telemetry (Supporting Role)
**Your Supporting Responsibility**: Validate business telemetry requirements

**Your Approach**:
- Identify existing business data sources
- Validate that impact measurements are feasible
- Prioritize telemetry gaps from business perspective
- Ensure telemetry supports business decision-making

**Quality Indicators**:
- Business data sources are identified
- Telemetry gaps are prioritized by business value
- Business feasibility of measurements is confirmed

### Step 5: WHAT signals (Primary Responsibility)
**Your Primary Responsibility**: Define business signals and KPI relationships

**Your Approach**:
For each business impact:
- **Business Signal**: What indicates this impact is occurring
- **Measurement Method**: How the signal is calculated
- **Business Thresholds**: Normal, warning, and critical levels
- **Response Action**: What business action should be triggered
- **KPI Relationship**: How this signal supports business KPIs
- **Stakeholder Impact**: Which stakeholders are affected

**Quality Indicators**:
- Signals are actionable and tied to business outcomes
- Thresholds reflect business decision points
- Clear business ownership and response procedures

## Collaboration Guidelines

### Working with Developers
- **Provide Business Context**: Explain why certain signals matter
- **Validate Technical Feasibility**: Ensure proposed measurements are realistic
- **Review Process Signals**: Confirm they support business outcomes
- **Clarify Business Logic**: Help translate business rules to technical requirements

### Working with Platform SREs
- **Explain Business Impact**: Connect system failures to business consequences
- **Prioritize System Signals**: Identify which system issues matter most to business
- **Validate Platform Requirements**: Ensure infrastructure supports business needs
- **Review System Correlations**: Confirm system signals align with business impacts

## Common Pitfalls to Avoid

### Vague Stakeholder Identification
- **Bad**: "Users need the system to work"
- **Good**: "Loan applicants need application status within 2 seconds to make decisions"

### Unmeasurable Expectations
- **Bad**: "Fast and reliable performance"
- **Good**: "95% of requests complete within 500ms with 99.9% uptime"

### Generic Impact Analysis
- **Bad**: "Business will be affected"
- **Good**: "$50K revenue at risk per hour of downtime based on average transaction volume"

### Technical Focus Instead of Business Focus
- **Bad**: "CPU usage should be below 80%"
- **Good**: "Response time degradation affects loan approval decisions"

## Validation Checklist

Before moving to artifact generation:
- [ ] All stakeholders are specifically identified with expectations
- [ ] Business impacts are quantified and measurable
- [ ] Business signals are actionable and tied to KPIs
- [ ] Signal thresholds reflect business decision points
- [ ] Business ownership and response procedures are defined
- [ ] Collaboration with technical personas is complete

## Your Success Metrics

- **Stakeholder Completeness**: All critical business stakeholders identified
- **Impact Measurability**: Business impacts have quantifiable metrics
- **Signal Actionability**: Business signals trigger clear business actions
- **KPI Alignment**: Signals support existing business KPIs
- **Business Validation**: Technical team understands business context

Your expertise ensures that the BOS methodology creates business-aligned observability that supports real business decision-making and stakeholder needs.