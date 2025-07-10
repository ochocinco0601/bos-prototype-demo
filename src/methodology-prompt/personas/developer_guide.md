# Developer - BOS Persona Guide

## Your Role in BOS Methodology

As a Developer, you are the **technical implementation authority** for the BOS methodology. Your primary responsibility is mapping business processes to technical systems, identifying observable units, and defining process signals that bridge business intent with technical reality.

## Your Template Fields (Canonical Mapping)

| **Field Name** | **BOS Step** | **Your Responsibility** |
|----------------|--------------|-------------------------|
| Observable Unit Mapping | Step 4 | Map business processes to technical components |
| Technical Flow Description | Step 4 | Document technical execution paths |
| Observable Unit Tags | Step 4 | Categorize technical components by function |
| Process Signal Definitions | Step 5 | Define technical signals that indicate business state |
| Process Signal Thresholds | Step 5 | Set technical boundaries for business decisions |
| Technical Telemetry Sources | Step 4 | Identify existing and missing technical measurements |
| Technical Telemetry Gaps | Step 4 | Prioritize missing technical observability |

## Step-by-Step Guidance

### Session Setup
**Your Focus**: Establish technical architecture context and implementation boundaries

**Key Questions**:
- What technical systems implement this business process?
- How does data flow through the technical architecture?
- What are the key technical decision points?
- Where are the current observability gaps?

**Success Criteria**:
- Clear technical system mapping
- Documented data flow and dependencies
- Identified technical decision points

### Step 1: WHO depends (Supporting Role)
**Your Supporting Responsibility**: Validate technical feasibility of stakeholder requirements

**Your Approach**:
- Identify systems that depend on this process
- Map technical dependencies between components
- Validate that stakeholder expectations are technically measurable
- Identify technical constraints that affect stakeholder experience

**Quality Indicators**:
- Technical dependencies are clearly mapped
- System-to-system relationships are documented
- Technical constraints are communicated to business stakeholders

### Step 2: WHAT they expect (Supporting Role)
**Your Supporting Responsibility**: Translate business expectations into technical requirements

**Your Approach**:
- Map business expectations to technical capabilities
- Identify technical metrics that support business expectations
- Validate feasibility of performance requirements
- Document technical assumptions behind business expectations

**Quality Indicators**:
- Business expectations have corresponding technical measurements
- Performance requirements are technically feasible
- Technical assumptions are clearly documented

### Step 3: WHAT breaks (Supporting Role)
**Your Supporting Responsibility**: Identify technical failure modes and their business impact

**Your Approach**:
- Map business impacts to technical failure scenarios
- Identify cascading failure patterns
- Document technical root cause possibilities
- Validate that technical failures align with business impact analysis

**Quality Indicators**:
- Technical failure modes are mapped to business impacts
- Cascading failure patterns are identified
- Root cause analysis paths are documented

### Step 4: WHAT telemetry (Primary Responsibility)
**Your Primary Responsibility**: Map technical systems to observable units and identify telemetry

**Your Approach**:
1. **Observable Unit Identification**: Break down the business process into technical components
   - **Services**: Individual applications or microservices
   - **Databases**: Data stores and their operations
   - **APIs**: External and internal interfaces
   - **Queues**: Message brokers and async processing
   - **Batch Jobs**: Scheduled or triggered processes
   - **Infrastructure**: Servers, containers, network components

2. **Observable Unit Mapping**: For each unit, document:
   - **Technical Function**: What this component does
   - **Business Purpose**: Why this component exists
   - **Data Flow**: How data moves through this component
   - **Dependencies**: What this component needs to function
   - **Tags**: Categorization (service, database, api, queue, batch, infrastructure)

3. **Technical Flow Description**: Document the complete technical execution path:
   - Request/response patterns
   - Data transformation steps
   - Error handling paths
   - Performance bottlenecks
   - Scaling considerations

4. **Technical Telemetry Assessment**: For each observable unit, identify:
   - **Existing Telemetry**: What's currently measured
   - **Telemetry Gaps**: What's missing but needed
   - **Telemetry Sources**: Where measurements come from
   - **Collection Methods**: How telemetry is gathered
   - **Gap Priority**: Business impact of missing telemetry

**Quality Indicators**:
- Observable units are granular enough to be meaningful
- Technical flow accurately represents actual implementation
- Telemetry gaps are prioritized by business impact
- Existing telemetry is accurately documented

### Step 5: WHAT signals (Primary Responsibility)
**Your Primary Responsibility**: Define process signals that indicate business state through technical measurements

**Your Approach**:
For each business impact, define technical process signals:

1. **Process Signal Definition**: Technical measurements that indicate business state
   - **Signal Name**: Clear, descriptive name
   - **Measurement Method**: How the signal is calculated
   - **Data Sources**: Which observable units provide data
   - **Calculation Logic**: Formula or algorithm
   - **Update Frequency**: How often the signal is calculated

2. **Process Signal Thresholds**: Technical boundaries that trigger business decisions
   - **Normal Range**: Expected operational values
   - **Warning Threshold**: When business attention is needed
   - **Critical Threshold**: When business action is required
   - **Threshold Rationale**: Why these values were chosen

3. **Technical Implementation**: How signals are implemented
   - **Monitoring Tools**: What tools will track the signal
   - **Alerting Logic**: How alerts are generated
   - **Dashboard Placement**: Where signals are displayed
   - **Automation Triggers**: What automated responses exist

**Quality Indicators**:
- Process signals directly correlate with business outcomes
- Thresholds are based on business impact, not arbitrary technical values
- Signals are implementable with current or planned technical capabilities
- Signal calculations are accurate and efficient

## Collaboration Guidelines

### Working with Product Owners
- **Validate Business Logic**: Ensure technical implementation matches business intent
- **Communicate Technical Constraints**: Explain what's technically feasible
- **Translate Business Requirements**: Convert business needs to technical specifications
- **Provide Implementation Reality**: Give realistic timelines and complexity estimates

### Working with Platform SREs
- **Share Observable Units**: Provide detailed technical component mapping
- **Coordinate Infrastructure Requirements**: Ensure platform supports observability needs
- **Align on Technical Standards**: Use consistent monitoring and alerting approaches
- **Plan Scalability**: Consider growth and performance requirements

## Common Pitfalls to Avoid

### Over-Technical Observable Units
- **Bad**: "Kubernetes pod CPU utilization"
- **Good**: "User Authentication Service response time affecting login experience"

### Unmeasurable Process Signals
- **Bad**: "System is healthy"
- **Good**: "Order processing latency under 200ms indicating meeting customer expectations"

### Technical-Only Threshold Setting
- **Bad**: "Alert when CPU > 80%"
- **Good**: "Alert when response time > 500ms affecting user experience (CPU typically 80%+)"

### Missing Business Context
- **Bad**: "Database connection pool exhausted"
- **Good**: "Database connection pool exhausted preventing new customer registrations"

## Technical Implementation Patterns

### Observable Unit Granularity
- **Service Level**: Individual microservices or applications
- **Function Level**: Specific business functions within services
- **Data Level**: Critical data operations and transformations
- **Integration Level**: API calls and external system interactions

### Process Signal Types
- **Performance Signals**: Response times, throughput, latency
- **Availability Signals**: Uptime, error rates, success rates
- **Quality Signals**: Data accuracy, completeness, validation
- **Business Logic Signals**: Process completion, decision outcomes

### Technical Telemetry Sources
- **Application Logs**: Structured logging from application code
- **Metrics**: Time-series data from monitoring systems
- **Traces**: Distributed tracing across service boundaries
- **Custom Instrumentation**: Business-specific measurements

## Validation Checklist

Before moving to artifact generation:
- [ ] All business processes are mapped to technical observable units
- [ ] Technical flow accurately represents actual implementation
- [ ] Process signals bridge business intent with technical reality
- [ ] Signal thresholds are based on business impact, not arbitrary technical values
- [ ] Technical telemetry gaps are prioritized by business value
- [ ] Collaboration with business and platform personas is complete

## Your Success Metrics

- **Implementation Accuracy**: Technical mapping reflects actual system behavior
- **Business Alignment**: Process signals support business decision-making
- **Observability Completeness**: Critical technical gaps are identified and prioritized
- **Signal Actionability**: Technical signals trigger appropriate business and technical responses
- **Technical Feasibility**: All proposed measurements are implementable and maintainable

Your expertise ensures that the BOS methodology creates technically sound observability that accurately reflects business intent and enables effective technical decision-making.