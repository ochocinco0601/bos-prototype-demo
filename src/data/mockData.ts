/**
 * Mock data creation functions for the BOS (Business Observability System) prototype
 * Extracted from App.tsx to provide centralized data creation utilities
 *
 * These functions create the initial data sets for the application including:
 * - Home Lending flow with complete stage-step-service structure
 * - Complete BOS methodology implementation with all 5 steps
 * - Basic example flow for comparison
 */

import { Flow } from '../types'

// =============================================================================
// HOME LENDING FLOW - Complete real-world example
// =============================================================================

/**
 * Create Home Lending Flow with enhanced data structure
 *
 * This function creates a comprehensive home lending origination process
 * based on actual HL flow-stage-step-service structure. It includes:
 * - Complete customer acquisition and application process
 * - Document collection and regulatory compliance
 * - Underwriting and risk assessment
 * - Closing and funding operations
 *
 * @returns {Flow} Complete home lending flow with all stages and steps
 */
export const createHLFlow = (): Flow => ({
  id: 'hl-originations',
  name: 'Home Lending - Originations',
  description:
    'Complete home lending origination process from customer acquisition to loan funding',
  stages: [
    {
      id: 'acquire-customer',
      name: 'Acquire Customer',
      steps: [
        {
          id: 'pre-qualification',
          name: 'Pre-Qualification',
          description:
            'Initial customer qualification and eligibility assessment',
          stakeholders: [], // TEST SCENARIO A: No stakeholders = 0% readiness
          dependencies: {
            'Loan Officer':
              'Customer income documentation and credit authorization',
            Customer:
              'Pre-qualification criteria and preliminary approval status',
            'Credit Bureau': 'Credit score and payment history data',
          },
          impacts: {},
          telemetry: {},
          signals: {},
          score: 25,
          // TEST SCENARIO A: Complete - Minimal data for 0% readiness
          telemetryMappings: [],
          services: [
            {
              name: 'Customer Portal',
              technical_description:
                'Web-based loan application interface with document upload capabilities',
              technical_flow:
                'Customer Portal -> Application API -> Loan Processing System',
            },
            {
              name: 'Credit Assessment Service',
              technical_description:
                'Integrated credit bureau interface for real-time credit evaluation',
              technical_flow:
                'Credit Assessment Service -> Equifax API -> Credit Decision Engine',
            },
          ],
        },
        {
          id: 'fee-review',
          name: 'Fee Review',
          description:
            'Review and approval of loan origination fees and closing costs',
          stakeholders: [
            // TEST SCENARIO B: Has stakeholders but no measurable impacts
            {
              name: 'Loan Officer',
              type: 'people',
              role: 'Fee Coordinator',
            },
            {
              name: 'Customer',
              type: 'people',
              role: 'Fee Approver',
            },
          ],
          dependencies: {
            'Loan Officer': 'Current fee schedule and pricing guidelines',
            Customer: 'Fee disclosure acknowledgment and approval',
            'Pricing Team': 'Accurate fee calculations and market rates',
          },
          impacts: [
            // TEST SCENARIO B: Has impacts but NONE are measurable = partial score
            {
              category: 'financial',
              description: 'Potential customer dissatisfaction with fees',
              isMeasurable: false,
            },
          ],
          telemetry: {},
          signals: [],
          score: 25,
          // TEST SCENARIO B: Complete - Partial data (stakeholders but no measurable impacts)
          telemetryMappings: [],
          services: [
            {
              name: 'Fee Calculation Engine',
              technical_description:
                'Automated fee calculation based on loan parameters and market conditions',
              technical_flow:
                'Fee Calculation Engine -> Pricing Database -> Disclosure Generator',
            },
            {
              name: 'Disclosure Management System',
              technical_description:
                'Regulatory compliance system for fee disclosure generation and tracking',
              technical_flow:
                'Disclosure Management System -> Regulatory Templates -> Customer Portal',
            },
          ],
        },
      ],
    },
    {
      id: 'complete-application',
      name: 'Complete Application',
      steps: [
        {
          id: 'document-collection',
          name: 'Document Collection',
          description:
            'Systematic collection and verification of required loan documentation',
          stakeholders: [
            {
              name: 'Loan Processor',
              role: 'Document Coordinator',
              type: 'people',
            },
            { name: 'Customer', role: 'Document Provider', type: 'people' },
            {
              name: 'Document Management Team',
              role: 'Document Validator',
              type: 'business',
            },
          ],
          dependencies: {
            'Loan Processor':
              'Complete document checklist and processing timeline',
            Customer: 'Required documents in acceptable format and quality',
            'Document Management Team':
              'Document validation rules and processing capacity',
          },
          impacts: {},
          telemetry: {},
          signals: {},
          score: 25,
          services: [
            {
              name: 'Document Management System',
              technical_description:
                'Centralized document storage with OCR and automated validation',
              technical_flow:
                'Document Management System -> OCR Engine -> Validation Rules -> Document Repository',
            },
            {
              name: 'Document Verification Service',
              technical_description:
                'Automated document authenticity and completeness verification',
              technical_flow:
                'Document Verification Service -> ML Validation -> Exception Queue',
            },
          ],
        },
      ],
    },
    {
      id: 'manage-disclosures',
      name: 'Manage Disclosures',
      steps: [
        {
          id: 'regulatory-disclosures',
          name: 'Regulatory Disclosures',
          description:
            'Generation and delivery of required regulatory disclosures and compliance documentation',
          stakeholders: [
            {
              name: 'Compliance Officer',
              role: 'Regulatory Coordinator',
              type: 'people',
            },
            { name: 'Customer', role: 'Disclosure Recipient', type: 'people' },
            {
              name: 'Legal Team',
              role: 'Compliance Reviewer',
              type: 'business',
            },
          ],
          dependencies: {
            'Compliance Officer':
              'Current regulatory requirements and templates',
            Customer: 'Timely receipt and acknowledgment of disclosures',
            'Legal Team': 'Regulatory interpretation and compliance validation',
          },
          impacts: {},
          telemetry: {},
          signals: {},
          score: 25,
          services: [
            {
              name: 'Regulatory Compliance Engine',
              technical_description:
                'Automated regulatory disclosure generation and tracking system',
              technical_flow:
                'Regulatory Compliance Engine -> Template Engine -> Delivery System -> Acknowledgment Tracking',
            },
          ],
        },
      ],
    },
    {
      id: 'process-application',
      name: 'Process Application',
      steps: [
        {
          id: 'underwriting',
          name: 'Underwriting',
          description:
            'Comprehensive risk assessment and loan approval decision process',
          stakeholders: [
            // TEST SCENARIO C: Minimum required data for 40%+ readiness
            {
              name: 'Senior Underwriter',
              type: 'people',
              role: 'Risk Decision Maker',
            },
          ],
          dependencies: {
            'Senior Underwriter':
              'Complete application file and risk assessment tools',
            'Loan Officer':
              'Customer relationship insight and application context',
            'Risk Management': 'Current risk policies and approval guidelines',
          },
          impacts: [
            // TEST SCENARIO C: Key measurable impact for 40%+ readiness
            {
              category: 'financial',
              description:
                'Loan approval delays impact revenue and customer satisfaction',
              isMeasurable: true, // Key: This makes it meet minimum requirements
              measurabilityPattern:
                'Track average loan approval time and customer satisfaction scores',
            },
          ],
          telemetry: {},
          signals: [],
          score: 25,
          // TEST SCENARIO C: Complete - Sufficient data (1 stakeholder + 1 measurable impact)
          telemetryMappings: [],
          services: [
            {
              name: 'Automated Underwriting System',
              technical_description:
                'AI-powered risk assessment and decision recommendation engine',
              technical_flow:
                'Automated Underwriting System -> Risk Models -> Decision Engine -> Approval Workflow',
            },
            {
              name: 'Risk Analytics Platform',
              technical_description:
                'Comprehensive risk data aggregation and analysis platform',
              technical_flow:
                'Risk Analytics Platform -> External Data Sources -> Risk Scoring -> Underwriting Dashboard',
            },
          ],
        },
      ],
    },
    {
      id: 'close-fund',
      name: 'Close and Fund',
      steps: [
        {
          id: 'closing-preparation',
          name: 'Closing Preparation',
          description:
            'Final preparation and coordination for loan closing and funding',
          stakeholders: [
            // TEST SCENARIO D: Rich data for 70%+ readiness
            {
              name: 'Closing Coordinator',
              type: 'people',
              role: 'Process Manager',
            },
            {
              name: 'Title Company',
              type: 'vendor',
              role: 'Closing Agent',
            },
            {
              name: 'Customer',
              type: 'people',
              role: 'Loan Borrower',
            },
          ],
          dependencies: {
            'Closing Coordinator':
              'Final loan documents and closing timeline coordination',
            'Title Company': 'Clear title confirmation and closing logistics',
            Customer: 'Closing date availability and final documentation',
          },
          impacts: [
            // TEST SCENARIO D: Multiple measurable impacts across categories
            {
              category: 'financial',
              description:
                'Closing delays impact revenue recognition and customer satisfaction',
              isMeasurable: true,
              measurabilityPattern:
                'Track closing timeline variance and customer satisfaction scores',
            },
            {
              category: 'customer_experience',
              description:
                'Poor closing experience affects customer retention and referrals',
              isMeasurable: true,
              measurabilityPattern:
                'Monitor NPS scores and referral rates post-closing',
            },
            {
              category: 'operational',
              description:
                'Coordination failures create process delays and rework',
              isMeasurable: true,
              measurabilityPattern:
                'Measure rework instances and process cycle time',
            },
          ],
          telemetry: {},
          signals: [
            // TEST SCENARIO D: Rich signal data with ownership
            {
              name: 'Closing Timeline Variance',
              type: 'business',
              threshold: '>2 days delay',
              owner: 'Closing Coordinator',
            },
            {
              name: 'Document Completion Rate',
              type: 'process',
              threshold: '<95% complete 48hrs before closing',
              owner: 'Operations Team',
            },
            {
              name: 'System Availability',
              type: 'system',
              threshold: '<99% uptime during closing hours',
              owner: 'IT Operations',
            },
          ],
          score: 25,
          // TEST SCENARIO D: Complete - Rich data with multiple measurable impacts and signals
          telemetryMappings: [
            {
              telemetryRequired: 'Closing Timeline Variance',
              dataSources: 'Closing Management System',
              observableSignals: 'actual_close_date vs scheduled_close_date',
            },
          ],
          services: [
            {
              name: 'Closing Management System',
              technical_description:
                'End-to-end closing process coordination and document management',
              technical_flow:
                'Closing Management System -> Document Assembly -> Title Interface -> Funding System',
            },
            {
              name: 'Loan Funding Platform',
              technical_description:
                'Secure loan disbursement and payment processing system',
              technical_flow:
                'Loan Funding Platform -> Wire Transfer System -> Account Management -> Confirmation Service',
            },
          ],
        },
      ],
    },
  ],
})

// =============================================================================
// COMPLETE BOS METHODOLOGY - Full 5-step implementation
// =============================================================================

/**
 * Create Complete Methodology Example Flow
 *
 * This function creates a comprehensive BOS methodology implementation
 * demonstrating all 5 steps of the BOS process:
 * 1. WHO depends (Stakeholders)
 * 2. WHAT they expect (Dependencies)
 * 3. WHAT breaks (Impacts)
 * 4. WHAT telemetry (Telemetry mapping)
 * 5. WHAT signals (Signal definitions)
 *
 * @returns {Flow} Complete BOS methodology flow with full signal implementation
 */
export const createCompleteMethodologyFlow = (): Flow => ({
  id: 'income-verification-complete',
  name: 'Income Verification - Complete Example',
  description:
    'Complete BOS methodology implementation with full 5-step process',
  stages: [
    {
      id: 'verification-stage',
      name: 'Document Income Verification',
      steps: [
        {
          id: 'document-income-verification',
          name: 'Document Income Verification',
          description:
            'Comprehensive income verification process with complete BOS methodology',
          stakeholders: [
            {
              name: 'Senior Loan Processor',
              role: 'Income Verification Specialist',
              type: 'people',
            },
            {
              name: 'Income Verification Department',
              role: 'Processing Team',
              type: 'business',
            },
            {
              name: 'Third-Party Verification Service',
              role: 'External Income Validator',
              type: 'vendor',
            },
          ],
          dependencies: {
            'Senior Loan Processor':
              'Complete income documentation package and verification checklist',
            'Income Verification Department':
              'Verification processing tools and employer contact database',
            'Third-Party Verification Service':
              'Real-time access to employment and income databases',
          },
          impacts: {
            'income-verification-failure': {
              financial:
                'Incorrect income verification leads to higher default rates and potential regulatory fines up to $500K',
              legal:
                'Non-compliance with income verification requirements results in regulatory penalties and audit findings',
              operational:
                'Failed income verification causes processing delays averaging 5-7 additional business days',
              customer_experience:
                'Income verification delays create customer dissatisfaction and potential loan abandonment',
            },
          },
          telemetry: {
            'income-verification-failure': {
              telemetry_required:
                'Income verification success rates, processing time metrics, error categorization',
              data_sources:
                'Loan origination system, third-party verification APIs, document management platform',
              observable_signals:
                'Verification completion events, processing duration, document quality scores',
            },
          },
          signals: {
            'income-verification-failure': {
              business_signal: {
                observable_unit: 'Income Verification Process',
                signal_type: 'Business Signal',
                signal_name: 'Income Verification Success Rate',
                instrumentation_details:
                  'Track percentage of successful income verifications vs. total verification attempts per day',
                threshold_conditions:
                  'Success rate below 90% triggers immediate escalation to management',
                implementation_notes:
                  'Implement counter metrics with success/failure labels, aggregate by loan type and verification method',
              },
              process_signal: {
                observable_unit: 'Verification Processing Pipeline',
                signal_type: 'Process Signal',
                signal_name: 'Income Verification Processing Time',
                instrumentation_details:
                  'Measure elapsed time from verification request to completion or failure',
                threshold_conditions:
                  'Processing time exceeding 48 hours triggers process review and customer communication',
                implementation_notes:
                  'Use histogram metrics to track processing time distribution, identify bottlenecks',
              },
              system_signal: {
                observable_unit: 'Third-Party Verification Service',
                signal_type: 'System Signal',
                signal_name: 'External Service Availability',
                instrumentation_details:
                  'Monitor API response times and availability of third-party verification services',
                threshold_conditions:
                  'Service response time >3 seconds OR availability <99.5% triggers failover procedures',
                implementation_notes:
                  'Implement synthetic monitoring and health checks with automated failover to backup services',
              },
            },
          },
          score: 100,
          services: [
            {
              name: 'VPS Customer Verification',
              technical_description:
                'Primary customer verification processing system integrating multiple data sources',
              technical_flow:
                'VPS Customer Verification -> Equifax TWN -> DTDS -> Fannie Mae Not Pay',
            },
            {
              name: 'Equifax TWN',
              technical_description:
                'Equifax The Work Number service for automated employment and income verification',
              technical_flow:
                'Employment Verification API -> Equifax TWN Database -> Income History Response',
            },
            {
              name: 'DTDS',
              technical_description:
                'Document and Data Transformation Service for standardizing verification data',
              technical_flow:
                'Raw Verification Data -> DTDS Processing -> Standardized Output Format',
            },
            {
              name: 'Fannie Mae Not Pay',
              technical_description:
                'Fannie Mae verification service for mortgage industry compliance',
              technical_flow:
                'Verification Request -> Fannie Mae API Gateway -> Compliance Validation Response',
            },
          ],
        },
      ],
    },
  ],
})

// =============================================================================
// BASIC EXAMPLE FLOW - Minimal methodology for comparison
// =============================================================================

/**
 * Create Basic Example Flow
 *
 * This function creates a minimal process example with partial methodology
 * implementation. Used for comparison with complete methodology examples
 * to demonstrate the difference in BOS implementation completeness.
 *
 * @returns {Flow} Basic flow with minimal methodology implementation
 */
export const createBasicFlow = (): Flow => ({
  id: 'basic-example',
  name: 'Basic Example - Partial Methodology',
  description: 'Basic process with minimal methodology implementation',
  stages: [
    {
      id: 'basic-stage',
      name: 'Basic Process Stage',
      steps: [
        {
          id: 'basic-step',
          name: 'Basic Process Step',
          description: 'Simple process step with partial methodology',
          stakeholders: [
            {
              name: 'Process Owner',
              role: 'Primary Responsible Party',
              type: 'people',
            },
            {
              name: 'Supporting System',
              role: 'Automated Processor',
              type: 'business',
            },
          ],
          dependencies: {
            'Process Owner':
              'Process execution authority and resource allocation',
            'Supporting System': 'System availability and operational capacity',
          },
          impacts: {},
          telemetry: {},
          signals: {},
          score: 50,
          services: [
            {
              name: 'Basic Processing Service',
              technical_description: 'Simple automated processing service',
              technical_flow:
                'Input Data -> Processing Logic -> Output Generation',
            },
          ],
        },
      ],
    },
  ],
})

// =============================================================================
// EXPORT ALL FUNCTIONS
// =============================================================================

/**
 * Create Enhanced Complete BOS Methodology Flow
 *
 * Modern implementation using current array-based data model.
 * Provides complete end-to-end test data for all 5 BOS methodology steps:
 * WHO → WHAT → BREAKS → TELEMETRY → SIGNALS
 *
 * @returns {Flow} Complete flow with modern BOS methodology implementation
 */
export const createEnhancedCompleteFlow = (): Flow => ({
  id: 'enhanced-complete-test',
  name: 'Enhanced Complete Test Flow',
  description:
    'Complete BOS methodology test data with modern array-based format',
  stages: [
    {
      id: 'test-stage',
      name: 'Complete Test Stage',
      steps: [
        {
          id: 'complete-test-step',
          name: 'Complete Test Step',
          description: 'Fully populated BOS methodology example for testing',

          // WHO depends - 3 stakeholder types with proper relationships
          stakeholders: [
            {
              id: 'stakeholder-1',
              name: 'Primary Loan Officer',
              role: 'Income Verification Specialist',
              type: 'people',
              description:
                'Processes and validates customer income documentation',
            },
            {
              id: 'stakeholder-2',
              name: 'Underwriting Department',
              role: 'Risk Assessment Team',
              type: 'business',
              description:
                'Maintains income verification standards and procedures',
            },
            {
              id: 'stakeholder-3',
              name: 'Third-Party Verification Service',
              role: 'External Data Provider',
              type: 'vendor',
              description: 'Provides employment and income verification data',
            },
          ],

          // WHAT they expect - dependencies linked to stakeholders
          dependencies: [
            {
              id: 'dependency-1',
              stakeholderId: 'stakeholder-1',
              expectation:
                'Complete income documentation package within 24 hours',
              description:
                'All required income documents properly formatted and verified',
            },
            {
              id: 'dependency-2',
              stakeholderId: 'stakeholder-2',
              expectation:
                'Income verification completion within SLA requirements',
              description:
                'Verification process completed within defined service level agreements',
            },
            {
              id: 'dependency-3',
              stakeholderId: 'stakeholder-3',
              expectation: 'Real-time access to employment verification APIs',
              description:
                'Continuous availability of third-party verification services',
            },
          ],

          // WHAT breaks - all 4 impact categories
          impacts: [
            {
              id: 'impact-1',
              category: 'financial',
              description:
                'Default risk increases by 15% when income verification fails, leading to potential losses of $2M annually',
              isMeasurable: true,
              severity: 'high',
            },
            {
              id: 'impact-2',
              category: 'legal',
              description:
                'Regulatory compliance violations result in fines up to $500K and audit findings',
              isMeasurable: true,
              severity: 'critical',
            },
            {
              id: 'impact-3',
              category: 'operational',
              description:
                'Processing delays average 5-7 additional business days when verification fails',
              isMeasurable: true,
              severity: 'medium',
            },
            {
              id: 'impact-4',
              category: 'customer_experience',
              description:
                'Customer satisfaction drops 40% due to verification delays and loan abandonment increases',
              isMeasurable: true,
              severity: 'high',
            },
          ],

          // WHAT telemetry - telemetry mappings linked to impacts
          telemetryMappings: [
            {
              id: 'telemetry-1',
              impactId: 'impact-1',
              telemetryRequired:
                'Income verification success rate and default correlation metrics',
              dataSources:
                'Loan origination system, risk management database, portfolio performance data',
              observableSignals:
                'Verification success events, default rate changes, portfolio risk scores',
            },
            {
              id: 'telemetry-2',
              impactId: 'impact-2',
              telemetryRequired:
                'Compliance violation tracking and regulatory audit metrics',
              dataSources:
                'Compliance management system, audit logs, regulatory reporting database',
              observableSignals:
                'Compliance check results, audit findings, regulatory notifications',
            },
            {
              id: 'telemetry-3',
              impactId: 'impact-3',
              telemetryRequired:
                'Processing time metrics and workflow bottleneck identification',
              dataSources:
                'Workflow management system, processing queues, task completion logs',
              observableSignals:
                'Task duration events, queue depth metrics, bottleneck alerts',
            },
            {
              id: 'telemetry-4',
              impactId: 'impact-4',
              telemetryRequired:
                'Customer satisfaction scores and loan abandonment tracking',
              dataSources:
                'Customer feedback system, application tracking database, abandonment analytics',
              observableSignals:
                'Satisfaction survey results, abandonment events, customer complaints',
            },
          ],

          // WHAT signals - business/process/system/kpi signals with Business Impact Playbook support
          signals: [
            {
              id: 'signal-1',
              name: 'Income Verification Success Rate',
              type: 'business',
              description:
                'Percentage of successful income verifications vs total attempts',
              owner: 'Underwriting Department',
              metricName: 'verification_success_rate',
              threshold: 'Alert if below 90% over 24-hour period',
            },
            {
              id: 'signal-2',
              name: 'Processing Time SLA Compliance',
              type: 'process',
              description:
                'Percentage of verifications completed within SLA timeframes',
              owner: 'Operations Team',
              metricName: 'sla_compliance_rate',
              threshold: 'Alert if below 95% within business hours',
              // Process signals remain step-level (no dependencyId)
            },
            {
              id: 'signal-3',
              name: 'Third-Party API Availability',
              type: 'system',
              description:
                'Availability and response time of external verification services',
              owner: 'IT Infrastructure Team',
              metricName: 'api_availability_score',
              threshold:
                'Alert if availability below 99.5% or response time above 3 seconds',
              // System signals remain step-level (no dependencyId)
            },
            {
              id: 'signal-4',
              name: 'Documentation Turnaround Time',
              type: 'business',
              description:
                'Average time from document request to completion for income verification',
              owner: 'Primary Loan Officer',
              metricName: 'doc_turnaround_time_hours',
              threshold: 'Target: < 24 hours, Alert: > 48 hours',
            },
            {
              id: 'signal-5',
              name: 'Verification Quality Score',
              type: 'business',
              description:
                'Composite score of verification accuracy and completeness',
              owner: 'Underwriting Department',
              metricName: 'verification_quality_score',
              threshold: 'Target: > 95%, Alert: < 85%',
            },
            {
              id: 'signal-6',
              name: 'Third-Party Service Reliability',
              type: 'business',
              description:
                'Success rate of third-party verification API responses',
              owner: 'Third-Party Verification Service',
              metricName: 'api_success_rate',
              threshold: 'Target: > 99%, Alert: < 95%',
            },
          ],

          score: 100, // Complete methodology = full score
          services: [
            {
              name: 'Income Verification Service',
              technical_description:
                'Orchestrates income verification workflow with external data sources',
              technical_flow:
                'Application API → Verification Service → Third-Party APIs → Validation Engine → Results API',
            },
          ],
        },
      ],
    },
  ],
})

/**
 * All mock data creation functions are exported above with their individual declarations
 * These functions are used to initialize the application with sample data
 */
