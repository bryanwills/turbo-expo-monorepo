"use client";

import { useState, useEffect } from 'react';
import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Input } from "@acme/ui/components/input";
import { Label } from "@acme/ui/components/label";
import { Loader2 } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ui/theme-toggle";
import { useTheme } from "../../lib/theme/theme-context";

interface AuthScreenProps {
  defaultMode?: 'signup' | 'signin';
}

export default function AuthScreen({ defaultMode = 'signin' }: AuthScreenProps) {
  const { theme, setTheme } = useTheme();
  const [mode, setMode] = useState<'signup' | 'signin'>(defaultMode);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user has signed up before and switch to signin mode
  useEffect(() => {
    checkUserExists();
  }, []);

  const checkUserExists = async () => {
    try {
      // Check if user has signed up before by looking for stored auth data
      const hasSignedUp = await authClient.getSession();
      if (hasSignedUp?.data?.user) {
        setMode('signin');
      }
    } catch (error) {
      // User doesn't exist, keep in signin mode
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      setLoading(true);

      let result;

      switch (provider) {
        case 'google':
          result = await authClient.signIn.social({
            provider: 'google',
            callbackURL: "/dashboard",
          });
          break;
        case 'facebook':
          result = await authClient.signIn.social({
            provider: 'facebook',
            callbackURL: "/dashboard",
          });
          break;
        case 'github':
          result = await authClient.signIn.social({
            provider: 'github',
            callbackURL: "/dashboard",
          });
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      if (result?.error) {
        alert(`OAuth Error: ${result.error.message}`);
        return;
      }

      // OAuth successful - redirect to dashboard
      if (result?.data?.url) {
        window.location.href = result.data.url;
      } else {
        alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication successful!`);
        router.push('/dashboard');
      }

    } catch (error: any) {
      console.error(`${provider} OAuth error:`, error);
      alert(`Failed to authenticate with ${provider}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password || (mode === 'signup' && !name)) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      let result;

      if (mode === 'signup') {
        result = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/dashboard",
        });
      } else {
        result = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
        });
      }

      if (result?.error) {
        alert(`Authentication Error: ${result.error.message}`);
        return;
      }

      alert(
        mode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!'
      );
      console.log(`${mode} result:`, result?.data);

      // Switch to signin mode after successful signup
      if (mode === 'signup') {
        setMode('signin');
        setEmail('');
        setPassword('');
        setName('');
        setShowEmailForm(false);
      }
    } catch (error: any) {
      alert(`Failed to ${mode}`);
      console.error(`${mode} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmailForm = () => {
    setShowEmailForm(!showEmailForm);
    if (!showEmailForm) {
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const switchToSignUp = () => {
    setMode('signup');
    setShowEmailForm(true);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col justify-center items-center p-4 relative">
      {/* Theme Toggle - Lower Right */}
      <div className="absolute bottom-10 right-10 z-10">
        <ThemeToggle theme={theme} onThemeChange={setTheme} />
      </div>

      {/* Header */}
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to {mode === 'signup' ? 'Your App' : 'Your App'}
        </h1>
        <p className="text-gray-300 text-lg">
          {mode === 'signup'
            ? 'Create your account to get started'
            : 'Sign in to access your account'}
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md">
        <div className="bg-[#2A2A2A] rounded-lg p-8 shadow-2xl border border-[#4B5563]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === 'signup' ? 'Sign up' : 'Sign in'}
            </h2>
            <p className="text-gray-300 text-base">
              {mode === 'signup'
                ? 'Create your account to continue'
                : 'Welcome back! Please sign in to continue'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Social Login Buttons - Only show in signin mode when email form is hidden */}
            {mode === 'signin' && !showEmailForm && (
              <>
                {/* Social Login Buttons */}
                <Button
                  variant="outline"
                  className="!w-full !h-12 flex items-center justify-center transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: '#36394A',
                    borderColor: '#4A5568',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#40455A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#36394A';
                  }}
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                >
                  <div className="flex items-center w-full">
                    <div className="ml-5 mr-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-white font-medium">Continue with Google</span>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="!w-full !h-12 flex items-center justify-center transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: '#1877F2',
                    borderColor: '#1877F2',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1565C0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1877F2';
                  }}
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading}
                >
                  <div className="flex items-center w-full">
                    <div className="ml-5 mr-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-white font-medium">Continue with Facebook</span>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="!w-full !h-12 flex items-center justify-center transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: '#24292E',
                    borderColor: '#24292E',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2F363D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#24292E';
                  }}
                  onClick={() => handleSocialLogin('github')}
                  disabled={loading}
                >
                  <div className="flex items-center w-full">
                    <div className="ml-5 mr-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-white font-medium">Continue with GitHub</span>
                    </div>
                  </div>
                </Button>

                {/* Divider - Only show in signin mode when email form is hidden */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#2A2A2A] text-gray-400">
                      or
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Email Sign Up Button - Only show in signin mode when email form is hidden */}
            {mode === 'signin' && !showEmailForm && (
              <Button
                className="!w-full !h-12 transition-all duration-200 active:scale-95"
                style={{
                  backgroundColor: '#F97316',
                  borderColor: '#EA580C',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EA580C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F97316';
                }}
                onClick={toggleEmailForm}
                disabled={loading}
              >
                Continue with Email
              </Button>
            )}

            {/* Email Form - Show when showEmailForm is true OR when in signup mode */}
            {(showEmailForm || mode === 'signup') && (
              <div className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 bg-[#36394A] border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-[#36394A] border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-[#36394A] border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <Button
                  className="!w-full !h-12 transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: '#2563EB',
                    borderColor: '#3B82F6',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1D4ED8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563EB';
                  }}
                  onClick={handleEmailAuth}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : null}
                  {loading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
                </Button>

                {/* Back to Social Options Button - Only show when email form is visible in signin mode */}
                {mode === 'signin' && showEmailForm && (
                  <Button
                    variant="outline"
                    className="!w-full !h-12 transition-all duration-200 active:scale-95"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: '#6B7280',
                      color: '#9CA3AF'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#374151';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={toggleEmailForm}
                    disabled={loading}
                  >
                    Back to Social Options
                  </Button>
                )}

                {/* Social Icons Below Email Form - Only show when email form is visible in signin mode */}
                {mode === 'signin' && showEmailForm && (
                  <div className="pt-4">
                    <p className="text-center text-gray-400 text-base mb-4">
                      Or continue with a social provider:
                    </p>
                    <div className="flex justify-center space-x-6">
                      <button
                        onClick={() => handleSocialLogin('google')}
                        className="p-3 rounded-full bg-[#36394A] hover:bg-[#40455A] transition-colors"
                        title="Continue with Google"
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleSocialLogin('facebook')}
                        className="p-3 rounded-full bg-[#1877F2] hover:bg-[#1565C0] transition-colors"
                        title="Continue with Facebook"
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleSocialLogin('github')}
                        className="p-3 rounded-full bg-[#24292E] hover:bg-[#2F363D] transition-colors"
                        title="Continue with GitHub"
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode Toggle */}
            <div className="text-center pt-4">
              <p className="text-gray-400 text-base">
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <button
                className="text-orange-400 hover:text-orange-300 font-semibold text-base underline mt-1"
                onClick={mode === 'signin' ? switchToSignUp : () => setMode('signin')}
              >
                {mode === 'signin'
                  ? 'Click here to sign up as you can use email or social options'
                  : 'Click here to sign into your account'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Secured by Better Auth
          </p>
        </div>
      </div>
    </div>
  );
}
