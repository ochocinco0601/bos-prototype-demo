#!/usr/bin/env python3
"""
BOS Methodology Prompt - Comprehensive Test Suite Runner

Master test execution script that orchestrates all automated testing components:
- Core framework validation
- Prompt response validation  
- Quality scoring assessment
- BOS methodology compliance
- Persona-specific validation

This script provides a unified interface for executing the complete automated testing suite.
"""

import asyncio
import json
import time
import sys
import os
from pathlib import Path
from typing import Dict, List, Any, Optional

# Import all testing modules
try:
    from automated_test_framework import BOSPromptTestSuite
    from prompt_response_validator import AutomatedPromptTester
    from quality_scoring_engine import QualityScoringEngine
    from bos_compliance_tester import BOSComplianceTester
    from persona_validation_tests import PersonaValidationTester
except ImportError as e:
    print(f"Error importing testing modules: {e}")
    print("Make sure all testing modules are in the same directory")
    sys.exit(1)


class ComprehensiveTestRunner:
    """Master test runner for complete BOS methodology prompt validation."""
    
    def __init__(self, output_dir: str = "test_results"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Initialize all test components
        self.framework_tester = BOSPromptTestSuite()
        self.prompt_tester = AutomatedPromptTester()
        self.quality_scorer = QualityScoringEngine()
        self.compliance_tester = BOSComplianceTester()
        self.persona_tester = PersonaValidationTester()
        
        # Test configuration
        self.test_responses = self._load_test_responses()
        
    def _load_test_responses(self) -> List[Dict[str, Any]]:
        """Load test responses for validation (simulated for now)."""
        return [
            {
                "name": "Product Owner Loan Approval",
                "persona": "product_owner",
                "scenario": "loan_approval_process",
                "response": """
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
            },
            {
                "name": "Developer Payment Processing",
                "persona": "developer", 
                "scenario": "payment_processing_service",
                "response": """
                ✅ Technical Stakeholder Profile Complete

                Observable Units Identified:
                - Payment confirmation API endpoint (500ms SLA)
                - Database transaction handler (99.9% availability target)
                - External payment processor integration

                Current telemetry sources:
                - API response time metrics with Prometheus
                - Error rate monitoring via application logs
                - Transaction success rate tracking in database

                Process signals required:
                - Payment validation success/failure indicators
                - Response time threshold alerts (>500ms)
                - Error pattern detection for retry logic

                Technical implementation approach validated for observable unit mapping.
                """
            },
            {
                "name": "Platform SRE Authentication",
                "persona": "platform_sre",
                "scenario": "user_authentication_system",
                "response": """
                ✅ Infrastructure Dependencies Mapped

                System Signal Requirements:
                - Authentication service availability monitoring (99.9% uptime SLA)
                - Database connection health with connection pool metrics
                - Load balancer performance with request distribution analytics

                Infrastructure integration points:
                - APM monitoring system integration (Datadog/New Relic)
                - Dashboard widget specifications for Grafana
                - Alert threshold configurations in PagerDuty

                Operational monitoring approach:
                - System health indicators with automated recovery
                - Performance degradation detection with predictive alerting
                - Automated failover procedures for service continuity

                Dashboard requirements technically feasible for Platform SRE implementation.
                """
            }
        ]
    
    async def run_comprehensive_test_suite(self) -> Dict[str, Any]:
        """Execute the complete automated testing suite."""
        
        print("🚀 Starting BOS Methodology Prompt Comprehensive Test Suite...")
        print("=" * 80)
        
        start_time = time.time()
        overall_results = {
            "test_suite_summary": {
                "start_time": start_time,
                "test_components": 5,
                "test_responses": len(self.test_responses)
            },
            "component_results": {},
            "overall_assessment": {},
            "recommendations": []
        }
        
        # 1. Core Framework Testing
        print("\n📋 1. Core Framework Testing...")
        framework_results = await self._run_framework_tests()
        overall_results["component_results"]["framework"] = framework_results
        
        # 2. Prompt Response Validation
        print("\n🔍 2. Prompt Response Validation...")
        response_results = await self._run_response_validation()
        overall_results["component_results"]["response_validation"] = response_results
        
        # 3. Quality Scoring Assessment
        print("\n📊 3. Quality Scoring Assessment...")
        quality_results = self._run_quality_scoring()
        overall_results["component_results"]["quality_scoring"] = quality_results
        
        # 4. BOS Methodology Compliance
        print("\n✅ 4. BOS Methodology Compliance Testing...")
        compliance_results = self._run_compliance_testing()
        overall_results["component_results"]["compliance"] = compliance_results
        
        # 5. Persona-Specific Validation
        print("\n🎭 5. Persona-Specific Validation...")
        persona_results = self._run_persona_validation()
        overall_results["component_results"]["persona_validation"] = persona_results
        
        # Generate overall assessment
        execution_time = time.time() - start_time
        overall_assessment = self._generate_overall_assessment(overall_results, execution_time)
        overall_results["overall_assessment"] = overall_assessment
        overall_results["test_suite_summary"]["execution_time"] = execution_time
        
        # Save comprehensive results
        await self._save_results(overall_results)
        
        # Print summary
        self._print_test_summary(overall_assessment)
        
        return overall_results
    
    async def _run_framework_tests(self) -> Dict[str, Any]:
        """Execute core framework testing."""
        try:
            results = await self.framework_tester.run_comprehensive_test_suite()
            
            print(f"   ✅ Framework tests completed")
            print(f"   📈 Pass rate: {results['summary']['pass_rate']:.1%}")
            print(f"   🏆 Average score: {results['summary']['average_scores']['validation']:.1%}")
            
            return {
                "status": "completed",
                "results": results,
                "summary": {
                    "pass_rate": results['summary']['pass_rate'],
                    "average_score": results['summary']['average_scores']['validation'],
                    "total_tests": results['summary']['total_tests']
                }
            }
            
        except Exception as e:
            print(f"   ❌ Framework tests failed: {str(e)}")
            return {"status": "failed", "error": str(e)}
    
    async def _run_response_validation(self) -> Dict[str, Any]:
        """Execute prompt response validation."""
        try:
            results = await self.prompt_tester.run_automated_test_suite()
            
            print(f"   ✅ Response validation completed")
            print(f"   📈 Pass rate: {results['summary']['pass_rate']:.1%}")
            print(f"   🏆 Average score: {results['summary']['average_score']:.1%}")
            
            return {
                "status": "completed",
                "results": results,
                "summary": {
                    "pass_rate": results['summary']['pass_rate'],
                    "average_score": results['summary']['average_score'],
                    "total_tests": results['summary']['total_tests']
                }
            }
            
        except Exception as e:
            print(f"   ❌ Response validation failed: {str(e)}")
            return {"status": "failed", "error": str(e)}
    
    def _run_quality_scoring(self) -> Dict[str, Any]:
        """Execute quality scoring assessment."""
        try:
            quality_results = []
            
            for test_response in self.test_responses:
                quality_score = self.quality_scorer.calculate_quality_score(
                    response=test_response["response"],
                    persona=test_response["persona"]
                )
                
                quality_results.append({
                    "test_name": test_response["name"],
                    "persona": test_response["persona"],
                    "quality_score": quality_score
                })
            
            # Calculate summary metrics
            overall_scores = [result["quality_score"].overall_score for result in quality_results]
            weighted_scores = [result["quality_score"].weighted_score for result in quality_results]
            
            avg_overall = sum(overall_scores) / len(overall_scores)
            avg_weighted = sum(weighted_scores) / len(weighted_scores)
            
            print(f"   ✅ Quality scoring completed")
            print(f"   📊 Average overall score: {avg_overall:.1%}")
            print(f"   🎯 Average weighted score: {avg_weighted:.1%}")
            
            return {
                "status": "completed",
                "results": quality_results,
                "summary": {
                    "average_overall_score": avg_overall,
                    "average_weighted_score": avg_weighted,
                    "tests_scored": len(quality_results)
                }
            }
            
        except Exception as e:
            print(f"   ❌ Quality scoring failed: {str(e)}")
            return {"status": "failed", "error": str(e)}
    
    def _run_compliance_testing(self) -> Dict[str, Any]:
        """Execute BOS methodology compliance testing."""
        try:
            compliance_results = []
            
            for test_response in self.test_responses:
                compliance_report = self.compliance_tester.validate_bos_compliance(
                    response=test_response["response"]
                )
                
                compliance_results.append({
                    "test_name": test_response["name"],
                    "persona": test_response["persona"],
                    "compliance_report": compliance_report
                })
            
            # Calculate summary metrics
            overall_compliance = [result["compliance_report"].overall_compliance for result in compliance_results]
            critical_failures = [result["compliance_report"].critical_failures for result in compliance_results]
            
            avg_compliance = sum(overall_compliance) / len(overall_compliance)
            total_critical_failures = sum(critical_failures)
            
            print(f"   ✅ Compliance testing completed")
            print(f"   📋 Average compliance: {avg_compliance:.1%}")
            print(f"   ⚠️  Critical failures: {total_critical_failures}")
            
            return {
                "status": "completed",
                "results": compliance_results,
                "summary": {
                    "average_compliance": avg_compliance,
                    "total_critical_failures": total_critical_failures,
                    "tests_completed": len(compliance_results)
                }
            }
            
        except Exception as e:
            print(f"   ❌ Compliance testing failed: {str(e)}")
            return {"status": "failed", "error": str(e)}
    
    def _run_persona_validation(self) -> Dict[str, Any]:
        """Execute persona-specific validation."""
        try:
            persona_results = []
            
            for test_response in self.test_responses:
                persona_report = self.persona_tester.run_comprehensive_persona_validation(
                    response=test_response["response"]
                )
                
                persona_results.append({
                    "test_name": test_response["name"],
                    "persona": test_response["persona"],
                    "persona_report": persona_report
                })
            
            # Calculate summary metrics
            persona_compliance = [result["persona_report"].overall_persona_compliance for result in persona_results]
            collaboration_ready = [result["persona_report"].collaboration_readiness["collaboration_ready"] for result in persona_results]
            
            avg_persona_compliance = sum(persona_compliance) / len(persona_compliance)
            collaboration_ready_count = sum(collaboration_ready)
            
            print(f"   ✅ Persona validation completed")
            print(f"   🎭 Average persona compliance: {avg_persona_compliance:.1%}")
            print(f"   🤝 Collaboration ready: {collaboration_ready_count}/{len(collaboration_ready)}")
            
            return {
                "status": "completed",
                "results": persona_results,
                "summary": {
                    "average_persona_compliance": avg_persona_compliance,
                    "collaboration_ready_count": collaboration_ready_count,
                    "total_persona_tests": len(persona_results)
                }
            }
            
        except Exception as e:
            print(f"   ❌ Persona validation failed: {str(e)}")
            return {"status": "failed", "error": str(e)}
    
    def _generate_overall_assessment(self, results: Dict[str, Any], execution_time: float) -> Dict[str, Any]:
        """Generate comprehensive overall assessment."""
        
        # Collect all scores
        scores = []
        critical_issues = []
        recommendations = []
        
        # Framework scores
        if results["component_results"]["framework"]["status"] == "completed":
            framework_summary = results["component_results"]["framework"]["summary"]
            scores.append(framework_summary["average_score"])
            
            if framework_summary["pass_rate"] < 0.9:
                critical_issues.append("Framework test pass rate below 90%")
        
        # Response validation scores
        if results["component_results"]["response_validation"]["status"] == "completed":
            response_summary = results["component_results"]["response_validation"]["summary"]
            scores.append(response_summary["average_score"])
            
            if response_summary["pass_rate"] < 0.8:
                critical_issues.append("Response validation pass rate below 80%")
        
        # Quality scoring
        if results["component_results"]["quality_scoring"]["status"] == "completed":
            quality_summary = results["component_results"]["quality_scoring"]["summary"]
            scores.append(quality_summary["average_weighted_score"])
            
            if quality_summary["average_weighted_score"] < 0.8:
                recommendations.append("Improve overall quality scoring metrics")
        
        # Compliance testing
        if results["component_results"]["compliance"]["status"] == "completed":
            compliance_summary = results["component_results"]["compliance"]["summary"]
            scores.append(compliance_summary["average_compliance"])
            
            if compliance_summary["total_critical_failures"] > 0:
                critical_issues.append(f"{compliance_summary['total_critical_failures']} critical compliance failures")
        
        # Persona validation
        if results["component_results"]["persona_validation"]["status"] == "completed":
            persona_summary = results["component_results"]["persona_validation"]["summary"]
            scores.append(persona_summary["average_persona_compliance"])
            
            if persona_summary["collaboration_ready_count"] < persona_summary["total_persona_tests"]:
                recommendations.append("Improve cross-persona collaboration support")
        
        # Calculate overall score
        overall_score = sum(scores) / len(scores) if scores else 0.0
        
        # Determine readiness status
        if overall_score >= 0.9 and len(critical_issues) == 0:
            readiness_status = "PRODUCTION_READY"
        elif overall_score >= 0.8 and len(critical_issues) <= 1:
            readiness_status = "MOSTLY_READY"
        elif overall_score >= 0.7:
            readiness_status = "NEEDS_IMPROVEMENT"
        else:
            readiness_status = "NOT_READY"
        
        return {
            "overall_score": overall_score,
            "readiness_status": readiness_status,
            "execution_time": execution_time,
            "critical_issues": critical_issues,
            "recommendations": recommendations,
            "component_scores": scores,
            "tests_passed": len([r for r in results["component_results"].values() if r["status"] == "completed"]),
            "total_test_components": len(results["component_results"])
        }
    
    async def _save_results(self, results: Dict[str, Any]) -> None:
        """Save comprehensive test results."""
        
        # Save main results
        main_results_file = self.output_dir / "comprehensive_test_results.json"
        with open(main_results_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
        # Save individual component results
        for component, component_results in results["component_results"].items():
            if component_results["status"] == "completed":
                component_file = self.output_dir / f"{component}_results.json"
                with open(component_file, 'w') as f:
                    json.dump(component_results["results"], f, indent=2, default=str)
        
        print(f"\n💾 Test results saved to {self.output_dir}/")
    
    def _print_test_summary(self, assessment: Dict[str, Any]) -> None:
        """Print comprehensive test summary."""
        
        print("\n" + "=" * 80)
        print("🏁 BOS METHODOLOGY PROMPT - COMPREHENSIVE TEST RESULTS")
        print("=" * 80)
        
        print(f"\n📊 OVERALL ASSESSMENT:")
        print(f"   Overall Score: {assessment['overall_score']:.1%}")
        print(f"   Readiness Status: {assessment['readiness_status']}")
        print(f"   Execution Time: {assessment['execution_time']:.2f} seconds")
        print(f"   Components Passed: {assessment['tests_passed']}/{assessment['total_test_components']}")
        
        if assessment['critical_issues']:
            print(f"\n❌ CRITICAL ISSUES:")
            for issue in assessment['critical_issues']:
                print(f"   • {issue}")
        
        if assessment['recommendations']:
            print(f"\n💡 RECOMMENDATIONS:")
            for rec in assessment['recommendations']:
                print(f"   • {rec}")
        
        print(f"\n🎯 PRODUCTION READINESS ASSESSMENT:")
        if assessment['readiness_status'] == "PRODUCTION_READY":
            print("   ✅ System is ready for production deployment")
        elif assessment['readiness_status'] == "MOSTLY_READY":
            print("   ⚠️  System is mostly ready, address critical issues first")
        elif assessment['readiness_status'] == "NEEDS_IMPROVEMENT":
            print("   🔧 System needs improvement before production deployment")
        else:
            print("   ❌ System is not ready for production deployment")
        
        print(f"\n📁 Detailed results available in: {self.output_dir}/")
        print("=" * 80)


async def main():
    """Main execution function."""
    
    print("🧪 BOS Methodology Prompt - Comprehensive Automated Testing Suite")
    print("This suite validates prompt quality, compliance, and persona appropriateness")
    print("")
    
    # Create test runner
    test_runner = ComprehensiveTestRunner()
    
    # Execute comprehensive testing
    try:
        results = await test_runner.run_comprehensive_test_suite()
        
        # Return success code based on results
        assessment = results["overall_assessment"]
        if assessment["readiness_status"] in ["PRODUCTION_READY", "MOSTLY_READY"]:
            return 0  # Success
        else:
            return 1  # Failure
            
    except Exception as e:
        print(f"\n❌ Test suite execution failed: {str(e)}")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)