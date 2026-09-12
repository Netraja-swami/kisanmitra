import React, { useState } from 'react';
import { useFarmerContext } from './hooks/useFarmerContext';
import { useAuth } from './hooks/useAuth';
import AuthScreen, { MOCK_USER } from './components/AuthScreen';
import LanguageSelection from './components/LanguageSelection';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import OnboardingFlow from './components/OnboardingFlow';
import ChatView from './views/ChatView';
import CropsView from './views/CropsView';
import MandiView from './views/MandiView';
import ProfileView from './views/ProfileView';

export default function App() {
  const {
    currentUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    authError,
    lockoutStatus,
    signIn,
    signUp,
    demoLogin,
    signOut
  } = useAuth();

  const {
    context,
    updateContext,
    selectLanguage,
    resetLanguage,
    completeOnboarding,
    resetOnboarding,
    updateApiKeys
  } = useFarmerContext();

  const [activeTab, setActiveTab] = useState('chat');
  const [prefilledQuery, setPrefilledQuery] = useState('');

  // When farmer taps "Ask KisanMitra" from Crops or Mandi tab
  const handleAskAdvice = (query) => {
    setPrefilledQuery(query);
    setActiveTab('chat');
  };

  const handleLogin = (user) => {
    const activeUser = user || MOCK_USER;
    demoLogin(activeUser);
    // Set default demo farm parameters so farmer goes directly to main app chat
    updateContext({
      farmerName: activeUser?.name || 'Ramesh Kumar',
      state: 'uttar_pradesh',
      soilType: 'black',
      season: 'kharif',
      language: 'hinglish',
      hasCompletedOnboarding: true,
      hasSelectedLanguage: true
    });
  };

  // STEP 1: If farmer is not authenticated, show AuthScreen / Login page
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onDemoLogin={handleLogin}
        onSignIn={(identifier, password) => {
          signIn(identifier, password);
          handleLogin({ mobile: identifier });
        }}
        onSignUp={(name, mobile, password, confirmPassword) => {
          signUp(name, mobile, password, confirmPassword);
          handleLogin({ name, mobile });
        }}
        authError={authError}
        lockoutStatus={lockoutStatus}
        isLoading={isAuthLoading}
        language={context.language}
      />
    );
  }

  // STEP 2: If farmer has not chosen a preferred language, show Language Selection
  if (!context.hasSelectedLanguage) {
    return (
      <LanguageSelection
        currentLanguage={context.language}
        onSelectLanguage={selectLanguage}
      />
    );
  }

  // STEP 3: If farmer hasn't completed farm onboarding yet, show Onboarding
  if (!context.hasCompletedOnboarding) {
    return (
      <OnboardingFlow
        onComplete={completeOnboarding}
        initialContext={{
          ...context,
          farmerName: currentUser?.name || context.farmerName
        }}
      />
    );
  }

  // STEP 4: Main Application Workspace
  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans overflow-hidden">
      {/* Mobile-centric frame container */}
      <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-white shadow-2xl overflow-hidden relative">
        {/* Sticky Top Header */}
        <Header
          farmerContext={context}
          currentUser={currentUser}
          onOpenProfile={() => setActiveTab('profile')}
          onResetContext={resetOnboarding}
        />

        {/* Main View Area */}
        <main className="flex-1 overflow-hidden relative">
          {activeTab === 'chat' && (
            <ChatView
              farmerContext={{
                ...context,
                farmerName: currentUser?.name || context.farmerName
              }}
              initialQuery={prefilledQuery}
              onClearPrefilledQuery={() => setPrefilledQuery('')}
            />
          )}

          {activeTab === 'crops' && (
            <CropsView
              farmerContext={context}
              onAskCropAdvice={handleAskAdvice}
            />
          )}

          {activeTab === 'mandi' && (
            <MandiView
              farmerContext={context}
              onAskMandiAdvice={handleAskAdvice}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              farmerContext={context}
              currentUser={currentUser}
              onUpdateContext={updateContext}
              onResetOnboarding={resetOnboarding}
              onChangeLanguage={resetLanguage}
              onUpdateApiKeys={updateApiKeys}
              onSignOut={signOut}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          language={context.language}
        />
      </div>
    </div>
  );
}
