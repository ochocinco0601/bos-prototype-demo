# Step 1: WHO depends (Stakeholder Identification)

## Objective
Identify all stakeholders who depend on or are affected by this business step using the BOS stakeholder framework.

## BOS Stakeholder Framework

### People
**Definition**: Internal or external human customers, users, employees, agents
**Examples**:
- Loan applicants
- Customer service agents  
- Loan officers
- Compliance staff
- End users
- Support teams

### Business Entities
**Definition**: Organizational or transactional entities including business objects and regulatory requirements
**Examples**:
- Mortgage applications
- Customer accounts
- Compliance requirements
- Loan portfolios
- Business processes
- Regulatory frameworks

### Vendors
**Definition**: Third-party dependencies and integrations
**Examples**:
- Credit bureaus
- Document delivery services
- Fraud detection providers
- Payment processors
- API providers
- External service providers

## Data Collection Structure

```json
{
  "stakeholders": {
    "people": [
      {
        "name": "Stakeholder Name",
        "type": "internal|external",
        "role": "Role description",
        "expectations": "What they expect from this step",
        "criticality": "high|medium|low",
        "impact_if_unavailable": "Consequence if step fails"
      }
    ],
    "business_entities": [
      {
        "name": "Entity Name",
        "type": "process|object|requirement",
        "dependency": "How entity depends on this step",
        "criticality": "high|medium|low",
        "compliance_relevance": "Any regulatory implications"
      }
    ],
    "vendors": [
      {
        "name": "Vendor Name",
        "service_type": "Type of service provided",
        "integration_level": "critical|important|optional",
        "failure_impact": "Impact if vendor unavailable",
        "sla_requirements": "Expected service levels"
      }
    ]
  }
}
```

## Persona-Specific Guidance

### Product Owner Focus
- **Primary Responsibility**: Identify all stakeholder categories
- **Key Questions**:
  - Who uses the output of this step?
  - Who gets impacted if this step fails?
  - What business entities depend on this step?
  - Which vendors must be available?
- **Validation**: Every stakeholder type should have at least one entry

### Developer Focus
- **Supporting Role**: Validate technical stakeholder relationships
- **Key Questions**:
  - Which systems/services call this component?
  - What downstream processes depend on this step?
  - Are there technical stakeholders missing?
- **Validation**: Technical dependencies align with business stakeholders

### Platform SRE Focus
- **Supporting Role**: Identify infrastructure stakeholders
- **Key Questions**:
  - What infrastructure components support this step?
  - Which monitoring systems need this data?
  - Are there platform-level dependencies?
- **Validation**: Infrastructure stakeholders support business operations

## Validation Criteria

### Completeness Requirements
- [ ] At least one stakeholder in each category (People, Business Entities, Vendors)
- [ ] All stakeholders have defined expectations
- [ ] Criticality levels assigned
- [ ] Impact descriptions are specific and measurable

### Quality Indicators
- **High Quality**: Stakeholders are named specifically, expectations are measurable
- **Medium Quality**: General stakeholder types with clear expectations
- **Low Quality**: Vague stakeholder descriptions or missing expectations

### Common Validation Errors
- Missing stakeholder categories
- Vague stakeholder descriptions ("users", "customers")
- Undefined expectations or impacts
- Missing criticality assessments

## Guided Prompts by Persona

### Product Owner Prompts
```
Let's identify WHO depends on this business step: [STEP_NAME]

1. **People**: Who are the human stakeholders?
   - Internal users (employees, agents, staff)
   - External users (customers, partners, regulators)
   
2. **Business Entities**: What business objects/processes depend on this?
   - Business processes that use this step's output
   - Regulatory requirements that must be met
   - Business objects that must be updated
   
3. **Vendors**: Which external services are required?
   - Third-party APIs or services
   - External data providers
   - Integration partners

For each stakeholder, describe:
- What they expect from this step
- How critical their dependency is
- What happens if this step fails
```

### Developer Prompts
```
From a technical perspective, let's validate the stakeholder list:

1. **System Dependencies**: 
   - Which systems call this component?
   - What downstream services depend on this step?
   
2. **Data Dependencies**:
   - What systems need the data this step produces?
   - Are there database or messaging dependencies?
   
3. **Integration Points**:
   - Which APIs or services does this step call?
   - Are there technical stakeholders missing from the business list?
```

### Platform SRE Prompts
```
From an infrastructure perspective, let's identify system stakeholders:

1. **Infrastructure Dependencies**:
   - Which platform services support this step?
   - What monitoring systems need visibility?
   
2. **Operational Dependencies**:
   - Which teams need alerts from this step?
   - What operational processes depend on this step's health?
   
3. **Platform Services**:
   - Which shared services (databases, queues, etc.) are required?
   - Are there infrastructure stakeholders missing?
```

## Step Completion Criteria

### Ready to Proceed When:
- [ ] All three stakeholder categories have entries
- [ ] Each stakeholder has clear expectations defined
- [ ] Criticality levels are assigned
- [ ] Impact descriptions are specific
- [ ] All personas have reviewed and validated the list

### Validation Score Calculation:
- **Completeness**: (Filled categories / 3) × 50%
- **Quality**: (Stakeholders with detailed expectations / Total stakeholders) × 30%
- **Specificity**: (Named stakeholders / Total stakeholders) × 20%

Target: >80% for high-quality step completion