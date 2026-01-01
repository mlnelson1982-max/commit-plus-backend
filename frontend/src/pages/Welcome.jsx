import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Commit+" className="h-8 w-auto" />
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 text-slate-700 hover:text-slate-900 font-semibold transition">
              Sign In
            </Link>
            <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Your Lifestyle <span className="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">Operating System</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Commit+ eliminates confusion, removes shame, and replaces willpower with structure and community. It's not a fitness app—it's a system that works if you do.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-lg font-semibold text-slate-900">Built on Three Non-Negotiables:</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Natural Inputs Only</p>
                      <p className="text-slate-600">Real food, real ingredients, real education.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Guided Structure</p>
                      <p className="text-slate-600">The app tells you what to do today, not what you did wrong yesterday.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Social Accountability Without Toxicity</p>
                      <p className="text-slate-600">Encouragement over embarrassment. Always.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg font-bold text-lg hover:shadow-xl transition transform hover:scale-105">
                  Start Your Journey
                </Link>
                <button className="px-8 py-4 border-2 border-slate-300 text-slate-900 rounded-lg font-bold text-lg hover:border-slate-400 transition">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-green-500 rounded-3xl blur-3xl opacity-20"></div>
                <img src="/logo.png" alt="Commit+ Logo" className="relative w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What Makes Commit+ Different</h2>
            <p className="text-xl text-slate-600">A system designed for people who are done starting over.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border-2 border-slate-200 hover:border-teal-500 transition hover:shadow-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Personalized Blueprint</h3>
              <p className="text-slate-600">Your weight-loss goal automatically configures your nutrition plan, movement strategy, and daily execution plan.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border-2 border-slate-200 hover:border-teal-500 transition hover:shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Daily Commitment Flow</h3>
              <p className="text-slate-600">No decisions. No overwhelm. Just a clear execution checklist: what to eat, how to move, what to learn, what to reflect on.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border-2 border-slate-200 hover:border-teal-500 transition hover:shadow-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Accountability Community</h3>
              <p className="text-slate-600">Share progress, celebrate wins, and receive encouragement—without toxic comparison or judgment.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl border-2 border-slate-200 hover:border-teal-500 transition hover:shadow-lg">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Consistency Leaderboards</h3>
              <p className="text-slate-600">Ranked by showing up, not genetics. Consistency streaks, completion rates, and community engagement matter.</p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl border-2 border-slate-200 hover:border-teal-500 transition hover:shadow-lg">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Education First</h3>
              <p className="text-slate-600">Learn why foods work, not just what to eat. Understand inflammation, digestion, metabolism, and recovery.</p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl border-2 border-slate-200 hover:border-teal-500 transition hover:shadow-lg">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Progress Without Shame</h3>
              <p className="text-slate-600">Track your transformation visually. No calorie obsession. No vanity metrics. Just real progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            "People don't fail diets—systems fail people. <span className="text-transparent bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text">Commit+ fixes the system.</span>"
          </blockquote>
          <p className="text-xl text-slate-300 mb-8">
            This is for individuals who want structure, not motivation. People tired of gimmicks and extremes. Users ready to invest financially and mentally in real change.
          </p>
          <p className="text-lg text-slate-400">
            Commit+ doesn't promise shortcuts. It provides a system that works if you do.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Paid-Only by Design</h2>
          <p className="text-xl text-slate-600 mb-12">
            There is no free tier. Payment equals commitment. Users self-select into seriousness. Community quality remains high.
          </p>
          <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-12 border-2 border-teal-200">
            <p className="text-slate-600 mb-4">Starting at</p>
            <p className="text-6xl font-bold text-slate-900 mb-4">$9.99<span className="text-2xl text-slate-600">/month</span></p>
            <p className="text-slate-600 mb-8">Cancel anytime. No hidden fees.</p>
            <Link to="/login" className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg font-bold text-lg hover:shadow-xl transition">
              Join Commit+
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-500 to-green-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Transform?</h2>
          <p className="text-xl text-teal-50 mb-8">
            Join a community of people who are done starting over. Start your transformation today.
          </p>
          <Link to="/login" className="inline-block px-8 py-4 bg-white text-teal-600 rounded-lg font-bold text-lg hover:shadow-xl transition transform hover:scale-105">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo.png" alt="Commit+" className="h-8 w-auto mb-4" />
              <p className="text-sm">Your lifestyle operating system.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Commit+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Welcome;
