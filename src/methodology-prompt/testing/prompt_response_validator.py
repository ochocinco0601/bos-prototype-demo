#!/usr/bin/env python3
"""
BOS Methodology Prompt - Response Validation System

Automated validation system that can execute actual LLM prompts and validate responses
against BOS methodology requirements, quality standards, and persona appropriateness.
"""

import json
import re
import asyncio
import openai
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass
from enum import Enum
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMProvider(Enum):
    OPENAI_GPT4 = "openai_gpt4"
    ANTHROPIC_CLAUDE = "anthropic_claude"
    GOOGLE_GEMINI = "google_gemini"


@dataclass
class PromptExecution:
    """Configuration for prompt execution."""
    provider: LLMProvider
    model: str
    temperature: float = 0.7
    max_tokens: int = 2000
    timeout: int = 30


@dataclass
class ValidationCriteria:
    """Comprehensive validation criteria for prompt responses."""
    
    # BOS Methodology Compliance
    methodology_adherence: float = 0.9
    step_progression_logic: float = 0.9
    framework_consistency: float = 0.85
    
    # Content Quality
    specificity_threshold: float = 0.8
    measurability_requirement: float = 0.7
    business_language_appropriate: float = 0.8
    technical_accuracy: float = 0.8
    
    # Persona Appropriateness
    persona_guidance_relevance: float = 0.85
    role_specific_prompting: float = 0.8
    expertise_level_match: float = 0.8
    
    # Stakeholder Framework
    stakeholder_category_coverage: float = 0.8
    stakeholder_completeness: float = 0.7
    dependency_mapping_quality: float = 0.8
    
    # Impact Analysis
    impact_category_coverage: float = 0.8
    quantification_requirement: float = 0.7
    measurable_outcomes: float = 0.8
    
    # Technical Implementation
    observable_unit_precision: float = 0.8
    telemetry_source_identification: float = 0.7
    signal_definition_clarity: float = 0.8


class BOS_PromptResponseValidator:
    """Advanced validation system for BOS methodology prompt responses."""
    
    def __init__(self, execution_config: PromptExecution, validation_criteria: ValidationCriteria):
        self.execution_config = execution_config
        self.criteria = validation_criteria
        self.bos_prompt = self._load_bos_prompt()
        
    def _load_bos_prompt(self) -> str:
        """Load the BOS methodology prompt from file."""
        try:
            with open("../bos_guided_prompt_final.md", "r") as f:
                return f.read()
        except FileNotFoundError:
            logger.error("BOS prompt file not found")
            return ""
    
    async def execute_and_validate_prompt(self, 
                                        test_scenario: str,
                                        user_inputs: List[str],
                                        persona: str) -> Dict[str, Any]:
        """Execute prompt with LLM and validate the response."""
        
        # Prepare prompt context
        full_prompt = self._prepare_prompt_context(test_scenario, persona)
        
        # Execute prompt with LLM
        response = await self._execute_prompt(full_prompt, user_inputs)
        
        # Validate response
        validation_results = self._validate_response(response, persona, test_scenario)
        
        return {
            "scenario": test_scenario,
            "persona": persona,
            "inputs": user_inputs,
            "response": response,
            "validation": validation_results,
            "execution_metadata": {
                "provider": self.execution_config.provider.value,
                "model": self.execution_config.model,
                "response_length": len(response),
                "timestamp": asyncio.get_event_loop().time()
            }
        }
    
    def _prepare_prompt_context(self, scenario: str, persona: str) -> str:
        """Prepare the complete prompt context for execution."""
        context = f"""
{self.bos_prompt}

TESTING SCENARIO: {scenario}
ACTIVE PERSONA: {persona}

Please respond as the BOS methodology facilitator for this scenario.
"""
        return context
    
    async def _execute_prompt(self, prompt: str, user_inputs: List[str]) -> str:
        """Execute the prompt with the configured LLM provider."""
        
        if self.execution_config.provider == LLMProvider.OPENAI_GPT4:
            return await self._execute_openai_prompt(prompt, user_inputs)
        elif self.execution_config.provider == LLMProvider.ANTHROPIC_CLAUDE:
            return await self._execute_anthropic_prompt(prompt, user_inputs)
        else:
            raise ValueError(f"Unsupported LLM provider: {self.execution_config.provider}")
    
    async def _execute_openai_prompt(self, prompt: str, user_inputs: List[str]) -> str:
        """Execute prompt using OpenAI GPT-4."""
        try:
            # Build conversation
            messages = [
                {"role": "system", "content": prompt}
            ]
            
            for user_input in user_inputs:
                messages.append({"role": "user", "content": user_input})
                
                # Get response
                response = await openai.ChatCompletion.acreate(
                    model=self.execution_config.model,
                    messages=messages,
                    temperature=self.execution_config.temperature,
                    max_tokens=self.execution_config.max_tokens,
                    timeout=self.execution_config.timeout
                )
                
                assistant_response = response.choices[0].message.content
                messages.append({"role": "assistant", "content": assistant_response})
            
            return assistant_response
            
        except Exception as e:
            logger.error(f"OpenAI execution error: {e}")
            return f"ERROR: {str(e)}"
    
    async def _execute_anthropic_prompt(self, prompt: str, user_inputs: List[str]) -> str:
        """Execute prompt using Anthropic Claude."""
        # Placeholder for Anthropic API integration
        logger.info("Anthropic Claude execution not yet implemented")
        return "SIMULATED_RESPONSE: Claude integration pending"
    
    def _validate_response(self, response: str, persona: str, scenario: str) -> Dict[str, Any]:
        """Comprehensive validation of prompt response."""
        
        validation_results = {
            "overall_score": 0.0,
            "category_scores": {},
            "detailed_analysis": {},
            "compliance_checks": {},
            "quality_metrics": {},
            "improvement_suggestions": []
        }
        
        # 1. BOS Methodology Compliance Validation
        methodology_score = self._validate_methodology_compliance(response)
        validation_results["category_scores"]["methodology"] = methodology_score
        
        # 2. Persona Appropriateness Validation
        persona_score = self._validate_persona_appropriateness(response, persona)
        validation_results["category_scores"]["persona"] = persona_score
        
        # 3. Content Quality Validation
        quality_score = self._validate_content_quality(response)
        validation_results["category_scores"]["quality"] = quality_score
        
        # 4. Stakeholder Framework Validation
        stakeholder_score = self._validate_stakeholder_framework(response)
        validation_results["category_scores"]["stakeholder"] = stakeholder_score
        
        # 5. Technical Precision Validation
        technical_score = self._validate_technical_precision(response, persona)
        validation_results["category_scores"]["technical"] = technical_score
        
        # Calculate overall score
        category_weights = {
            "methodology": 0.25,
            "persona": 0.20,
            "quality": 0.20,
            "stakeholder": 0.20,
            "technical": 0.15
        }
        
        validation_results["overall_score"] = sum(
            validation_results["category_scores"][cat] * weight 
            for cat, weight in category_weights.items()
        )
        
        # Generate improvement suggestions
        validation_results["improvement_suggestions"] = self._generate_improvement_suggestions(
            validation_results["category_scores"]
        )
        
        return validation_results
    
    def _validate_methodology_compliance(self, response: str) -> float:
        """Validate adherence to BOS methodology framework."""
        compliance_indicators = {
            "step_references": [
                "WHO depends", "WHAT they expect", "WHAT breaks",
                "WHAT telemetry", "WHAT signals", "PLAYBOOK", "DASHBOARD"
            ],
            "framework_structure": [
                "stakeholder", "dependency", "impact", "telemetry", "signal"
            ],
            "methodology_commands": [
                "/start", "/persona", "/step", "/validate", "/generate"
            ],
            "progression_logic": [
                "Step 1", "Step 2", "Step 3", "next step", "proceed to"
            ]
        }
        
        scores = {}
        for category, indicators in compliance_indicators.items():
            found_count = sum(1 for indicator in indicators 
                            if re.search(rf'\b{re.escape(indicator)}\b', response, re.IGNORECASE))
            scores[category] = min(found_count / len(indicators), 1.0)
        
        return sum(scores.values()) / len(scores)
    
    def _validate_persona_appropriateness(self, response: str, persona: str) -> float:
        """Validate persona-specific guidance appropriateness."""
        persona_indicators = {
            "product_owner": {
                "business_language": ["business", "stakeholder", "impact", "value", "requirement"],
                "avoid_technical": ["API", "database", "server", "code", "implementation"],
                "focus_areas": ["process", "outcome", "measurement", "expectation"]
            },
            "developer": {
                "technical_language": ["API", "service", "observable", "telemetry", "signal"],
                "implementation_focus": ["code", "system", "integration", "measurement"],
                "avoid_business_jargon": ["ROI", "business case", "strategy"]
            },
            "platform_sre": {
                "infrastructure_language": ["system", "platform", "monitoring", "infrastructure"],
                "operational_focus": ["health", "performance", "reliability", "dashboard"],
                "technical_precision": ["metric", "threshold", "alert", "SLA"]
            }
        }
        
        if persona not in persona_indicators:
            return 0.5  # Unknown persona
        
        indicators = persona_indicators[persona]
        scores = {}
        
        # Check for appropriate language
        for category, terms in indicators.items():
            if category.startswith("avoid_"):
                # Penalty for inappropriate terms
                penalty_count = sum(1 for term in terms 
                                  if re.search(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
                scores[category] = max(0, 1.0 - (penalty_count * 0.2))
            else:
                # Reward for appropriate terms
                found_count = sum(1 for term in terms 
                                if re.search(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
                scores[category] = min(found_count / len(terms), 1.0)
        
        return sum(scores.values()) / len(scores)
    
    def _validate_content_quality(self, response: str) -> float:
        """Validate content quality and specificity."""
        quality_metrics = {
            "measurable_values": self._count_measurable_values(response),
            "specific_timeframes": self._count_time_references(response),
            "quantified_impacts": self._count_quantified_impacts(response),
            "clear_instructions": self._assess_instruction_clarity(response),
            "actionable_guidance": self._assess_actionability(response)
        }
        
        # Normalize scores (implementation depends on specific counting logic)
        normalized_scores = {}
        for metric, value in quality_metrics.items():
            # Simple normalization - adjust based on expected ranges
            normalized_scores[metric] = min(value / 5.0, 1.0)  # Assuming 5 is a good target
        
        return sum(normalized_scores.values()) / len(normalized_scores)
    
    def _validate_stakeholder_framework(self, response: str) -> float:
        """Validate stakeholder framework coverage."""
        stakeholder_categories = {
            "people": ["role", "team", "person", "individual", "staff"],
            "business_entities": ["department", "organization", "customer", "client"],
            "vendors": ["vendor", "supplier", "provider", "contractor", "third-party"]
        }
        
        category_coverage = {}
        for category, terms in stakeholder_categories.items():
            mentions = sum(1 for term in terms 
                          if re.search(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
            category_coverage[category] = min(mentions / 2.0, 1.0)  # Target 2 mentions per category
        
        return sum(category_coverage.values()) / len(category_coverage)
    
    def _validate_technical_precision(self, response: str, persona: str) -> float:
        """Validate technical precision appropriate for persona."""
        if persona == "developer":
            technical_terms = ["observable unit", "telemetry", "signal", "metric", "instrumentation"]
            precision_score = sum(1 for term in technical_terms 
                                if re.search(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
            return min(precision_score / len(technical_terms), 1.0)
        
        elif persona == "platform_sre":
            infrastructure_terms = ["dashboard", "monitoring", "alert", "threshold", "SLA"]
            precision_score = sum(1 for term in infrastructure_terms 
                                if re.search(rf'\b{re.escape(term)}\b', response, re.IGNORECASE))
            return min(precision_score / len(infrastructure_terms), 1.0)
        
        else:
            # For product owner, technical precision is less critical
            return 0.8  # Default reasonable score
    
    # Helper methods for quality assessment
    def _count_measurable_values(self, response: str) -> int:
        """Count measurable values in response."""
        patterns = [
            r'\d+(?:\.\d+)?\s*%',  # Percentages
            r'\d+(?:\.\d+)?\s*(second|minute|hour|day)s?',  # Time units
            r'\$\d+(?:,\d{3})*(?:\.\d{2})?',  # Dollar amounts
            r'\d+(?:\.\d+)?\s*(ms|sec|min|hr|SLA)'  # Technical units
        ]
        
        count = 0
        for pattern in patterns:
            count += len(re.findall(pattern, response, re.IGNORECASE))
        return count
    
    def _count_time_references(self, response: str) -> int:
        """Count specific time references."""
        time_patterns = [
            r'\d+\s*(second|minute|hour|day|week|month)s?',
            r'within\s+\d+',
            r'by\s+\d+',
            r'real.?time',
            r'immediately'
        ]
        
        count = 0
        for pattern in time_patterns:
            count += len(re.findall(pattern, response, re.IGNORECASE))
        return count
    
    def _count_quantified_impacts(self, response: str) -> int:
        """Count quantified business impacts."""
        impact_patterns = [
            r'revenue.*?\$\d+',
            r'cost.*?\$\d+',
            r'loss.*?\$\d+',
            r'\d+.*?customer',
            r'\d+.*?user',
            r'efficiency.*?\d+%'
        ]
        
        count = 0
        for pattern in impact_patterns:
            count += len(re.findall(pattern, response, re.IGNORECASE))
        return count
    
    def _assess_instruction_clarity(self, response: str) -> float:
        """Assess clarity of instructions provided."""
        clarity_indicators = [
            "please", "next", "complete", "provide", "identify", "define"
        ]
        
        found_indicators = sum(1 for indicator in clarity_indicators 
                             if re.search(rf'\b{re.escape(indicator)}\b', response, re.IGNORECASE))
        
        return min(found_indicators / 3.0, 1.0)  # Target 3 clear instructions
    
    def _assess_actionability(self, response: str) -> float:
        """Assess actionability of guidance."""
        action_words = [
            "identify", "define", "specify", "map", "analyze", "create", "generate"
        ]
        
        action_count = sum(1 for word in action_words 
                          if re.search(rf'\b{re.escape(word)}\b', response, re.IGNORECASE))
        
        return min(action_count / 4.0, 1.0)  # Target 4 actionable items
    
    def _generate_improvement_suggestions(self, category_scores: Dict[str, float]) -> List[str]:
        """Generate specific improvement suggestions based on scores."""
        suggestions = []
        
        if category_scores.get("methodology", 0) < self.criteria.methodology_adherence:
            suggestions.append("Improve BOS methodology framework adherence")
        
        if category_scores.get("persona", 0) < self.criteria.persona_guidance_relevance:
            suggestions.append("Enhance persona-specific guidance appropriateness")
        
        if category_scores.get("quality", 0) < self.criteria.specificity_threshold:
            suggestions.append("Increase specificity and measurability of guidance")
        
        if category_scores.get("stakeholder", 0) < self.criteria.stakeholder_category_coverage:
            suggestions.append("Improve stakeholder framework coverage")
        
        if category_scores.get("technical", 0) < self.criteria.technical_accuracy:
            suggestions.append("Enhance technical precision for the target persona")
        
        return suggestions


# Test execution class
class AutomatedPromptTester:
    """Orchestrates automated prompt testing across scenarios."""
    
    def __init__(self):
        self.validator = BOS_PromptResponseValidator(
            execution_config=PromptExecution(
                provider=LLMProvider.OPENAI_GPT4,
                model="gpt-4",
                temperature=0.7
            ),
            validation_criteria=ValidationCriteria()
        )
    
    async def run_automated_test_suite(self) -> Dict[str, Any]:
        """Run comprehensive automated test suite."""
        
        test_scenarios = [
            {
                "name": "Product Owner Loan Approval",
                "scenario": "loan_approval_process",
                "persona": "product_owner",
                "inputs": [
                    "/start loan_approval_process",
                    "/persona product_owner",
                    "Loan officers need application review within 24 hours"
                ]
            },
            {
                "name": "Developer Payment Processing",
                "scenario": "payment_processing_service",
                "persona": "developer",
                "inputs": [
                    "/start payment_processing_service",
                    "/persona developer",
                    "Payment confirmation API has 500ms SLA requirement"
                ]
            },
            {
                "name": "Platform SRE Authentication",
                "scenario": "user_authentication_system",
                "persona": "platform_sre",
                "inputs": [
                    "/start user_authentication_system",
                    "/persona platform_sre",
                    "Authentication system requires 99.9% availability monitoring"
                ]
            }
        ]
        
        results = []
        for scenario in test_scenarios:
            logger.info(f"Executing test: {scenario['name']}")
            
            result = await self.validator.execute_and_validate_prompt(
                scenario["scenario"],
                scenario["inputs"],
                scenario["persona"]
            )
            
            results.append(result)
        
        # Generate comprehensive report
        return self._generate_test_report(results)
    
    def _generate_test_report(self, results: List[Dict]) -> Dict[str, Any]:
        """Generate comprehensive test report."""
        total_tests = len(results)
        passed_tests = len([r for r in results if r["validation"]["overall_score"] >= 0.8])
        
        return {
            "summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "pass_rate": passed_tests / total_tests if total_tests > 0 else 0,
                "average_score": sum(r["validation"]["overall_score"] for r in results) / total_tests if total_tests > 0 else 0
            },
            "detailed_results": results,
            "recommendations": self._aggregate_recommendations(results)
        }
    
    def _aggregate_recommendations(self, results: List[Dict]) -> List[str]:
        """Aggregate improvement recommendations across all tests."""
        all_suggestions = []
        for result in results:
            all_suggestions.extend(result["validation"]["improvement_suggestions"])
        
        # Count frequency and return most common suggestions
        suggestion_counts = {}
        for suggestion in all_suggestions:
            suggestion_counts[suggestion] = suggestion_counts.get(suggestion, 0) + 1
        
        return sorted(suggestion_counts.keys(), key=lambda x: suggestion_counts[x], reverse=True)


# Main execution
async def main():
    """Main function to run automated prompt testing."""
    tester = AutomatedPromptTester()
    
    print("🚀 Starting BOS Methodology Prompt Automated Testing...")
    
    results = await tester.run_automated_test_suite()
    
    print(f"\n📊 Test Results:")
    print(f"✅ Pass Rate: {results['summary']['pass_rate']:.1%}")
    print(f"📈 Average Score: {results['summary']['average_score']:.1%}")
    
    # Save results
    with open("prompt_validation_results.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    print("\n📁 Results saved to prompt_validation_results.json")
    
    return results


if __name__ == "__main__":
    asyncio.run(main())