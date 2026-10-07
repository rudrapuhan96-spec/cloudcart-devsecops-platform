import { NavLink } from 'react-router-dom'

function Overview() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="eyebrow">
            <span className="status-dot" />
            Cloud-native e-commerce engineering platform
          </div>

          <h1>
            Shopping built on
            <br />
            <span>modern cloud infrastructure.</span>
          </h1>

          <p>
            CloudCart is a secure cloud-native e-commerce platform built to
            demonstrate AWS, Kubernetes, Terraform, DevSecOps, observability,
            event-driven architecture, and automated security response.
          </p>

          <div className="hero-actions">
            <NavLink to="/architecture" className="primary-button">
              Explore Architecture
            </NavLink>

            <NavLink to="/security" className="secondary-button">
              Open Security Center
            </NavLink>
          </div>

          <div className="status-grid">
            <div className="status-card">
              <div className="status-card-label">Platform</div>
              <div className="status-card-value">
                Cloud-native
              </div>
            </div>

            <div className="status-card">
              <div className="status-card-label">Compute</div>
              <div className="status-card-value">
                Amazon EKS
              </div>
            </div>

            <div className="status-card">
              <div className="status-card-label">Infrastructure</div>
              <div className="status-card-value">
                Terraform
              </div>
            </div>

            <div className="status-card">
              <div className="status-card-label">Security</div>
              <div className="status-card-value status-live">
                Defense in Depth
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM OVERVIEW */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Overview</div>

            <h2 className="section-title">
              One platform. Multiple engineering layers.
            </h2>

            <p className="section-description">
              CloudCart combines application development, infrastructure,
              platform engineering, security, CI/CD, observability, and
              resilience into one end-to-end system.
            </p>
          </div>

          <div className="product-grid">
            <article className="product-card">
              <div className="product-tag">Application</div>

              <h3>React Storefront</h3>

              <p>
                A real customer-facing shopping interface for browsing
                products, interacting with carts, and creating orders.
              </p>
            </article>

            <article className="product-card">
              <div className="product-tag">Services</div>

              <h3>Containerized APIs</h3>

              <p>
                Node.js and TypeScript services separate catalog,
                cart, and order responsibilities into independently
                deployable workloads.
              </p>
            </article>

            <article className="product-card">
              <div className="product-tag">Platform</div>

              <h3>Amazon EKS</h3>

              <p>
                Kubernetes provides service discovery, workload scheduling,
                health checks, autoscaling, controlled deployments, and
                workload isolation.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ENGINEERING */}
      <section className="section" id="engineering">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Engineering</div>

            <h2 className="section-title">
              Designed like a production platform.
            </h2>

            <p className="section-description">
              Instead of treating cloud services as isolated technologies,
              CloudCart connects them around real application and operational
              requirements.
            </p>
          </div>

          <div className="engineering-grid">
            <article className="engineering-card">
              <h3>AWS Infrastructure</h3>

              <p>
                VPC networking, private application workloads, load
                balancing, storage, identity, encryption, managed databases,
                messaging, and monitoring.
              </p>
            </article>

            <article className="engineering-card">
              <h3>Infrastructure as Code</h3>

              <p>
                Terraform defines infrastructure in version-controlled code
                so changes can be reviewed, validated, reproduced, and
                destroyed cleanly.
              </p>
            </article>

            <article className="engineering-card">
              <h3>DevSecOps Pipeline</h3>

              <p>
                Source changes move through testing, linting, infrastructure
                validation, security scanning, image building, and controlled
                deployment stages.
              </p>
            </article>

            <article className="engineering-card">
              <h3>GitOps Delivery</h3>

              <p>
                Kubernetes desired state is represented through Git and
                deployed using Helm and Argo CD for traceability and
                controlled releases.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* SECURITY PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Security Operations</div>

            <h2 className="section-title">
              Security is part of the platform lifecycle.
            </h2>

            <p className="section-description">
              CloudCart is designed around prevention, detection, alerting,
              investigation, controlled containment, and recovery.
            </p>
          </div>

          <div className="security-panel">
            <div className="security-main">
              <h3>Detect → Alert → Contain → Recover</h3>

              <p>
                Security controls are connected instead of being treated as
                separate checklist items. Findings can flow through detection
                and event-routing systems into controlled response workflows.
              </p>

              <div className="security-flow">
                <div className="security-step">
                  <strong>Prevent</strong>
                  <span>WAF · IAM · Network Policy</span>
                </div>

                <div className="security-step">
                  <strong>Detect</strong>
                  <span>GuardDuty · CloudTrail</span>
                </div>

                <div className="security-step">
                  <strong>Alert</strong>
                  <span>Security Hub · EventBridge</span>
                </div>

                <div className="security-step">
                  <strong>Recover</strong>
                  <span>Rollback · Restore · Evidence</span>
                </div>
              </div>
            </div>

            <div className="security-list">
              <div className="security-item">
                <strong>Application Edge</strong>

                <span>
                  Public traffic is designed to pass through controlled
                  entry points before reaching private workloads.
                </span>
              </div>

              <div className="security-item">
                <strong>Workload Isolation</strong>

                <span>
                  Kubernetes workloads and data services are separated using
                  identity and network-level controls.
                </span>
              </div>

              <div className="security-item">
                <strong>Secrets Protection</strong>

                <span>
                  Application secrets are intended to stay outside source
                  code and container images.
                </span>
              </div>

              <div className="security-item">
                <strong>Response Automation</strong>

                <span>
                  High-confidence security events can feed controlled
                  notification and containment workflows.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OBSERVABILITY PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Observability</div>

            <h2 className="section-title">
              Visibility across the entire platform.
            </h2>

            <p className="section-description">
              The final platform will connect infrastructure metrics,
              application telemetry, audit events, and security findings.
            </p>
          </div>

          <div className="observability">
            <div className="metric-card">
              <div className="metric-label">Metrics</div>
              <div className="metric-value">CloudWatch</div>
              <div className="metric-note">
                Infrastructure and workload monitoring
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Tracing</div>
              <div className="metric-value">OpenTelemetry</div>
              <div className="metric-note">
                Distributed request visibility
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Audit</div>
              <div className="metric-value">CloudTrail</div>
              <div className="metric-note">
                AWS activity and security evidence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NAVIGATION */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Explore</div>

            <h2 className="section-title">
              Go deeper into the platform.
            </h2>

            <p className="section-description">
              Each area will have its own dedicated page with architecture
              decisions, implementation details, validation evidence, and
              operational workflows.
            </p>
          </div>

          <div className="product-grid">
            <NavLink to="/architecture" className="product-card">
              <div className="product-tag">01</div>
              <h3>Architecture</h3>
              <p>
                Explore network layers, traffic flow, compute, data, and
                service relationships.
              </p>
            </NavLink>

            <NavLink to="/cicd" className="product-card">
              <div className="product-tag">02</div>
              <h3>CI/CD</h3>
              <p>
                Follow the complete build, security scanning, image delivery,
                and deployment lifecycle.
              </p>
            </NavLink>

            <NavLink to="/evidence" className="product-card">
              <div className="product-tag">03</div>
              <h3>Evidence</h3>
              <p>
                Review the tests and proof collected during infrastructure,
                security, and resilience validation.
              </p>
            </NavLink>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section">
        <div className="container">
          <div className="security-main">
            <div className="section-kicker">CloudCart</div>

            <h2 className="section-title">
              Built to demonstrate cloud engineering end to end.
            </h2>

            <p className="section-description">
              The goal is not to showcase the maximum number of AWS services.
              The goal is to show why each component exists, how the pieces
              interact, how the platform is secured, and how the system is
              actually validated.
            </p>

            <div className="hero-actions">
              <NavLink to="/architecture" className="primary-button">
                View Architecture
              </NavLink>

              <NavLink to="/docs" className="secondary-button">
                Read Documentation
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Overview