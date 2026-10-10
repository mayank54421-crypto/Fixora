import React, { useState } from 'react';
import { User, Language } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously, 
  updateProfile 
} from '../firebase';
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Award, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  Languages, 
  MapPin, 
  CheckCircle2, 
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  AlertCircle,
  Database
} from 'lucide-react';

interface LoginPageProps {
  lang: Language;
  onLanguageToggle: () => void;
  onLogin: (user: User) => void;
  onOpenSafetyModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  lang,
  onLanguageToggle,
  onLogin,
  onOpenSafetyModal,
}) => {
  const t = getTranslation(lang);
  
  // Auth view mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Role selector for sign up
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'officer' | 'leader'>('citizen');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [ward, setWard] = useState('Ward 42 - Lajpat Nagar');
  const [department, setDepartment] = useState('Public Works Department (PWD)');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Firebase Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password.trim()) {
      setErrorMessage(lang === 'hi' ? 'कृपया ईमेल और पासवर्ड दर्ज करें।' : 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    // Dedicated Officer Verification for sonikumaranubhav@gmail.com
    if (cleanEmail === 'sonikumaranubhav@gmail.com') {
      if (password === '654321') {
        const officerUser: User = {
          id: 'officer-sonikumar',
          name: 'Anubhav Soni (Executive Engineer)',
          email: 'sonikumaranubhav@gmail.com',
          role: 'officer',
          department: 'Public Works Department (PWD & Nagar Nigam)',
          title: 'Executive Engineer (Civil & Urban Infrastructure)',
          isAnonymous: false,
        };

        try {
          await signInWithEmailAndPassword(auth, cleanEmail, password);
        } catch (fbErr) {
          // If not yet registered on Firebase, attempt registration
          try {
            await createUserWithEmailAndPassword(auth, cleanEmail, password);
          } catch {
            // Proceed with authenticated officer session
          }
        }

        onLogin(officerUser);
        setIsLoading(false);
        return;
      } else {
        setErrorMessage(
          lang === 'hi'
            ? 'अधिकारी खाते के लिए पासवर्ड गलत है। कृपया पुनः प्रयास करें।'
            : 'Incorrect password for Officer account. Please try again.'
        );
        setIsLoading(false);
        return;
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;
      
      const loggedInUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || email.split('@')[0],
        email: fbUser.email || undefined,
        role: 'citizen',
        isAnonymous: false,
      };

      onLogin(loggedInUser);
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = lang === 'hi' ? 'अमान्य ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।' : 'Invalid email or password. Please verify credentials or sign up.';
      } else if (err.code === 'auth/invalid-email') {
        msg = lang === 'hi' ? 'कृपया वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = lang === 'hi' 
          ? 'फायरबेस कंसोल में ईमेल/पासवर्ड प्रदाता सक्षम करें, अथवा अनाम मोड से प्रवेश करें।' 
          : 'Email/Password provider not enabled in Firebase Console. You can also use Anonymous entry.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Firebase Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage(lang === 'hi' ? 'कृपया ईमेल और पासवर्ड भरें।' : 'Please fill all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage(lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(lang === 'hi' ? 'पासवर्ड मेल नहीं खा रहे हैं।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;

      // Update Display Name in Firebase Profile
      const displayNameToSave = fullName.trim() || (selectedRole === 'citizen' ? 'Citizen User' : selectedRole === 'officer' ? 'Municipal Officer' : 'Elected Leader');
      await updateProfile(fbUser, { displayName: displayNameToSave });

      const newUser: User = {
        id: fbUser.uid,
        name: displayNameToSave,
        email: fbUser.email || undefined,
        role: selectedRole,
        isAnonymous: false,
        ward: selectedRole === 'leader' ? ward : undefined,
        department: selectedRole === 'officer' ? department : undefined,
        title: selectedRole === 'officer' ? 'Municipal Engineer' : selectedRole === 'leader' ? 'Ward Leader' : undefined,
      };

      setSuccessMessage(lang === 'hi' ? 'खाता सफलतापूर्वक बना! प्रवेश हो रहा है...' : 'Account created successfully! Entering portal...');
      setTimeout(() => {
        onLogin(newUser);
      }, 600);
    } catch (err: any) {
      console.error('Firebase Sign Up Error:', err);
      let msg = err.message || 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') {
        msg = lang === 'hi' ? 'यह ईमेल पहले से पंजीकृत है। कृपया साइन इन करें।' : 'This email is already in use. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = lang === 'hi' ? 'पासवर्ड कमजोर है। कम से कम 6 वर्ण का उपयोग करें।' : 'Password is too weak. Must be at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = lang === 'hi' 
          ? 'फायरबेस कंसोल में ईमेल साइन-अप सक्षम नहीं है। आप डेमो या अनाम मोड का उपयोग कर सकते हैं।' 
          : 'Email sign-up not enabled in Firebase Console. You can also use 1-Click Demo or Anonymous entry.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Firebase Anonymous Sign In
  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const userCredential = await signInAnonymously(auth);
      const fbUser = userCredential.user;
      onLogin({
        id: fbUser.uid,
        name: lang === 'hi' ? 'अनाम नागरिक (पहचान गुप्त)' : 'Anonymous Citizen (Identity Shielded)',
        role: 'citizen',
        isAnonymous: true,
      });
    } catch (err: any) {
      console.warn('Firebase Anonymous Auth fallback:', err);
      // Fallback local anonymous session so user is never blocked
      onLogin({
        id: `anon-${Date.now()}`,
        name: lang === 'hi' ? 'अनाम नागरिक (पहचान गुप्त)' : 'Anonymous Citizen (Identity Shielded)',
        role: 'citizen',
        isAnonymous: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Demo Profile fast-track
  const handleDemoSelect = (role: 'citizen' | 'officer' | 'leader' | 'mla') => {
    if (role === 'citizen') {
      onLogin({
        id: 'user-citizen-demo',
        name: 'Aarav Sharma',
        role: 'citizen',
        email: 'aarav.citizen@fixora.gov.in',
        isAnonymous: false,
      });
    } else if (role === 'officer') {
      onLogin({
        id: 'user-officer-demo',
        name: 'Er. Rajesh Verma',
        role: 'officer',
        department: 'Public Works Department (PWD & Nagar Nigam)',
        title: 'Executive Engineer (Civil & Roads)',
        email: 'rajesh.verma@mcd.gov.in',
        isAnonymous: false,
      });
    } else if (role === 'leader') {
      onLogin({
        id: 'user-leader-demo',
        name: 'Sunita Devi',
        role: 'leader',
        ward: 'Ward 42 - Lajpat Nagar & Defence Colony',
        title: 'Ward Councillor (Parshad)',
        email: 'parshad.ward42@mcd.gov.in',
        isAnonymous: false,
      });
    } else if (role === 'mla') {
      onLogin({
        id: 'user-mla-demo',
        name: 'Vikramaditya Singh',
        role: 'leader',
        ward: 'Lucknow Central Vidhan Sabha',
        title: 'Member of Legislative Assembly (MLA)',
        email: 'mla.lucknowcentral@up.gov.in',
        isAnonymous: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-500 selection:text-white relative overflow-hidden">
      {/* Indian Tricolor Top Ribbon */}
      <div className="h-2 w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* Top Header Bar */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-400/30">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-stone-900">
                Fixora
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                {lang === 'hi' ? 'फिक्सोरा जन सेवा' : 'Fixora Civic'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
              {lang === 'hi' ? 'सार्वजनिक संपत्ति क्षति रिपोर्टिंग एवं जवाबदेही' : 'Public Damage & Leader Accountability Network'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Firebase Connection Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-lg">
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>Firebase: fixora-8de98</span>
          </div>

          {/* Whistleblower Protection Pill */}
          <button
            onClick={onOpenSafetyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{lang === 'hi' ? '100% पहचान सुरक्षित' : 'Identity Shielded'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 hover:border-amber-400 bg-white hover:bg-amber-50 text-stone-700 transition-all shadow-2xs"
          >
            <Languages className="w-3.5 h-3.5 text-amber-600" />
            <span className="uppercase text-[11px] font-extrabold tracking-wider">
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Column: Mission & Highlights */}
        <div className="max-w-xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>{lang === 'hi' ? 'नागरिक अधिकार एवं सार्वजनिक जवाबदेही' : 'Citizen Empowerment & Public Accountability'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            {lang === 'hi' ? (
              <>
                टूटी सार्वजनिक संपत्ति? <br />
                <span className="bg-gradient-to-r from-red-600 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                  Fixora
                </span>{' '}
                पर पहचान छुपाकर शिकायत करें।
              </>
            ) : (
              <>
                Damaged Public Property? <br />
                Report Anonymously on{' '}
                <span className="bg-gradient-to-r from-red-600 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                  Fixora
                </span>
                .
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
            {lang === 'hi'
              ? 'सड़क के गड्ढे, टूटे फुटपाथ, खुले मैनहोल और खराब स्ट्रीट लाइट की फोटो भेजें। आपकी पहचान पूरी तरह गुप्त रहेगी जबकि कार्य सीधे नगर निगम व आपके स्थानीय वार्ड पार्षद/विधायक के रिपोर्ट कार्ड में दर्ज होगा ताकि आप सही चुनाव कर सकें।'
              : 'Spot broken civic infrastructure? Snap a photo. Your identity is 100% shielded while our platform directly alerts the municipality and logs the issue under your elected ward leader so you can choose wisely in elections.'}
          </p>

          {/* 3 Pillars */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                  {lang === 'hi' ? '100% व्हिसलब्लोअर पहचान सुरक्षा' : '100% Whistleblower Anonymity Shield'}
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  {lang === 'hi' ? 'कोई नाम, फोन या आईपी ठेकेदारों को नहीं दिया जाता।' : 'Zero personal info shared with contractors or local politicians.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                  {lang === 'hi' ? 'लाइव जीआईएस मानचित्र एवं मरम्मत स्थिति' : 'Live Geospatial Damage Map & SLA Tracking'}
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  {lang === 'hi' ? 'निरीक्षण से लेकर समाधान फोटो तक वास्तविक समय में प्रगति।' : 'Track verification, work orders, and restored before/after photos.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-800 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                  {lang === 'hi' ? 'जन प्रतिनिधि जवाबदेही (सही नेता चुनें)' : 'Leader Accountability Scorecards (Choose Wisely)'}
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  {lang === 'hi' ? 'पार्षद और विधायक का समाधान दर और औसत गति जांचें।' : 'Inspect ward councillors & MLAs resolution percentage before voting.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Firebase Authentication Box */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col">
          {/* Card Tricolor Header */}
          <div className="h-1.5 w-full flex shrink-0">
            <div className="h-full w-1/3 bg-[#FF9933]" />
            <div className="h-full w-1/3 bg-white" />
            <div className="h-full w-1/3 bg-[#138808]" />
          </div>

          <div className="p-6 sm:p-7">
            {/* Sign In vs Sign Up Tab Switcher */}
            <div className="flex bg-stone-100 p-1 rounded-xl mb-5 border border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signin'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-amber-600" />
                {t.login.signInTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signup'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                {t.login.signUpTab}
              </button>
            </div>

            {/* Subtitle */}
            <div className="mb-4">
              <h2 className="text-xl font-black text-stone-900">
                {authMode === 'signin' 
                  ? (lang === 'hi' ? 'फिक्सोरा में साइन इन करें' : 'Sign in to Fixora') 
                  : (lang === 'hi' ? 'नया फिक्सोरा खाता बनाएं' : 'Create your Fixora account')}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {t.login.subtitle}
              </p>
            </div>

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form: SIGN IN or SIGN UP */}
            {authMode === 'signin' ? (
              /* SIGN IN FORM */
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.login.emailLabel} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. citizen@fixora.gov.in"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.login.passwordLabel} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                >
                  <KeyRound className="w-4 h-4" />
                  {isLoading ? (lang === 'hi' ? 'सत्यापन हो रहा है...' : 'Signing in...') : t.login.loginBtn}
                </button>

                <div className="text-center text-xs text-stone-500 pt-1">
                  <span>{lang === 'hi' ? 'नया खाता बनाना चाहते हैं?' : "Don't have an account?"}{' '}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-amber-700 hover:underline"
                  >
                    {t.login.signUpTab}
                  </button>
                </div>
              </form>
            ) : (
              /* SIGN UP FORM */
              <form onSubmit={handleSignUp} className="space-y-3">
                {/* Role selection for signup */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {lang === 'hi' ? 'आपकी भूमिका चुनें' : 'Select Your Role'} *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('citizen')}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        selectedRole === 'citizen'
                          ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      {t.login.tabCitizen}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('officer')}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        selectedRole === 'officer'
                          ? 'bg-blue-100 text-blue-900 border-blue-400 font-bold'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      {t.login.tabOfficer}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('leader')}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        selectedRole === 'leader'
                          ? 'bg-purple-100 text-purple-900 border-purple-400 font-bold'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      {t.login.tabLeader}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.login.nameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.login.emailLabel} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {t.login.passwordLabel} *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full px-2.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {t.login.confirmPasswordLabel} *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-2.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                {selectedRole === 'officer' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'hi' ? 'विभाग' : 'Department'}
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                      <option value="Jal Sansthan (Water Works)">Jal Sansthan (Water Works)</option>
                      <option value="Electricity Board (Discom)">Electricity Board (Discom)</option>
                      <option value="Solid Waste Management (SWM)">Solid Waste Management (SWM)</option>
                    </select>
                  </div>
                )}

                {selectedRole === 'leader' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'hi' ? 'वार्ड / विधानसभा' : 'Constituency / Ward'}
                    </label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="Ward 42 - Lajpat Nagar">Ward 42 - Lajpat Nagar (Delhi)</option>
                      <option value="Ward 18 - Hazratganj">Ward 18 - Hazratganj (Lucknow)</option>
                      <option value="Ward 74 - Bandra West">Ward 74 - Bandra West (Mumbai)</option>
                      <option value="Koramangala Ward">Koramangala Ward (Bengaluru)</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                >
                  <UserPlus className="w-4 h-4" />
                  {isLoading ? (lang === 'hi' ? 'खाता बनाया जा रहा है...' : 'Creating account...') : t.login.createAccountBtn}
                </button>

                <div className="text-center text-xs text-stone-500 pt-1">
                  <span>{lang === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'}{' '}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    {t.login.signInTab}
                  </button>
                </div>
              </form>
            )}

            {/* Separator */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-stone-500 font-medium">
                  {lang === 'hi' ? 'अथवा' : 'OR'}
                </span>
              </div>
            </div>

            {/* Anonymous Bypass */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleAnonymousSignIn}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 border border-stone-700"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.login.anonymousBtn}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-stone-200 bg-white text-xs text-stone-500">
        Fixora (फिक्सोरा) • Firebase Auth (fixora-8de98) Connected • 100% Anonymous Citizen Shield
      </footer>
    </div>
  );
};
