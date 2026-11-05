import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, ArrowLeft, Building2, UserCheck, CheckCircle2 } from 'lucide-react';
import Logo from '../assets/logo.png';

const PrivacyPolicy = () => {
  const lastUpdated = "November 5, 2026";

  return (
    <div className="min-h-screen bg-slate-50/80 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">AVG</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
              Franchise
            </span>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-10 md:p-12">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center pb-8 border-b border-slate-100">
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 mb-4 shadow-inner">
              <img src={Logo} alt="AVG Franchise Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-xs font-medium text-slate-400 mt-2">
              Effective Date: <span className="font-semibold text-slate-600">{lastUpdated}</span>
            </p>
            <p className="text-sm text-slate-500 max-w-xl mt-3 font-medium leading-relaxed">
              This Privacy Policy outlines how the AVG Franchise Operations Portal collects, utilizes, and protects operational, personal, and administrative data across our partner ecosystem.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="mt-8 space-y-8 text-slate-700 text-sm leading-relaxed">

            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                  1. Information We Collect
                </h2>
              </div>
              <p className="text-slate-600 pl-8">
                To manage franchise access, operational workflows, and organizational roles (Super Admin, Director, State Head, Sales Manager, Franchise Operator, Stockholder), we collect the following datasets:
              </p>
              <ul className="pl-8 space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Identity & Authentication Data:</strong> Full name, phone number, email address, designated User ID (e.g., AVG-TN-CHN-00125), and password credentials.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Franchise & Territory Details:</strong> Assigned branch office distributions, regional operations codes, state executive assignments, and territorial logs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Operational Activity:</strong> Portal access logs, session time, IP address, and role-based action tracking for administrative integrity.</span>
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                  2. How We Use Your Data
                </h2>
              </div>
              <p className="text-slate-600 pl-8">
                Data collected within the AVG Franchise portal strictly serves internal enterprise operations:
              </p>
              <ul className="pl-8 space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Authenticating user identities and routing users to designated role-based dashboards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Managing branch allocations, sales logistics, and regional performance monitoring.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Sending critical platform alerts, credential updates, and transactional security notices.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                  3. Data Security & Storage
                </h2>
              </div>
              <p className="text-slate-600 pl-8">
                We implement industry-standard encryption protocols (HTTPS/TLS) for data in transit and secure database hashing algorithms for sensitive authentication tokens. Access to regional performance metrics and personal details is strictly governed by role-based access controls (RBAC).
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Eye className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                  4. Third-Party Sharing
                </h2>
              </div>
              <p className="text-slate-600 pl-8">
                AVG Franchise does <strong>not</strong> sell, rent, or trade your personal or operational data to third-party advertisers. Data is shared exclusively with integrated transactional service providers (such as SMTP email delivery platforms) strictly necessary for system operation.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                  5. Contact & Support
                </h2>
              </div>
              <p className="text-slate-600 pl-8">
                If you have questions regarding account permissions, credential updates, or data privacy within the AVG Franchise portal, please contact the Super Admin team at:
              </p>
              <div className="ml-8 mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Franchise Desk Support</p>
                  <p className="text-sm font-semibold text-blue-600">support@avgprimetech.com</p>
                </div>
                <span className="text-xs text-slate-400 font-medium">Response within 24 business hours</span>
              </div>
            </section>

          </div>

          {/* Footer Section */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} AVG Franchise Portal. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enterprise Compliance Verified</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;