#!/usr/bin/env python3
"""
BOS Methodology Compliance Tester

Automated testing system specifically designed to validate strict adherence 
to BOS methodology principles, framework structure, and implementation requirements.
"""

import json
import re
import time
from typing import Dict, List, Any, Tuple, Optional
from dataclasses import dataclass, asdict
from enum import Enum


class ComplianceLevel(Enum):
    CRITICAL = "critical"    # Must pass for BOS compliance
    IMPORTANT = "important"  # Should pass for quality BOS implementation
    RECOMMENDED = "recommended"  # Good practices for optimal BOS


class ComplianceStatus(Enum):
    PASS = "pass"
    FAIL = "fail"
    WARNING = "warning"
    NOT_APPLICABLE = "not_applicable"


@dataclass
class ComplianceRule:
    """Definition of a BOS methodology compliance rule."""
    rule_id: str
    rule_name: str
    description: str
    compliance_level: ComplianceLevel
    validation_function: str
    required_elements: List[str]
    pass_threshold: float
    weight: float


@dataclass
class ComplianceResult:
    """Result of a compliance rule evaluation."""
    rule_id: str
    status: ComplianceStatus
    score: float
    details: Dict[str, Any]
    violations: List[str]
    recommendations: List[str]


@dataclass
class ComplianceReport:
    """Comprehensive BOS methodology compliance report."""
    overall_compliance: float
    compliance_grade: str
    critical_failures: int
    important_failures: int
    total_rules_tested: int
    rules_passed: int
    detailed_results: List[ComplianceResult]
    summary_by_category: Dict[str, Dict[str, Any]]
    implementation_readiness: bool
    required_fixes: List[str]
    recommended_improvements: List[str]


class BOSComplianceTester:
    """Comprehensive BOS methodology compliance testing system."""
    
    def __init__(self):
        self.compliance_rules = self._initialize_compliance_rules()
        self.bos_framework_structure = self._initialize_framework_structure()
        self.stakeholder_framework = self._initialize_stakeholder_framework()
        self.methodology_sequence = self._initialize_methodology_sequence()
        
    def _initialize_compliance_rules(self) -> List[ComplianceRule]:
        """Initialize comprehensive BOS methodology compliance rules."""
        return [
            # CRITICAL COMPLIANCE RULES
            ComplianceRule(
                rule_id="BOS-001",
                rule_name="Seven Step Methodology Structure",
                description="Must reference all 7 BOS methodology steps in correct sequence",
                compliance_level=ComplianceLevel.CRITICAL,
                validation_function="validate_seven_step_structure",
                required_elements=["WHO depends", "WHAT they expect", "WHAT breaks", 
                                 "WHAT telemetry", "WHAT signals", "PLAYBOOK", "DASHBOARD"],
                pass_threshold=1.0,
                weight=0.15
            ),
            
            ComplianceRule(
                rule_id="BOS-002", 
                rule_name="Stakeholder Framework Completeness",
                description="Must address People, Business Entities, and Vendors stakeholder categories",
                compliance_level=ComplianceLevel.CRITICAL,
                validation_function="validate_stakeholder_framework",
                required_elements=["People", "Business Entities", "Vendors"],
                pass_threshold=1.0,
                weight=0.12
            ),
            
            ComplianceRule(
                rule_id="BOS-003",
                rule_name="Impact Categories Coverage", 
                description="Must address Financial, Legal, Operational, Customer Experience impacts",
                compliance_level=ComplianceLevel.CRITICAL,
                validation_function="validate_impact_categories",
                required_elements=["Financial", "Legal", "Operational", "Customer Experience"],
                pass_threshold=1.0,
                weight=0.12
            ),
            
            ComplianceRule(
                rule_id="BOS-004",
                rule_name="Observable Unit Focus",
                description="Must emphasize observable units as core telemetry mapping concept",
                compliance_level=ComplianceLevel.CRITICAL,
                validation_function="validate_observable_units",
                required_elements=["observable unit", "observable units"],
                pass_threshold=0.8,
                weight=0.10
            ),
            
            ComplianceRule(
                rule_id="BOS-005",
                rule_name="Signal Type Differentiation",
                description="Must differentiate between Business, Process, and System signals",
                compliance_level=ComplianceLevel.CRITICAL,
                validation_function="validate_signal_types",
                required_elements=["business signal", "process signal", "system signal"],
                pass_threshold=0.6,
                weight=0.10
            ),
            
            # IMPORTANT COMPLIANCE RULES
            ComplianceRule(
                rule_id="BOS-006",
                rule_name="Persona-Specific Guidance",
                description="Should provide appropriate guidance for each persona's responsibilities",
                compliance_level=ComplianceLevel.IMPORTANT,
                validation_function="validate_persona_guidance",
                required_elements=["Product Owner", "Developer", "Platform SRE"],
                pass_threshold=0.8,
                weight=0.08
            ),
            
            ComplianceRule(
                rule_id="BOS-007",
                rule_name="Session State Management",
                description="Should include session management commands and state tracking",
                compliance_level=ComplianceLevel.IMPORTANT,
                validation_function="validate_session_management",
                required_elements=["/start", "/persona", "/step", "/validate", "/status"],
                pass_threshold=0.6,
                weight=0.07
            ),
            
            ComplianceRule(
                rule_id="BOS-008",
                rule_name="Measurable Expectations Focus",
                description="Should emphasize measurable, quantifiable expectations",
                compliance_level=ComplianceLevel.IMPORTANT,
                validation_function="validate_measurable_expectations",
                required_elements=["measurable", "quantifiable", "specific", "timeframe"],
                pass_threshold=0.7,
                weight=0.08
            ),
            
            ComplianceRule(
                rule_id="BOS-009",
                rule_name="Business Impact Playbook Structure",
                description="Should define proper Business Impact Playbook artifact structure",
                compliance_level=ComplianceLevel.IMPORTANT,
                validation_function="validate_playbook_structure",
                required_elements=["Executive Summary", "Stakeholder Impact Matrix", 
                                 "Response Procedures", "Escalation Matrix"],
                pass_threshold=0.75,
                weight=0.06
            ),
            
            ComplianceRule(
                rule_id="BOS-010",
                rule_name="Dashboard Requirements Specification",
                description="Should define technical dashboard requirements for Platform SRE",
                compliance_level=ComplianceLevel.IMPORTANT,
                validation_function="validate_dashboard_requirements",
                required_elements=["dashboard", "widget", "visualization", "technical specifications"],
                pass_threshold=0.7,
                weight=0.06
            ),
            
            # RECOMMENDED COMPLIANCE RULES
            ComplianceRule(
                rule_id="BOS-011",
                rule_name="Validation and Quality Gates",
                description="Should include validation commands and quality assessment",
                compliance_level=ComplianceLevel.RECOMMENDED,
                validation_function="validate_quality_gates",
                required_elements=["validate", "quality", "completeness", "score"],
                pass_threshold=0.5,
                weight=0.03
            ),
            
            ComplianceRule(
                rule_id="BOS-012",
                rule_name="Collaborative Workflow Support",
                description="Should support multi-persona collaborative workflows",
                compliance_level=ComplianceLevel.RECOMMENDED,
                validation_function="validate_collaborative_support",
                required_elements=["handoff", "collaboration", "team", "cross-persona"],
                pass_threshold=0.5,
                weight=0.03
            )
        ]
    
    def _initialize_framework_structure(self) -> Dict[str, Any]:
        """Initialize BOS framework structural requirements."""
        return {
            "methodology_steps": {
                "step_1": {"name": "WHO depends", "focus": "stakeholder identification"},
                "step_2": {"name": "WHAT they expect", "focus": "dependency mapping"},
                "step_3": {"name": "WHAT breaks", "focus": "impact analysis"},
                "step_4": {"name": "WHAT telemetry", "focus": "telemetry mapping"},
                "step_5": {"name": "WHAT signals", "focus": "signal definitions"},
                "step_6": {"name": "PLAYBOOK generation", "focus": "artifact creation"},
                "step_7": {"name": "DASHBOARD requirements", "focus": "technical specifications"}
            },
            "required_progression": [
                "WHO → WHAT → BREAKS → TELEMETRY → SIGNALS → PLAYBOOK → DASHBOARD"
            ],
            "core_concepts": [
                "stakeholder-first methodology",
                "observable units",
                "business observability", 
                "stakeholder expectations",
                "measurable outcomes"
            ]
        }
    
    def _initialize_stakeholder_framework(self) -> Dict[str, Any]:
        """Initialize BOS stakeholder framework requirements."""
        return {
            "stakeholder_categories": {
                "people": {
                    "description": "Individuals, roles, teams who interact with the process",
                    "examples": ["users", "operators", "managers", "analysts"]
                },
                "business_entities": {
                    "description": "Organizations, departments, customers, business units",
                    "examples": ["departments", "customers", "partners", "business units"]
                },
                "vendors": {
                    "description": "External providers, suppliers, third-party services",
                    "examples": ["suppliers", "service providers", "contractors", "APIs"]
                }
            },
            "relationship_types": ["serves", "maintains", "integrates"],
            "required_attributes": ["expectations", "criticality", "impact"]
        }
    
    def _initialize_methodology_sequence(self) -> Dict[str, Any]:
        """Initialize BOS methodology sequence requirements."""
        return {
            "sequential_flow": [
                {"step": 1, "prerequisite": None, "validates": "stakeholder completeness"},
                {"step": 2, "prerequisite": "step_1", "validates": "dependency mapping"},
                {"step": 3, "prerequisite": "step_2", "validates": "impact analysis"},
                {"step": 4, "prerequisite": "step_3", "validates": "telemetry coverage"},
                {"step": 5, "prerequisite": "step_4", "validates": "signal definitions"},
                {"step": 6, "prerequisite": "step_5", "validates": "playbook generation"},
                {"step": 7, "prerequisite": "step_6", "validates": "dashboard requirements"}
            ],
            "validation_gates": {
                "step_1_to_2": "All stakeholder categories identified",
                "step_2_to_3": "Dependencies mapped and measured", 
                "step_3_to_4": "Impact scenarios quantified",
                "step_4_to_5": "Observable units defined",
                "step_5_to_6": "Signals traceable to impacts",
                "step_6_to_7": "Playbook structure complete"
            }
        }
    
    def validate_bos_compliance(self, response: str, context: Optional[Dict] = None) -> ComplianceReport:
        """Execute comprehensive BOS methodology compliance validation."""
        
        start_time = time.time()
        
        compliance_results = []
        critical_failures = 0
        important_failures = 0
        total_rules = len(self.compliance_rules)
        rules_passed = 0
        
        # Execute each compliance rule
        for rule in self.compliance_rules:
            result = self._execute_compliance_rule(rule, response, context)
            compliance_results.append(result)
            
            if result.status == ComplianceStatus.PASS:
                rules_passed += 1
            elif result.status == ComplianceStatus.FAIL:
                if rule.compliance_level == ComplianceLevel.CRITICAL:
                    critical_failures += 1
                elif rule.compliance_level == ComplianceLevel.IMPORTANT:
                    important_failures += 1
        
        # Calculate overall compliance score
        weighted_score = sum(
            result.score * rule.weight 
            for result, rule in zip(compliance_results, self.compliance_rules)
        )
        
        # Determine compliance grade
        compliance_grade = self._determine_compliance_grade(weighted_score, critical_failures)
        
        # Check implementation readiness
        implementation_readiness = (critical_failures == 0 and weighted_score >= 0.8)
        
        # Generate summary by category
        summary_by_category = self._generate_category_summary(compliance_results)
        
        # Collect required fixes and recommendations
        required_fixes = []
        recommended_improvements = []
        
        for result in compliance_results:
            if result.status == ComplianceStatus.FAIL:
                rule = next(r for r in self.compliance_rules if r.rule_id == result.rule_id)
                if rule.compliance_level == ComplianceLevel.CRITICAL:
                    required_fixes.extend(result.violations)
                else:
                    recommended_improvements.extend(result.recommendations)
        
        execution_time = time.time() - start_time
        
        return ComplianceReport(
            overall_compliance=weighted_score,
            compliance_grade=compliance_grade,
            critical_failures=critical_failures,
            important_failures=important_failures,
            total_rules_tested=total_rules,
            rules_passed=rules_passed,
            detailed_results=compliance_results,
            summary_by_category=summary_by_category,
            implementation_readiness=implementation_readiness,
            required_fixes=required_fixes,
            recommended_improvements=recommended_improvements
        )
    
    def _execute_compliance_rule(self, rule: ComplianceRule, response: str, context: Optional[Dict]) -> ComplianceResult:
        """Execute a specific compliance rule."""
        
        # Get the validation method
        validation_method = getattr(self, rule.validation_function, None)
        if not validation_method:
            return ComplianceResult(
                rule_id=rule.rule_id,
                status=ComplianceStatus.FAIL,
                score=0.0,
                details={"error": f"Validation method {rule.validation_function} not found"},
                violations=[f"Internal error: validation method missing"],
                recommendations=[]
            )
        
        # Execute validation
        try:
            validation_result = validation_method(response, rule, context)
            
            # Determine compliance status
            if validation_result["score"] >= rule.pass_threshold:
                status = ComplianceStatus.PASS
            elif validation_result["score"] >= rule.pass_threshold * 0.5:
                status = ComplianceStatus.WARNING
            else:
                status = ComplianceStatus.FAIL
            
            return ComplianceResult(
                rule_id=rule.rule_id,
                status=status,
                score=validation_result["score"],
                details=validation_result,
                violations=validation_result.get("violations", []),
                recommendations=validation_result.get("recommendations", [])
            )
            
        except Exception as e:
            return ComplianceResult(
                rule_id=rule.rule_id,
                status=ComplianceStatus.FAIL,
                score=0.0,
                details={"error": str(e)},
                violations=[f"Validation error: {str(e)}"],
                recommendations=[]
            )
    
    # Specific validation methods for each compliance rule
    
    def validate_seven_step_structure(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate presence and structure of 7-step BOS methodology."""
        
        found_steps = {}
        violations = []
        
        for step in rule.required_elements:
            # Look for exact step references
            pattern = rf'\b{re.escape(step)}\b'
            matches = re.findall(pattern, response, re.IGNORECASE)
            found_steps[step] = len(matches)
            
            if len(matches) == 0:
                violations.append(f"Missing methodology step: {step}")
        
        # Check for proper sequence indicators
        sequence_indicators = [
            "Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6", "Step 7",
            "1.", "2.", "3.", "4.", "5.", "6.", "7."
        ]
        
        sequence_found = sum(
            len(re.findall(rf'\b{re.escape(indicator)}\b', response, re.IGNORECASE))
            for indicator in sequence_indicators
        )
        
        # Calculate score
        steps_found = sum(1 for count in found_steps.values() if count > 0)
        step_score = steps_found / len(rule.required_elements)
        sequence_score = min(sequence_found / 7, 1.0)
        
        overall_score = (step_score * 0.8) + (sequence_score * 0.2)
        
        return {
            "score": overall_score,
            "found_steps": found_steps,
            "sequence_indicators": sequence_found,
            "violations": violations,
            "recommendations": [
                "Include all 7 BOS methodology steps",
                "Use clear step numbering or sequencing",
                "Reference specific BOS step names"
            ] if overall_score < rule.pass_threshold else []
        }
    
    def validate_stakeholder_framework(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate BOS stakeholder framework coverage."""
        
        stakeholder_patterns = {
            "People": [
                r'\b(people|person|individual|user|operator|manager|analyst|staff|employee|role|team)\b',
                r'\b(customer service|sales|support|administrator|specialist)\b'
            ],
            "Business Entities": [
                r'\b(business|department|organization|company|customer|client|partner)\b',
                r'\b(business unit|division|subsidiary|entity)\b'
            ],
            "Vendors": [
                r'\b(vendor|supplier|provider|contractor|third.?party|external)\b',
                r'\b(service provider|API|integration|external service)\b'
            ]
        }
        
        found_categories = {}
        violations = []
        
        for category, patterns in stakeholder_patterns.items():
            category_count = 0
            for pattern in patterns:
                matches = re.findall(pattern, response, re.IGNORECASE)
                category_count += len(matches)
            
            found_categories[category] = category_count
            
            if category_count == 0:
                violations.append(f"Missing stakeholder category: {category}")
        
        # Calculate score based on category coverage
        categories_covered = sum(1 for count in found_categories.values() if count > 0)
        coverage_score = categories_covered / len(rule.required_elements)
        
        # Bonus for explicit framework reference
        framework_bonus = 0.0
        if re.search(r'(People|Business Entities|Vendors)', response, re.IGNORECASE):
            framework_bonus = 0.1
        
        overall_score = min(coverage_score + framework_bonus, 1.0)
        
        return {
            "score": overall_score,
            "found_categories": found_categories,
            "categories_covered": categories_covered,
            "violations": violations,
            "recommendations": [
                f"Add {category} stakeholder examples" 
                for category, count in found_categories.items() if count == 0
            ]
        }
    
    def validate_impact_categories(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate BOS impact categories coverage."""
        
        impact_patterns = {
            "Financial": [
                r'\b(financial|revenue|cost|profit|loss|budget|monetary|dollar|ROI)\b',
                r'\$\d+', r'\b\d+.*?(revenue|cost|loss)\b'
            ],
            "Legal": [
                r'\b(legal|compliance|regulatory|audit|violation|penalty|liability)\b',
                r'\b(regulation|law|requirement|mandate|policy)\b'
            ],
            "Operational": [
                r'\b(operational|process|workflow|efficiency|productivity|performance)\b',
                r'\b(operation|procedure|task|activity|processing)\b'
            ],
            "Customer Experience": [
                r'\b(customer|user|client|satisfaction|experience|service)\b',
                r'\b(customer service|user experience|satisfaction|quality)\b'
            ]
        }
        
        found_impacts = {}
        violations = []
        
        for category, patterns in impact_patterns.items():
            category_count = 0
            for pattern in patterns:
                matches = re.findall(pattern, response, re.IGNORECASE)
                category_count += len(matches)
            
            found_impacts[category] = category_count
            
            if category_count == 0:
                violations.append(f"Missing impact category: {category}")
        
        # Calculate score
        impacts_covered = sum(1 for count in found_impacts.values() if count > 0)
        coverage_score = impacts_covered / len(rule.required_elements)
        
        return {
            "score": coverage_score,
            "found_impacts": found_impacts,
            "impacts_covered": impacts_covered,
            "violations": violations,
            "recommendations": [
                f"Add {category} impact analysis" 
                for category, count in found_impacts.items() if count == 0
            ]
        }
    
    def validate_observable_units(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate observable unit concept emphasis."""
        
        observable_patterns = [
            r'\bobservable unit\b',
            r'\bobservable units\b',
            r'\bobservable\s+\w+\s+unit\b',
            r'\bunit.*?observable\b'
        ]
        
        observable_count = 0
        for pattern in observable_patterns:
            matches = re.findall(pattern, response, re.IGNORECASE)
            observable_count += len(matches)
        
        # Look for related concepts
        related_concepts = [
            "telemetry source", "monitoring point", "instrumentation",
            "measurement point", "data source", "signal source"
        ]
        
        related_count = sum(
            len(re.findall(rf'\b{re.escape(concept)}\b', response, re.IGNORECASE))
            for concept in related_concepts
        )
        
        # Calculate score
        direct_score = min(observable_count / 2, 1.0)  # Target 2 mentions
        related_score = min(related_count / 3, 0.5)    # Up to 0.5 bonus
        
        overall_score = min(direct_score + related_score, 1.0)
        
        violations = []
        if observable_count == 0:
            violations.append("Missing 'observable unit' concept reference")
        
        return {
            "score": overall_score,
            "observable_count": observable_count,
            "related_count": related_count,
            "violations": violations,
            "recommendations": [
                "Emphasize 'observable units' as core BOS concept",
                "Define observable units as measurable components"
            ] if overall_score < rule.pass_threshold else []
        }
    
    def validate_signal_types(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate differentiation between signal types."""
        
        signal_types = {
            "business signal": ["business signal", "business indicator", "business metric"],
            "process signal": ["process signal", "process indicator", "process metric"],
            "system signal": ["system signal", "system indicator", "system metric", "infrastructure signal"]
        }
        
        found_signals = {}
        violations = []
        
        for signal_type, patterns in signal_types.items():
            type_count = sum(
                len(re.findall(rf'\b{re.escape(pattern)}\b', response, re.IGNORECASE))
                for pattern in patterns
            )
            found_signals[signal_type] = type_count
            
            if type_count == 0:
                violations.append(f"Missing signal type: {signal_type}")
        
        # Calculate score
        types_found = sum(1 for count in found_signals.values() if count > 0)
        type_score = types_found / len(rule.required_elements)
        
        return {
            "score": type_score,
            "found_signals": found_signals,
            "types_found": types_found,
            "violations": violations,
            "recommendations": [
                "Differentiate between business, process, and system signals",
                "Define signal types clearly for each persona"
            ] if type_score < rule.pass_threshold else []
        }
    
    def validate_persona_guidance(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate persona-specific guidance appropriateness."""
        
        persona_indicators = {
            "Product Owner": [
                "product owner", "business SME", "stakeholder", "business context",
                "business impact", "business requirement", "business outcome"
            ],
            "Developer": [
                "developer", "technical implementation", "observable unit", "instrumentation",
                "telemetry", "code", "API", "service", "technical"
            ],
            "Platform SRE": [
                "platform SRE", "infrastructure", "monitoring", "dashboard", "system",
                "operational", "reliability", "performance", "health"
            ]
        }
        
        found_personas = {}
        for persona, indicators in persona_indicators.items():
            persona_count = sum(
                len(re.findall(rf'\b{re.escape(indicator)}\b', response, re.IGNORECASE))
                for indicator in indicators
            )
            found_personas[persona] = persona_count
        
        # Calculate score based on persona coverage
        personas_covered = sum(1 for count in found_personas.values() if count > 0)
        coverage_score = personas_covered / len(rule.required_elements)
        
        return {
            "score": coverage_score,
            "found_personas": found_personas,
            "personas_covered": personas_covered,
            "violations": [
                f"Missing {persona} guidance" 
                for persona, count in found_personas.items() if count == 0
            ],
            "recommendations": [
                "Include guidance for all three BOS personas",
                "Differentiate responsibilities by persona"
            ] if coverage_score < rule.pass_threshold else []
        }
    
    def validate_session_management(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate session management capabilities."""
        
        command_count = 0
        found_commands = {}
        
        for command in rule.required_elements:
            pattern = rf'\{re.escape(command)}\b'
            matches = re.findall(pattern, response, re.IGNORECASE)
            found_commands[command] = len(matches)
            if len(matches) > 0:
                command_count += 1
        
        coverage_score = command_count / len(rule.required_elements)
        
        return {
            "score": coverage_score,
            "found_commands": found_commands,
            "commands_covered": command_count,
            "violations": [
                f"Missing command: {cmd}" 
                for cmd, count in found_commands.items() if count == 0
            ],
            "recommendations": [
                "Include session management commands",
                "Define state tracking capabilities"
            ] if coverage_score < rule.pass_threshold else []
        }
    
    def validate_measurable_expectations(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate emphasis on measurable expectations."""
        
        measurable_patterns = [
            r'\d+(?:\.\d+)?\s*%',
            r'\d+(?:\.\d+)?\s*(second|minute|hour|day)s?',
            r'\$\d+(?:,\d{3})*(?:\.\d{2})?',
            r'\b(measurable|quantifiable|specific|exact)\b'
        ]
        
        measurable_count = sum(
            len(re.findall(pattern, response, re.IGNORECASE))
            for pattern in measurable_patterns
        )
        
        # Normalize by response length
        word_count = len(response.split())
        if word_count == 0:
            return {"score": 0.0, "measurable_count": 0}
        
        measurable_ratio = measurable_count / (word_count / 50)  # Per 50 words
        score = min(measurable_ratio, 1.0)
        
        return {
            "score": score,
            "measurable_count": measurable_count,
            "measurable_ratio": measurable_ratio,
            "violations": ["Insufficient measurable expectations"] if score < rule.pass_threshold else [],
            "recommendations": [
                "Add more quantified metrics and timeframes",
                "Emphasize specific, measurable outcomes"
            ] if score < rule.pass_threshold else []
        }
    
    def validate_playbook_structure(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate Business Impact Playbook structure."""
        
        found_elements = {}
        for element in rule.required_elements:
            pattern = rf'\b{re.escape(element)}\b'
            matches = re.findall(pattern, response, re.IGNORECASE)
            found_elements[element] = len(matches)
        
        elements_found = sum(1 for count in found_elements.values() if count > 0)
        coverage_score = elements_found / len(rule.required_elements)
        
        return {
            "score": coverage_score,
            "found_elements": found_elements,
            "elements_found": elements_found,
            "violations": [
                f"Missing playbook element: {element}" 
                for element, count in found_elements.items() if count == 0
            ],
            "recommendations": [
                "Define complete Business Impact Playbook structure",
                "Include all required playbook sections"
            ] if coverage_score < rule.pass_threshold else []
        }
    
    def validate_dashboard_requirements(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate dashboard requirements specification."""
        
        found_elements = {}
        for element in rule.required_elements:
            pattern = rf'\b{re.escape(element)}\b'
            matches = re.findall(pattern, response, re.IGNORECASE)
            found_elements[element] = len(matches)
        
        elements_found = sum(1 for count in found_elements.values() if count > 0)
        coverage_score = elements_found / len(rule.required_elements)
        
        return {
            "score": coverage_score,
            "found_elements": found_elements,
            "elements_found": elements_found,
            "violations": [
                f"Missing dashboard element: {element}" 
                for element, count in found_elements.items() if count == 0
            ],
            "recommendations": [
                "Include technical dashboard specifications",
                "Define widget and visualization requirements"
            ] if coverage_score < rule.pass_threshold else []
        }
    
    def validate_quality_gates(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate quality assessment capabilities."""
        
        found_elements = {}
        for element in rule.required_elements:
            pattern = rf'\b{re.escape(element)}\b'
            matches = re.findall(pattern, response, re.IGNORECASE)
            found_elements[element] = len(matches)
        
        elements_found = sum(1 for count in found_elements.values() if count > 0)
        coverage_score = elements_found / len(rule.required_elements)
        
        return {
            "score": coverage_score,
            "found_elements": found_elements,
            "elements_found": elements_found,
            "violations": [],
            "recommendations": [
                "Include validation and quality assessment features",
                "Define quality gates and scoring"
            ] if coverage_score < rule.pass_threshold else []
        }
    
    def validate_collaborative_support(self, response: str, rule: ComplianceRule, context: Optional[Dict]) -> Dict[str, Any]:
        """Validate collaborative workflow support."""
        
        found_elements = {}
        for element in rule.required_elements:
            pattern = rf'\b{re.escape(element)}\b'
            matches = re.findall(pattern, response, re.IGNORECASE)
            found_elements[element] = len(matches)
        
        elements_found = sum(1 for count in found_elements.values() if count > 0)
        coverage_score = elements_found / len(rule.required_elements)
        
        return {
            "score": coverage_score,
            "found_elements": found_elements,
            "elements_found": elements_found,
            "violations": [],
            "recommendations": [
                "Include multi-persona collaboration features",
                "Define handoff and team coordination"
            ] if coverage_score < rule.pass_threshold else []
        }
    
    def _determine_compliance_grade(self, weighted_score: float, critical_failures: int) -> str:
        """Determine compliance grade based on score and critical failures."""
        if critical_failures > 0:
            return "NON-COMPLIANT"
        elif weighted_score >= 0.95:
            return "EXCELLENT"
        elif weighted_score >= 0.90:
            return "VERY_GOOD"
        elif weighted_score >= 0.85:
            return "GOOD"
        elif weighted_score >= 0.80:
            return "ACCEPTABLE"
        elif weighted_score >= 0.70:
            return "NEEDS_IMPROVEMENT"
        else:
            return "POOR"
    
    def _generate_category_summary(self, results: List[ComplianceResult]) -> Dict[str, Dict[str, Any]]:
        """Generate summary by compliance category."""
        categories = {
            ComplianceLevel.CRITICAL: {"total": 0, "passed": 0, "failed": 0},
            ComplianceLevel.IMPORTANT: {"total": 0, "passed": 0, "failed": 0},
            ComplianceLevel.RECOMMENDED: {"total": 0, "passed": 0, "failed": 0}
        }
        
        for result in results:
            rule = next(r for r in self.compliance_rules if r.rule_id == result.rule_id)
            level = rule.compliance_level
            
            categories[level]["total"] += 1
            if result.status == ComplianceStatus.PASS:
                categories[level]["passed"] += 1
            elif result.status == ComplianceStatus.FAIL:
                categories[level]["failed"] += 1
        
        # Convert to serializable format
        return {
            "critical": categories[ComplianceLevel.CRITICAL],
            "important": categories[ComplianceLevel.IMPORTANT],
            "recommended": categories[ComplianceLevel.RECOMMENDED]
        }


# Example usage
def main():
    """Example usage of BOS compliance tester."""
    
    tester = BOSComplianceTester()
    
    # Sample BOS prompt response to test
    sample_response = """
    You are a Business Observability System (BOS) methodology facilitator. Your role is to guide users through the 7-step BOS methodology:

    1. WHO depends - Stakeholder identification using People, Business Entities, and Vendors framework
    2. WHAT they expect - Dependency mapping with measurable expectations  
    3. WHAT breaks - Impact analysis covering Financial, Legal, Operational, Customer Experience
    4. WHAT telemetry - Observable unit mapping and telemetry source identification
    5. WHAT signals - Business signals, process signals, and system signals definition
    6. PLAYBOOK generation - Business Impact Playbook with Executive Summary, Stakeholder Impact Matrix
    7. DASHBOARD requirements - Technical dashboard specifications for Platform SRE

    Available commands: /start, /persona, /step, /validate, /status
    
    Personas supported: Product Owner, Developer, Platform SRE with specific guidance for each role.
    """
    
    # Run compliance test
    report = tester.validate_bos_compliance(sample_response)
    
    # Print results
    print("🔍 BOS Methodology Compliance Test Results:")
    print(f"Overall Compliance: {report.overall_compliance:.1%}")
    print(f"Compliance Grade: {report.compliance_grade}")
    print(f"Implementation Ready: {report.implementation_readiness}")
    print(f"Critical Failures: {report.critical_failures}")
    print(f"Rules Passed: {report.rules_passed}/{report.total_rules_tested}")
    
    if report.required_fixes:
        print(f"\n⚠️  Required Fixes: {report.required_fixes}")
    
    if report.recommended_improvements:
        print(f"\n💡 Recommendations: {report.recommended_improvements}")
    
    # Save detailed report
    with open("bos_compliance_report.json", "w") as f:
        json.dump(asdict(report), f, indent=2, default=str)
    
    print("\n📁 Detailed report saved to bos_compliance_report.json")


if __name__ == "__main__":
    main()