# Platform SRE - BOS Persona Guide

## Your Role in BOS Methodology

As a Platform SRE, you are the **infrastructure and system reliability authority** for the BOS methodology. Your primary responsibility is ensuring the platform can support business observability requirements, defining system signals that indicate infrastructure health, and creating dashboard requirements that enable effective incident response.

## Your Template Fields (Canonical Mapping)

| **Field Name** | **BOS Step** | **Your Responsibility** |
|----------------|--------------|-------------------------|
| System Signal Definitions | Step 5 | Define infrastructure signals that support business outcomes |
| System Signal Thresholds | Step 5 | Set system boundaries that prevent business impact |
| Infrastructure Telemetry Sources | Step 4 | Identify platform telemetry capabilities and gaps |
| System Correlations | Step 5 | Map system signals to business and process signals |
| Dashboard Requirements | Step 7 | Specify monitoring dashboards for incident response |
| Alert Routing | Step 5 | Define escalation paths for system issues |
| Runbook Integration | Step 7 | Connect system signals to operational procedures |

## Step-by-Step Guidance

### Session Setup
**Your Focus**: Establish infrastructure context and reliability boundaries

**Key Questions**:
- What infrastructure supports this business process?
- What are the system dependencies and failure modes?
- How does infrastructure performance affect business outcomes?
- What monitoring and alerting capabilities exist?

**Success Criteria**:
- Clear infrastructure mapping
- Documented system dependencies
- Established reliability requirements

### Step 1: WHO depends (Supporting Role)
**Your Supporting Responsibility**: Identify system dependencies and infrastructure stakeholders

**Your Approach**:
- Map infrastructure dependencies for business stakeholders
- Identify internal infrastructure consumers
- Document external system dependencies
- Validate that infrastructure can support stakeholder requirements

**Quality Indicators**:
- System dependencies are clearly mapped
- Infrastructure capacity requirements are documented
- External system dependencies are identified

### Step 2: WHAT they expect (Supporting Role)
**Your Supporting Responsibility**: Validate infrastructure can meet business expectations

**Your Approach**:
- Assess infrastructure capacity for performance requirements
- Identify system-level expectations (availability, latency, throughput)
- Validate that current infrastructure supports business expectations
- Document infrastructure assumptions and constraints

**Quality Indicators**:
- Infrastructure capacity aligns with business requirements
- System-level SLAs are defined and achievable
- Infrastructure constraints are communicated to stakeholders

### Step 3: WHAT breaks (Supporting Role)
**Your Supporting Responsibility**: Identify infrastructure failure modes and their business impact

**Your Approach**:
- Map business impacts to infrastructure failure scenarios
- Identify single points of failure
- Document cascading failure patterns
- Assess blast radius of infrastructure failures

**Quality Indicators**:
- Infrastructure failure modes are mapped to business impacts
- Single points of failure are identified and prioritized
- Cascading failure patterns are documented

### Step 4: WHAT telemetry (Primary Responsibility)
**Your Primary Responsibility**: Assess platform telemetry capabilities and identify infrastructure gaps

**Your Approach**:
1. **Infrastructure Telemetry Assessment**: Review current platform monitoring
   - **Compute Resources**: CPU, memory, disk, network metrics
   - **Application Performance**: Response times, error rates, throughput
   - **Database Performance**: Query performance, connection pools, locks
   - **Network Performance**: Latency, packet loss, bandwidth utilization
   - **Storage Performance**: IOPS, throughput, capacity utilization
   - **Security Metrics**: Authentication failures, suspicious activity

2. **Telemetry Gap Analysis**: Identify missing platform observability
   - **Business Process Visibility**: Can we see business flows in system metrics?
   - **Cross-System Correlation**: Can we trace requests across system boundaries?
   - **Performance Attribution**: Can we correlate system performance to business impact?
   - **Predictive Capabilities**: Can we predict system issues before business impact?

3. **Platform Capabilities Review**: Assess monitoring infrastructure
   - **Monitoring Tools**: What tools are available for data collection?
   - **Data Retention**: How long is telemetry data stored?
   - **Query Capabilities**: What analysis can be performed on telemetry?
   - **Alert Capabilities**: What alerting options are available?
   - **Dashboard Capabilities**: What visualization options exist?

**Quality Indicators**:
- Platform telemetry capabilities are accurately documented
- Telemetry gaps are prioritized by business impact
- Monitoring infrastructure capacity is assessed
- Data retention and query capabilities are clearly defined

### Step 5: WHAT signals (Primary Responsibility)
**Your Primary Responsibility**: Define system signals that indicate infrastructure health and business impact

**Your Approach**:
For each business impact, define supporting system signals:

1. **System Signal Definition**: Infrastructure measurements that indicate business risk
   - **Signal Name**: Clear, descriptive name linking system to business
   - **Measurement Method**: How the signal is calculated from system metrics
   - **Data Sources**: Which infrastructure components provide data
   - **Calculation Logic**: Formula or algorithm for signal computation
   - **Update Frequency**: How often the signal is calculated and evaluated

2. **System Signal Thresholds**: Infrastructure boundaries that prevent business impact
   - **Normal Range**: Expected operational values
   - **Warning Threshold**: When system attention is needed
   - **Critical Threshold**: When business impact is imminent
   - **Threshold Rationale**: Why these values were chosen based on business impact

3. **System Correlations**: How system signals relate to business and process signals
   - **Business Signal Correlation**: How system signals support business signals
   - **Process Signal Correlation**: How system signals support process signals
   - **Leading Indicators**: System signals that predict business signal changes
   - **Lagging Indicators**: System signals that confirm business signal changes

4. **Alert Routing and Escalation**: How system signals trigger operational response
   - **Primary Contact**: Who gets alerted first
   - **Escalation Path**: Who gets alerted if no response
   - **Escalation Timing**: How long to wait before escalation
   - **Business Communication**: How business stakeholders are notified

**Quality Indicators**:
- System signals are clearly correlated with business outcomes
- Thresholds prevent business impact rather than just indicating system problems
- Alert routing ensures appropriate response based on business priority
- System signals complement rather than duplicate business and process signals

### Step 7: DASHBOARD requirements (Primary Responsibility)
**Your Primary Responsibility**: Specify dashboard requirements for effective incident response

**Your Approach**:
1. **Dashboard Architecture**: Design monitoring dashboard structure
   - **Executive Dashboard**: High-level business impact view
   - **Operational Dashboard**: Real-time system health and business signals
   - **Diagnostic Dashboard**: Detailed system metrics for troubleshooting
   - **Capacity Dashboard**: Resource utilization and scaling indicators

2. **Dashboard Specifications**: For each dashboard, define:
   - **Purpose**: What decisions this dashboard supports
   - **Audience**: Who will use this dashboard
   - **Key Metrics**: What signals and metrics to display
   - **Layout**: How information is organized and prioritized
   - **Refresh Rate**: How often data is updated
   - **Drill-down Capabilities**: What detailed views are available

3. **Incident Response Integration**: Connect dashboards to operational procedures
   - **Runbook Links**: Connect signals to operational procedures
   - **Context Preservation**: Ensure dashboards provide troubleshooting context
   - **Historical Analysis**: Enable comparison with previous incidents
   - **Collaboration Tools**: Integration with incident management systems

**Quality Indicators**:
- Dashboards support business decision-making, not just technical monitoring
- Dashboard hierarchy matches incident response workflow
- Runbook integration provides clear operational guidance
- Historical analysis capabilities support continuous improvement

## Collaboration Guidelines

### Working with Product Owners
- **Explain System Impact**: Connect infrastructure issues to business consequences
- **Validate Business Requirements**: Ensure infrastructure can support business expectations
- **Communicate System Constraints**: Explain infrastructure limitations and trade-offs
- **Provide Cost Context**: Help prioritize infrastructure investments

### Working with Developers
- **Share Platform Capabilities**: Explain monitoring and alerting infrastructure
- **Coordinate Signal Implementation**: Ensure system signals complement process signals
- **Provide Technical Context**: Explain how infrastructure affects application performance
- **Plan Monitoring Strategy**: Align on technical monitoring approaches

## Common Pitfalls to Avoid

### System-Only Signal Definitions
- **Bad**: "CPU utilization above 80%"
- **Good**: "CPU utilization above 80% indicating response time degradation affecting customer experience"

### Arbitrary Threshold Setting
- **Bad**: "Alert when disk usage > 90%"
- **Good**: "Alert when disk usage > 85% to prevent database performance degradation affecting order processing"

### Missing Business Context in Dashboards
- **Bad**: "System metrics dashboard"
- **Good**: "Business impact dashboard showing how system performance affects customer experience and revenue"

### Technical-Only Alert Routing
- **Bad**: "Alert goes to on-call engineer"
- **Good**: "Alert goes to on-call engineer with business context and escalation to business stakeholders if not resolved in 15 minutes"

## Platform SRE Implementation Patterns

### System Signal Categories
- **Performance Signals**: Resource utilization patterns that predict business impact
- **Availability Signals**: System health indicators that affect business operations
- **Capacity Signals**: Resource consumption trends that affect business growth
- **Security Signals**: Infrastructure security events that affect business risk

### Dashboard Design Patterns
- **Business Impact First**: Start with business metrics, drill down to system metrics
- **Correlation Views**: Show relationships between system and business signals
- **Predictive Displays**: Highlight trends that predict future business impact
- **Action-Oriented**: Every displayed metric should trigger a clear action

### Alert Design Patterns
- **Business Context**: Every alert explains business impact
- **Escalation Timing**: Alert timing based on business SLA requirements
- **Runbook Integration**: Every alert links to clear operational procedures
- **Correlation Data**: Alerts provide context for rapid troubleshooting

## Validation Checklist

Before moving to artifact generation:
- [ ] All infrastructure dependencies are mapped to business processes
- [ ] System signals are correlated with business and process signals
- [ ] System thresholds prevent business impact rather than just indicating problems
- [ ] Dashboard requirements support business decision-making
- [ ] Alert routing ensures appropriate response based on business priority
- [ ] Runbook integration provides clear operational guidance

## Your Success Metrics

- **Business Alignment**: System signals support business decision-making
- **Incident Prevention**: System signals predict and prevent business impact
- **Response Effectiveness**: Dashboards enable rapid incident resolution
- **Operational Efficiency**: Alert routing minimizes business impact duration
- **Continuous Improvement**: Historical analysis supports reliability improvements

Your expertise ensures that the BOS methodology creates infrastructure observability that proactively protects business outcomes and enables effective incident response.