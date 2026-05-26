export default function Terms() {
  return (
    <div className="min-h-screen bg-[var(--color-app-bg)] text-[var(--color-app-text)] p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-[var(--color-app-text-muted)] mb-8">Last Updated: October 2023</p>

      <div className="space-y-6 text-[var(--color-app-text-muted)] leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-app-text)] mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using the Lynk Creator Platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-app-text)] mb-4">2. Acceptable Use Policy</h2>
          <p>You agree not to use the platform for any illegal activities, spam, malware distribution, or to harass others. We reserve the right to terminate accounts that violate these guidelines without notice.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-app-text)] mb-4">3. Subscriptions & Billing</h2>
          <p>Paid features require a valid payment method. Subscriptions automatically renew unless canceled. Refunds are handled on a case-by-case basis according to our refund policy.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-app-text)] mb-4">4. Automation & API Usage</h2>
          <p>Users of our automation engine must adhere to fair use rate limits. Abuse of the execution engine or webhooks will result in immediate API key revocation.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-app-text)] mb-4">5. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the new terms.</p>
        </section>
      </div>
    </div>
  );
}
