import { NavLink } from 'react-router-dom'

const securityControls = [
  {
    title: 'AWS WAF',
    category: 'EDGE PROTECTION',
    description:
      'Filters web requests before they reach the application entry point.',
    status: 'DESIGNED',
  },
  {
    title: 'IAM',
    category: 'IDENTITY',
    description:
      'Separates human and workload permissions using least-privilege access.',
    status: 'DESIGNED',
  },
  {
    title: 'Secrets Manager',
    category: 'SECRETS',
    description:
      'Keeps application credentials outside source code and container images.',
    status: 'DESIGNED',
  },
  {
    title: 'KMS',
    category: 'ENCRYPTION',
    description:
      'Provides centralized key management for protected data and secrets.',
    status: 'DESIGNED',
  },
  {
    title: 'GuardDuty',
    category: 'THREAT DETECTION',
    description:
      'Detects suspicious activity and security findings across supported AWS resources.',
    status: 'PLANNED',
  },
  {
    title: 'Security Hub',
    category: 'FINDINGS',
    description:
      'Centralizes security findings for investigation and response workflows.',
    status: 'PLANNED',
  },
]

const responseStages = [
  ['01', 'Detect', 'Security signal appears'],
  ['02', 'Enrich', 'Collect useful event context'],
  ['03', 'Alert', 'Route notification to operators'],
  ['04', 'Contain', 'Apply controlled response'],
  ['05', 'Recover', 'Restore trusted service state'],
  ['06', 'Audit', 'Preserve evidence and timeline'],
]

function Security() {
  return (
    <div className="security-page">
      {/* HERO */}
      <section className="section security-hero">
        <div className="container">
          <div className="section-kicker">Security Operations</div>

          <div className="security-hero-grid">
            <div>
              <h1 className="section-title security-title">
                Security is not a feature.
                <br />
                <span>It is the operating model.</span>
              </h1>

              <p className="section-description security-description">
                CloudCart uses multiple security layers across the application
                edge, identity, workloads, data, detection, monitoring, and
                incident response.
              </p>

              <div className="hero-actions">
                <NavLink to="/cicd" className="primary-button">
                  Security in CI/CD
                </NavLink>

                <NavLink to="/evidence" className="secondary-button">
                  View Evidence
                </NavLink>
              </div>
            </div>

            <div className="security-command-card">
              <div className="security-command-top">
                <span>SECURITY POSTURE</span>
                <span className="status-live">DEFENSE IN DEPTH</span>
              </div>

              <div className="security-command-title">
                CloudCart Security Center
              </div>

              <div className="security-command-grid">
                <div>
                  <small>Prevention</small>
                  <strong>Multi-layer</strong>
                </div>

                <div>
                  <small>Detection</small>
                  <strong>Continuous</strong>
                </div>

                <div>
                  <small>Response</small>
                  <strong>Controlled</strong>
                </div>

                <div>
                  <small>Evidence</small>
                  <strong>Auditable</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY PHILOSOPHY */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Security Model</div>

            <h2 className="section-title">
              Prevent the issue before detection is required.
            </h2>

            <p className="section-description">
              Security controls are layered so a single failed control does
              not become the only line of defense.
            </p>
          </div>

          <div className="security-philosophy-grid">
            <article className="security-philosophy-card">
              <span className="security-card-number">01</span>
              <h3>Reduce Exposure</h3>
              <p>
                Keep unnecessary public access away from application and data
                services.
              </p>
            </article>

            <article className="security-philosophy-card">
              <span className="security-card-number">02</span>
              <h3>Reduce Privilege</h3>
              <p>
                Give users and workloads only the permissions needed for their
                responsibilities.
              </p>
            </article>

            <article className="security-philosophy-card">
              <span className="security-card-number">03</span>
              <h3>Detect Quickly</h3>
              <p>
                Collect security signals and route useful findings to an
                investigation path.
              </p>
            </article>

            <article className="security-philosophy-card">
              <span className="security-card-number">04</span>
              <h3>Recover Safely</h3>
              <p>
                Containment should preserve recovery options and evidence
                rather than destroy the environment blindly.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="section" id="controls">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Security Controls</div>

            <h2 className="section-title">
              Controls across the entire attack surface.
            </h2>

            <p className="section-description">
              Each control has a defined responsibility instead of being
              added only for technology coverage.
            </p>
          </div>

          <div className="security-control-grid">
            {securityControls.map((control) => (
              <article className="security-control-card" key={control.title}>
                <div className="security-control-top">
                  <span className="security-control-category">
                    {control.category}
                  </span>

                  <span className="security-control-status">
                    {control.status}
                  </span>
                </div>

                <h3>{control.title}</h3>

                <p>{control.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* THREAT FLOW */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Detection Pipeline</div>

            <h2 className="section-title">
              One signal should create an operational timeline.
            </h2>

            <p className="section-description">
              A security event should move through detection, context,
              notification, controlled containment, recovery, and audit.
            </p>
          </div>

          <div className="response-flow">
            {responseStages.map(([number, title, description], index) => (
              <div className="response-stage" key={number}>
                <div className="response-stage-number">{number}</div>

                <div>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>

                {index < responseStages.length - 1 && (
                  <div className="response-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INCIDENT RESPONSE */}
      <section className="section">
        <div className="container">
          <div className="security-incident">
            <div>
              <div className="section-kicker">Incident Response</div>

              <h2 className="section-title">
                Automated response should be controlled.
              </h2>

              <p className="section-description">
                CloudCart is designed around confidence-based response:
                investigate first, preserve evidence, and apply automated
                containment only where the detection and response path
                supports it.
              </p>
            </div>

            <div className="incident-rules">
              <div className="incident-rule">
                <div className="incident-severity medium">
                  MEDIUM
                </div>

                <div>
                  <strong>Investigate</strong>
                  <span>
                    Collect context and notify the operator.
                  </span>
                </div>
              </div>

              <div className="incident-rule">
                <div className="incident-severity high">
                  HIGH
                </div>

                <div>
                  <strong>Contain</strong>
                  <span>
                    Apply a predefined containment workflow when confidence is
                    sufficient.
                  </span>
                </div>
              </div>

              <div className="incident-rule">
                <div className="incident-severity recovery">
                  RECOVERY
                </div>

                <div>
                  <strong>Restore</strong>
                  <span>
                    Recover from a trusted deployment or backup path.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DATABASE PROTECTION */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Data Protection</div>

            <h2 className="section-title">
              The database gets its own security boundary.
            </h2>

            <p className="section-description">
              Persistent data should not depend on the security of a single
              application component. Network access, identity, encryption,
              credentials, backups, and monitoring work together.
            </p>
          </div>

          <div className="engineering-grid">
            <article className="engineering-card">
              <h3>Private Access</h3>
              <p>
                Application workloads communicate with persistent data through
                controlled private network paths.
              </p>
            </article>

            <article className="engineering-card">
              <h3>Credentials</h3>
              <p>
                Database credentials are intended to be managed separately
                from application source code and images.
              </p>
            </article>

            <article className="engineering-card">
              <h3>Encryption</h3>
              <p>
                Data protection includes encryption controls and centrally
                managed keys where appropriate.
              </p>
            </article>

            <article className="engineering-card">
              <h3>Recovery</h3>
              <p>
                Backup and recovery paths are part of the security design so
                an incident does not automatically become data loss.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* VALIDATION */}
      <section className="section" id="validation">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Security Validation</div>

            <h2 className="section-title">
              A security control is useful only when it can be tested.
            </h2>

            <p className="section-description">
              CloudCart will use controlled test scenarios to validate
              prevention, detection, alerting, containment, and recovery
              without creating a real-world compromise.
            </p>
          </div>

          <div className="product-grid">
            <article className="product-card">
              <div className="product-tag">Test 01</div>

              <h3>Unauthorized Access</h3>

              <p>
                Verify that unauthorized requests do not receive access to
                protected application or data paths.
              </p>
            </article>

            <article className="product-card">
              <div className="product-tag">Test 02</div>

              <h3>Security Finding</h3>

              <p>
                Generate a controlled security finding and trace it through
                the notification workflow.
              </p>
            </article>

            <article className="product-card">
              <div className="product-tag">Test 03</div>

              <h3>Containment & Recovery</h3>

              <p>
                Validate a controlled response workflow and document how the
                affected workload returns to a trusted state.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* NAVIGATION */}
      <section className="section">
        <div className="container">
          <div className="security-main">
            <div className="section-kicker">Continue</div>

            <h2 className="section-title">
              Security does not stop at runtime.
            </h2>

            <p className="section-description">
              Continue into the CI/CD pipeline to see how security checks are
              integrated before deployment.
            </p>

            <div className="hero-actions">
              <NavLink to="/cicd" className="primary-button">
                Open CI/CD
              </NavLink>

              <NavLink to="/observability" className="secondary-button">
                Open Observability
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Security
