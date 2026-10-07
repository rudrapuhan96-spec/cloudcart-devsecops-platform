import { NavLink } from 'react-router-dom'

const docSections = [
  {
    id: 'architecture',
    number: '01',
    title: 'Architecture',
    description: 'AWS and Kubernetes platform design',
  },
  {
    id: 'security',
    number: '02',
    title: 'Security',
    description: 'Controls, detection, and response',
  },
  {
    id: 'devsecops',
    number: '03',
    title: 'DevSecOps',
    description: 'CI/CD and security gates',
  },
  {
    id: 'operations',
    number: '04',
    title: 'Operations',
    description: 'Monitoring and troubleshooting',
  },
  {
    id: 'runbook',
    number: '05',
    title: 'Runbook',
    description: 'Incident and recovery procedures',
  },
  {
    id: 'interview',
    number: '06',
    title: 'Interview Notes',
    description: 'Explain the project clearly',
  },
]

function Docs() {
  return (
    <div className="docs-page">
      {/* DOCUMENT HEADER */}
      <section className="docs-header">
        <div className="container">
          <div className="docs-breadcrumb">
            CLOUDCART <span>/</span> DOCUMENTATION
          </div>

          <div className="docs-header-grid">
            <div>
              <div className="section-kicker">Documentation Portal</div>

              <h1 className="docs-title">
                Understand
                <br />
                <span>every layer.</span>
              </h1>

              <p className="docs-intro">
                CloudCart documentation connects architecture decisions,
                implementation details, security controls, operational
                workflows, and validation procedures.
              </p>
            </div>

            <div className="docs-meta">
              <div>
                <span>PROJECT</span>
                <strong>CloudCart</strong>
              </div>

              <div>
                <span>DOCUMENT TYPE</span>
                <strong>Engineering Guide</strong>
              </div>

              <div>
                <span>APPROACH</span>
                <strong>Explain + Validate</strong>
              </div>

              <div>
                <span>OWNER</span>
                <strong>Rudra Shankar Puhan</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOC LAYOUT */}
      <section className="docs-workspace">
        <div className="container docs-layout">
          {/* SIDEBAR */}
          <aside className="docs-sidebar">
            <div className="docs-sidebar-title">
              ON THIS PAGE
            </div>

            {docSections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                <span>{section.number}</span>

                <div>
                  <strong>{section.title}</strong>
                  <small>{section.description}</small>
                </div>
              </a>
            ))}

            <div className="docs-sidebar-footer">
              <span>PROJECT STATUS</span>
              <strong>ACTIVE BUILD</strong>
            </div>
          </aside>

          {/* DOCUMENT CONTENT */}
          <article className="docs-content">
            {/* OVERVIEW */}
            <section className="doc-section">
              <div className="doc-section-label">START HERE</div>

              <h2>What is CloudCart?</h2>

              <p>
                CloudCart is a secure cloud-native e-commerce platform
                designed to demonstrate application engineering, AWS
                infrastructure, Kubernetes operations, DevSecOps, security
                monitoring, observability, and resilience.
              </p>

              <div className="doc-callout">
                <strong>Engineering principle</strong>

                <p>
                  Every major component should have a clear purpose, a
                  documented implementation, and a validation path.
                </p>
              </div>
            </section>

            {/* ARCHITECTURE */}
            <section className="doc-section" id="architecture">
              <div className="doc-section-label">01 / ARCHITECTURE</div>

              <h2>Architecture model</h2>

              <p>
                CloudCart separates internet-facing traffic, application
                workloads, data services, messaging, identity, and security
                operations into distinct layers.
              </p>

              <div className="doc-code">
                <div className="doc-code-header">
                  <span>REQUEST FLOW</span>
                  <span>ARCHITECTURE</span>
                </div>

                <pre>
{`Customer
   |
Route 53
   |
CloudFront
   |
WAF
   |
ALB
   |
Amazon EKS
   |
+-------------------------+
| Catalog API             |
| Order API               |
| Order Worker            |
+-------------------------+
   |
+-------------------------+
| RDS MySQL               |
| DynamoDB                |
| SQS / Lambda / SNS      |
+-------------------------+`}
                </pre>
              </div>

              <div className="doc-two-column">
                <div>
                  <h3>Public boundary</h3>

                  <p>
                    The public-facing path is separated from internal
                    application and persistent data services.
                  </p>
                </div>

                <div>
                  <h3>Private workloads</h3>

                  <p>
                    Application and data services are designed to operate
                    behind controlled network and identity boundaries.
                  </p>
                </div>
              </div>
            </section>

            {/* SECURITY */}
            <section className="doc-section" id="security">
              <div className="doc-section-label">02 / SECURITY</div>

              <h2>Security model</h2>

              <p>
                CloudCart uses a defense-in-depth model across edge
                protection, identity, workload isolation, secrets, encryption,
                threat detection, and response.
              </p>

              <div className="doc-table">
                <div className="doc-table-row doc-table-head">
                  <span>CONTROL</span>
                  <span>PURPOSE</span>
                </div>

                <div className="doc-table-row">
                  <strong>WAF</strong>
                  <span>Protect public web traffic.</span>
                </div>

                <div className="doc-table-row">
                  <strong>IAM</strong>
                  <span>Control human and workload permissions.</span>
                </div>

                <div className="doc-table-row">
                  <strong>KMS</strong>
                  <span>Support encryption and key management.</span>
                </div>

                <div className="doc-table-row">
                  <strong>Secrets Manager</strong>
                  <span>Keep sensitive credentials outside source code.</span>
                </div>

                <div className="doc-table-row">
                  <strong>GuardDuty</strong>
                  <span>Detect supported suspicious activity.</span>
                </div>

                <div className="doc-table-row">
                  <strong>Security Hub</strong>
                  <span>Centralize security findings.</span>
                </div>
              </div>
            </section>

            {/* DEVSECOPS */}
            <section className="doc-section" id="devsecops">
              <div className="doc-section-label">03 / DEVSECOPS</div>

              <h2>Delivery lifecycle</h2>

              <p>
                The delivery pipeline is designed to validate changes before
                they reach the Kubernetes runtime.
              </p>

              <div className="doc-process">
                <div>
                  <span>01</span>
                  <strong>Commit</strong>
                  <small>GitHub</small>
                </div>

                <div>
                  <span>02</span>
                  <strong>Test</strong>
                  <small>Application checks</small>
                </div>

                <div>
                  <span>03</span>
                  <strong>Scan</strong>
                  <small>Security gates</small>
                </div>

                <div>
                  <span>04</span>
                  <strong>Build</strong>
                  <small>Docker</small>
                </div>

                <div>
                  <span>05</span>
                  <strong>Publish</strong>
                  <small>Amazon ECR</small>
                </div>

                <div>
                  <span>06</span>
                  <strong>Deploy</strong>
                  <small>EKS / Argo CD</small>
                </div>
              </div>

              <div className="doc-code">
                <div className="doc-code-header">
                  <span>SECURITY GATES</span>
                  <span>PIPELINE</span>
                </div>

                <pre>
{`Source Code
     |
     +-- Tests
     +-- Oxlint
     +-- CodeQL
     +-- Checkov
     |
Docker Build
     |
     +-- Trivy
     |
Amazon ECR
     |
Argo CD
     |
Amazon EKS`}
                </pre>
              </div>
            </section>

            {/* OPERATIONS */}
            <section className="doc-section" id="operations">
              <div className="doc-section-label">04 / OPERATIONS</div>

              <h2>Observability and troubleshooting</h2>

              <p>
                Operational visibility should help an engineer move from an
                alert to evidence and eventually to a root-cause hypothesis.
              </p>

              <div className="doc-steps">
                <div>
                  <span>01</span>
                  <strong>Alert</strong>
                  <p>Identify the abnormal signal.</p>
                </div>

                <div>
                  <span>02</span>
                  <strong>Metrics</strong>
                  <p>Determine scope and timing.</p>
                </div>

                <div>
                  <span>03</span>
                  <strong>Logs</strong>
                  <p>Inspect event-level context.</p>
                </div>

                <div>
                  <span>04</span>
                  <strong>Traces</strong>
                  <p>Follow the request path.</p>
                </div>

                <div>
                  <span>05</span>
                  <strong>Evidence</strong>
                  <p>Record what actually happened.</p>
                </div>
              </div>
            </section>

            {/* RUNBOOK */}
            <section className="doc-section" id="runbook">
              <div className="doc-section-label">05 / RUNBOOK</div>

              <h2>Incident response runbook</h2>

              <p>
                CloudCart is designed around controlled response rather than
                blindly deleting workloads when an alert appears.
              </p>

              <div className="runbook">
                <div className="runbook-row">
                  <span className="runbook-number">01</span>

                  <div>
                    <strong>Detect</strong>
                    <p>
                      Confirm that the event is a real signal and identify
                      the affected service.
                    </p>
                  </div>
                </div>

                <div className="runbook-row">
                  <span className="runbook-number">02</span>

                  <div>
                    <strong>Investigate</strong>
                    <p>
                      Collect useful event, identity, network, and workload
                      context.
                    </p>
                  </div>
                </div>

                <div className="runbook-row">
                  <span className="runbook-number">03</span>

                  <div>
                    <strong>Contain</strong>
                    <p>
                      Apply an appropriate controlled response when confidence
                      supports automation.
                    </p>
                  </div>
                </div>

                <div className="runbook-row">
                  <span className="runbook-number">04</span>

                  <div>
                    <strong>Recover</strong>
                    <p>
                      Restore the service using a trusted deployment or
                      recovery path.
                    </p>
                  </div>
                </div>

                <div className="runbook-row">
                  <span className="runbook-number">05</span>

                  <div>
                    <strong>Document</strong>
                    <p>
                      Preserve the timeline, evidence, root-cause findings,
                      and corrective actions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* INTERVIEW */}
            <section className="doc-section" id="interview">
              <div className="doc-section-label">06 / INTERVIEW NOTES</div>

              <h2>How to explain CloudCart</h2>

              <p>
                The project should be explainable as an engineering system,
                not as a list of technologies.
              </p>

              <div className="interview-doc">
                <div>
                  <span>WHY</span>
                  <strong>Why was this component needed?</strong>
                </div>

                <div>
                  <span>HOW</span>
                  <strong>How was it implemented?</strong>
                </div>

                <div>
                  <span>SECURITY</span>
                  <strong>How is it protected?</strong>
                </div>

                <div>
                  <span>TEST</span>
                  <strong>How was it validated?</strong>
                </div>

                <div>
                  <span>FAILURE</span>
                  <strong>What happens when it breaks?</strong>
                </div>

                <div>
                  <span>RECOVERY</span>
                  <strong>How does the system return to a trusted state?</strong>
                </div>
              </div>
            </section>

            {/* RELATED */}
            <section className="doc-section">
              <div className="doc-related">
                <div>
                  <span>RELATED AREAS</span>
                  <strong>Continue exploring CloudCart</strong>
                </div>

                <div className="doc-related-links">
                  <NavLink to="/architecture">
                    Architecture
                  </NavLink>

                  <NavLink to="/security">
                    Security
                  </NavLink>

                  <NavLink to="/cicd">
                    CI/CD
                  </NavLink>

                  <NavLink to="/evidence">
                    Evidence
                  </NavLink>
                </div>
              </div>
            </section>
          </article>
        </div>
      </section>
    </div>
  )
}

export default Docs