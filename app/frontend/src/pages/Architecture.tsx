import { NavLink } from 'react-router-dom'

const architectureLayers = [
  {
    number: '01',
    title: 'Edge Layer',
    description:
      'Internet-facing traffic enters through controlled AWS edge services before reaching application workloads.',
    services: ['Route 53', 'CloudFront', 'AWS WAF', 'ALB'],
  },
  {
    number: '02',
    title: 'Application Layer',
    description:
      'Containerized application services run inside Amazon EKS using isolated Kubernetes workloads.',
    services: ['EKS', 'Catalog API', 'Order API', 'Worker'],
  },
  {
    number: '03',
    title: 'Data & Messaging Layer',
    description:
      'Persistent data and asynchronous processing remain separated from the public application entry point.',
    services: ['RDS MySQL', 'DynamoDB', 'SQS', 'Lambda', 'SNS'],
  },
  {
    number: '04',
    title: 'Security & Operations',
    description:
      'Identity, encryption, audit, detection, monitoring, and event-driven response operate across the platform.',
    services: [
      'IAM',
      'KMS',
      'Secrets Manager',
      'CloudTrail',
      'GuardDuty',
      'Security Hub',
    ],
  },
]

const services = [
  ['Route 53', 'DNS routing'],
  ['CloudFront', 'Global content delivery'],
  ['WAF', 'Web request protection'],
  ['ALB', 'Application traffic routing'],
  ['EKS', 'Kubernetes compute platform'],
  ['RDS', 'Relational persistence'],
  ['SQS', 'Async order messaging'],
  ['Lambda', 'Event processing'],
]

function Architecture() {
  return (
    <div className="architecture-page">
      {/* Hero */}
      <section className="section architecture-hero">
        <div className="container">
          <div className="section-kicker">Architecture</div>

          <div className="architecture-hero-grid">
            <div>
              <h1 className="section-title architecture-title">
                The platform
                <br />
                <span>from request to recovery.</span>
              </h1>

              <p className="section-description architecture-description">
                CloudCart separates edge traffic, application workloads, data
                services, messaging, identity, and security operations into
                distinct layers.
              </p>

              <div className="hero-actions architecture-actions">
                <NavLink to="/security" className="primary-button">
                  Explore Security
                </NavLink>

                <NavLink to="/observability" className="secondary-button">
                  View Observability
                </NavLink>
              </div>
            </div>

            <div className="architecture-summary">
              <div className="architecture-summary-head">
                <span>PLATFORM MODEL</span>
                <span className="status-live">DESIGNED</span>
              </div>

              <div className="architecture-summary-value">
                Layered cloud architecture
              </div>

              <div className="architecture-summary-grid">
                <div>
                  <small>Compute</small>
                  <strong>EKS</strong>
                </div>

                <div>
                  <small>Data</small>
                  <strong>Private</strong>
                </div>

                <div>
                  <small>Delivery</small>
                  <strong>GitOps</strong>
                </div>

                <div>
                  <small>Security</small>
                  <strong>Defense in Depth</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Request flow */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Request Flow</div>

            <h2 className="section-title">
              How a customer request moves through CloudCart.
            </h2>

            <p className="section-description">
              The application is designed so public traffic reaches the
              application layer through controlled entry points, while data
              services remain behind the application boundary.
            </p>
          </div>

          <div className="architecture-flow">
            <div className="flow-node">
              <span className="flow-number">01</span>
              <strong>Customer</strong>
              <small>Browser / Client</small>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-node">
              <span className="flow-number">02</span>
              <strong>CloudFront</strong>
              <small>Edge delivery</small>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-node">
              <span className="flow-number">03</span>
              <strong>WAF</strong>
              <small>Request filtering</small>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-node">
              <span className="flow-number">04</span>
              <strong>ALB</strong>
              <small>Traffic routing</small>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-node">
              <span className="flow-number">05</span>
              <strong>EKS</strong>
              <small>Application services</small>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture layers */}
      <section className="section" id="layers">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Architecture Layers</div>

            <h2 className="section-title">
              Every layer has a specific responsibility.
            </h2>
          </div>

          <div className="architecture-layer-list">
            {architectureLayers.map((layer) => (
              <article className="architecture-layer" key={layer.number}>
                <div className="architecture-layer-number">
                  {layer.number}
                </div>

                <div className="architecture-layer-content">
                  <h3>{layer.title}</h3>

                  <p>{layer.description}</p>

                  <div className="service-tags">
                    {layer.services.map((service) => (
                      <span key={service} className="service-tag">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Network boundary */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Network Boundaries</div>

            <h2 className="section-title">
              Public entry points. Private workloads.
            </h2>

            <p className="section-description">
              A core design goal is to keep persistent data and internal
              workloads away from direct internet exposure.
            </p>
          </div>

          <div className="network-diagram">
            <div className="network-zone public-zone">
              <div className="network-zone-label">
                PUBLIC / EDGE
              </div>

              <div className="network-node">
                Route 53
              </div>

              <div className="network-node">
                CloudFront
              </div>

              <div className="network-node">
                WAF
              </div>

              <div className="network-node">
                ALB
              </div>
            </div>

            <div className="network-connector">
              <span>CONTROLLED TRAFFIC</span>
              <strong>↓</strong>
            </div>

            <div className="network-zone private-zone">
              <div className="network-zone-label">
                PRIVATE APPLICATION / DATA
              </div>

              <div className="network-node">
                EKS Workloads
              </div>

              <div className="network-node">
                Order Worker
              </div>

              <div className="network-node">
                RDS MySQL
              </div>

              <div className="network-node">
                DynamoDB
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event flow */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Event Architecture</div>

            <h2 className="section-title">
              Orders can be processed asynchronously.
            </h2>

            <p className="section-description">
              Decoupling long-running work from the synchronous API path helps
              separate customer requests from background processing.
            </p>
          </div>

          <div className="event-flow">
            <div className="event-node">
              <strong>Order API</strong>
              <span>Accept order</span>
            </div>

            <div className="event-arrow">→</div>

            <div className="event-node">
              <strong>SQS</strong>
              <span>Queue event</span>
            </div>

            <div className="event-arrow">→</div>

            <div className="event-node">
              <strong>Worker / Lambda</strong>
              <span>Process event</span>
            </div>

            <div className="event-arrow">→</div>

            <div className="event-node">
              <strong>Data</strong>
              <span>Persist result</span>
            </div>

            <div className="event-arrow">→</div>

            <div className="event-node">
              <strong>SNS</strong>
              <span>Notify</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service inventory */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Service Inventory</div>

            <h2 className="section-title">
              What each major service is doing.
            </h2>
          </div>

          <div className="service-table">
            <div className="service-table-head">
              <span>Service</span>
              <span>Responsibility</span>
            </div>

            {services.map(([service, responsibility]) => (
              <div className="service-table-row" key={service}>
                <strong>{service}</strong>
                <span>{responsibility}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering decisions */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">Engineering Decisions</div>

            <h2 className="section-title">
              Architecture decisions should have a reason.
            </h2>

            <p className="section-description">
              The final documentation will connect each infrastructure
              decision to its operational, security, scalability, or
              maintainability objective.
            </p>
          </div>

          <div className="engineering-grid">
            <article className="engineering-card">
              <h3>Private Data Plane</h3>
              <p>
                Persistent data should not require direct internet exposure
                for normal application operation.
              </p>
            </article>

            <article className="engineering-card">
              <h3>Asynchronous Processing</h3>
              <p>
                Queue-based processing separates background work from the
                customer-facing request path.
              </p>
            </article>

            <article className="engineering-card">
              <h3>Infrastructure as Code</h3>
              <p>
                Terraform keeps infrastructure changes version-controlled,
                reviewable, reproducible, and testable.
              </p>
            </article>

            <article className="engineering-card">
              <h3>Observable Services</h3>
              <p>
                Metrics, logs, traces, and audit records provide operational
                evidence when the platform behaves unexpectedly.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="section">
        <div className="container">
          <div className="security-main">
            <div className="section-kicker">Continue Exploring</div>

            <h2 className="section-title">
              Architecture is only one layer of the platform.
            </h2>

            <p className="section-description">
              Move into security, CI/CD, or observability to see how the
              infrastructure is protected, delivered, and monitored.
            </p>

            <div className="hero-actions">
              <NavLink to="/security" className="primary-button">
                Security Center
              </NavLink>

              <NavLink to="/cicd" className="secondary-button">
                CI/CD Pipeline
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

export default Architecture