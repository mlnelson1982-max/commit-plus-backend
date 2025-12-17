import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // await signInWithEmailAndPassword(auth, email, password);
            console.log("Login clicked (Firebase not fully configured yet)");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-[var(--color-bg-dark)] to-[#0a1f10]">

            <div className="w-full max-w-md card space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-[rgba(0,200,83,0.1)] mb-4">
                        <Sparkles className="w-8 h-8 text-[var(--color-brand-primary)]" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        Commit<span className="text-[var(--color-brand-primary)]">+</span>
                    </h1>
                    <p className="text-[var(--color-text-muted)]">
                        Accountability that actually works.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[var(--radius-md)] text-white focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[var(--radius-md)] text-white focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 group">
                        Sign In
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="text-center text-sm text-[var(--color-text-muted)]">
                    Don't have an account? <a href="#" className="text-[var(--color-brand-secondary)] hover:underline">Join the waitlist</a>
                </div>
            </div>
        </div>
    );
}
