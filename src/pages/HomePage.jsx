import {
  FaArrowRight,
  FaBullseye,
  FaCalendarCheck,
  FaChartLine,
  FaClipboardList,
  FaCheck,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: FaClipboardList,
    title: 'Track applications',
    description: 'Keep every role, status, and follow-up organized in one place.',
    tone: 'mint',
  },
  {
    icon: FaCalendarCheck,
    title: 'Manage interviews',
    description: 'Stay ready with interview dates, preparation notes, and reminders.',
    tone: 'lavender',
  },
  {
    icon: FaChartLine,
    title: 'Understand progress',
    description: 'See patterns in your job search and know where to focus next.',
    tone: 'blue',
  },
  {
    icon: FaBullseye,
    title: 'Move toward your goals',
    description: 'Turn your next career step into a clear, achievable plan.',
    tone: 'peach',
  },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="home-nav">
        <div className="home-nav-inner">
          <a className="home-brand" href="#home" aria-label="CareerHub home">
            <span className="home-brand-mark">C</span>
            <span>Career<span>Hub</span></span>
          </a>

          <nav className="home-nav-links" aria-label="Main navigation">
            <a className="active" href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About</a>
          </nav>

          <div className="home-nav-actions">
            <Link className="home-login" to="/login">Login</Link>
            <Link className="home-nav-cta" to="/register">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="home-hero" id="home">
          <div className="home-hero-inner">
            <div className="home-hero-copy">
              <p className="home-eyebrow">Track · Analyze · Improve · Grow</p>
              <h1>Track your<br /><span>job search journey.</span></h1>
              <p className="home-hero-description">
                Keep track of applications, manage interviews, and understand your progress —
                all in one simple place.
              </p>
              <div className="home-hero-actions">
                <Link className="home-primary-cta" to="/register">
                  Get started <FaArrowRight aria-hidden="true" />
                </Link>
                <a className="home-secondary-cta" href="#features">
                  Learn more
                </a>
              </div>
            </div>

            <div className="home-preview-wrap" aria-label="Simple illustration of a career search in progress">
              <div className="home-journey-card">
                <div className="home-journey-heading">
                  <span className="home-journey-mark">C</span>
                  <div>
                    <span className="home-preview-overline">YOUR CAREER JOURNEY</span>
                    <h2>One step at a time</h2>
                  </div>
                </div>
                <div className="home-journey-steps">
                  <div className="home-journey-step complete">
                    <span className="home-journey-step-icon"><FaCheck aria-hidden="true" /></span>
                    <span><strong>Apply</strong><small>Keep applications organized</small></span>
                    <span className="home-journey-step-state">Done</span>
                  </div>
                  <div className="home-journey-connector" />
                  <div className="home-journey-step current">
                    <span className="home-journey-step-icon">2</span>
                    <span><strong>Prepare</strong><small>Get ready for interviews</small></span>
                    <span className="home-journey-step-state">Next</span>
                  </div>
                  <div className="home-journey-connector" />
                  <div className="home-journey-step">
                    <span className="home-journey-step-icon">3</span>
                    <span><strong>Grow</strong><small>Learn from your progress</small></span>
                  </div>
                </div>
                <div className="home-journey-footer">
                  <span className="home-journey-footer-dot" />
                  <span>Your progress, all in one place</span>
                </div>
              </div>
              <span className="home-journey-decoration home-journey-decoration-one" />
              <span className="home-journey-decoration home-journey-decoration-two" />
            </div>
          </div>
        </section>

        <section className="home-feature-strip" id="features" aria-label="CareerHub features">
          <h2 className="home-features-title">Why CareerHub?</h2>
          <div className="home-feature-grid">
            {features.map(({ icon: Icon, title, description, tone }) => (
              <article className="home-feature" key={title}>
                <span className={`home-feature-icon ${tone}`}><Icon aria-hidden="true" /></span>
                <div>
                  <h2>{title}</h2>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-about" id="how-it-works">
          <div className="home-about-copy">
            <p className="home-eyebrow">A calmer way to move forward</p>
            <h2>More than just a tracker</h2>
          </div>
          <div className="home-about-detail" id="about">
            <p>
              CareerHub brings your applications, interviews, and career insights together.
              Spot what is working, prepare for what is next, and make every step count.
            </p>
            <Link to="/register">Start organizing your search <FaArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <a className="home-brand" href="#home">
          <span className="home-brand-mark">C</span>
          <span>Career<span>Hub</span></span>
        </a>
        <span>Your next opportunity starts with a clearer plan.</span>
        <Link to="/login">Sign in</Link>
      </footer>
    </div>
  );
}
