import React, { useState, useEffect } from 'react';

import {
  RotateCcw,
  ShieldCheck,
  Sparkles,
  LogOut,
  Languages,
  MessageSquare,
  Check,
  Layers,
  Sun
} from 'lucide-react';

import { INDIAN_STATES } from '../data/states';
import { SOIL_TYPES } from '../data/soils';
import { SEASONS } from '../data/seasons';
import { SUPPORTED_LANGUAGES } from '../components/LanguageSelection';
import { useTranslation } from '../i18n/useTranslation';


export default function ProfileView({
  farmerContext,
  currentUser,
  onUpdateContext,
  onResetOnboarding,
  onChangeLanguage,
  onSignOut
}) {

  const {
    t,
    isEnglish
  } = useTranslation(
    farmerContext?.language
  );


  // =========================================================
  // CURRENT USER
  // =========================================================

  const [user, setUser] = useState(
    currentUser || null
  );


  // Keep user synced with login session
  useEffect(() => {

    if (currentUser) {

      setUser(currentUser);

      return;
    }


    try {

      const storedUser =
        localStorage.getItem(
          'kisanmitra_user'
        );

      if (storedUser) {

        setUser(
          JSON.parse(storedUser)
        );
      }

    } catch (error) {

      console.error(
        'Failed to load current user:',
        error
      );

    }

  }, [currentUser]);


  // =========================================================
  // QUESTIONS COUNT
  // =========================================================

  const [questionsCount, setQuestionsCount] =
    useState(() => {

      try {

        return parseInt(
          localStorage.getItem(
            'kisanmitra_questions_count'
          ) || '0',
          10
        );

      } catch (error) {

        return 0;
      }

    });


  // =========================================================
  // FARM PROFILE
  // =========================================================

  const [selectedState, setSelectedState] =
    useState(
      farmerContext?.state || 'up'
    );


  const [selectedSoil, setSelectedSoil] =
    useState(
      farmerContext?.soilType || 'black'
    );


  const [selectedSeason, setSelectedSeason] =
    useState(
      farmerContext?.season || 'kharif'
    );


  const [updateSuccess, setUpdateSuccess] =
    useState(false);


  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false);


  const [profileLoading, setProfileLoading] =
    useState(true);


  // =========================================================
  // LOAD PROFILE FROM BACKEND
  // =========================================================

  useEffect(() => {

    const loadProfile = async () => {

      const userId =
        localStorage.getItem(
          'kisanmitra_user_id'
        );

      const token =
        localStorage.getItem(
          'kisanmitra_jwt'
        );


      if (!userId || !token) {

        console.warn(
          'User ID or JWT token missing'
        );

        setProfileLoading(false);

        return;
      }


      try {

        const response =
          await fetch(
            `http://localhost:8080/api/profile/${userId}`,
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        if (!response.ok) {

          console.error(
            'Failed to load profile:',
            response.status
          );

          setProfileLoading(false);

          return;
        }


        const profile =
          await response.json();


        console.log(
          'Profile loaded from backend:',
          profile
        );


        // -----------------------------------------------------
        // Load saved farm profile
        // -----------------------------------------------------

        if (profile.state) {

          setSelectedState(
            profile.state
          );
        }


        if (profile.soil) {

          setSelectedSoil(
            profile.soil
          );
        }


        if (profile.season) {

          setSelectedSeason(
            profile.season
          );
        }


        // -----------------------------------------------------
        // Update global farmer context
        // -----------------------------------------------------

        onUpdateContext({

          ...(profile.state
            ? {
                state:
                  profile.state
              }
            : {}),

          ...(profile.soil
            ? {
                soilType:
                  profile.soil
              }
            : {}),

          ...(profile.season
            ? {
                season:
                  profile.season
              }
            : {})
        });


      } catch (error) {

        console.error(
          'Profile loading connection error:',
          error
        );

      } finally {

        setProfileLoading(false);

      }

    };


    loadProfile();

  }, []);


  // =========================================================
  // UPDATE FARM PROFILE
  // =========================================================

  const handleFarmProfileChange =
    async (field, value) => {

      // -----------------------------------------------------
      // Update local UI
      // -----------------------------------------------------

      let newState =
        selectedState;

      let newSoil =
        selectedSoil;

      let newSeason =
        selectedSeason;


      if (field === 'state') {

        newState = value;

        setSelectedState(value);
      }


      if (field === 'soil') {

        newSoil = value;

        setSelectedSoil(value);
      }


      if (field === 'season') {

        newSeason = value;

        setSelectedSeason(value);
      }


      // -----------------------------------------------------
      // Update global context
      // -----------------------------------------------------

      onUpdateContext({

        state: newState,

        soilType: newSoil,

        season: newSeason

      });


      // -----------------------------------------------------
      // Get current login
      // -----------------------------------------------------

      const userId =
        localStorage.getItem(
          'kisanmitra_user_id'
        );

      const token =
        localStorage.getItem(
          'kisanmitra_jwt'
        );


      if (!userId || !token) {

        console.error(
          'User ID or JWT token missing'
        );

        return;
      }


      try {

        const response =
          await fetch(
            `http://localhost:8080/api/profile/${userId}`,
            {
              method: 'PUT',

              headers: {

                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`

              },

              body: JSON.stringify({

                state:
                  newState,

                soil:
                  newSoil,

                season:
                  newSeason

              })

            }
          );


        if (!response.ok) {

          const errorText =
            await response.text();

          console.error(
            'Profile update failed:',
            response.status,
            errorText
          );

          return;
        }


        console.log(
          'Profile updated successfully'
        );


        setUpdateSuccess(true);


        setTimeout(() => {

          setUpdateSuccess(false);

        }, 2000);


      } catch (error) {

        console.error(
          'Profile update connection error:',
          error
        );

      }

    };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    setShowLogoutConfirm(false);


    if (onSignOut) {

      onSignOut();

    }

  };


  // =========================================================
  // LANGUAGE
  // =========================================================

  const currentLang =
    SUPPORTED_LANGUAGES.find(
      (language) =>
        language.id ===
        farmerContext?.language
    );


  // =========================================================
  // USER DISPLAY
  // =========================================================

  const displayName =
    user?.name ||
    'User';


  const displayMobile =
    user?.mobile ||
    '';


  const displayEmail =
    user?.email ||
    '';


  const displayUid =
    user?.id ||
    user?.uid ||
    '';


  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part.charAt(0).toUpperCase()
      )
      .join('') ||
    'U';


  return (

    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-24 text-left">


      {/* =====================================================
          PROFILE HEADER
      ====================================================== */}

      <div className="bg-[#166534] text-white p-5 shadow-sm">

        <div className="max-w-2xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-3.5">


            {/* Avatar */}

            <div className="w-16 h-16 rounded-full bg-[#14532d] text-emerald-100 flex items-center justify-center text-2xl font-black shadow-md border-2 border-emerald-400 shrink-0">

              {user?.photo ? (

                <img
                  src={user.photo}
                  alt={displayName}
                  className="w-full h-full rounded-full object-cover"
                />

              ) : (

                <span>
                  {initials}
                </span>

              )}

            </div>


            <div>

              <div className="flex items-center gap-2 flex-wrap">

                <h2 className="text-xl font-bold leading-tight">

                  {displayName}

                </h2>


                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">

                  <span className="w-1.5 h-1.5 rounded-full bg-[#166534] animate-pulse"></span>

                  Active Account

                </span>

              </div>


              {displayMobile && (

                <p className="text-xs text-emerald-200 mt-1">

                  📱 {displayMobile}

                </p>

              )}


              {displayEmail && (

                <p className="text-xs text-emerald-200 mt-0.5">

                  {displayEmail}

                </p>

              )}


              {displayUid && (

                <p className="text-[10px] text-emerald-300 mt-0.5 font-mono">

                  User ID: {displayUid}

                </p>

              )}

            </div>

          </div>

        </div>

      </div>


      <div className="max-w-2xl mx-auto w-full p-4 space-y-4">


        {/* =================================================
            STATS
        ================================================== */}

        <div className="grid grid-cols-2 gap-3">


          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center shrink-0">

              <MessageSquare className="w-5 h-5" />

            </div>


            <div>

              <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">

                {isEnglish
                  ? 'Questions Asked'
                  : 'सवाल पूछे गए'}

              </span>


              <span className="text-2xl font-black text-slate-800">

                {questionsCount}

              </span>

            </div>

          </div>


          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">

              <Sparkles className="w-5 h-5" />

            </div>


            <div>

              <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">

                AI Service

              </span>


              <span className="text-xs font-bold text-emerald-700 block mt-1">

                ⚡ Gemini Active

              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            FARM PROFILE
        ================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">


          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">

            <div className="flex items-center gap-2">

              <span className="text-lg">
                🌾
              </span>


              <h3 className="text-sm font-bold text-slate-800">

                {isEnglish
                  ? 'Farm Profile'
                  : 'खेत की जानकारी'}

              </h3>

            </div>


            {updateSuccess && (

              <span className="text-[11px] font-bold text-[#166534] bg-[#dcfce7] px-2 py-0.5 rounded-md flex items-center gap-1">

                <Check className="w-3 h-3" />

                Updated!

              </span>

            )}

          </div>


          <p className="text-xs text-slate-500 mb-3.5">

            {isEnglish

              ? 'Your saved region, soil type, and season are used by Gemini for personalized advice.'

              : 'राज्य, मिट्टी और मौसम की जानकारी Gemini की personalized सलाह के लिए उपयोग होती है।'}

          </p>


          {profileLoading ? (

            <div className="text-center py-6 text-sm text-slate-500">

              Loading your farm profile...

            </div>

          ) : (

            <div className="space-y-3">


              {/* STATE */}

              <div>

                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">

                  <span>📍</span>

                  <span>

                    {isEnglish
                      ? 'State / Region:'
                      : 'राज्य:'}

                  </span>

                </label>


                <select

                  value={selectedState}

                  onChange={(e) =>
                    handleFarmProfileChange(
                      'state',
                      e.target.value
                    )
                  }

                  className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-emerald-100 cursor-pointer"

                >

                  {INDIAN_STATES
                    .slice()
                    .sort(
                      (a, b) =>
                        a.name.localeCompare(
                          b.name
                        )
                    )
                    .map((state) => (

                      <option
                        key={state.id}
                        value={state.id}
                      >

                        {state.name}
                        {' '}
                        ({state.hindi})

                      </option>

                    ))}

                </select>

              </div>


              {/* SOIL */}

              <div>

                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">

                  <Layers className="w-3.5 h-3.5 text-amber-700" />

                  <span>

                    {isEnglish
                      ? 'Soil Type:'
                      : 'मिट्टी का प्रकार:'}

                  </span>

                </label>


                <select

                  value={selectedSoil}

                  onChange={(e) =>
                    handleFarmProfileChange(
                      'soil',
                      e.target.value
                    )
                  }

                  className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-emerald-100 cursor-pointer"

                >

                  {SOIL_TYPES.map(
                    (soil) => (

                      <option
                        key={soil.id}
                        value={soil.id}
                      >

                        {soil.icon}
                        {' '}
                        {soil.name}
                        {' — '}
                        {soil.hindi}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* SEASON */}

              <div>

                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">

                  <Sun className="w-3.5 h-3.5 text-amber-500" />

                  <span>

                    {isEnglish
                      ? 'Current Season:'
                      : 'वर्तमान मौसम:'}

                  </span>

                </label>


                <select

                  value={selectedSeason}

                  onChange={(e) =>
                    handleFarmProfileChange(
                      'season',
                      e.target.value
                    )
                  }

                  className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-emerald-100 cursor-pointer"

                >

                  {SEASONS.map(
                    (season) => (

                      <option
                        key={season.id}
                        value={season.id}
                      >

                        {season.icon}
                        {' '}
                        {season.name}
                        {' ('}
                        {season.hindi}
                        {') — '}
                        {season.months}

                      </option>

                    )
                  )}

                </select>

              </div>

            </div>

          )}

        </div>


        {/* =================================================
            LANGUAGE
        ================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">

          <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-2">

            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">

              <Languages className="w-4 h-4 text-[#166534]" />

              <span>
                {t('languagePref')}
              </span>

            </h3>


            <button

              type="button"

              onClick={onChangeLanguage}

              className="text-xs text-[#166534] hover:text-emerald-900 font-bold flex items-center gap-1 active:scale-95 cursor-pointer"

            >

              <RotateCcw className="w-3.5 h-3.5" />

              <span>
                {t('changeLangBtn')}
              </span>

            </button>

          </div>


          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 flex items-center justify-between">

            <div className="flex items-center gap-2.5">

              <span className="text-2xl">

                {currentLang?.flag || '🇮🇳'}

              </span>


              <div>

                <span className="font-bold text-sm text-emerald-950 block">

                  {currentLang?.name ||
                    'Hinglish'}

                </span>


                <span className="text-xs text-[#166534]">

                  {currentLang?.subname ||
                    'Hindi + English Mix'}

                </span>

              </div>

            </div>


            <span className="bg-[#166534] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">

              {t('activeLangBadge')}

            </span>

          </div>

        </div>


        {/* =================================================
            LOGOUT
        ================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">


          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">

            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">

              <ShieldCheck className="w-4 h-4 text-[#166534]" />

              <span>
                Session & Logout
              </span>

            </h3>


            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">

              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>

              Secure Session

            </span>

          </div>


          {!showLogoutConfirm ? (

            <button

              type="button"

              onClick={() =>
                setShowLogoutConfirm(true)
              }

              className="w-full min-h-[48px] rounded-xl border-2 border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"

            >

              <LogOut className="w-4 h-4 text-rose-600" />

              <span>
                {t('signOutBtn')}
              </span>

            </button>

          ) : (

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-center space-y-2.5">


              <p className="text-xs text-rose-900 font-bold">

                {t('signOutConfirmTitle')}

              </p>


              <p className="text-[11px] text-rose-700">

                Aap wapas Login screen par redirect ho jayenge.

              </p>


              <div className="grid grid-cols-2 gap-2">


                <button

                  type="button"

                  onClick={() =>
                    setShowLogoutConfirm(false)
                  }

                  className="min-h-[42px] rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"

                >

                  {t('signOutConfirmNo')}

                </button>


                <button

                  type="button"

                  onClick={handleLogout}

                  className="min-h-[42px] rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs cursor-pointer"

                >

                  {t('signOutConfirmYes')}

                </button>

              </div>

            </div>

          )}

        </div>


        {/* =================================================
            ABOUT KISANMITRA
        ================================================== */}

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950">


          <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5 mb-1.5">

            <Sparkles className="w-4 h-4 text-amber-600" />

            <span>
              KisanMitra AI
            </span>

          </div>


          <p className="leading-relaxed text-slate-700">

            Your farm profile is securely saved in the KisanMitra backend and used to provide personalized agricultural advice through Gemini.

          </p>


          <div className="mt-2 text-[11px] text-[#166534] font-semibold">

            • Spring Boot Backend • PostgreSQL • Gemini AI

          </div>

        </div>


      </div>

    </div>
  );
}