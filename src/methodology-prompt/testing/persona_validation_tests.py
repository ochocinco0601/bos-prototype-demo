#!/usr/bin/env python3
"""
BOS Methodology - Persona-Specific Validation Tests

Comprehensive automated testing system focused on validating persona-specific 
behavior, guidance appropriateness, and role-based workflow compliance.
"""

import json
import re
import time
from typing import Dict, List, Any, Tuple, Optional
from dataclasses import dataclass, asdict
from enum import Enum


class PersonaType(Enum):
    PRODUCT_OWNER = "product_owner"
    DEVELOPER = "developer"
    PLATFORM_SRE = "platform_sre"


class ValidationCategory(Enum):
    LANGUAGE_APPROPRIATENESS = "language_appropriateness"
    ROLE_RESPONSIBILITIES = "role_responsibilities" 
    EXPERTISE_LEVEL = "expertise_level"
    WORKFLOW_GUIDANCE = "workflow_guidance"
    COLLABORATION_HANDOFFS = "collaboration_handoffs"


@dataclass
class PersonaValidationRule:
    """Persona-specific validation rule definition."""
    rule_id: str
    persona: PersonaType
    category: ValidationCategory
    description: str
    validation_criteria: Dict[str, Any]
    pass_threshold: float
    weight: float


@dataclass
class PersonaTestResult:
    """Result of persona-specific validation test."""
    persona: PersonaType
    category: ValidationCategory
    overall_score: float
    detailed_scores: Dict[str, float]
    validation_details: Dict[str, Any]
    strengths: List[str]
    improvement_areas: List[str]
    persona_alignment_grade: str


@dataclass
class PersonaValidationReport:
    """Comprehensive persona validation report."""
    test_summary: Dict[str, Any]
    persona_results: Dict[PersonaType, Dict[ValidationCategory, PersonaTestResult]]
    cross_persona_analysis: Dict[str, Any]
    collaboration_readiness: Dict[str, Any]
    overall_persona_compliance: float
    recommendations_by_persona: Dict[PersonaType, List[str]]


class PersonaValidationTester:
    """Advanced persona-specific validation testing system."""
    
    def __init__(self):
        self.validation_rules = self._initialize_validation_rules()
        self.persona_vocabularies = self._initialize_persona_vocabularies()
        self.role_responsibilities = self._initialize_role_responsibilities()
        self.workflow_patterns = self._initialize_workflow_patterns()
        self.collaboration_patterns = self._initialize_collaboration_patterns()
    
    def _initialize_validation_rules(self) -> List[PersonaValidationRule]:
        """Initialize comprehensive persona validation rules."""
        return [
            # PRODUCT OWNER VALIDATION RULES
            PersonaValidationRule(
                rule_id="PO-001",
                persona=PersonaType.PRODUCT_OWNER,
                category=ValidationCategory.LANGUAGE_APPROPRIATENESS,
                description="Product Owner should use business-focused language",
                validation_criteria={
                    "required_terms": ["business", "stakeholder", "value", "outcome", "requirement"],
                    "discouraged_terms": ["API", "database", "server", "code", "implementation"],
                    "business_focus_ratio": 0.8
                },
                pass_threshold=0.8,
                weight=0.25
            ),
            
            PersonaValidationRule(
                rule_id="PO-002", 
                persona=PersonaType.PRODUCT_OWNER,
                category=ValidationCategory.ROLE_RESPONSIBILITIES,
                description="Product Owner should focus on stakeholder identification and business impact",
                validation_criteria={
                    "primary_focus": ["stakeholder identification", "business impact", "requirements"],
                    "secondary_focus": ["process definition", "outcome measurement"],
                    "responsibility_coverage": 0.7
                },
                pass_threshold=0.7,
                weight=0.30
            ),
            
            PersonaValidationRule(
                rule_id="PO-003",
                persona=PersonaType.PRODUCT_OWNER,
                category=ValidationCategory.EXPERTISE_LEVEL,
                description="Product Owner guidance should match business expertise level",
                validation_criteria={
                    "complexity_level": "business_focused",
                    "technical_depth": "minimal",
                    "business_depth": "comprehensive"
                },
                pass_threshold=0.75,
                weight=0.20
            ),
            
            PersonaValidationRule(
                rule_id="PO-004",
                persona=PersonaType.PRODUCT_OWNER,
                category=ValidationCategory.WORKFLOW_GUIDANCE,
                description="Product Owner should receive step 1-3 focused guidance",
                validation_criteria={
                    "primary_steps": ["Step 1", "Step 2", "Step 3"],
                    "step_emphasis": ["WHO depends", "WHAT they expect", "WHAT breaks"],
                    "workflow_appropriateness": 0.8
                },
                pass_threshold=0.8,
                weight=0.15
            ),
            
            PersonaValidationRule(
                rule_id="PO-005",
                persona=PersonaType.PRODUCT_OWNER,
                category=ValidationCategory.COLLABORATION_HANDOFFS,
                description="Product Owner should support handoff to Developer after Step 3",
                validation_criteria={
                    "handoff_points": ["Step 3 to Step 4", "business to technical"],
                    "collaboration_support": True,
                    "handoff_clarity": 0.7
                },
                pass_threshold=0.7,
                weight=0.10
            ),
            
            # DEVELOPER VALIDATION RULES
            PersonaValidationRule(
                rule_id="DEV-001",
                persona=PersonaType.DEVELOPER,
                category=ValidationCategory.LANGUAGE_APPROPRIATENESS,
                description="Developer should use technical implementation language",
                validation_criteria={
                    "required_terms": ["API", "service", "observable unit", "telemetry", "instrumentation"],
                    "discouraged_terms": ["ROI", "business case", "strategy", "market"],
                    "technical_focus_ratio": 0.8
                },
                pass_threshold=0.8,
                weight=0.25
            ),
            
            PersonaValidationRule(
                rule_id="DEV-002",
                persona=PersonaType.DEVELOPER,
                category=ValidationCategory.ROLE_RESPONSIBILITIES,
                description="Developer should focus on observable units and technical telemetry",
                validation_criteria={
                    "primary_focus": ["observable units", "telemetry mapping", "process signals"],
                    "secondary_focus": ["technical implementation", "instrumentation"],
                    "responsibility_coverage": 0.8
                },
                pass_threshold=0.8,
                weight=0.30
            ),
            
            PersonaValidationRule(
                rule_id="DEV-003",
                persona=PersonaType.DEVELOPER,
                category=ValidationCategory.EXPERTISE_LEVEL,
                description="Developer guidance should match technical implementation expertise",
                validation_criteria={
                    "complexity_level": "technical_implementation",
                    "technical_depth": "comprehensive",
                    "business_depth": "contextual"
                },
                pass_threshold=0.8,
                weight=0.20
            ),
            
            PersonaValidationRule(
                rule_id="DEV-004",
                persona=PersonaType.DEVELOPER,
                category=ValidationCategory.WORKFLOW_GUIDANCE,
                description="Developer should receive step 4-5 focused guidance",
                validation_criteria={
                    "primary_steps": ["Step 4", "Step 5"],
                    "step_emphasis": ["WHAT telemetry", "WHAT signals"],
                    "workflow_appropriateness": 0.8
                },
                pass_threshold=0.8,
                weight=0.15
            ),
            
            PersonaValidationRule(
                rule_id="DEV-005",
                persona=PersonaType.DEVELOPER,
                category=ValidationCategory.COLLABORATION_HANDOFFS,
                description="Developer should support handoff from Product Owner and to Platform SRE",
                validation_criteria={
                    "handoff_points": ["business to technical", "implementation to operations"],
                    "collaboration_support": True,
                    "handoff_clarity": 0.8
                },
                pass_threshold=0.8,
                weight=0.10
            ),
            
            # PLATFORM SRE VALIDATION RULES
            PersonaValidationRule(
                rule_id="SRE-001",
                persona=PersonaType.PLATFORM_SRE,
                category=ValidationCategory.LANGUAGE_APPROPRIATENESS,
                description="Platform SRE should use infrastructure and operational language",
                validation_criteria={
                    "required_terms": ["infrastructure", "monitoring", "dashboard", "system", "operational"],
                    "discouraged_terms": ["business strategy", "market analysis", "customer acquisition"],
                    "operational_focus_ratio": 0.8
                },
                pass_threshold=0.8,
                weight=0.25
            ),
            
            PersonaValidationRule(
                rule_id="SRE-002",
                persona=PersonaType.PLATFORM_SRE,
                category=ValidationCategory.ROLE_RESPONSIBILITIES,
                description="Platform SRE should focus on system signals and dashboard implementation",
                validation_criteria={
                    "primary_focus": ["system signals", "dashboard requirements", "infrastructure health"],
                    "secondary_focus": ["monitoring", "alerting", "operational procedures"],
                    "responsibility_coverage": 0.8
                },
                pass_threshold=0.8,
                weight=0.30
            ),
            
            PersonaValidationRule(
                rule_id="SRE-003",
                persona=PersonaType.PLATFORM_SRE,
                category=ValidationCategory.EXPERTISE_LEVEL,
                description="Platform SRE guidance should match infrastructure expertise level",
                validation_criteria={
                    "complexity_level": "infrastructure_operations",
                    "technical_depth": "comprehensive",
                    "operational_depth": "comprehensive"
                },
                pass_threshold=0.8,
                weight=0.20
            ),
            
            PersonaValidationRule(
                rule_id="SRE-004",
                persona=PersonaType.PLATFORM_SRE,
                category=ValidationCategory.WORKFLOW_GUIDANCE,
                description="Platform SRE should receive step 5-7 focused guidance",
                validation_criteria={
                    "primary_steps": ["Step 5", "Step 6", "Step 7"],
                    "step_emphasis": ["WHAT signals", "DASHBOARD requirements"],
                    "workflow_appropriateness": 0.8
                },
                pass_threshold=0.8,
                weight=0.15
            ),
            
            PersonaValidationRule(
                rule_id="SRE-005",
                persona=PersonaType.PLATFORM_SRE,
                category=ValidationCategory.COLLABORATION_HANDOFFS,
                description="Platform SRE should support handoff from Developer and final implementation",
                validation_criteria={
                    "handoff_points": ["technical to operational", "implementation to deployment"],
                    "collaboration_support": True,
                    "handoff_clarity": 0.8
                },
                pass_threshold=0.8,
                weight=0.10
            )
        ]
    
    def _initialize_persona_vocabularies(self) -> Dict[PersonaType, Dict[str, List[str]]]:
        """Initialize detailed persona vocabulary sets."""
        return {
            PersonaType.PRODUCT_OWNER: {
                "highly_appropriate": [
                    "business", "stakeholder", "requirement", "outcome", "value", "customer",
                    "user", "process", "workflow", "impact", "ROI", "KPI", "metric", "goal",
                    "objective", "success", "deliverable", "expectation", "satisfaction"
                ],
                "moderately_appropriate": [
                    "system", "service", "application", "data", "report", "dashboard",
                    "integration", "interface", "platform", "solution", "feature"
                ],
                "inappropriate": [
                    "API", "database", "server", "code", "implementation", "deployment",
                    "infrastructure", "docker", "kubernetes", "microservice", "endpoint"
                ],
                "business_indicators": [
                    "revenue", "cost", "profit", "budget", "financial", "compliance",
                    "regulatory", "legal", "operational efficiency", "customer experience"
                ]
            },
            
            PersonaType.DEVELOPER: {
                "highly_appropriate": [
                    "API", "service", "endpoint", "database", "system", "code", "implementation",
                    "integration", "observable unit", "telemetry", "instrumentation", "metrics",
                    "logs", "traces", "monitoring", "signal", "measurement", "data source"
                ],
                "moderately_appropriate": [
                    "business", "user", "customer", "process", "requirement", "outcome",
                    "stakeholder", "impact", "value", "workflow", "procedure"
                ],
                "inappropriate": [
                    "ROI", "business case", "strategy", "market", "competitive advantage",
                    "revenue model", "customer acquisition", "business development"
                ],
                "technical_indicators": [
                    "response time", "latency", "throughput", "error rate", "availability",
                    "performance", "scalability", "reliability", "instrumentation"
                ]
            },
            
            PersonaType.PLATFORM_SRE: {
                "highly_appropriate": [
                    "infrastructure", "platform", "monitoring", "alerting", "dashboard", "system",
                    "health", "performance", "reliability", "availability", "SLA", "SLO",
                    "uptime", "latency", "throughput", "capacity", "scaling", "operational"
                ],
                "moderately_appropriate": [
                    "service", "API", "database", "metrics", "logs", "traces", "deployment",
                    "application", "business", "user", "requirement", "process"
                ],
                "inappropriate": [
                    "business strategy", "market analysis", "customer acquisition", "revenue optimization",
                    "competitive advantage", "business development", "sales strategy"
                ],
                "operational_indicators": [
                    "incident", "alert", "threshold", "baseline", "trend", "anomaly",
                    "recovery", "failover", "redundancy", "monitoring", "observability"
                ]
            }
        }
    
    def _initialize_role_responsibilities(self) -> Dict[PersonaType, Dict[str, Any]]:
        """Initialize role-specific responsibility definitions."""
        return {
            PersonaType.PRODUCT_OWNER: {
                "primary_responsibilities": [
                    "stakeholder identification and analysis",
                    "business impact assessment",
                    "requirement definition and validation",
                    "business outcome measurement",
                    "stakeholder expectation management"
                ],
                "bos_focus_areas": [
                    "Step 1: WHO depends", "Step 2: WHAT they expect", "Step 3: WHAT breaks"
                ],
                "collaboration_points": [
                    "define business context for developers",
                    "validate business value of technical solutions",
                    "provide business input for operational decisions"
                ]
            },
            
            PersonaType.DEVELOPER: {
                "primary_responsibilities": [
                    "observable unit identification and mapping",
                    "telemetry source implementation",
                    "process signal definition",
                    "technical instrumentation design",
                    "system integration planning"
                ],
                "bos_focus_areas": [
                    "Step 4: WHAT telemetry", "Step 5: WHAT signals (process signals)"
                ],
                "collaboration_points": [
                    "translate business requirements to technical implementation",
                    "provide technical feasibility input",
                    "define technical specifications for operations team"
                ]
            },
            
            PersonaType.PLATFORM_SRE: {
                "primary_responsibilities": [
                    "system signal definition and monitoring",
                    "dashboard design and implementation", 
                    "infrastructure health monitoring",
                    "operational procedure definition",
                    "performance and reliability assurance"
                ],
                "bos_focus_areas": [
                    "Step 5: WHAT signals (system signals)", "Step 7: DASHBOARD requirements"
                ],
                "collaboration_points": [
                    "implement technical specifications from developers",
                    "provide operational constraints and requirements",
                    "ensure business objectives are operationally achievable"
                ]
            }
        }
    
    def _initialize_workflow_patterns(self) -> Dict[PersonaType, Dict[str, Any]]:
        """Initialize persona-specific workflow patterns."""
        return {
            PersonaType.PRODUCT_OWNER: {
                "workflow_sequence": ["stakeholder_identification", "dependency_mapping", "impact_analysis"],
                "guidance_patterns": [
                    "business context first", "stakeholder-centric approach", "measurable outcomes focus"
                ],
                "progression_indicators": [
                    "complete stakeholder categories", "define measurable expectations", 
                    "quantify business impacts"
                ]
            },
            
            PersonaType.DEVELOPER: {
                "workflow_sequence": ["observable_unit_mapping", "telemetry_implementation", "process_signal_definition"],
                "guidance_patterns": [
                    "technical implementation focus", "measurable system behavior", "instrumentation design"
                ],
                "progression_indicators": [
                    "map technical components", "identify telemetry sources", 
                    "define process measurements"
                ]
            },
            
            PersonaType.PLATFORM_SRE: {
                "workflow_sequence": ["system_signal_definition", "dashboard_design", "operational_procedures"],
                "guidance_patterns": [
                    "operational reliability focus", "system health monitoring", "infrastructure perspective"
                ],
                "progression_indicators": [
                    "define system signals", "design monitoring dashboards", 
                    "establish operational procedures"
                ]
            }
        }
    
    def _initialize_collaboration_patterns(self) -> Dict[str, Any]:
        """Initialize cross-persona collaboration patterns."""
        return {
            "handoff_sequences": [
                {"from": "product_owner", "to": "developer", "trigger": "business context complete"},
                {"from": "developer", "to": "platform_sre", "trigger": "technical implementation defined"},
                {"from": "platform_sre", "to": "all", "trigger": "operational implementation ready"}
            ],
            "collaboration_indicators": [
                "handoff", "transition", "coordinate", "collaborate", "validate",
                "cross-persona", "team", "together", "shared", "consensus"
            ],
            "validation_points": [
                "business-technical alignment", "technical-operational feasibility",
                "end-to-end workflow completeness"
            ]
        }
    
    def validate_persona_specific_behavior(self, response: str, persona: PersonaType, 
                                         context: Optional[Dict] = None) -> PersonaTestResult:
        """Execute comprehensive persona-specific validation."""
        
        # Get rules for this persona
        persona_rules = [rule for rule in self.validation_rules if rule.persona == persona]
        
        category_results = {}
        detailed_scores = {}
        validation_details = {}
        
        # Execute validation for each category
        for category in ValidationCategory:
            category_rules = [rule for rule in persona_rules if rule.category == category]
            if not category_rules:
                continue
                
            category_score, category_details = self._validate_persona_category(
                response, persona, category, category_rules, context
            )
            
            category_results[category] = category_score
            detailed_scores[category.value] = category_score
            validation_details[category.value] = category_details
        
        # Calculate overall persona score
        if category_results:
            overall_score = sum(category_results.values()) / len(category_results)
        else:
            overall_score = 0.0
        
        # Determine persona alignment grade
        alignment_grade = self._determine_persona_grade(overall_score)
        
        # Identify strengths and improvement areas
        strengths = self._identify_persona_strengths(category_results, persona)
        improvement_areas = self._identify_persona_improvements(category_results, persona)
        
        return PersonaTestResult(
            persona=persona,
            category=list(category_results.keys())[0] if category_results else ValidationCategory.LANGUAGE_APPROPRIATENESS,
            overall_score=overall_score,
            detailed_scores=detailed_scores,
            validation_details=validation_details,
            strengths=strengths,
            improvement_areas=improvement_areas,
            persona_alignment_grade=alignment_grade
        )
    
    def _validate_persona_category(self, response: str, persona: PersonaType, 
                                 category: ValidationCategory, rules: List[PersonaValidationRule],
                                 context: Optional[Dict]) -> Tuple[float, Dict[str, Any]]:
        """Validate a specific persona category."""
        
        if category == ValidationCategory.LANGUAGE_APPROPRIATENESS:
            return self._validate_language_appropriateness(response, persona, rules)
        elif category == ValidationCategory.ROLE_RESPONSIBILITIES:
            return self._validate_role_responsibilities(response, persona, rules)
        elif category == ValidationCategory.EXPERTISE_LEVEL:
            return self._validate_expertise_level(response, persona, rules)
        elif category == ValidationCategory.WORKFLOW_GUIDANCE:
            return self._validate_workflow_guidance(response, persona, rules)
        elif category == ValidationCategory.COLLABORATION_HANDOFFS:
            return self._validate_collaboration_handoffs(response, persona, rules)
        else:
            return 0.0, {"error": f"Unknown category: {category}"}
    
    def _validate_language_appropriateness(self, response: str, persona: PersonaType, 
                                         rules: List[PersonaValidationRule]) -> Tuple[float, Dict[str, Any]]:
        """Validate persona-appropriate language usage."""
        
        vocab = self.persona_vocabularies[persona]
        word_count = len(response.split())
        
        if word_count == 0:
            return 0.0, {"error": "Empty response"}
        
        # Count highly appropriate terms
        highly_appropriate_count = sum(
            len(re.findall(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
            for term in vocab["highly_appropriate"]
        )
        
        # Count moderately appropriate terms
        moderately_appropriate_count = sum(
            len(re.findall(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
            for term in vocab["moderately_appropriate"]
        )
        
        # Count inappropriate terms (penalty)
        inappropriate_count = sum(
            len(re.findall(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
            for term in vocab["inappropriate"]
        )
        
        # Count persona-specific indicators
        indicator_key = {
            PersonaType.PRODUCT_OWNER: "business_indicators",
            PersonaType.DEVELOPER: "technical_indicators", 
            PersonaType.PLATFORM_SRE: "operational_indicators"
        }[persona]
        
        indicator_count = sum(
            len(re.findall(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
            for term in vocab[indicator_key]
        )
        
        # Calculate language appropriateness score
        appropriate_score = (highly_appropriate_count * 1.0 + moderately_appropriate_count * 0.5) / (word_count / 20)
        inappropriate_penalty = inappropriate_count * 0.1
        indicator_bonus = indicator_count * 0.05
        
        language_score = max(min(appropriate_score - inappropriate_penalty + indicator_bonus, 1.0), 0.0)
        
        return language_score, {
            "highly_appropriate_count": highly_appropriate_count,
            "moderately_appropriate_count": moderately_appropriate_count,
            "inappropriate_count": inappropriate_count,
            "indicator_count": indicator_count,
            "language_score": language_score
        }
    
    def _validate_role_responsibilities(self, response: str, persona: PersonaType, 
                                      rules: List[PersonaValidationRule]) -> Tuple[float, Dict[str, Any]]:
        """Validate focus on persona-specific responsibilities."""
        
        responsibilities = self.role_responsibilities[persona]
        
        # Count mentions of primary responsibilities
        primary_score = 0.0
        primary_mentions = {}
        
        for responsibility in responsibilities["primary_responsibilities"]:
            # Create flexible patterns for responsibility matching
            responsibility_words = responsibility.replace(" and ", " ").split()
            pattern_score = 0.0
            
            for word in responsibility_words:
                if len(word) > 3:  # Skip short words
                    mentions = len(re.findall(rf'\b{re.escape(word)}\b', response, re.IGNORECASE))
                    pattern_score += mentions
            
            primary_mentions[responsibility] = pattern_score
            if pattern_score > 0:
                primary_score += 1
        
        primary_coverage = primary_score / len(responsibilities["primary_responsibilities"])
        
        # Count mentions of BOS focus areas
        focus_score = 0.0
        focus_mentions = {}
        
        for focus_area in responsibilities["bos_focus_areas"]:
            mentions = len(re.findall(rf'{re.escape(focus_area)}', response, re.IGNORECASE))
            focus_mentions[focus_area] = mentions
            if mentions > 0:
                focus_score += 1
        
        focus_coverage = focus_score / len(responsibilities["bos_focus_areas"])
        
        # Overall responsibility score
        responsibility_score = (primary_coverage * 0.7) + (focus_coverage * 0.3)
        
        return responsibility_score, {
            "primary_coverage": primary_coverage,
            "focus_coverage": focus_coverage,
            "primary_mentions": primary_mentions,
            "focus_mentions": focus_mentions,
            "responsibility_score": responsibility_score
        }
    
    def _validate_expertise_level(self, response: str, persona: PersonaType, 
                                rules: List[PersonaValidationRule]) -> Tuple[float, Dict[str, Any]]:
        """Validate expertise level appropriateness."""
        
        # Define complexity indicators for each persona
        complexity_indicators = {
            PersonaType.PRODUCT_OWNER: {
                "appropriate_complexity": [
                    "stakeholder", "business process", "outcome", "requirement", "impact"
                ],
                "too_technical": [
                    "algorithm", "architecture", "database schema", "API design", "code structure"
                ],
                "too_simple": []
            },
            PersonaType.DEVELOPER: {
                "appropriate_complexity": [
                    "observable unit", "instrumentation", "telemetry", "API", "system integration"
                ],
                "too_technical": [
                    "assembly language", "kernel", "low-level optimization", "hardware"
                ],
                "too_simple": [
                    "click button", "simple form", "basic user interface"
                ]
            },
            PersonaType.PLATFORM_SRE: {
                "appropriate_complexity": [
                    "infrastructure", "monitoring", "alerting", "dashboard", "operational procedure"
                ],
                "too_technical": [
                    "business strategy", "market analysis", "user psychology"
                ],
                "too_simple": [
                    "turn on computer", "basic login", "simple restart"
                ]
            }
        }
        
        indicators = complexity_indicators[persona]
        
        # Count appropriate complexity terms
        appropriate_count = sum(
            len(re.findall(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
            for term in indicators["appropriate_complexity"]
        )
        
        # Count inappropriate complexity terms
        too_technical_count = sum(
            len(re.findall(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
            for term in indicators["too_technical"]
        )
        
        too_simple_count = sum(
            len(re.findall(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
            for term in indicators["too_simple"]
        )
        
        # Calculate expertise level score
        word_count = len(response.split())
        if word_count == 0:
            return 0.0, {"error": "Empty response"}
        
        appropriate_ratio = appropriate_count / (word_count / 30)  # Per 30 words
        penalty_ratio = (too_technical_count + too_simple_count) * 0.2
        
        expertise_score = max(min(appropriate_ratio - penalty_ratio, 1.0), 0.0)
        
        return expertise_score, {
            "appropriate_count": appropriate_count,
            "too_technical_count": too_technical_count,
            "too_simple_count": too_simple_count,
            "expertise_score": expertise_score
        }
    
    def _validate_workflow_guidance(self, response: str, persona: PersonaType, 
                                  rules: List[PersonaValidationRule]) -> Tuple[float, Dict[str, Any]]:
        """Validate persona-specific workflow guidance."""
        
        workflow = self.workflow_patterns[persona]
        
        # Count workflow sequence mentions
        sequence_score = 0.0
        sequence_mentions = {}
        
        for step in workflow["workflow_sequence"]:
            step_words = step.replace("_", " ").split()
            step_mentions = 0
            
            for word in step_words:
                if len(word) > 3:
                    step_mentions += len(re.findall(rf'\b{re.escape(word)}\b', response, re.IGNORECASE))
            
            sequence_mentions[step] = step_mentions
            if step_mentions > 0:
                sequence_score += 1
        
        sequence_coverage = sequence_score / len(workflow["workflow_sequence"])
        
        # Count guidance pattern mentions
        pattern_score = 0.0
        pattern_mentions = {}
        
        for pattern in workflow["guidance_patterns"]:
            pattern_words = pattern.replace("_", " ").split()
            pattern_count = 0
            
            for word in pattern_words:
                if len(word) > 3:
                    pattern_count += len(re.findall(rf'\b{re.escape(word)}\b', response, re.IGNORECASE))
            
            pattern_mentions[pattern] = pattern_count
            if pattern_count > 0:
                pattern_score += 1
        
        pattern_coverage = pattern_score / len(workflow["guidance_patterns"])
        
        # Overall workflow score
        workflow_score = (sequence_coverage * 0.6) + (pattern_coverage * 0.4)
        
        return workflow_score, {
            "sequence_coverage": sequence_coverage,
            "pattern_coverage": pattern_coverage,
            "sequence_mentions": sequence_mentions,
            "pattern_mentions": pattern_mentions,
            "workflow_score": workflow_score
        }
    
    def _validate_collaboration_handoffs(self, response: str, persona: PersonaType, 
                                       rules: List[PersonaValidationRule]) -> Tuple[float, Dict[str, Any]]:
        """Validate collaboration and handoff support."""
        
        collaboration_indicators = self.collaboration_patterns["collaboration_indicators"]
        
        # Count collaboration mentions
        collaboration_count = sum(
            len(re.findall(rf'\b{re.escape(indicator)}\b', response, re.IGNORECASE))
            for indicator in collaboration_indicators
        )
        
        # Count persona mentions (indicating multi-persona awareness)
        persona_mentions = {
            "product_owner": len(re.findall(r'\b(product owner|business SME)\b', response, re.IGNORECASE)),
            "developer": len(re.findall(r'\b(developer|development team)\b', response, re.IGNORECASE)),
            "platform_sre": len(re.findall(r'\b(platform SRE|SRE|operations)\b', response, re.IGNORECASE))
        }
        
        personas_mentioned = sum(1 for count in persona_mentions.values() if count > 0)
        
        # Calculate collaboration score
        word_count = len(response.split())
        if word_count == 0:
            return 0.0, {"error": "Empty response"}
        
        collaboration_ratio = collaboration_count / (word_count / 50)  # Per 50 words
        persona_awareness = personas_mentioned / 3.0  # All 3 personas
        
        collaboration_score = min((collaboration_ratio * 0.6) + (persona_awareness * 0.4), 1.0)
        
        return collaboration_score, {
            "collaboration_count": collaboration_count,
            "persona_mentions": persona_mentions,
            "personas_mentioned": personas_mentioned,
            "collaboration_score": collaboration_score
        }
    
    def _determine_persona_grade(self, overall_score: float) -> str:
        """Determine persona alignment grade."""
        if overall_score >= 0.95:
            return "EXCELLENT"
        elif overall_score >= 0.90:
            return "VERY_GOOD"
        elif overall_score >= 0.85:
            return "GOOD"
        elif overall_score >= 0.80:
            return "ACCEPTABLE"
        elif overall_score >= 0.70:
            return "NEEDS_IMPROVEMENT"
        else:
            return "POOR"
    
    def _identify_persona_strengths(self, category_results: Dict[ValidationCategory, float], 
                                  persona: PersonaType) -> List[str]:
        """Identify persona-specific strengths."""
        strengths = []
        
        for category, score in category_results.items():
            if score >= 0.85:
                if category == ValidationCategory.LANGUAGE_APPROPRIATENESS:
                    strengths.append(f"Excellent {persona.value} language appropriateness")
                elif category == ValidationCategory.ROLE_RESPONSIBILITIES:
                    strengths.append(f"Strong focus on {persona.value} responsibilities")
                elif category == ValidationCategory.EXPERTISE_LEVEL:
                    strengths.append(f"Appropriate expertise level for {persona.value}")
                elif category == ValidationCategory.WORKFLOW_GUIDANCE:
                    strengths.append(f"Effective {persona.value} workflow guidance")
                elif category == ValidationCategory.COLLABORATION_HANDOFFS:
                    strengths.append(f"Good collaboration support for {persona.value}")
        
        return strengths
    
    def _identify_persona_improvements(self, category_results: Dict[ValidationCategory, float], 
                                     persona: PersonaType) -> List[str]:
        """Identify persona-specific improvement areas."""
        improvements = []
        
        for category, score in category_results.items():
            if score < 0.7:
                if category == ValidationCategory.LANGUAGE_APPROPRIATENESS:
                    improvements.append(f"Improve {persona.value} language appropriateness")
                elif category == ValidationCategory.ROLE_RESPONSIBILITIES:
                    improvements.append(f"Better focus on {persona.value} responsibilities")
                elif category == ValidationCategory.EXPERTISE_LEVEL:
                    improvements.append(f"Adjust expertise level for {persona.value}")
                elif category == ValidationCategory.WORKFLOW_GUIDANCE:
                    improvements.append(f"Enhance {persona.value} workflow guidance")
                elif category == ValidationCategory.COLLABORATION_HANDOFFS:
                    improvements.append(f"Improve collaboration support for {persona.value}")
        
        return improvements
    
    def run_comprehensive_persona_validation(self, response: str, 
                                           context: Optional[Dict] = None) -> PersonaValidationReport:
        """Execute comprehensive persona validation across all personas."""
        
        start_time = time.time()
        
        # Test each persona
        persona_results = {}
        for persona in PersonaType:
            persona_result = self.validate_persona_specific_behavior(response, persona, context)
            
            # Organize by category
            if persona not in persona_results:
                persona_results[persona] = {}
            
            # For now, store the overall result under language appropriateness category
            # In a full implementation, you'd run separate tests for each category
            persona_results[persona][ValidationCategory.LANGUAGE_APPROPRIATENESS] = persona_result
        
        # Calculate overall persona compliance
        all_scores = [
            result.overall_score 
            for persona_dict in persona_results.values()
            for result in persona_dict.values()
        ]
        overall_compliance = sum(all_scores) / len(all_scores) if all_scores else 0.0
        
        # Generate cross-persona analysis
        cross_persona_analysis = self._analyze_cross_persona_consistency(persona_results)
        
        # Assess collaboration readiness
        collaboration_readiness = self._assess_collaboration_readiness(persona_results)
        
        # Generate recommendations by persona
        recommendations_by_persona = {}
        for persona, categories in persona_results.items():
            recommendations = []
            for category, result in categories.items():
                recommendations.extend(result.improvement_areas)
            recommendations_by_persona[persona] = recommendations
        
        execution_time = time.time() - start_time
        
        return PersonaValidationReport(
            test_summary={
                "execution_time": execution_time,
                "personas_tested": len(PersonaType),
                "categories_tested": len(ValidationCategory),
                "overall_compliance": overall_compliance
            },
            persona_results=persona_results,
            cross_persona_analysis=cross_persona_analysis,
            collaboration_readiness=collaboration_readiness,
            overall_persona_compliance=overall_compliance,
            recommendations_by_persona=recommendations_by_persona
        )
    
    def _analyze_cross_persona_consistency(self, persona_results: Dict) -> Dict[str, Any]:
        """Analyze consistency across personas."""
        consistency_metrics = {
            "language_consistency": 0.0,
            "workflow_alignment": 0.0,
            "collaboration_support": 0.0
        }
        
        # Calculate consistency metrics
        scores_by_category = {}
        for persona, categories in persona_results.items():
            for category, result in categories.items():
                if category not in scores_by_category:
                    scores_by_category[category] = []
                scores_by_category[category].append(result.overall_score)
        
        # Calculate variance (lower variance = higher consistency)
        for category, scores in scores_by_category.items():
            if len(scores) > 1:
                mean_score = sum(scores) / len(scores)
                variance = sum((score - mean_score) ** 2 for score in scores) / len(scores)
                consistency = max(0, 1 - variance)
                
                if "language" in category.value:
                    consistency_metrics["language_consistency"] = consistency
                elif "workflow" in category.value:
                    consistency_metrics["workflow_alignment"] = consistency
                elif "collaboration" in category.value:
                    consistency_metrics["collaboration_support"] = consistency
        
        return consistency_metrics
    
    def _assess_collaboration_readiness(self, persona_results: Dict) -> Dict[str, Any]:
        """Assess readiness for cross-persona collaboration."""
        
        collaboration_scores = []
        for persona, categories in persona_results.items():
            for category, result in categories.items():
                if ValidationCategory.COLLABORATION_HANDOFFS in result.detailed_scores:
                    collaboration_scores.append(result.detailed_scores[ValidationCategory.COLLABORATION_HANDOFFS.value])
        
        if collaboration_scores:
            avg_collaboration_score = sum(collaboration_scores) / len(collaboration_scores)
            collaboration_ready = avg_collaboration_score >= 0.8
        else:
            avg_collaboration_score = 0.0
            collaboration_ready = False
        
        return {
            "collaboration_ready": collaboration_ready,
            "average_collaboration_score": avg_collaboration_score,
            "readiness_level": "HIGH" if avg_collaboration_score >= 0.9 else 
                             "MEDIUM" if avg_collaboration_score >= 0.7 else "LOW"
        }


# Example usage
def main():
    """Example usage of persona validation tester."""
    
    tester = PersonaValidationTester()
    
    # Sample response to test
    sample_response = """
    ✅ Persona Set: Product Owner

    As a Product Owner, you'll focus on:
    - Business context and stakeholder identification  
    - Business impact analysis and dependencies
    - Business signals and KPI relationships
    - Stakeholder expectations and measurable outcomes

    Your methodology focus: Steps 1-3 (WHO/WHAT/BREAKS) with business lens

    Ready to begin Step 1: WHO depends on your process?

    Use business language to identify stakeholders in three categories:
    • People (roles, teams, individuals)
    • Business Entities (departments, partners, customers)  
    • Vendors (external services, providers)

    Let's start with ONE critical stakeholder. Who would be most impacted if this process failed?
    """
    
    # Run comprehensive persona validation
    report = tester.run_comprehensive_persona_validation(sample_response)
    
    # Print results
    print("🎭 Persona Validation Test Results:")
    print(f"Overall Persona Compliance: {report.overall_persona_compliance:.1%}")
    print(f"Collaboration Ready: {report.collaboration_readiness['collaboration_ready']}")
    
    for persona, categories in report.persona_results.items():
        print(f"\n👤 {persona.value.upper()}:")
        for category, result in categories.items():
            print(f"  {category.value}: {result.overall_score:.1%} ({result.persona_alignment_grade})")
            if result.strengths:
                print(f"  ✅ Strengths: {result.strengths}")
            if result.improvement_areas:
                print(f"  ⚠️  Improvements: {result.improvement_areas}")
    
    # Save detailed report
    with open("persona_validation_report.json", "w") as f:
        json.dump(asdict(report), f, indent=2, default=str)
    
    print("\n📁 Detailed report saved to persona_validation_report.json")


if __name__ == "__main__":
    main()