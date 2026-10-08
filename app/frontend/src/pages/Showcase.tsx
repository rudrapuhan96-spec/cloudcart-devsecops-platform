import './Showcase.css'

const screenshots = [
  {
    src: '/showcase/cloudcart-store-1.png',
    title: 'CloudCart Store',
    description: 'Developer-focused CloudCart storefront experience.'
  },
  {
    src: '/showcase/cloudcart-store-2.png',
    title: 'DevOps Gear',
    description: 'Cloud and DevOps merchandise presentation.'
  },
  {
    src: '/showcase/cloudcart-store-3.png',
    title: 'CloudCart Storefront',
    description: 'Polished e-commerce visual experience.'
  }
]

export default function Showcase() {
  return (
    <main className="showcase-page">
      <section className="showcase-header">
        <div className="container">
          <div className="section-kicker">CloudCart Visual Showcase</div>
          <h1>Built for cloud builders.</h1>
          <p>
            A visual look at the CloudCart e-commerce experience.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container showcase-grid">
          {screenshots.map((shot) => (
            <article className="showcase-card" key={shot.src}>
              <img
                src={shot.src}
                alt={shot.title}
                loading="lazy"
                decoding="async"
              />
              <div className="showcase-info">
                <span>{shot.title}</span>
                <p>{shot.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
