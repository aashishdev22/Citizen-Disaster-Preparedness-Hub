import React, { useState } from 'react';
import { Icon } from '../components/Shell';
import { ONBOARDING_SLIDES } from '../data/seedData';
import { useApp } from '../state/AppContext';
import { validateLogin, validateRegistration } from '../utils/preparedness';

/* 1. SPLASH & LANGUAGE SELECTION SCREEN */
export function SplashScreen() {
  const { language, setLanguage, navigate } = useApp();

  return (
    <div className="min-h-screen bg-light-primary text-light-on-primary flex items-center justify-center p-gutter-lg">
      <main className="max-w-[440px] w-full min-h-[min(820px,calc(100vh-32px))] flex flex-col justify-between py-gutter-xl gap-gutter-xl">
        {/* Top Emergency Helpline Quick Call */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="min-h-[40px] px-gutter-sm rounded text-light-primary-container hover:text-light-on-primary font-label text-label-md inline-flex items-center gap-gutter-xs"
          >
            <Icon name="dashboard" className="text-[18px]" />
            Dashboard
          </button>
          <a
            href="tel:112"
            className="min-h-[40px] px-gutter-md rounded-full bg-light-on-primary/10 hover:bg-light-on-primary/15 text-light-on-primary font-label text-label-md inline-flex items-center gap-gutter-xs"
          >
            <Icon name="call" className="text-[18px]" />
            Emergency 112
          </a>
        </div>

        {/* Center Brand Identity */}
        <section className="flex flex-col items-center text-center gap-gutter-lg">
          <div className="w-20 h-20 rounded-md bg-light-secondary text-light-on-secondary inline-flex items-center justify-center shadow-lg">
            <Icon name="shield_with_heart" className="text-[44px]" filled />
          </div>

          <div className="flex flex-col gap-gutter-sm">
            <h1 className="font-display text-display-sm">
              {language === 'hi'
                ? 'नागरिक आपदा तैयारी केंद्र'
                : 'Citizen Disaster Preparedness Hub'}
            </h1>
            <p className="font-body text-body-md text-light-primary-container max-w-[320px] mx-auto">
              {language === 'hi'
                ? 'तैयार रहें। सुरक्षित रहें। सही समय पर अलर्ट और नजदीकी राहत आश्रय पाएं।'
                : 'Stay Prepared. Stay Safe. Real-time alerts, safe shelters, and 112 emergency help.'}
            </p>
          </div>

          {/* Readiness Progress Bar */}
          <div className="w-48 h-1.5 rounded-full bg-light-on-primary/20 overflow-hidden mt-gutter-sm">
            <div className="h-full w-3/4 bg-light-secondary-container rounded-full" />
          </div>
          <span className="font-label text-label-sm text-light-primary-container">
            {language === 'hi'
              ? 'ऑफ़लाइन सुरक्षा गाइड तैयार हैं'
              : 'Offline safety guides ready'}
          </span>
        </section>

        {/* Bottom Language Selector + Continue */}
        <section className="bg-light-surface text-light-on-surface rounded-md p-gutter-lg flex flex-col gap-gutter-md shadow-xl">
          <div className="flex items-center gap-gutter-xs">
            <Icon name="translate" className="text-[20px] text-light-secondary" />
            <h2 className="font-title text-title-sm">Choose Language / भाषा चुनें</h2>
          </div>

          <div className="grid grid-cols-2 gap-gutter-sm">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              className={`min-h-[48px] rounded font-label text-label-md transition-colors ${
                language === 'en'
                  ? 'border-2 border-light-secondary bg-light-secondary-container text-light-on-secondary-container'
                  : 'border border-light-outline-variant bg-light-surface text-light-on-surface hover:bg-light-surface-container-low'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              aria-pressed={language === 'hi'}
              className={`min-h-[48px] rounded font-label text-label-md transition-colors ${
                language === 'hi'
                  ? 'border-2 border-light-secondary bg-light-secondary-container text-light-on-secondary-container'
                  : 'border border-light-outline-variant bg-light-surface text-light-on-surface hover:bg-light-surface-container-low'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('onboarding')}
            className="min-h-[48px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg inline-flex items-center justify-center gap-gutter-xs hover:opacity-95"
          >
            {language === 'hi' ? 'आगे बढ़ें' : 'Continue'}
            <Icon name="arrow_forward" className="text-[20px]" />
          </button>
        </section>
      </main>
    </div>
  );
}

/* 2. WELCOME & ONBOARDING CAROUSEL */
export function OnboardingScreen() {
  const { language, setLanguage, navigate } = useApp();
  const [idx, setIdx] = useState(0);

  const slides = ONBOARDING_SLIDES[language];
  const current = slides[idx];

  const handleNext = () => {
    if (idx < slides.length - 1) {
      setIdx((i) => i + 1);
    } else {
      navigate('login');
    }
  };

  return (
    <div className="min-h-screen bg-light-surface flex flex-col">
      <div className="max-w-[480px] w-full mx-auto flex-1 flex flex-col justify-between">
        {/* Top Bar */}
        <header className="px-gutter-lg pt-gutter-lg pb-gutter-sm flex items-center justify-between">
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="min-h-[40px] px-gutter-md rounded border border-light-outline-variant bg-light-surface-container-low font-label text-label-md text-light-on-surface inline-flex items-center gap-gutter-xs"
          >
            <Icon name="translate" className="text-[18px] text-light-secondary" />
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
          <button
            type="button"
            onClick={() => navigate('home')}
            className="min-h-[40px] px-gutter-md rounded font-label text-label-md text-light-on-surface-variant hover:text-light-primary"
          >
            {language === 'hi' ? 'छोड़ें' : 'Skip'}
          </button>
        </header>

        {/* Slide Content */}
        <main className="px-gutter-xl py-gutter-lg flex-1 flex flex-col items-center justify-center text-center gap-gutter-xl">
          <div
            className={`w-36 h-36 rounded-md ${current.bg} inline-flex items-center justify-center shadow-sm`}
          >
            <Icon name={current.icon} className="text-[72px]" />
          </div>

          <div className="flex flex-col gap-gutter-sm max-w-[340px]">
            <h1 className="font-headline text-headline-md text-light-on-surface">
              {current.title}
            </h1>
            <p className="font-body text-body-md text-light-on-surface-variant">{current.desc}</p>
          </div>
        </main>

        {/* Footer Controls */}
        <footer className="px-gutter-xl pb-gutter-xl pt-gutter-md flex flex-col gap-gutter-lg">
          <div className="flex items-center justify-center gap-gutter-sm">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === idx ? 'w-6 bg-light-primary' : 'w-2.5 bg-light-outline-variant'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-gutter-sm">
            {idx > 0 && (
              <button
                type="button"
                onClick={() => setIdx((i) => i - 1)}
                className="min-h-[48px] px-gutter-lg rounded border border-light-outline-variant bg-light-surface text-light-primary font-label text-label-lg"
              >
                {language === 'hi' ? 'पीछे' : 'Back'}
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="min-h-[48px] flex-1 rounded bg-light-primary text-light-on-primary font-label text-label-lg inline-flex items-center justify-center gap-gutter-xs hover:opacity-95"
            >
              {idx === slides.length - 1
                ? language === 'hi'
                  ? 'शुरू करें'
                  : 'Get Started'
                : language === 'hi'
                  ? 'अगला'
                  : 'Next'}
              <Icon name="arrow_forward" className="text-[20px]" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* 3. LOGIN & GUEST MODE SCREEN */
export function LoginScreen() {
  const { navigate, updateUser, showToast } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateLogin(identifier, password);
    if (!res.valid) {
      setError(res.error || 'Please check your credentials.');
      return;
    }
    setError(null);
    updateUser({ isGuest: false });
    showToast('Welcome back to Citizen Disaster Preparedness Hub.', 'success');
    navigate('home');
  };

  const handleGuest = () => {
    updateUser({ isGuest: true });
    showToast('Continuing in Guest Mode — Alerts, Shelters & 112 ready.', 'info');
    navigate('home');
  };

  return (
    <div className="min-h-screen bg-light-background flex items-center justify-center p-gutter-lg">
      <main className="max-w-[440px] w-full flex flex-col gap-gutter-lg">
        {/* Header Brand */}
        <header className="flex flex-col items-center text-center gap-gutter-sm">
          <span className="w-14 h-14 rounded-md bg-light-primary text-light-on-primary inline-flex items-center justify-center">
            <Icon name="shield_with_heart" className="text-[32px]" filled />
          </span>
          <h1 className="font-headline text-headline-md text-light-on-surface">Welcome Back</h1>
          <p className="font-body text-body-md text-light-on-surface-variant">
            Sign in to sync your family safety group &amp; emergency kit.
          </p>
        </header>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-md shadow-sm"
        >
          {error && (
            <div
              role="alert"
              className="p-gutter-sm rounded bg-light-error-container text-light-on-error-container font-label text-label-md"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-gutter-xs">
            <label htmlFor="login-id" className="font-label text-label-md text-light-on-surface">
              Mobile Number or Email
            </label>
            <input
              id="login-id"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="+91 98204 51234 or email"
              className="min-h-[48px] px-gutter-md rounded border border-light-outline-variant bg-light-surface font-body text-body-md text-light-on-surface focus:border-light-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-gutter-xs">
            <label htmlFor="login-pass" className="font-label text-label-md text-light-on-surface">
              Password
            </label>
            <div className="relative">
              <input
                id="login-pass"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full min-h-[48px] pl-gutter-md pr-12 rounded border border-light-outline-variant bg-light-surface font-body text-body-md text-light-on-surface focus:border-light-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
                className="w-11 h-11 absolute right-1 top-1/2 -translate-y-1/2 rounded-full hover:bg-light-surface-container-low inline-flex items-center justify-center text-light-on-surface-variant"
              >
                <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-gutter-sm">
            <label className="min-h-[40px] inline-flex items-center gap-gutter-xs cursor-pointer font-body text-body-sm text-light-on-surface">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-light-primary"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate('forgot-password')}
              className="font-label text-label-md text-light-secondary hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="min-h-[48px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg hover:opacity-95"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={handleGuest}
            className="min-h-[48px] w-full rounded border border-light-outline-variant bg-light-surface-container-low text-light-primary font-label text-label-lg hover:bg-light-surface-container"
          >
            Continue as Guest (Emergency Access)
          </button>
        </form>

        <p className="text-center font-body text-body-sm text-light-on-surface-variant">
          New citizen?{' '}
          <button
            type="button"
            onClick={() => navigate('register')}
            className="font-label text-label-md text-light-primary underline"
          >
            Create Account
          </button>
        </p>
      </main>
    </div>
  );
}

/* 4. CITIZEN REGISTRATION SCREEN */
export function RegistrationScreen() {
  const { navigate, updateUser, showToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [stateName, setStateName] = useState('Maharashtra');
  const [city, setCity] = useState('Dadar West, Mumbai');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateRegistration({
      name,
      phone,
      password,
      confirmPassword,
      acceptedTerms: terms,
    });
    if (!res.valid) {
      setError(res.error || 'Please check required fields.');
      return;
    }
    setError(null);
    updateUser({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || 'citizen@example.in',
      locationLabel: city.trim() || 'Dadar West, Mumbai',
      districtState: `${stateName}`,
      isGuest: false,
    });
    showToast(`Citizen account created for ${name.trim()}!`, 'success');
    navigate('home');
  };

  return (
    <div className="min-h-screen bg-light-background flex items-center justify-center p-gutter-lg">
      <main className="max-w-[460px] w-full flex flex-col gap-gutter-md">
        <div className="flex items-center gap-gutter-sm">
          <button
            type="button"
            onClick={() => navigate('login')}
            aria-label="Back to Login"
            className="w-11 h-11 rounded-full hover:bg-light-surface-container inline-flex items-center justify-center text-light-on-surface"
          >
            <Icon name="arrow_back" className="text-[22px]" />
          </button>
          <div>
            <h1 className="font-headline text-headline-sm text-light-on-surface">
              Citizen Registration
            </h1>
            <p className="font-body text-body-sm text-light-on-surface-variant">
              Receive ward-level IMD &amp; SDMA disaster alerts
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-md shadow-sm"
        >
          {error && (
            <div
              role="alert"
              className="p-gutter-sm rounded bg-light-error-container text-light-on-error-container font-label text-label-md"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-gutter-xs">
            <label htmlFor="reg-name" className="font-label text-label-md text-light-on-surface">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Aarav Sharma"
              className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="reg-phone" className="font-label text-label-md text-light-on-surface">
                Mobile Number
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98204 51234"
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
              />
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="reg-email" className="font-label text-label-md text-light-on-surface">
                Email (Optional)
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.in"
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="reg-state" className="font-label text-label-md text-light-on-surface">
                State
              </label>
              <select
                id="reg-state"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant bg-light-surface font-body text-body-md"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Kerala">Kerala</option>
                <option value="Odisha">Odisha</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="reg-city" className="font-label text-label-md text-light-on-surface">
                City / Ward
              </label>
              <input
                id="reg-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="reg-pass" className="font-label text-label-md text-light-on-surface">
                Create Password
              </label>
              <input
                id="reg-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
              />
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <label
                htmlFor="reg-confirm"
                className="font-label text-label-md text-light-on-surface"
              >
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="min-h-[44px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
              />
            </div>
          </div>

          <label className="flex items-start gap-gutter-sm cursor-pointer font-body text-body-sm text-light-on-surface-variant">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-light-primary shrink-0"
            />
            <span>
              I agree to receive verified public safety alerts and consent to emergency GPS sharing
              when I trigger SOS.
            </span>
          </label>

          <button
            type="submit"
            className="min-h-[48px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg hover:opacity-95"
          >
            Create Citizen Account
          </button>
        </form>
      </main>
    </div>
  );
}

/* 5. FORGOT PASSWORD 3-STEP OTP FLOW */
export function ForgotPasswordScreen() {
  const { navigate, showToast } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contact, setContact] = useState('+91 98204 51234');
  const [otp, setOtp] = useState('482910');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      setError('Enter your registered mobile number or email.');
      return;
    }
    setError(null);
    showToast('6-digit verification code sent (demo OTP: 482910).', 'info');
    setStep(2);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length < 6) {
      setError('Enter the 6-digit verification OTP.');
      return;
    }
    if (newPass.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-light-background flex items-center justify-center p-gutter-lg">
      <main className="max-w-[440px] w-full flex flex-col gap-gutter-md">
        <div className="flex items-center gap-gutter-sm">
          <button
            type="button"
            onClick={() => navigate('login')}
            aria-label="Back to Login"
            className="w-11 h-11 rounded-full hover:bg-light-surface-container inline-flex items-center justify-center text-light-on-surface"
          >
            <Icon name="arrow_back" className="text-[22px]" />
          </button>
          <div>
            <h1 className="font-headline text-headline-sm text-light-on-surface">
              Reset Password
            </h1>
            <p className="font-body text-body-sm text-light-on-surface-variant">
              Step {step} of 3 • Account Recovery
            </p>
          </div>
        </div>

        <div className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-xl shadow-sm">
          {error && (
            <div
              role="alert"
              className="mb-gutter-md p-gutter-sm rounded bg-light-error-container text-light-on-error-container font-label text-label-md"
            >
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-gutter-md">
              <p className="font-body text-body-md text-light-on-surface-variant">
                Enter your registered mobile number or email to receive a one-time verification code.
              </p>
              <div className="flex flex-col gap-gutter-xs">
                <label htmlFor="fp-contact" className="font-label text-label-md text-light-on-surface">
                  Mobile Number or Email
                </label>
                <input
                  id="fp-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="min-h-[48px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
                />
              </div>
              <button
                type="submit"
                className="min-h-[48px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg hover:opacity-95"
              >
                Send Verification Code
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleReset} className="flex flex-col gap-gutter-md">
              <div className="p-gutter-sm rounded bg-light-secondary-container text-light-on-secondary-container font-label text-label-sm">
                Verification OTP sent to {contact} (Pre-filled demo code: 482910)
              </div>
              <div className="flex flex-col gap-gutter-xs">
                <label htmlFor="fp-otp" className="font-label text-label-md text-light-on-surface">
                  6-Digit OTP
                </label>
                <input
                  id="fp-otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="min-h-[48px] px-gutter-md rounded border border-light-outline-variant font-mono text-title-md tracking-widest text-center"
                />
              </div>
              <div className="flex flex-col gap-gutter-xs">
                <label htmlFor="fp-new" className="font-label text-label-md text-light-on-surface">
                  New Password
                </label>
                <input
                  id="fp-new"
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="min-h-[48px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
                />
              </div>
              <div className="flex flex-col gap-gutter-xs">
                <label htmlFor="fp-confirm" className="font-label text-label-md text-light-on-surface">
                  Confirm New Password
                </label>
                <input
                  id="fp-confirm"
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter password"
                  className="min-h-[48px] px-gutter-md rounded border border-light-outline-variant font-body text-body-md"
                />
              </div>
              <button
                type="submit"
                className="min-h-[48px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg hover:opacity-95"
              >
                Update Password
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center gap-gutter-md py-gutter-md">
              <span className="w-16 h-16 rounded-full bg-light-success-container text-light-success inline-flex items-center justify-center">
                <Icon name="check_circle" className="text-[40px]" />
              </span>
              <h2 className="font-headline text-headline-sm text-light-on-surface">
                Password Updated
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant">
                Your Citizen Disaster Preparedness Hub password has been reset securely.
              </p>
              <button
                type="button"
                onClick={() => navigate('login')}
                className="min-h-[48px] w-full rounded bg-light-primary text-light-on-primary font-label text-label-lg hover:opacity-95"
              >
                Return to Sign In
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
