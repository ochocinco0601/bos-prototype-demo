#!/usr/bin/env python3
"""
BOS Methodology Prompt - Quality Scoring Engine

Advanced automated quality scoring algorithms for comprehensive assessment of 
BOS methodology prompt responses across multiple dimensions and quality criteria.
"""

import json
import re
import math
from typing import Dict, List, Any, Tuple, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import nltk
from textstat import flesch_reading_ease, flesch_kincaid_grade


class QualityDimension(Enum):
    COMPLETENESS = "completeness"
    SPECIFICITY = "specificity"
    MEASURABILITY = "measurability"
    ACTIONABILITY = "actionability"
    CONSISTENCY = "consistency"
    PERSONA_APPROPRIATENESS = "persona_appropriateness"
    METHODOLOGY_COMPLIANCE = "methodology_compliance"
    BUSINESS_VALUE = "business_value"


@dataclass
class QualityScore:
    """Comprehensive quality score with detailed breakdown."""
    overall_score: float
    dimension_scores: Dict[str, float]
    weighted_score: float
    confidence_level: float
    quality_grade: str
    detailed_analysis: Dict[str, Any]
    improvement_areas: List[str]
    strengths: List[str]


@dataclass
class ScoringWeights:
    """Configurable weights for different quality dimensions."""
    completeness: float = 0.20
    specificity: float = 0.15
    measurability: float = 0.15
    actionability: float = 0.15
    consistency: float = 0.10
    persona_appropriateness: float = 0.10
    methodology_compliance: float = 0.10
    business_value: float = 0.05


class QualityScoringEngine:
    """Advanced quality scoring engine for BOS methodology responses."""
    
    def __init__(self, scoring_weights: Optional[ScoringWeights] = None):
        self.weights = scoring_weights or ScoringWeights()
        self.bos_keywords = self._initialize_bos_keywords()
        self.quality_patterns = self._initialize_quality_patterns()
        self.persona_vocabularies = self._initialize_persona_vocabularies()
        
    def _initialize_bos_keywords(self) -> Dict[str, List[str]]:
        """Initialize BOS methodology-specific keywords."""
        return {
            "stakeholder_terms": [
                "stakeholder", "customer", "user", "team", "department", 
                "vendor", "supplier", "partner", "client", "end-user"
            ],
            "dependency_terms": [
                "depends", "requires", "needs", "expects", "relies", 
                "integration", "interface", "handoff", "upstream", "downstream"
            ],
            "impact_terms": [
                "impact", "effect", "consequence", "result", "outcome",
                "financial", "operational", "legal", "compliance", "customer experience"
            ],
            "telemetry_terms": [
                "telemetry", "metrics", "monitoring", "observability", "instrumentation",
                "logs", "traces", "events", "data", "measurement"
            ],
            "signal_terms": [
                "signal", "indicator", "threshold", "alert", "trigger",
                "business signal", "process signal", "system signal", "KPI"
            ],
            "methodology_terms": [
                "WHO depends", "WHAT they expect", "WHAT breaks", "WHAT telemetry",
                "WHAT signals", "playbook", "dashboard", "observable unit"
            ]
        }
    
    def _initialize_quality_patterns(self) -> Dict[str, List[str]]:
        """Initialize patterns for quality assessment."""
        return {
            "measurable_patterns": [
                r'\d+(?:\.\d+)?\s*%',  # Percentages
                r'\d+(?:\.\d+)?\s*(second|minute|hour|day|week|month)s?',  # Time units
                r'\$\d+(?:,\d{3})*(?:\.\d{2})?',  # Currency
                r'\d+(?:\.\d+)?\s*(ms|sec|min|hr|GB|MB|KB)',  # Technical units
                r'SLA|availability|uptime.*?\d+',  # SLA references
                r'\d+(?:\.\d+)?\s*(transaction|request|user)s?\s*per\s*(second|minute|hour)'  # Rate units
            ],
            "specific_patterns": [
                r'\b(exactly|precisely|specifically|particular)\b',
                r'\b(within|by|before|after)\s+\d+',
                r'\b(must|shall|will|required to)\b',
                r'\b(API|endpoint|service|database|table|queue|topic)\b'
            ],
            "actionable_patterns": [
                r'\b(identify|define|create|implement|monitor|track|measure)\b',
                r'\b(should|need to|must|will)\s+\w+',
                r'\b(step|action|task|requirement)s?\b',
                r'\b(next|then|following|proceed)\b'
            ],
            "vague_patterns": [
                r'\b(some|many|several|various|numerous|multiple|different)\b',
                r'\b(good|bad|better|worse|high|low|fast|slow)\b(?!\s+\d)',
                r'\b(appropriate|suitable|reasonable|adequate|sufficient)\b',
                r'\b(improve|enhance|optimize|better)\b(?!\s+\w+\s+by)'
            ]
        }
    
    def _initialize_persona_vocabularies(self) -> Dict[str, Dict[str, List[str]]]:
        """Initialize persona-specific vocabulary sets."""
        return {
            "product_owner": {
                "appropriate": [
                    "business", "stakeholder", "requirement", "outcome", "value",
                    "customer", "user", "process", "workflow", "impact", "ROI",
                    "KPI", "metric", "goal", "objective", "success", "deliverable"
                ],
                "technical_ok": [
                    "system", "service", "application", "data", "report",
                    "dashboard", "integration", "interface", "platform"
                ],
                "avoid": [
                    "API", "database", "server", "code", "implementation",
                    "deployment", "infrastructure", "docker", "kubernetes"
                ]
            },
            "developer": {
                "appropriate": [
                    "API", "service", "endpoint", "database", "system", "code",
                    "implementation", "integration", "observable unit", "telemetry",
                    "instrumentation", "metrics", "logs", "traces", "monitoring"
                ],
                "business_ok": [
                    "business", "user", "customer", "process", "requirement",
                    "outcome", "stakeholder", "impact", "value"
                ],
                "avoid": [
                    "ROI", "business case", "strategy", "market", "competitive",
                    "revenue model", "customer acquisition"
                ]
            },
            "platform_sre": {
                "appropriate": [
                    "infrastructure", "platform", "monitoring", "alerting", "dashboard",
                    "system", "health", "performance", "reliability", "availability",
                    "SLA", "SLO", "uptime", "latency", "throughput", "capacity"
                ],
                "technical_ok": [
                    "service", "API", "database", "metrics", "logs", "traces",
                    "deployment", "scaling", "load balancing", "failover"
                ],
                "avoid": [
                    "business strategy", "market analysis", "customer acquisition",
                    "revenue optimization", "competitive advantage"
                ]
            }
        }
    
    def calculate_quality_score(self, response: str, persona: str, 
                              scenario_context: Optional[Dict] = None) -> QualityScore:
        """Calculate comprehensive quality score for a response."""
        
        # Calculate dimension scores
        dimension_scores = {}
        detailed_analysis = {}
        
        # 1. Completeness Score
        completeness_result = self._calculate_completeness_score(response, scenario_context)
        dimension_scores[QualityDimension.COMPLETENESS.value] = completeness_result["score"]
        detailed_analysis["completeness"] = completeness_result
        
        # 2. Specificity Score
        specificity_result = self._calculate_specificity_score(response)
        dimension_scores[QualityDimension.SPECIFICITY.value] = specificity_result["score"]
        detailed_analysis["specificity"] = specificity_result
        
        # 3. Measurability Score
        measurability_result = self._calculate_measurability_score(response)
        dimension_scores[QualityDimension.MEASURABILITY.value] = measurability_result["score"]
        detailed_analysis["measurability"] = measurability_result
        
        # 4. Actionability Score
        actionability_result = self._calculate_actionability_score(response)
        dimension_scores[QualityDimension.ACTIONABILITY.value] = actionability_result["score"]
        detailed_analysis["actionability"] = actionability_result
        
        # 5. Consistency Score
        consistency_result = self._calculate_consistency_score(response)
        dimension_scores[QualityDimension.CONSISTENCY.value] = consistency_result["score"]
        detailed_analysis["consistency"] = consistency_result
        
        # 6. Persona Appropriateness Score
        persona_result = self._calculate_persona_appropriateness_score(response, persona)
        dimension_scores[QualityDimension.PERSONA_APPROPRIATENESS.value] = persona_result["score"]
        detailed_analysis["persona_appropriateness"] = persona_result
        
        # 7. Methodology Compliance Score
        methodology_result = self._calculate_methodology_compliance_score(response)
        dimension_scores[QualityDimension.METHODOLOGY_COMPLIANCE.value] = methodology_result["score"]
        detailed_analysis["methodology_compliance"] = methodology_result
        
        # 8. Business Value Score
        business_value_result = self._calculate_business_value_score(response, persona)
        dimension_scores[QualityDimension.BUSINESS_VALUE.value] = business_value_result["score"]
        detailed_analysis["business_value"] = business_value_result
        
        # Calculate overall and weighted scores
        overall_score = sum(dimension_scores.values()) / len(dimension_scores)
        
        weighted_score = sum(
            dimension_scores[dim.value] * getattr(self.weights, dim.value)
            for dim in QualityDimension
        )
        
        # Calculate confidence level
        confidence_level = self._calculate_confidence_level(dimension_scores, response)
        
        # Determine quality grade
        quality_grade = self._determine_quality_grade(weighted_score)
        
        # Identify improvement areas and strengths
        improvement_areas = self._identify_improvement_areas(dimension_scores)
        strengths = self._identify_strengths(dimension_scores)
        
        return QualityScore(
            overall_score=overall_score,
            dimension_scores=dimension_scores,
            weighted_score=weighted_score,
            confidence_level=confidence_level,
            quality_grade=quality_grade,
            detailed_analysis=detailed_analysis,
            improvement_areas=improvement_areas,
            strengths=strengths
        )
    
    def _calculate_completeness_score(self, response: str, context: Optional[Dict]) -> Dict[str, Any]:
        """Calculate completeness score based on BOS methodology coverage."""
        required_elements = {
            "stakeholder_identification": 0.25,
            "dependency_mapping": 0.20,
            "impact_analysis": 0.20,
            "telemetry_coverage": 0.15,
            "signal_definition": 0.20
        }
        
        element_scores = {}
        
        # Check stakeholder identification
        stakeholder_count = sum(
            len(re.findall(rf'\b{term}\b', response, re.IGNORECASE))
            for term in self.bos_keywords["stakeholder_terms"]
        )
        element_scores["stakeholder_identification"] = min(stakeholder_count / 3.0, 1.0)
        
        # Check dependency mapping
        dependency_count = sum(
            len(re.findall(rf'\b{term}\b', response, re.IGNORECASE))
            for term in self.bos_keywords["dependency_terms"]
        )
        element_scores["dependency_mapping"] = min(dependency_count / 2.0, 1.0)
        
        # Check impact analysis
        impact_count = sum(
            len(re.findall(rf'\b{term}\b', response, re.IGNORECASE))
            for term in self.bos_keywords["impact_terms"]
        )
        element_scores["impact_analysis"] = min(impact_count / 3.0, 1.0)
        
        # Check telemetry coverage
        telemetry_count = sum(
            len(re.findall(rf'\b{term}\b', response, re.IGNORECASE))
            for term in self.bos_keywords["telemetry_terms"]
        )
        element_scores["telemetry_coverage"] = min(telemetry_count / 2.0, 1.0)
        
        # Check signal definition
        signal_count = sum(
            len(re.findall(rf'\b{term}\b', response, re.IGNORECASE))
            for term in self.bos_keywords["signal_terms"]
        )
        element_scores["signal_definition"] = min(signal_count / 2.0, 1.0)
        
        # Calculate weighted completeness score
        completeness_score = sum(
            element_scores[element] * weight
            for element, weight in required_elements.items()
        )
        
        return {
            "score": completeness_score,
            "element_scores": element_scores,
            "missing_elements": [
                element for element, score in element_scores.items() 
                if score < 0.5
            ]
        }
    
    def _calculate_specificity_score(self, response: str) -> Dict[str, Any]:
        """Calculate specificity score based on concrete vs. vague language."""
        
        # Count specific indicators
        specific_count = 0
        for pattern in self.quality_patterns["specific_patterns"]:
            specific_count += len(re.findall(pattern, response, re.IGNORECASE))
        
        # Count vague indicators (penalty)
        vague_count = 0
        for pattern in self.quality_patterns["vague_patterns"]:
            vague_count += len(re.findall(pattern, response, re.IGNORECASE))
        
        # Calculate word count for normalization
        word_count = len(response.split())
        
        if word_count == 0:
            return {"score": 0.0, "specific_count": 0, "vague_count": 0}
        
        # Normalize counts
        specific_ratio = specific_count / (word_count / 100)  # Per 100 words
        vague_ratio = vague_count / (word_count / 100)  # Per 100 words
        
        # Calculate specificity score (specific terms boost, vague terms penalize)
        specificity_score = min(max(specific_ratio - vague_ratio * 0.5, 0), 1.0)
        
        return {
            "score": specificity_score,
            "specific_count": specific_count,
            "vague_count": vague_count,
            "specific_ratio": specific_ratio,
            "vague_ratio": vague_ratio
        }
    
    def _calculate_measurability_score(self, response: str) -> Dict[str, Any]:
        """Calculate measurability score based on quantified metrics."""
        
        measurable_count = 0
        measurable_types = {}
        
        for pattern in self.quality_patterns["measurable_patterns"]:
            matches = re.findall(pattern, response, re.IGNORECASE)
            measurable_count += len(matches)
            
            # Categorize measurable types
            if "%" in pattern:
                measurable_types["percentages"] = len(matches)
            elif "second|minute|hour" in pattern:
                measurable_types["time_units"] = len(matches)
            elif "\\$" in pattern:
                measurable_types["currency"] = len(matches)
            elif "ms|sec|min" in pattern:
                measurable_types["technical_units"] = len(matches)
        
        # Normalize by response length
        word_count = len(response.split())
        if word_count == 0:
            return {"score": 0.0, "measurable_count": 0}
        
        # Target: 1 measurable metric per 50 words
        target_ratio = word_count / 50
        measurability_score = min(measurable_count / max(target_ratio, 1), 1.0)
        
        return {
            "score": measurability_score,
            "measurable_count": measurable_count,
            "measurable_types": measurable_types,
            "target_ratio": target_ratio
        }
    
    def _calculate_actionability_score(self, response: str) -> Dict[str, Any]:
        """Calculate actionability score based on clear actions and instructions."""
        
        actionable_count = 0
        action_types = {}
        
        for pattern in self.quality_patterns["actionable_patterns"]:
            matches = re.findall(pattern, response, re.IGNORECASE)
            actionable_count += len(matches)
            
            if "identify|define|create" in pattern:
                action_types["creation_actions"] = len(matches)
            elif "should|need|must" in pattern:
                action_types["imperative_actions"] = len(matches)
            elif "step|action|task" in pattern:
                action_types["structured_actions"] = len(matches)
            elif "next|then|following" in pattern:
                action_types["sequential_actions"] = len(matches)
        
        # Check for questions that guide action
        question_count = len(re.findall(r'\?', response))
        
        # Normalize by sentence count
        sentence_count = len(re.findall(r'[.!?]', response))
        if sentence_count == 0:
            return {"score": 0.0, "actionable_count": 0}
        
        # Target: 1 actionable element per 2 sentences
        target_ratio = sentence_count / 2
        actionability_score = min((actionable_count + question_count) / max(target_ratio, 1), 1.0)
        
        return {
            "score": actionability_score,
            "actionable_count": actionable_count,
            "action_types": action_types,
            "question_count": question_count
        }
    
    def _calculate_consistency_score(self, response: str) -> Dict[str, Any]:
        """Calculate consistency score based on terminology and structure."""
        
        # Check for consistent terminology usage
        term_consistency = {}
        
        # Check BOS methodology term consistency
        for category, terms in self.bos_keywords.items():
            category_mentions = []
            for term in terms:
                mentions = len(re.findall(rf'\b{term}\b', response, re.IGNORECASE))
                if mentions > 0:
                    category_mentions.append(mentions)
            
            if category_mentions:
                # Consistency measured as standard deviation of term usage
                avg_mentions = sum(category_mentions) / len(category_mentions)
                variance = sum((x - avg_mentions) ** 2 for x in category_mentions) / len(category_mentions)
                std_dev = math.sqrt(variance)
                
                # Normalize consistency (lower std_dev = higher consistency)
                consistency = max(0, 1 - (std_dev / max(avg_mentions, 1)))
                term_consistency[category] = consistency
        
        # Overall consistency score
        if term_consistency:
            consistency_score = sum(term_consistency.values()) / len(term_consistency)
        else:
            consistency_score = 0.5  # Neutral score if no terms found
        
        return {
            "score": consistency_score,
            "term_consistency": term_consistency
        }
    
    def _calculate_persona_appropriateness_score(self, response: str, persona: str) -> Dict[str, Any]:
        """Calculate persona appropriateness score."""
        
        if persona not in self.persona_vocabularies:
            return {"score": 0.5, "message": "Unknown persona"}
        
        vocab = self.persona_vocabularies[persona]
        
        # Count appropriate terms
        appropriate_count = sum(
            len(re.findall(rf'\b{term}\b', response, re.IGNORECASE))
            for term in vocab["appropriate"]
        )
        
        # Count business/technical terms (context-dependent appropriateness)
        context_ok_count = sum(
            len(re.findall(rf'\b{term}\b', response, re.IGNORECASE))
            for term in vocab.get("business_ok", []) + vocab.get("technical_ok", [])
        )
        
        # Count inappropriate terms (penalty)
        inappropriate_count = sum(
            len(re.findall(rf'\b{term}\b', response, re.IGNORECASE))
            for term in vocab["avoid"]
        )
        
        # Calculate appropriateness score
        total_appropriate = appropriate_count + (context_ok_count * 0.5)
        total_words = len(response.split())
        
        if total_words == 0:
            return {"score": 0.0}
        
        # Normalize and apply penalty for inappropriate terms
        appropriateness_ratio = total_appropriate / (total_words / 10)  # Per 10 words
        inappropriateness_penalty = inappropriate_count * 0.1
        
        persona_score = max(min(appropriateness_ratio - inappropriateness_penalty, 1.0), 0.0)
        
        return {
            "score": persona_score,
            "appropriate_count": appropriate_count,
            "context_ok_count": context_ok_count,
            "inappropriate_count": inappropriate_count,
            "appropriateness_ratio": appropriateness_ratio
        }
    
    def _calculate_methodology_compliance_score(self, response: str) -> Dict[str, Any]:
        """Calculate BOS methodology compliance score."""
        
        methodology_indicators = {
            "framework_references": [
                "WHO depends", "WHAT they expect", "WHAT breaks",
                "WHAT telemetry", "WHAT signals", "playbook", "dashboard"
            ],
            "session_commands": [
                "/start", "/persona", "/step", "/validate", "/generate", "/status"
            ],
            "step_progression": [
                "Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6", "Step 7",
                "next step", "proceed to", "complete", "continue"
            ],
            "validation_elements": [
                "validate", "check", "review", "assess", "evaluate", "score"
            ]
        }
        
        compliance_scores = {}
        
        for category, indicators in methodology_indicators.items():
            found_count = sum(
                len(re.findall(rf'\b{re.escape(indicator)}\b', response, re.IGNORECASE))
                for indicator in indicators
            )
            
            # Normalize by category expectations
            if category == "framework_references":
                target_count = 2  # Expect at least 2 framework references
            elif category == "session_commands":
                target_count = 1  # Expect at least 1 command reference
            elif category == "step_progression":
                target_count = 1  # Expect progression guidance
            else:
                target_count = 1
            
            compliance_scores[category] = min(found_count / target_count, 1.0)
        
        # Overall methodology compliance
        methodology_score = sum(compliance_scores.values()) / len(compliance_scores)
        
        return {
            "score": methodology_score,
            "compliance_scores": compliance_scores
        }
    
    def _calculate_business_value_score(self, response: str, persona: str) -> Dict[str, Any]:
        """Calculate business value orientation score."""
        
        business_value_indicators = [
            "business", "value", "outcome", "result", "benefit", "impact",
            "ROI", "cost", "revenue", "efficiency", "productivity", "quality",
            "customer", "user", "stakeholder", "satisfaction", "experience"
        ]
        
        value_count = sum(
            len(re.findall(rf'\b{term}\b', response, re.IGNORECASE))
            for term in business_value_indicators
        )
        
        # Adjust expectations based on persona
        if persona == "product_owner":
            target_ratio = 0.8  # High business value focus expected
        elif persona == "developer":
            target_ratio = 0.4  # Moderate business value focus
        elif persona == "platform_sre":
            target_ratio = 0.3  # Lower business value focus, more technical
        else:
            target_ratio = 0.5  # Default expectation
        
        word_count = len(response.split())
        if word_count == 0:
            return {"score": 0.0}
        
        value_ratio = value_count / (word_count / 20)  # Per 20 words
        business_value_score = min(value_ratio / target_ratio, 1.0)
        
        return {
            "score": business_value_score,
            "value_count": value_count,
            "target_ratio": target_ratio,
            "value_ratio": value_ratio
        }
    
    def _calculate_confidence_level(self, dimension_scores: Dict[str, float], response: str) -> float:
        """Calculate confidence level in the quality assessment."""
        
        # Factors affecting confidence:
        # 1. Response length (longer responses generally more reliable to assess)
        # 2. Score variance (consistent scores across dimensions = higher confidence)
        # 3. Clear indicators (responses with clear patterns = higher confidence)
        
        response_length = len(response.split())
        length_factor = min(response_length / 100, 1.0)  # Normalize to 100 words
        
        # Calculate score variance
        scores = list(dimension_scores.values())
        if len(scores) > 1:
            mean_score = sum(scores) / len(scores)
            variance = sum((score - mean_score) ** 2 for score in scores) / len(scores)
            consistency_factor = max(0, 1 - variance)
        else:
            consistency_factor = 0.5
        
        # Clear indicators factor (presence of specific patterns)
        indicator_count = 0
        all_patterns = []
        for pattern_list in self.quality_patterns.values():
            all_patterns.extend(pattern_list)
        
        for pattern in all_patterns:
            indicator_count += len(re.findall(pattern, response, re.IGNORECASE))
        
        indicator_factor = min(indicator_count / 10, 1.0)  # Normalize to 10 indicators
        
        # Weighted confidence calculation
        confidence = (length_factor * 0.4 + consistency_factor * 0.4 + indicator_factor * 0.2)
        
        return confidence
    
    def _determine_quality_grade(self, weighted_score: float) -> str:
        """Determine quality grade based on weighted score."""
        if weighted_score >= 0.95:
            return "A+"
        elif weighted_score >= 0.90:
            return "A"
        elif weighted_score >= 0.85:
            return "A-"
        elif weighted_score >= 0.80:
            return "B+"
        elif weighted_score >= 0.75:
            return "B"
        elif weighted_score >= 0.70:
            return "B-"
        elif weighted_score >= 0.65:
            return "C+"
        elif weighted_score >= 0.60:
            return "C"
        elif weighted_score >= 0.55:
            return "C-"
        elif weighted_score >= 0.50:
            return "D"
        else:
            return "F"
    
    def _identify_improvement_areas(self, dimension_scores: Dict[str, float]) -> List[str]:
        """Identify areas needing improvement based on low scores."""
        improvement_areas = []
        
        threshold = 0.7  # Scores below this need improvement
        
        for dimension, score in dimension_scores.items():
            if score < threshold:
                if dimension == "completeness":
                    improvement_areas.append("Enhance BOS methodology coverage completeness")
                elif dimension == "specificity":
                    improvement_areas.append("Increase specificity and reduce vague language")
                elif dimension == "measurability":
                    improvement_areas.append("Add more quantified metrics and measurable outcomes")
                elif dimension == "actionability":
                    improvement_areas.append("Provide clearer actionable guidance and next steps")
                elif dimension == "consistency":
                    improvement_areas.append("Improve terminology and structural consistency")
                elif dimension == "persona_appropriateness":
                    improvement_areas.append("Better align language and focus with persona needs")
                elif dimension == "methodology_compliance":
                    improvement_areas.append("Strengthen adherence to BOS methodology framework")
                elif dimension == "business_value":
                    improvement_areas.append("Emphasize business value and stakeholder outcomes")
        
        return improvement_areas
    
    def _identify_strengths(self, dimension_scores: Dict[str, float]) -> List[str]:
        """Identify strength areas based on high scores."""
        strengths = []
        
        threshold = 0.85  # Scores above this are strengths
        
        for dimension, score in dimension_scores.items():
            if score >= threshold:
                if dimension == "completeness":
                    strengths.append("Excellent BOS methodology coverage")
                elif dimension == "specificity":
                    strengths.append("High specificity and clear language")
                elif dimension == "measurability":
                    strengths.append("Strong quantified metrics and measurable outcomes")
                elif dimension == "actionability":
                    strengths.append("Clear actionable guidance provided")
                elif dimension == "consistency":
                    strengths.append("Consistent terminology and structure")
                elif dimension == "persona_appropriateness":
                    strengths.append("Well-aligned with persona needs and expertise")
                elif dimension == "methodology_compliance":
                    strengths.append("Strong BOS methodology framework adherence")
                elif dimension == "business_value":
                    strengths.append("Clear business value orientation")
        
        return strengths


# Example usage and testing
def main():
    """Example usage of the quality scoring engine."""
    
    # Initialize scoring engine
    engine = QualityScoringEngine()
    
    # Example response to score
    sample_response = """
    ✅ Persona Set: Product Owner

    Primary Stakeholder Identified: Senior Loan Officers

    Business context focus with measurable expectations:
    - Response time: 24 hours for complete application review
    - Accuracy target: 95% first-pass approval accuracy  
    - Financial impact: $50,000 revenue risk per delayed application

    Impact categories to analyze:
    - Financial: Revenue loss potential of $2M annually
    - Operational: Process efficiency degradation by 30%
    - Customer Experience: Satisfaction scores drop by 15%
    - Legal: Compliance violations with regulatory requirements

    Next steps: Complete stakeholder mapping across People/Business Entities/Vendors categories.
    Use /validate to check current completeness before proceeding to Step 2.
    """
    
    # Calculate quality score
    quality_score = engine.calculate_quality_score(
        response=sample_response,
        persona="product_owner"
    )
    
    # Print results
    print("🔍 Quality Scoring Results:")
    print(f"Overall Score: {quality_score.overall_score:.2f}")
    print(f"Weighted Score: {quality_score.weighted_score:.2f}")
    print(f"Quality Grade: {quality_score.quality_grade}")
    print(f"Confidence Level: {quality_score.confidence_level:.2f}")
    
    print("\n📊 Dimension Scores:")
    for dimension, score in quality_score.dimension_scores.items():
        print(f"  {dimension}: {score:.2f}")
    
    print(f"\n✅ Strengths: {quality_score.strengths}")
    print(f"⚠️  Improvement Areas: {quality_score.improvement_areas}")
    
    # Save detailed results
    with open("quality_scoring_results.json", "w") as f:
        json.dump(asdict(quality_score), f, indent=2)
    
    print("\n📁 Detailed results saved to quality_scoring_results.json")


if __name__ == "__main__":
    main()