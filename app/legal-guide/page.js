"use client"
import { useTheme } from "@/components/ThemeContext";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LegalGuide() {
  const { data: session, status } = useSession();
  const { darkMode } = useTheme();

  if (status === "loading") {
    return (
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4ff] mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className={`max-w-md mx-auto p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <div className="mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#00d4ff] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Please sign in to access the detailed legal guidelines for web accessibility compliance.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm bg-[#00d4ff] text-white font-semibold hover:bg-[#00d4ff]/80 shadow-md transition-all duration-300 h-10 px-6 py-2"
              >
                Sign In to Continue
              </Link>
            </div>
            
            {/* Preview section */}
            <div className={`mt-12 p-6 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">Available Guidelines Preview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} opacity-75`}>
                  <div className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="font-medium">WCAG 2.1 AA Compliant</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to read full details...</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} opacity-75`}>
                  <div className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="font-medium">ADA Title III Ready</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to read full details...</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} opacity-75`}>
                  <div className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="font-medium">EU EN 301 549</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to read full details...</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} opacity-75`}>
                  <div className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="font-medium">India RPwD Act</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to read full details...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Legal Accessibility Guidelines</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Comprehensive guide to web accessibility compliance standards and legal requirements worldwide
          </p>
        </div>

        <div className="grid gap-8">
          {/* WCAG 2.1 AA */}
          <div className={`p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <div className="flex items-center mb-6">
              <span className="text-green-500 text-2xl mr-3">✓</span>
              <h2 className="text-2xl font-bold">WCAG 2.1 AA Compliant</h2>
            </div>
            <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> is the internationally recognized standard for web accessibility, developed by the World Wide Web Consortium (W3C). It provides a comprehensive framework for making web content accessible to people with disabilities.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Four Core Principles (POUR):</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h4 className="font-semibold text-lg mb-2">1. Perceivable</h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Text alternatives for images</li>
                      <li>• Captions and transcripts for videos</li>
                      <li>• Color contrast ratio 4.5:1 (normal text)</li>
                      <li>• Color contrast ratio 3:1 (large text)</li>
                      <li>• Resizable text up to 200%</li>
                      <li>• Content distinguishable from background</li>
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <h4 className="font-semibold text-lg mb-2">2. Operable</h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Full keyboard accessibility</li>
                      <li>• No seizure-inducing content</li>
                      <li>• Users have enough time to read content</li>
                      <li>• Clear navigation and page structure</li>
                      <li>• Bypass blocks for repetitive content</li>
                      <li>• Focus indicators visible</li>
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                    <h4 className="font-semibold text-lg mb-2">3. Understandable</h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Text is readable and understandable</li>
                      <li>• Content appears and operates predictably</li>
                      <li>• Input assistance provided</li>
                      <li>• Error identification and suggestions</li>
                      <li>• Labels or instructions for user input</li>
                      <li>• Language of page is identified</li>
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <h4 className="font-semibold text-lg mb-2">4. Robust</h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Compatible with assistive technologies</li>
                      <li>• Valid HTML markup</li>
                      <li>• Proper semantic structure</li>
                      <li>• Works across different browsers</li>
                      <li>• Future-proof implementation</li>
                      <li>• Screen reader compatibility</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`}>
                <h4 className="font-semibold mb-3">WCAG 2.1 New Success Criteria (13 additional criteria):</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Level A:</p>
                    <ul className={`mt-1 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Character Key Shortcuts</li>
                      <li>• Pointer Cancellation</li>
                      <li>• Label in Name</li>
                      <li>• Motion Actuation</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Level AA:</p>
                    <ul className={`mt-1 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Orientation</li>
                      <li>• Identify Input Purpose</li>
                      <li>• Reflow</li>
                      <li>• Non-text Contrast</li>
                      <li>• Text Spacing</li>
                      <li>• Content on Hover or Focus</li>
                      <li>• Status Messages</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                <p className="text-sm font-medium">
                  <strong>Global Recognition:</strong> WCAG 2.1 AA is referenced in legislation across 40+ countries and is the foundation for most national accessibility laws.
                </p>
              </div>
            </div>
          </div>

          {/* ADA Title III */}
          <div className={`p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <div className="flex items-center mb-6">
              <span className="text-green-500 text-2xl mr-3">✓</span>
              <h2 className="text-2xl font-bold">ADA Title III Ready</h2>
            </div>
            <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>Americans with Disabilities Act (ADA) Title III</strong> prohibits discrimination based on disability in places of public accommodation. While originally focused on physical spaces, courts increasingly apply it to digital environments.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Legal Framework & Coverage:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Covered Entities:</h4>
                    <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Retail stores and shopping centers</li>
                      <li>• Hotels, restaurants, and entertainment venues</li>
                      <li>• Healthcare facilities and professional offices</li>
                      <li>• Banks and financial institutions</li>
                      <li>• Educational institutions (private)</li>
                      <li>• Transportation services</li>
                      <li>• Insurance offices and real estate agencies</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Legal Requirements:</h4>
                    <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Equal access to goods and services</li>
                      <li>• Reasonable modifications to policies</li>
                      <li>• Effective communication with disabled persons</li>
                      <li>• Auxiliary aids when necessary</li>
                      <li>• No discrimination in full enjoyment</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-red-50'} border-l-4 border-red-500`}>
                <h4 className="font-semibold mb-3">Digital Accessibility Case Law:</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Target Corp. (2006):</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>First major case establishing websites as places of public accommodation. Settlement required WCAG compliance.</p>
                  </div>
                  <div>
                    <p className="font-medium">Domino's Pizza (2019):</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Supreme Court let stand ruling that websites must be accessible. Established precedent for digital accessibility under ADA.</p>
                  </div>
                  <div>
                    <p className="font-medium">Recent Trends (2020-2024):</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Over 15,000 ADA website lawsuits filed. Average settlement ranges from $10,000 to $50,000 plus attorney fees.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Compliance Best Practices:</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Technical Standards</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Follow WCAG 2.1 AA guidelines as the de facto standard referenced by courts</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Documentation</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Maintain accessibility audits, remediation plans, and user testing records</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Ongoing Monitoring</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Regular testing with assistive technologies and disabled users</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                <p className="text-sm font-medium">
                  <strong>Risk Mitigation:</strong> Proactive accessibility compliance significantly reduces litigation risk and demonstrates good faith effort to accommodate disabled users.
                </p>
              </div>
            </div>
          </div>

          {/* EU EN 301 549 */}
          <div className={`p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <div className="flex items-center mb-6">
              <span className="text-green-500 text-2xl mr-3">✓</span>
              <h2 className="text-2xl font-bold">EU EN 301 549 Standard</h2>
            </div>
            <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>European Standard EN 301 549</strong> is the harmonized European standard that defines accessibility requirements for Information and Communication Technology (ICT) products and services across all EU member states.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Legal Framework & Directives:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h4 className="font-semibold mb-3">Web Accessibility Directive (2016/2102)</h4>
                    <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Applies to public sector websites and mobile apps</li>
                      <li>• Mandatory compliance since September 2020</li>
                      <li>• Based on WCAG 2.1 Level AA</li>
                      <li>• Requires accessibility statements</li>
                      <li>• Annual monitoring and reporting</li>
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <h4 className="font-semibold mb-3">European Accessibility Act (2019/882)</h4>
                    <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Applies to private sector from June 2025</li>
                      <li>• Covers e-commerce, banking, transport</li>
                      <li>• Mandatory for digital services</li>
                      <li>• Harmonized accessibility requirements</li>
                      <li>• Enforcement through market surveillance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Technical Requirements:</h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <h4 className="font-semibold mb-2">Chapter 9: Web Content (based on WCAG 2.1)</h4>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Incorporates all WCAG 2.1 Level A and AA success criteria with additional EU-specific requirements:</p>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Enhanced keyboard navigation requirements</li>
                      <li>• Specific color contrast measurements</li>
                      <li>• Multilingual accessibility considerations</li>
                      <li>• Additional timing and session requirements</li>
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                    <h4 className="font-semibold mb-2">Chapter 11: Software and Mobile Applications</h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Platform-specific accessibility APIs</li>
                      <li>• Native mobile app accessibility</li>
                      <li>• Assistive technology compatibility</li>
                      <li>• User preference settings respect</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Compliance Obligations:</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Accessibility Statement</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Detailed statement covering compliance status, non-accessible content, and feedback mechanisms</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Feedback Mechanism</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Accessible way for users to report accessibility issues and request alternative formats</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Monitoring Body</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Each member state designates monitoring body for enforcement and periodic audits</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className="text-sm font-medium">
                  <strong>Enforcement:</strong> Non-compliance can result in financial penalties, market restrictions, and legal action. The European Commission monitors implementation across all 27 member states.
                </p>
              </div>
            </div>
          </div>

          {/* India RPwD Act */}
          <div className={`p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <div className="flex items-center mb-6">
              <span className="text-green-500 text-2xl mr-3">✓</span>
              <h2 className="text-2xl font-bold">India RPwD Act 2016</h2>
            </div>
            <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>The Rights of Persons with Disabilities Act, 2016 (RPwD Act)</strong> is India's comprehensive legislation that replaces the Persons with Disabilities Act, 1995. It aligns with the UN Convention on the Rights of Persons with Disabilities (UNCRPD).
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Legislative Framework:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                    <h4 className="font-semibold mb-3">21 Recognized Disabilities</h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <p className="font-medium">Physical Disabilities (7):</p>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Locomotor, leprosy cured, cerebral palsy, dwarfism, muscular dystrophy, acid attack victims</p>
                      </div>
                      <div>
                        <p className="font-medium">Sensory Disabilities (2):</p>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Blindness, low vision, hearing impairment</p>
                      </div>
                      <div>
                        <p className="font-medium">Intellectual & Mental (4):</p>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Intellectual disability, mental illness, autism, learning disabilities</p>
                      </div>
                      <div>
                        <p className="font-medium">Others (8):</p>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Multiple sclerosis, Parkinson's, hemophilia, thalassemia, sickle cell disease</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <h4 className="font-semibold mb-3">Digital Accessibility Mandate</h4>
                    <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• All government websites must be accessible</li>
                      <li>• Public services in accessible formats</li>
                      <li>• Digital content accessibility guidelines</li>
                      <li>• Barrier-free access to information</li>
                      <li>• Sign language interpretation for videos</li>
                      <li>• Screen reader compatible interfaces</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Government Guidelines & Implementation:</h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                    <h4 className="font-semibold mb-2">Guidelines for Indian Government Websites (GIGW)</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Minimum Requirements:</p>
                        <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <li>• WCAG 2.0 Level A compliance</li>
                          <li>• Hindi and English language support</li>
                          <li>• Mobile-responsive design</li>
                          <li>• Text-to-speech functionality</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Enhanced Features:</p>
                        <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <li>• Font size adjustment options</li>
                          <li>• High contrast themes</li>
                          <li>• Keyboard navigation</li>
                          <li>• Audio descriptions for media</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <h4 className="font-semibold mb-2">Department of Empowerment of PwD Guidelines</h4>
                    <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Accessibility audit requirements for government portals</li>
                      <li>• Training programs for web developers on accessibility</li>
                      <li>• Regular compliance monitoring and reporting</li>
                      <li>• User feedback mechanisms for accessibility issues</li>
                      <li>• Integration with Accessible India Campaign (Sugamya Bharat Abhiyan)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Key Provisions for Digital Accessibility:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Section 40 - Accessibility Standards</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Government shall formulate accessibility standards for physical environment, transportation, ICT and communications</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Section 42 - Access to Electronic Media</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Television programs to have subtitles and sign language interpretation for hearing impaired persons</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Section 61 - Duties of Government</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ensure accessibility of public buildings, transport, and ICT including websites</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Private Sector Encouragement</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Act encourages private entities to follow accessibility standards and provides incentives</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                <p className="text-sm font-medium">
                  <strong>National Policy:</strong> The Act mandates that accessibility should be integral to development programs. The Digital India initiative specifically includes digital accessibility as a key component for inclusive development.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className={`mt-12 p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg text-center`}>
          <h2 className="text-2xl font-bold mb-4">Ensure Global Compliance Today</h2>
          <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our AI-powered accessibility scanner checks your website against all major international standards and provides detailed remediation guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scanner"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm bg-[#00d4ff] text-white font-semibold hover:bg-[#00d4ff]/80 shadow-md transition-all duration-300 h-12 px-8 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              </svg>
              Scan Your Website Now
            </Link>
            <Link
              href="/dashboard"
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm border font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 h-12 px-8 py-2 ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
