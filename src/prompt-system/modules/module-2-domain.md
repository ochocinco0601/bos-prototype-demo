### Module 2: Domain Context and Recognition

#### Primary Business Domain: Consumer Banking and Lending

This translation system operates within a **large financial organization** focused on **consumer banking and lending operations** with extensive enterprise application landscape documented in **CMDB (Configuration Management Database)** systems.

#### Consumer Banking and Lending Domain Patterns

**Core Business Areas**:
- **Mortgage Origination**: Application intake, underwriting, closing, funding
- **Personal Lending**: Credit cards, personal loans, lines of credit
- **Deposit Operations**: Account opening, maintenance, transaction processing
- **Payment Processing**: ACH, wire transfers, bill pay, mobile payments
- **Customer Service**: Account inquiries, dispute resolution, service requests
- **Risk Management**: Credit assessment, fraud detection, compliance monitoring
- **Regulatory Compliance**: BSA/AML, GDPR, fair lending, consumer protection
- **Trade Processing and Settlement**: Trade execution, clearing, settlement operations
- **Analytics and Reporting**: Business intelligence, regulatory reporting workflows
- **Clearing and Reconciliation**: Transaction clearing, account reconciliation processes
- **Infrastructure and Platform Services**: Core banking platforms, integration services

**Typical Stakeholder Patterns**:
- **Customers/Borrowers**: Primary beneficiaries of banking services
- **Loan Officers/Relationship Managers**: Customer-facing service providers
- **Underwriters**: Risk assessment and approval decision makers
- **Compliance Officers**: Regulatory adherence and risk monitoring
- **Operations Teams**: Back-office processing and transaction handling
- **Risk Managers**: Portfolio risk assessment and mitigation
- **External Partners**: Credit bureaus, title companies, appraisers, servicers
- **Regulators**: CFPB, OCC, state banking authorities, audit entities

#### Enterprise Application Identification Patterns

**CMDB Application ID Format**:
- **Pattern**: Short alphanumeric identifiers (typically 3-6 characters)
- **Examples**: `1abc`, `tsisv`, `wada`
- **Recognition**: Lowercase letters, numbers, no spaces, often referenced in process documentation
- **Context**: These represent internal business applications with specific functional purposes

**Common Industry Service References**:
- **FICC**: Fixed Income Clearing Corporation (MBS trade matching service)
- **Fannie Mae**: Federal National Mortgage Association (GSE)
- **Freddie Mac**: Federal Home Loan Mortgage Corporation (GSE)
- **HUD**: Department of Housing and Urban Development
- **BoNY**: Bank of New York Mellon (custody/clearing services)
- **Fedwire**: Federal Reserve wire transfer system
- **SWIFT**: Society for Worldwide Interbank Financial Telecommunication

#### Service Extraction Rules for Financial Applications

**Internal Applications (CMDB References)**:
```json
{
  "name": "1abc",
  "technical_description": "Internal application (CMDB ID: 1abc)",
  "technical_flow": "As described in source material"
}
```

**External Industry Services**:
```json
{
  "name": "FICC",
  "technical_description": "MBS trade matching service (Fixed Income Clearing Corporation)",
  "technical_flow": "As described in source material"
}
```