export default function Privacy() {
  return (
    <div className="min-h-screen bg-[var(--color-app-bg)] text-[var(--color-app-text)] p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-[var(--color-app-text-muted)] mb-8">Last Updated: October 2023</p>

      <div className="space-y-6 text-[var(--color-app-text-muted)] leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-app-text)] mb-4">1. Data Collection</h2>
          <p>We collect information you provide directly to us when creating an account, building a profile, or communicating with us. This includes email addresses, names, and profile content.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-app-text)] mb-4">2. Analytics & Tracking</h2>
          <p>We collect aggregated analytics data on profile views and link clicks to provide insights to creators. We use cookies and similar technologies to improve security and user experience.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-app-text)] mb-4">3. Third-Party Integrations</h2>
          <p>If you connect third-party apps via our integration marketplace, we may access data allowed by those providers (e.g., OAuth scopes). We do not store raw passwords for these services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-app-text)] mb-4">4. Data Security</h2>
          <p>We implement industry-standard security measures (SSL, encrypted tokens, Row Level Security) to protect your personal information.</p>
        </section>
      </div>
    </div>
  );
}
