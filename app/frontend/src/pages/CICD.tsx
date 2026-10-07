import { NavLink } from 'react-router-dom'

const pipelineStages = [
  {
    number: '01',
    title: 'Source',
    tool: 'GitHub',
    description: 'Code change starts with a version-controlled commit.',
  },
  {
    number: '02',
    title: 'Validate',
    tool: 'Tests + Lint',
    description: 'Application code and configuration are checked before build.',
  },
  {
    number: '03',
    title: 'Secure',
    tool: 'CodeQL + Checkov',
    description: 'Code and infrastructure are inspected for security issues.',
  },
  {
    number: '04',
    title: 'Build',
    tool: 'Docker',
    description: 'Application components are packaged into container images.',
  },
  {
    number: '05',
    title: 'Scan',
    tool: 'Trivy + ECR',
    description: 'Container images are checked before becoming deployable artifacts.',
  },
  {
    number: '06',
    title: 'Deploy',
    tool: 'Argo CD + EKS',
    description: 'Validated application state is delivered to Kubernetes.',
  },
]

const securityGates = [
  ['Application', 'Tests', 'Verify expected application behavior.'],
  ['Quality', 'Oxlint', 'Catch code-quality problems before delivery.'],
  ['Infrastructure', 'Checkov', 'Inspect infrastructure configuration against security policies.'],
  ['Code Security', 'CodeQL', 'Analyze source code for security-relevant patterns.'],
  ['Container', 'Trivy', 'Scan container images for known vulnerabilities.'],
  ['Registry', 'ECR', 'Store container artifacts in the AWS container registry.'],
]

function CICD() {
  return (
    <div className="cicd-page">
      {/* HERO */}
      <section className="section cicd-hero">
        <div className="container">
          <div className="section-kicker">DevSecOps / CI/CD</div>

          <div className="cicd-hero-grid">
            <div>
              <h1 className="section-title cicd-title">
                Ship changes
                <br />
                <span>through security gates.</span>
              </h1>

              <p className="section-description cicd-description">
                CloudCart treats delivery as a chain of validation steps:
                source control, testing, security analysis, containerization,
                image scanning, and controlled Kubernetes deployment.
              </p>

              <div className="hero-actions">
                <NavLink to="/security" className="primary-button">
                  Security Center
                </NavLink>

                <NavLink to="/evidence" className="secondary-button">
                  View Evidence
                </NavLink>
              </div>
            </div>

            <div className="cicd-command-card">
              <div className="cicd-command-top">
                <span>DELIVERY MODEL</span>
                <span className="status-live">GIT → BUILD → DEPLOY</span>
              </div>

              <div className="cicd-command-title">
                CloudCart Delivery Pipeline
              </div>

              <div className="cicd-command-grid">
                <div>
                  <small>Source</small>
                  <strong>GitHub</strong>
                </div>

                <div>
                  <small>Build</small>
                  <strong>Docker</strong>
                </div>

                <div>
                  <small>Registry</small>
                  <strong>ECR</strong>
                </div>

                <div>
                  <small>Runtime</small>
                  <strong>EKS</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Pipeline</div>

            <h2 className="section-title">
              From commit to running workload.
            </h2>

            <p className="section-description">
              Each stage has a distinct responsibility, making failures easier
              to identify and preventing unsafe artifacts from moving forward.
            </p>
          </div>

          <div className="pipeline-track">
            {pipelineStages.map((stage, index) => (
              <div className="pipeline-stage" key={stage.number}>
                <div className="pipeline-stage-top">
                  <span className="pipeline-number">{stage.number}</span>
                  <span className="pipeline-tool">{stage.tool}</span>
                </div>

                <h3>{stage.title}</h3>

                <p>{stage.description}</p>

                {index < pipelineStages.length - 1 && (
                  <div className="pipeline-connector">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY GATES */}
      <section className="section" id="gates">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Security Gates</div>

            <h2 className="section-title">
              Security checks belong inside the delivery path.
            </h2>

            <p className="section-description">
              The final pipeline will run these checks as part of the
              development lifecycle rather than waiting until after deployment.
            </p>
          </div>

          <div className="security-gate-grid">
            {securityGates.map(([category, tool, description], index) => (
              <article className="security-gate-card" key={tool}>
                <div className="security-gate-top">
                  <span>GATE {String(index + 1).padStart(2, '0')}</span>
                  <span className="security-gate-state">DEFINED</span>
                </div>

                <div className="security-gate-category">
                  {category}
                </div>

                <h3>{tool}</h3>

                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OIDC */}
      <section className="section">
        <div className="container">
          <div className="cicd-feature-panel">
            <div>
              <div className="section-kicker">AWS Authentication</div>

              <h2 className="section-title">
                CI should not depend on permanent AWS keys.
              </h2>

              <p className="section-description">
                The planned GitHub Actions integration uses GitHub OIDC with an
                AWS IAM role so the workflow can obtain short-lived
                credentials instead of storing long-lived access keys in
                repository secrets.
              </p>
            </div>

            <div className="oidc-flow">
              <div className="oidc-node">
                <strong>GitHub Actions</strong>
                <span>Workflow</span>
              </div>

              <div className="oidc-arrow">→</div>

              <div className="oidc-node">
                <strong>OIDC</strong>
                <span>Identity token</span>
              </div>

              <div className="oidc-arrow">→</div>

              <div className="oidc-node">
                <strong>AWS IAM Role</strong>
                <span>Temporary access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTAINERS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Container Delivery</div>

            <h2 className="section-title">
              Build once. Scan before deployment.
            </h2>

            <p className="section-description">
              Application services are packaged as Docker images, scanned for
              known issues, and stored as deployable artifacts before they are
              promoted into the Kubernetes environment.
            </p>
          </div>

          <div className="container-delivery">
            <div className="container-step">
              <span>01</span>
              <strong>Source</strong>
              <small>Application repository</small>
            </div>

            <div className="container-arrow">→</div>

            <div className="container-step">
              <span>02</span>
              <strong>Docker Build</strong>
              <small>Versioned image</small>
            </div>

            <div className="container-arrow">→</div>

            <div className="container-step">
              <span>03</span>
              <strong>Trivy Scan</strong>
              <small>Vulnerability inspection</small>
            </div>

            <div className="container-arrow">→</div>

            <div className="container-step">
              <span>04</span>
              <strong>Amazon ECR</strong>
              <small>Artifact registry</small>
            </div>

            <div className="container-arrow">→</div>

            <div className="container-step">
              <span>05</span>
              <strong>EKS</strong>
              <small>Runtime deployment</small>
            </div>
          </div>
        </div>
      </section>

      {/* GITOPS */}
      <section className="section">
        <div className="container">
          <div className="engineering-grid">
            <article className="engineering-card">
              <h3>Git as Desired State</h3>

              <p>
                Kubernetes configuration is intended to remain reviewable in
                Git so deployment changes have a visible history.
              </p>
            </article>

            <article className="engineering-card">
              <h3>Helm Packaging</h3>

              <p>
                Application deployment configuration can be packaged and
                parameterized using Helm.
              </p>
            </article>

            <article className="engineering-card">
              <h3>Argo CD</h3>

              <p>
                The planned GitOps controller continuously reconciles the
                declared application state with the Kubernetes environment.
              </p>
            </article>

            <article className="engineering-card">
              <h3>Rollback</h3>

              <p>
                A deployment should have a documented rollback path so an
                unhealthy release can be replaced by a trusted version.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* RELEASE SAFETY */}
      <section className="section">
        <div className="container">
          <div className="cicd-release-panel">
            <div>
              <div className="section-kicker">Release Safety</div>

              <h2 className="section-title">
                Deployment should be reversible.
              </h2>

              <p className="section-description">
                CloudCart will validate controlled release behavior including
                rolling updates, health checks, failure detection, and
                rollback to a known-good application version.
              </p>
            </div>

            <div className="release-checks">
              <div className="release-check">
                <span>01</span>
                <strong>Health checks</strong>
              </div>

              <div className="release-check">
                <span>02</span>
                <strong>Rolling update</strong>
              </div>

              <div className="release-check">
                <span>03</span>
                <strong>Failure detection</strong>
              </div>

              <div className="release-check">
                <span>04</span>
                <strong>Rollback</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVIDENCE NAV */}
      <section className="section">
        <div className="container">
          <div className="security-main">
            <div className="section-kicker">Proof</div>

            <h2 className="section-title">
              The pipeline will be backed by real evidence.
            </h2>

            <p className="section-description">
              Final documentation will show workflow runs, validation output,
              security scan results, image information, deployment history,
              and rollback tests from the actual CloudCart environment.
            </p>

            <div className="hero-actions">
              <NavLink to="/evidence" className="primary-button">
                Evidence Center
              </NavLink>

              <NavLink to="/observability" className="secondary-button">
                Observability
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CICD