# MIPP Security Architecture & Statutory Compliance (`SECURITY.md`)

## 1. Compliance Framework
MIPP adheres to official Government of Maharashtra and MeitY cybersecurity standards:
- **Digital Personal Data Protection Act (DPDPA 2023)**: Strict data localization within MeitY-empanelled Indian cloud infrastructure.
- **CERT-In Safe-to-Host Standards**: Mandatory vulnerability assessment and penetration testing (VAPT) for all startup software deployments.
- **Official Secrets Act**: Encrypted transmission and storage of sensitive municipal telemetry.

## 2. Security Controls & Protections
- **Authentication & RBAC**: JWT Bearer token authentication with Role-Based Access Control enforcing `GOVERNMENT`, `STARTUP`, `EVALUATOR`, `VALIDATOR`, and `ADMIN` boundaries.
- **SHA-256 Audit Logging**: Every critical action (Challenge Created, Evaluator Assigned, Conflict Declared, Payment Released, Evidence Verified, Scale Decision Made) is cryptographically signed with a SHA-256 hash in `MippAuditLog`.
- **Blind Evaluation Identity Redaction**: Startup identity details, company names, and founder PII are masked in Blind Review mode to eliminate evaluation bias.
- **Conflict of Interest Auto-Blocking**: If an evaluator declares a conflict, assignment is immediately blocked and transferred to an alternate expert with an immutable audit record.
