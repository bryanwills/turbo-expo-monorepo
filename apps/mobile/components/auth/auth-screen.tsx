import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { authClient } from '@/lib/auth/auth-client';
import Svg, { Path } from 'react-native-svg';

interface AuthScreenProps {
  defaultMode?: 'signup' | 'signin';
}

export default function AuthScreen({ defaultMode = 'signin' }: AuthScreenProps) {
  const [mode, setMode] = useState<'signup' | 'signin'>(defaultMode);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

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
        Alert.alert('OAuth Error', result.error.message);
        return;
      }

      // OAuth successful
      Alert.alert(
        'Success',
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication successful!`
      );
      console.log(`${provider} OAuth result:`, result?.data);

    } catch (error: any) {
      console.error(`${provider} OAuth error:`, error);
      Alert.alert('Error', `Failed to authenticate with ${provider}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password || (mode === 'signup' && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
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
        Alert.alert('Error', result.error.message);
        return;
      }

      Alert.alert(
        'Success',
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
    } catch (error) {
      Alert.alert('Error', `Failed to ${mode}`);
      console.error(`${mode} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  const switchToSignUp = () => {
    setMode('signup');
    setShowEmailForm(true);
    setEmail('');
    setPassword('');
    setName('');
  };

  const toggleEmailForm = () => {
    setShowEmailForm(!showEmailForm);
    if (!showEmailForm) {
      // Clear form when showing
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header - Always visible at top */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome to Your App
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'signup'
            ? 'Create your account to get started'
            : 'Sign in to access your account'}
        </Text>
      </View>

      {/* Auth Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {mode === 'signup' ? 'Sign up' : 'Sign in'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {mode === 'signup'
              ? 'Create your account to continue'
              : 'Welcome back! Please sign in to continue'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* Social Login Buttons - Only show in signin mode when email form is hidden */}
          {mode === 'signin' && !showEmailForm && (
            <>
              {/* Social Login Buttons */}
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialLogin('google')}
                disabled={loading}
              >
                <View style={styles.iconContainer}>
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                    <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </Svg>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialLogin('facebook')}
                disabled={loading}
              >
                <View style={styles.iconContainer}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="white">
                    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </Svg>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.githubButton]}
                onPress={() => handleSocialLogin('github')}
                disabled={loading}
              >
                <View style={styles.iconContainer}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="white">
                    <Path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </Svg>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.socialButtonText}>Continue with GitHub</Text>
                </View>
              </TouchableOpacity>

              {/* Divider - Only show in signin mode when email form is hidden */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
            </>
          )}

          {/* Email Sign Up Button - Only show in signin mode when email form is hidden */}
          {mode === 'signin' && !showEmailForm && (
            <TouchableOpacity
              style={[styles.button, styles.emailButton]}
              onPress={toggleEmailForm}
              disabled={loading}
            >
              <Text style={styles.emailButtonText}>
                Continue with Email
              </Text>
            </TouchableOpacity>
          )}

          {/* Email Form - Show when showEmailForm is true OR when in signup mode */}
          {(showEmailForm || mode === 'signup') && (
            <View style={styles.emailForm}>
              {mode === 'signup' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleEmailAuth}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Back to Social Options Button - Only show when email form is visible in signin mode */}
              {mode === 'signin' && showEmailForm && (
                <TouchableOpacity
                  style={[styles.button, styles.backButton]}
                  onPress={toggleEmailForm}
                  disabled={loading}
                >
                  <Text style={styles.backButtonText}>
                    Back to Social Options
                  </Text>
                </TouchableOpacity>
              )}

              {/* Social Icons Below Email Form - Only show when email form is visible in signin mode */}
              {mode === 'signin' && showEmailForm && (
                <View style={styles.socialIconsContainer}>
                  <Text style={styles.socialIconsText}>
                    Or continue with a social provider:
                  </Text>
                  <View style={styles.socialIconsRow}>
                    <TouchableOpacity
                      style={[styles.socialIconButton, styles.googleIconButton]}
                      onPress={() => handleSocialLogin('google')}
                    >
                      <Svg width={24} height={24} viewBox="0 0 24 24">
                        <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.socialIconButton, styles.facebookIconButton]}
                      onPress={() => handleSocialLogin('facebook')}
                    >
                      <Svg width={24} height={24} viewBox="0 0 24 24" fill="white">
                        <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.socialIconButton, styles.githubIconButton]}
                      onPress={() => handleSocialLogin('github')}
                    >
                      <Svg width={24} height={24} viewBox="0 0 24 24" fill="white">
                        <Path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </Svg>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Mode Toggle */}
          <View style={styles.modeToggle}>
            <Text style={styles.modeToggleText}>
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <TouchableOpacity onPress={mode === 'signin' ? switchToSignUp : () => setMode('signin')}>
              <Text style={styles.modeToggleLink}>
                {mode === 'signin'
                  ? 'Click here to sign up as you can use email or social options'
                  : 'Click here to sign into your account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Secured by Better Auth</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1A1A1A',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginLeft: 20,
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#36394A',
    borderColor: '#4A5568',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  githubButton: {
    backgroundColor: '#24292E',
    borderColor: '#24292E',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#4B5563',
  },
  dividerText: {
    color: '#9CA3AF',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailButton: {
    backgroundColor: '#F97316',
    borderWidth: 1,
    borderColor: '#EA580C',
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emailForm: {
    gap: 16,
    marginTop: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB',
  },
  input: {
    backgroundColor: '#36394A',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modeToggle: {
    alignItems: 'center',
    marginTop: 24,
  },
  modeToggleText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  modeToggleLink: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  socialIconsContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  socialIconsText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 12,
  },
  socialIconsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  socialIconButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#36394A',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  googleIconButton: {
    borderColor: '#4A5568',
  },
  facebookIconButton: {
    borderColor: '#1877F2',
  },
  githubIconButton: {
    borderColor: '#24292E',
  },
  backButton: {
    backgroundColor: '#36394A',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
