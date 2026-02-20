export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  code: string;
  tags: string[];
}

export const componentTemplates: ComponentTemplate[] = [
  {
    id: "hero-gradient",
    name: "Hero Section",
    description: "A stunning hero section with gradient background and CTA",
    category: "Landing",
    thumbnail: "🚀",
    tags: ["hero", "landing", "gradient"],
    code: `export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm text-purple-200 backdrop-blur">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Now Available
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          Build amazing products
          <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            faster than ever
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          The modern platform for building beautiful, responsive web applications with ease.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all hover:scale-105">
            Get Started Free
          </button>
          <button className="px-8 py-4 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
}`
  },
  {
    id: "pricing-cards",
    name: "Pricing Cards",
    description: "Modern pricing cards with hover effects",
    category: "Pricing",
    thumbnail: "💰",
    tags: ["pricing", "cards", "saas"],
    code: `export default function PricingCards() {
  const plans = [
    { name: "Starter", price: "$9", features: ["5 Projects", "Basic Analytics", "Email Support"] },
    { name: "Pro", price: "$29", features: ["Unlimited Projects", "Advanced Analytics", "Priority Support", "API Access"], popular: true },
    { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Dedicated Manager", "Custom Integrations", "SLA Guarantee"] },
  ];
  
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
        {plans.map((plan) => (
          <div key={plan.name} className={\`relative p-8 rounded-2xl bg-slate-900 border transition-all hover:-translate-y-2 hover:shadow-xl \${plan.popular ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-slate-800'}\`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-xs font-semibold rounded-full text-white">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              <span className="text-slate-400 mb-1">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className={\`mt-8 w-full py-3 rounded-xl font-semibold transition-all \${plan.popular ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-slate-800 text-white hover:bg-slate-700'}\`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`
  },
  {
    id: "feature-grid",
    name: "Feature Grid",
    description: "Icon-based feature grid layout",
    category: "Features",
    thumbnail: "✨",
    tags: ["features", "grid", "icons"],
    code: `export default function FeatureGrid() {
  const features = [
    { icon: "⚡", title: "Lightning Fast", desc: "Optimized performance for the best user experience" },
    { icon: "🔒", title: "Secure by Default", desc: "Enterprise-grade security built into every layer" },
    { icon: "🎨", title: "Beautiful Design", desc: "Stunning UI components ready to use" },
    { icon: "📱", title: "Fully Responsive", desc: "Works perfectly on all devices and screens" },
    { icon: "🔧", title: "Easy Integration", desc: "Seamlessly integrates with your existing tools" },
    { icon: "🚀", title: "Scalable", desc: "Grows with your business from startup to enterprise" },
  ];
  
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Everything you need</h2>
          <p className="text-slate-400 text-lg">Powerful features to build amazing products</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "testimonials",
    name: "Testimonials",
    description: "Customer testimonials with avatars",
    category: "Social Proof",
    thumbnail: "💬",
    tags: ["testimonials", "reviews", "social proof"],
    code: `export default function Testimonials() {
  const testimonials = [
    { name: "Sarah Chen", role: "CEO at TechCorp", text: "This product completely transformed how we work. Highly recommended!", avatar: "👩‍💼" },
    { name: "Mike Johnson", role: "Developer", text: "The best developer experience I've ever had. Clean, fast, and intuitive.", avatar: "👨‍💻" },
    { name: "Emily Davis", role: "Designer", text: "Beautiful components that save me hours of work every week.", avatar: "👩‍🎨" },
  ];
  
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Loved by thousands</h2>
          <p className="text-slate-400 text-lg">See what our customers have to say</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl">{t.avatar}</div>
                <div>
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-slate-400">{t.role}</div>
                </div>
              </div>
              <p className="text-slate-300 italic">"{t.text}"</p>
              <div className="mt-4 flex text-yellow-400">⭐⭐⭐⭐⭐</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "navbar",
    name: "Navigation Bar",
    description: "Responsive navigation with mobile menu",
    category: "Navigation",
    thumbnail: "📍",
    tags: ["navbar", "navigation", "header"],
    code: `export default function Navbar() {
  return (
    <nav className="bg-slate-950 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#" className="text-2xl font-bold text-white">Logo</a>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-slate-300 hover:text-white transition">Features</a>
            <a href="#" className="text-slate-300 hover:text-white transition">Pricing</a>
            <a href="#" className="text-slate-300 hover:text-white transition">About</a>
            <a href="#" className="text-slate-300 hover:text-white transition">Contact</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block px-4 py-2 text-slate-300 hover:text-white transition">Sign In</button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition">Get Started</button>
        </div>
      </div>
    </nav>
  );
}`
  },
  {
    id: "footer",
    name: "Footer",
    description: "Multi-column footer with links",
    category: "Navigation",
    thumbnail: "📋",
    tags: ["footer", "links", "navigation"],
    code: `export default function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Integrations", "Changelog"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Documentation", "Help Center", "Community", "Contact"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
  };
  
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <div className="text-2xl font-bold text-white mb-4">Logo</div>
            <p className="text-slate-400 text-sm">Building the future of web development.</p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 text-sm hover:text-white transition">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2024 Company. All rights reserved.</p>
          <div className="flex gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">GitHub</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}`
  },
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Beautiful contact form with validation styling",
    category: "Forms",
    thumbnail: "📝",
    tags: ["form", "contact", "input"],
    code: `export default function ContactForm() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-2">Get in touch</h2>
        <p className="text-slate-400 mb-6">We'd love to hear from you</p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Name</label>
            <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Email</label>
            <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Message</label>
            <textarea rows={4} placeholder="Your message..." className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition resize-none" />
          </div>
          <button type="submit" className="w-full py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all hover:shadow-lg hover:shadow-purple-500/25">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}`
  },
  {
    id: "stats-section",
    name: "Stats Section",
    description: "Animated statistics counter section",
    category: "Marketing",
    thumbnail: "📊",
    tags: ["stats", "numbers", "counter"],
    code: `export default function StatsSection() {
  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50M+", label: "API Requests" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];
  
  return (
    <div className="bg-slate-950 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "cta-section",
    name: "CTA Section",
    description: "Call-to-action section with gradient",
    category: "Marketing",
    thumbnail: "🎯",
    tags: ["cta", "call to action", "marketing"],
    code: `export default function CTASection() {
  return (
    <div className="bg-slate-950 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative text-center space-y-6">
            <h2 className="text-4xl font-bold text-white">Ready to get started?</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join thousands of developers building amazing products with our platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-purple-700 rounded-xl font-semibold hover:bg-slate-100 transition-all hover:scale-105 shadow-xl">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "team-section",
    name: "Team Section",
    description: "Team members grid with social links",
    category: "About",
    thumbnail: "👥",
    tags: ["team", "about", "people"],
    code: `export default function TeamSection() {
  const team = [
    { name: "Alex Morgan", role: "CEO & Founder", avatar: "👨‍💼" },
    { name: "Jordan Lee", role: "CTO", avatar: "👩‍💻" },
    { name: "Sam Parker", role: "Lead Designer", avatar: "👨‍🎨" },
    { name: "Casey Zhang", role: "Head of Product", avatar: "👩‍💼" },
  ];
  
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Meet our team</h2>
          <p className="text-slate-400 text-lg">The people behind the product</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                {member.avatar}
              </div>
              <h3 className="text-lg font-semibold text-white">{member.name}</h3>
              <p className="text-slate-400 text-sm">{member.role}</p>
              <div className="mt-4 flex justify-center gap-3 text-slate-500">
                <a href="#" className="hover:text-white transition">𝕏</a>
                <a href="#" className="hover:text-white transition">in</a>
                <a href="#" className="hover:text-white transition">📧</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "faq-accordion",
    name: "FAQ Accordion",
    description: "Expandable FAQ section",
    category: "Content",
    thumbnail: "❓",
    tags: ["faq", "accordion", "questions"],
    code: `export default function FAQAccordion() {
  const faqs = [
    { q: "What is your refund policy?", a: "We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund." },
    { q: "How do I get started?", a: "Simply sign up for a free account and follow our onboarding tutorial. You'll be up and running in minutes." },
    { q: "Do you offer enterprise plans?", a: "Yes! Contact our sales team for custom enterprise pricing and features tailored to your needs." },
    { q: "Is there a free trial?", a: "Absolutely! All plans come with a 14-day free trial. No credit card required." },
  ];
  
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400">Got questions? We've got answers.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer text-white font-semibold hover:bg-slate-800/50 transition">
                {faq.q}
                <span className="ml-4 text-2xl text-slate-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-slate-400">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "blog-cards",
    name: "Blog Cards",
    description: "Blog post preview cards grid",
    category: "Content",
    thumbnail: "📰",
    tags: ["blog", "cards", "articles"],
    code: `export default function BlogCards() {
  const posts = [
    { title: "Getting Started with React", date: "Dec 15, 2024", category: "Tutorial", desc: "Learn the fundamentals of React and build your first component." },
    { title: "10 CSS Tips You Need to Know", date: "Dec 10, 2024", category: "Tips", desc: "Improve your CSS skills with these essential techniques." },
    { title: "The Future of Web Development", date: "Dec 5, 2024", category: "Insights", desc: "Explore upcoming trends that will shape the industry." },
  ];
  
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Latest from the blog</h2>
          <p className="text-slate-400 text-lg">Insights, tips, and tutorials</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.title} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:-translate-y-1 transition-all group">
              <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-6xl">📝</div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">{post.category}</span>
                  <span className="text-slate-500 text-xs">{post.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition">{post.title}</h3>
                <p className="text-slate-400 text-sm">{post.desc}</p>
                <a href="#" className="inline-block mt-4 text-purple-400 text-sm font-semibold hover:text-purple-300 transition">Read more →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "login-form",
    name: "Login Form",
    description: "Clean authentication login form",
    category: "Forms",
    thumbnail: "🔐",
    tags: ["login", "auth", "form"],
    code: `export default function LoginForm() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-slate-400 mt-2">Sign in to your account</p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Email</label>
            <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none transition" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none transition" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400">
              <input type="checkbox" className="rounded border-slate-600" />
              Remember me
            </label>
            <a href="#" className="text-purple-400 hover:text-purple-300">Forgot password?</a>
          </div>
          <button type="submit" className="w-full py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition">
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400 text-sm">
          Don't have an account? <a href="#" className="text-purple-400 hover:text-purple-300">Sign up</a>
        </p>
      </div>
    </div>
  );
}`
  },
  {
    id: "dashboard-cards",
    name: "Dashboard Cards",
    description: "Analytics dashboard stat cards",
    category: "Dashboard",
    thumbnail: "📈",
    tags: ["dashboard", "stats", "analytics"],
    code: `export default function DashboardCards() {
  const stats = [
    { title: "Total Revenue", value: "$45,231", change: "+20.1%", up: true, icon: "💰" },
    { title: "Subscriptions", value: "2,350", change: "+15.2%", up: true, icon: "👥" },
    { title: "Active Now", value: "573", change: "+201", up: true, icon: "🟢" },
    { title: "Bounce Rate", value: "24.5%", change: "-4.3%", up: false, icon: "📊" },
  ];
  
  return (
    <div className="bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">{stat.title}</span>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className={\`text-sm \${stat.up ? 'text-green-400' : 'text-red-400'}\`}>
                {stat.change} from last month
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "notification-toast",
    name: "Notification Toasts",
    description: "Various notification toast styles",
    category: "Feedback",
    thumbnail: "🔔",
    tags: ["toast", "notification", "alert"],
    code: `export default function NotificationToasts() {
  const toasts = [
    { type: "success", icon: "✓", title: "Success!", message: "Your changes have been saved." },
    { type: "error", icon: "✕", title: "Error", message: "Something went wrong. Please try again." },
    { type: "warning", icon: "⚠", title: "Warning", message: "Your session will expire soon." },
    { type: "info", icon: "ℹ", title: "Info", message: "A new version is available." },
  ];
  
  const colors = {
    success: "bg-green-500/20 border-green-500/50 text-green-400",
    error: "bg-red-500/20 border-red-500/50 text-red-400",
    warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
    info: "bg-blue-500/20 border-blue-500/50 text-blue-400",
  };
  
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md">
        {toasts.map((toast) => (
          <div key={toast.type} className={\`flex items-start gap-4 p-4 rounded-xl border \${colors[toast.type]}\`}>
            <span className="text-xl flex-shrink-0">{toast.icon}</span>
            <div className="flex-1">
              <div className="font-semibold">{toast.title}</div>
              <div className="text-sm opacity-80">{toast.message}</div>
            </div>
            <button className="opacity-50 hover:opacity-100 transition">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}`
  },
  {
    id: "profile-card",
    name: "Profile Card",
    description: "User profile card with avatar and stats",
    category: "Cards",
    thumbnail: "👤",
    tags: ["profile", "user", "card"],
    code: `export default function ProfileCard() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-purple-500 to-pink-500" />
        <div className="px-6 pb-6">
          <div className="-mt-12 mb-4">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-4xl">
              👩‍💻
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">Sarah Developer</h3>
          <p className="text-slate-400">@sarahdev</p>
          <p className="mt-4 text-slate-300 text-sm">Full-stack developer passionate about building beautiful web experiences.</p>
          <div className="mt-6 flex gap-6">
            <div><span className="text-white font-bold">1.2K</span> <span className="text-slate-400 text-sm">Followers</span></div>
            <div><span className="text-white font-bold">384</span> <span className="text-slate-400 text-sm">Following</span></div>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="flex-1 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition">Follow</button>
            <button className="flex-1 py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition">Message</button>
          </div>
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "product-card",
    name: "Product Card",
    description: "E-commerce product card with price",
    category: "E-commerce",
    thumbnail: "🛍️",
    tags: ["product", "ecommerce", "card"],
    code: `export default function ProductCard() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden group">
        <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-8xl">
          👟
          <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            -20%
          </div>
          <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/20 transition opacity-0 group-hover:opacity-100">
            ❤️
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 text-sm">★★★★★</span>
            <span className="text-slate-400 text-sm">(128 reviews)</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Premium Running Shoes</h3>
          <p className="text-slate-400 text-sm mt-2">Lightweight and comfortable for everyday wear.</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-white">$79.99</span>
            <span className="text-slate-500 line-through">$99.99</span>
          </div>
          <button className="mt-4 w-full py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all hover:shadow-lg hover:shadow-purple-500/25">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "newsletter-signup",
    name: "Newsletter Signup",
    description: "Email newsletter subscription form",
    category: "Marketing",
    thumbnail: "📧",
    tags: ["newsletter", "email", "subscription"],
    code: `export default function NewsletterSignup() {
  return (
    <div className="bg-slate-950 py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
          <div className="text-5xl mb-4">📬</div>
          <h3 className="text-2xl font-bold text-white mb-2">Stay in the loop</h3>
          <p className="text-slate-400 mb-6">Get the latest updates, tips, and exclusive content delivered to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none transition"
            />
            <button type="submit" className="px-8 py-4 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-slate-500 text-sm">No spam, unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Vertical timeline for history or steps",
    category: "Content",
    thumbnail: "📅",
    tags: ["timeline", "history", "steps"],
    code: `export default function Timeline() {
  const events = [
    { year: "2024", title: "Company Founded", desc: "Started with a vision to revolutionize the industry." },
    { year: "2023", title: "Series A Funding", desc: "Raised $10M to accelerate product development." },
    { year: "2022", title: "100K Users", desc: "Reached a major milestone in user adoption." },
    { year: "2021", title: "Global Launch", desc: "Expanded to 50+ countries worldwide." },
  ];
  
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700" />
          <div className="space-y-8">
            {events.map((event, i) => (
              <div key={i} className="relative pl-20">
                <div className="absolute left-6 w-5 h-5 rounded-full bg-purple-500 border-4 border-slate-950" />
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-purple-400 text-sm font-semibold">{event.year}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{event.title}</h3>
                  <p className="text-slate-400 mt-2">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "404-page",
    name: "404 Error Page",
    description: "Creative not found error page",
    category: "Error",
    thumbnail: "🚫",
    tags: ["404", "error", "not found"],
    code: `export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Page not found</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off into the digital void.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition">
            Go Home
          </button>
          <button className="px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}`
  }
];

export const categories = [...new Set(componentTemplates.map(t => t.category))];
