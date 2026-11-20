import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  MonitorUp,
  UserX,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileWarning,
  Sliders,
  Lock,
  Smartphone,
  EyeOff,
  Copy,
  Check,
  ArrowRight,
  Scale,
  History
} from 'lucide-react';

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'vault' | 'policy'

  // Live OS & Transaction Telemetry State
  const [amount, setAmount] = useState(15000);
  const [payeeVpa, setPayeeVpa] = useState('refund.desk@okaxis');
  const [payeeName, setPayeeName] = useState('Unknown Merchant / Desk');
  const [threshold, setThreshold] = useState(2000);

  // Deterministic Signals
  const [isOnCall, setIsOnCall] = useState(true);
  const [callType, setCallType] = useState('voip'); // 'cellular' | 'voip' (WhatsApp/Telegram)
  const [isUnsavedCaller, setIsUnsavedCaller] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFirstTimePayee, setIsFirstTimePayee] = useState(true);

  // User Preferences / Fallback Controls
  const [coSignerConfigured, setCoSignerConfigured] = useState(true);
  const [soloPrivacyMode, setSoloPrivacyMode] = useState(false);

  // Transaction Execution State
  // 'idle' | 'settled_instant' | 'held_cosigner' | 'held_solo' | 'approved_released' | 'blocked_cancelled'
  const [txStatus, setTxStatus] = useState('idle');
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 mins default
  const [coSignerVerifiedVoice, setCoSignerVerifiedVoice] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // 1930 Cybercrime Evidence Vault Log
  const [evidenceLogs, setEvidenceLogs] = useState([
    {
      id: 'KVC-2026-8841',
      timestamp: 'Today, 11:18 AM',
      vpa: 'courier.customs@ybl',
      amount: 24500,
      signals: ['WhatsApp VoIP Call (MODE_IN_COMMUNICATION)', 'Unsaved Caller', 'New VPA'],
      outcome: 'Blocked by Co-Signer (₹0 Debited)'
    }
  ]);

  // Timer countdown during active hold
  useEffect(() => {
    if (txStatus !== 'held_cosigner' && txStatus !== 'held_solo') return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [txStatus]);

  // Deterministic Risk Engine (<15ms local calculation)
  const evaluateRisk = () => {
    let score = 0;
    const reasons = [];

    if (isScreenSharing) {
      score += 60;
      reasons.push('Active screen projection / virtual display (DisplayManager)');
    }

    if (isOnCall && isUnsavedCaller) {
      score += 45;
      reasons.push(
        callType === 'voip'
          ? 'Active VoIP/WhatsApp call (MODE_IN_COMMUNICATION) with unsaved caller'
          : 'Active cellular call (MODE_IN_CALL) with unsaved number'
      );
    } else if (isOnCall && !isUnsavedCaller) {
      score += 15;
      reasons.push('Active call with saved contact');
    }

    if (isFirstTimePayee) {
      score += 20;
      reasons.push(`First-time recipient VPA (${payeeVpa})`);
    }

    if (Number(amount) >= Number(threshold)) {
      score += 20;
      reasons.push(`Amount ₹${Number(amount).toLocaleString('en-IN')} exceeds personal threshold ₹${Number(threshold).toLocaleString('en-IN')}`);
    }

    const cappedScore = Math.min(score, 100);
    const hasCoercionSignal = isScreenSharing || (isOnCall && isUnsavedCaller);
    const shouldHold = hasCoercionSignal && cappedScore >= 60;

    return { score: cappedScore, reasons, shouldHold };
  };

  const risk = evaluateRisk();

  // Preset Scam & Normal Scenarios
  const applyPreset = (preset) => {
    setTxStatus('idle');
    setCoSignerVerifiedVoice(false);
    if (preset === 'normal') {
      setAmount(180);
      setPayeeVpa('chai.point@okicici');
      setPayeeName('Chai Point Koramangala');
      setIsOnCall(false);
      setIsUnsavedCaller(false);
      setIsScreenSharing(false);
      setIsFirstTimePayee(false);
    } else if (preset === 'digital_arrest') {
      setAmount(15000);
      setPayeeVpa('refund.desk@okaxis');
      setPayeeName('Verification Escrow Desk');
      setIsOnCall(true);
      setCallType('voip');
      setIsUnsavedCaller(true);
      setIsScreenSharing(false);
      setIsFirstTimePayee(true);
    } else if (preset === 'anydesk') {
      setAmount(8500);
      setPayeeVpa('kyc.support99@okhdfcbank');
      setPayeeName('KYC Update Support');
      setIsOnCall(true);
      setCallType('cellular');
      setIsUnsavedCaller(true);
      setIsScreenSharing(true);
      setIsFirstTimePayee(true);
    }
  };

  const handleInitiatePayment = () => {
    setCoSignerVerifiedVoice(false);
    if (!risk.shouldHold) {
      setTxStatus('settled_instant');
      return;
    }

    if (coSignerConfigured && !soloPrivacyMode) {
      setSecondsLeft(15 * 60); // 15-minute co-signer cool-off
      setTxStatus('held_cosigner');
    } else {
      setSecondsLeft(60 * 60); // 60-minute solo fallback cool-off
      setTxStatus('held_solo');
    }
  };

  const handleBlockAndLog = (blockedBy) => {
    const newLog = {
      id: `KVC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      vpa: payeeVpa,
      amount: Number(amount),
      signals: risk.reasons.length > 0 ? risk.reasons : ['Manual User Hold'],
      outcome: `${blockedBy} (₹0 Debited)`
    };
    setEvidenceLogs((prev) => [newLog, ...prev]);
    setTxStatus('blocked_cancelled');
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const copyEvidenceReport = (log) => {
    const reportText = `1930 CYBERCRIME / CHAKSHU FRAUD ATTEMPT REPORT\nRef ID: ${log.id}\nTime: ${log.timestamp}\nSuspect UPI VPA: ${log.vpa}\nAttempted Amount: INR ${log.amount} (PREVENTED - INR 0 DEBITED)\nOS Telemetry Triggers: ${log.signals.join(' | ')}`;
    navigator.clipboard?.writeText(reportText);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-white">KavachUPI</h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Pre-Debit Intent Shield
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Context-Aware Coercion Detection • Zero-Escrow Intent Interception
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'simulator'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Live Dual-Device Demo
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'vault'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              1930 Evidence Vault
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[10px]">
                {evidenceLogs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'policy'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              RBI 2026 Comparison
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: OS Sensor & Risk Engine Simulator (4 cols) */}
            <section className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  1. Android OS Telemetry Simulator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Test how deterministic OS flags evaluate intent before UPI PIN entry.
                </p>
              </div>

              {/* Quick Scenario Presets */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Quick Test Scenarios
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => applyPreset('normal')}
                    className="text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs flex items-center justify-between transition"
                  >
                    <span>☕ Normal Merchant QR (₹180)</span>
                    <span className="text-emerald-400 font-medium">&lt;2s Instant</span>
                  </button>
                  <button
                    onClick={() => applyPreset('digital_arrest')}
                    className="text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs flex items-center justify-between transition"
                  >
                    <span>🚨 "Digital Arrest" WhatsApp Scam</span>
                    <span className="text-rose-400 font-medium">Intent Hold</span>
                  </button>
                  <button
                    onClick={() => applyPreset('anydesk')}
                    className="text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs flex items-center justify-between transition"
                  >
                    <span>🖥️ AnyDesk Screen-Share Scam</span>
                    <span className="text-rose-400 font-medium">Intent Hold</span>
                  </button>
                </div>
              </div>

              {/* OS Signal Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Live Device Signals
                </label>

                {/* Active Call Toggle */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PhoneCall className={`w-4 h-4 ${isOnCall ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-medium text-slate-200">Active Voice / VoIP Call</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isOnCall}
                      onChange={(e) => {
                        setIsOnCall(e.target.checked);
                        setTxStatus('idle');
                      }}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  {isOnCall && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setCallType('voip')}
                        className={`flex-1 py-1 px-2 rounded text-[11px] border ${
                          callType === 'voip'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        WhatsApp / VoIP
                      </button>
                      <button
                        onClick={() => setCallType('cellular')}
                        className={`flex-1 py-1 px-2 rounded text-[11px] border ${
                          callType === 'cellular'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        Cellular Call
                      </button>
                    </div>
                  )}
                </div>

                {/* Unsaved Caller */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <UserX className={`w-4 h-4 ${isUnsavedCaller ? 'text-rose-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-medium text-slate-200">Caller Not in Contacts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isUnsavedCaller}
                    onChange={(e) => {
                      setIsUnsavedCaller(e.target.checked);
                      setTxStatus('idle');
                    }}
                    className="accent-emerald-500 w-4 h-4"
                  />
                </label>

                {/* Screen Projection */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MonitorUp className={`w-4 h-4 ${isScreenSharing ? 'text-rose-400' : 'text-slate-500'}`} />
                    <div>
                      <span className="text-xs font-medium text-slate-200 block">Screen Projection Active</span>
                      <span className="text-[10px] text-slate-500">AnyDesk / TeamViewer / Virtual Display</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isScreenSharing}
                    onChange={(e) => {
                      setIsScreenSharing(e.target.checked);
                      setTxStatus('idle');
                    }}
                    className="accent-emerald-500 w-4 h-4"
                  />
                </label>

                {/* First-Time Payee */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${isFirstTimePayee ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-medium text-slate-200">First-Time Payee VPA</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFirstTimePayee}
                    onChange={(e) => {
                      setIsFirstTimePayee(e.target.checked);
                      setTxStatus('idle');
                    }}
                    className="accent-emerald-500 w-4 h-4"
                  />
                </label>

                {/* Threshold & Privacy Fallback */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Personal Alert Threshold</span>
                    <span className="font-semibold text-white">₹{Number(threshold).toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={threshold}
                    onChange={(e) => {
                      setThreshold(Number(e.target.value));
                      setTxStatus('idle');
                    }}
                    className="w-full accent-emerald-500"
                  />
                  <label className="flex items-center justify-between pt-1 border-t border-slate-800/80 cursor-pointer">
                    <div className="flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] text-slate-300">Solo Privacy Mode (60m fallback)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={soloPrivacyMode}
                      onChange={(e) => {
                        setSoloPrivacyMode(e.target.checked);
                        setTxStatus('idle');
                      }}
                      className="accent-emerald-500 w-3.5 h-3.5"
                    />
                  </label>
                </div>
              </div>

              {/* Deterministic Risk Score Box */}
              <div
                className={`p-3.5 rounded-xl border ${
                  risk.shouldHold
                    ? 'bg-rose-950/30 border-rose-500/40'
                    : 'bg-emerald-950/30 border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                    Deterministic Risk Score
                  </span>
                  <span
                    className={`text-sm font-bold px-2 py-0.5 rounded ${
                      risk.shouldHold ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {risk.score} / 100
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {risk.shouldHold
                    ? 'Coercion context + threshold met → Pre-Debit Intent Hold armed.'
                    : 'Low coercion risk → Normal <2s UPI settlement.'}
                </p>
              </div>
            </section>

            {/* CENTER COLUMN: Sender Phone Simulation (4 cols) */}
            <section className="lg:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[360px] rounded-[2.2rem] border-[5px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
                {/* Phone Status Bar */}
                <div className="bg-slate-950 px-5 py-2.5 flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-800/80">
                  <span className="font-semibold text-slate-200">9:41 AM</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] text-emerald-400 border border-slate-800">
                    KavachUPI Wrapper
                  </span>
                  <span>5G • 100%</span>
                </div>

                {/* Active Call / Screen Share Banner inside Phone */}
                {(isOnCall || isScreenSharing) && (
                  <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <PhoneCall className="w-3 h-3 animate-pulse" />
                      {isScreenSharing
                        ? 'Screen Projection + Call Active'
                        : isOnCall
                        ? `${callType === 'voip' ? 'WhatsApp Call' : 'Phone Call'} (${
                            isUnsavedCaller ? 'Unsaved' : 'Saved'
                          })`
                        : ''}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold">Monitored</span>
                  </div>
                )}

                <div className="p-5 space-y-4 min-h-[500px] flex flex-col justify-between">
                  {txStatus === 'idle' && (
                    <>
                      <div className="space-y-4">
                        <div className="text-center pt-1">
                          <span className="text-[11px] uppercase tracking-wider text-slate-400">
                            2. Sender Device (upi://pay Intent)
                          </span>
                          <h3 className="text-base font-bold text-white mt-0.5">Verify & Pay via UPI</h3>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                          <div>
                            <label className="text-[11px] text-slate-400 block">Paying To</label>
                            <input
                              type="text"
                              value={payeeName}
                              onChange={(e) => setPayeeName(e.target.value)}
                              className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none border-b border-slate-800 pb-1 mt-0.5"
                            />
                            <input
                              type="text"
                              value={payeeVpa}
                              onChange={(e) => setPayeeVpa(e.target.value)}
                              className="w-full bg-transparent text-xs text-emerald-400 focus:outline-none mt-1"
                            />
                          </div>

                          <div className="pt-2 border-t border-slate-800">
                            <label className="text-[11px] text-slate-400 block">Amount (INR)</label>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-2xl font-bold text-slate-400">₹</span>
                              <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-transparent text-3xl font-bold text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Pre-check indicator */}
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                          <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            Intent is evaluated <strong>before</strong> UPI PIN entry. Zero funds are held in escrow.
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleInitiatePayment}
                        className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                      >
                        Proceed to Pay ₹{Number(amount).toLocaleString('en-IN')}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {txStatus === 'settled_instant' && (
                    <div className="my-auto text-center space-y-4 py-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                          Low Risk • Settled in 1.4s
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1">
                          ₹{Number(amount).toLocaleString('en-IN')} Paid
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Handed off directly to PSP app with zero added friction.
                        </p>
                      </div>
                      <button
                        onClick={() => setTxStatus('idle')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white"
                      >
                        Test Another Payment
                      </button>
                    </div>
                  )}

                  {(txStatus === 'held_cosigner' || txStatus === 'held_solo') && (
                    <div className="space-y-3.5">
                      <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/50 space-y-2">
                        <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          Pre-Debit Intent Hold Active
                        </div>
                        <p className="text-xs text-white font-semibold leading-relaxed">
                          "Stop & Verify: Police, CBI, customs, and banks NEVER ask you to transfer money while on a call."
                        </p>
                        <div className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold">
                          ₹0 Debited • UPI PIN Blocked
                        </div>
                      </div>

                      {/* Triggered Reasons */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                          Why This Was Paused
                        </span>
                        {risk.reasons.map((r, idx) => (
                          <div key={idx} className="text-[11px] text-amber-300 flex items-start gap-1.5">
                            <span>•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      {/* Cool-off Timer */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400 block">
                            {txStatus === 'held_cosigner'
                              ? 'Co-Signer Cool-Off Window'
                              : 'Solo Privacy Cool-Off Timer'}
                          </span>
                          <span className="text-xs text-slate-300">
                            {txStatus === 'held_cosigner'
                              ? 'Awaiting trusted family approval'
                              : 'Self-reflection buffer active'}
                          </span>
                        </div>
                        <div className="text-lg font-mono font-bold text-amber-400 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimer(secondsLeft)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => handleBlockAndLog('Cancelled by Sender')}
                          className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel Payment & Log for 1930
                        </button>

                        {txStatus === 'held_cosigner' && (
                          <button
                            onClick={() => {
                              setSecondsLeft(60 * 60);
                              setTxStatus('held_solo');
                            }}
                            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
                          >
                            Co-Signer Unreachable? Switch to 60m Solo Timer
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {txStatus === 'approved_released' && (
                    <div className="my-auto text-center space-y-4 py-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                        <UserCheck className="w-9 h-9" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                          Co-Signer Verified • Intent Released
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">
                          ₹{Number(amount).toLocaleString('en-IN')} Authorized
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Intent forwarded to PSP app for UPI PIN completion.
                        </p>
                      </div>
                      <button
                        onClick={() => setTxStatus('idle')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white"
                      >
                        Reset Demo
                      </button>
                    </div>
                  )}

                  {txStatus === 'blocked_cancelled' && (
                    <div className="my-auto text-center space-y-4 py-6">
                      <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-9 h-9" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                          Scam Attempt Neutralized
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">₹0 Lost • Intent Destroyed</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          VPA & OS telemetry saved to the 1930 Evidence Vault.
                        </p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setActiveTab('vault')}
                          className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white"
                        >
                          View 1930 Report
                        </button>
                        <button
                          onClick={() => setTxStatus('idle')}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white"
                        >
                          Reset Demo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* RIGHT COLUMN: Family Co-Signer Device (4 cols) */}
            <section className="lg:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[360px] rounded-[2.2rem] border-[5px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
                <div className="bg-slate-950 px-5 py-2.5 flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-800/80">
                  <span className="font-semibold text-slate-200">9:41 AM</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-[10px] text-indigo-300 border border-indigo-500/30">
                    Family Co-Signer Guard
                  </span>
                  <span>Wi-Fi</span>
                </div>

                <div className="p-5 min-h-[500px] flex flex-col justify-between">
                  <div className="text-center pt-1">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400">
                      3. Trusted Co-Signer Device
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">Context-Rich Push Guard</h3>
                  </div>

                  {txStatus === 'held_cosigner' ? (
                    <div className="space-y-4 my-auto">
                      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                            <FileWarning className="w-4 h-4" />
                            High-Risk Payment Alert
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">
                            Just now
                          </span>
                        </div>

                        <p className="text-xs text-slate-100 leading-relaxed">
                          Family member is attempting to send{' '}
                          <strong className="text-white">₹{Number(amount).toLocaleString('en-IN')}</strong> to an{' '}
                          <strong className="text-amber-300">unverified payee ({payeeVpa})</strong> while{' '}
                          <strong className="text-rose-300">
                            {isScreenSharing ? 'sharing their screen' : 'on an unknown call'}
                          </strong>
                          .
                        </p>
                      </div>

                      {/* Anti-Coaching Verification Checkbox */}
                      <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={coSignerVerifiedVoice}
                          onChange={(e) => setCoSignerVerifiedVoice(e.target.checked)}
                          className="mt-0.5 accent-emerald-500 w-4 h-4 shrink-0"
                        />
                        <span className="text-[11px] text-slate-300 leading-snug">
                          <strong>Anti-Coaching Check:</strong> I have spoken to them independently and confirmed they are not being pressured by police, bank, or courier callers.
                        </span>
                      </label>

                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          onClick={() => handleBlockAndLog('Blocked by Co-Signer')}
                          className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                        >
                          Block Scam
                        </button>
                        <button
                          disabled={!coSignerVerifiedVoice}
                          onClick={() => setTxStatus('approved_released')}
                          className={`py-2.5 px-3 rounded-xl font-bold text-xs transition ${
                            coSignerVerifiedVoice
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Approve Release
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="my-auto text-center space-y-3 px-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                        <Shield className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-medium text-slate-300">
                        {txStatus === 'held_solo'
                          ? 'Solo Privacy Mode / Fallback Active'
                          : 'No Active Coercion Holds'}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {txStatus === 'held_solo'
                          ? 'User opted for a 60-minute self-cool-off timer without notifying family.'
                          : 'Normal payments stay completely private. Co-signer is only alerted when active call/screen-share coercion is detected.'}
                      </p>
                    </div>
                  )}

                  <div className="text-center text-[10px] text-slate-500 border-t border-slate-800/80 pt-3">
                    Prevents attacker coaching via full context disclosure
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: 1930 Cybercrime Evidence Vault */}
        {activeTab === 'vault' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileWarning className="w-5 h-5 text-rose-400" />
                  1930 National Cybercrime & Chakshu Evidence Vault
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Every blocked or cancelled coercion attempt is preserved locally with OS telemetry for one-click reporting.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {evidenceLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-emerald-400">{log.id}</span>
                      <span className="text-xs text-slate-500">• {log.timestamp}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium">
                        {log.outcome}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Target VPA: <span className="text-amber-300 font-mono">{log.vpa}</span> — Attempted:{' '}
                      <span>₹{log.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {log.signals.map((sig, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300"
                        >
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => copyEvidenceReport(log)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedId === log.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        Copied 1930 Dossier
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy 1930 / Chakshu Report
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RBI 2026 Policy Comparison */}
        {activeTab === 'policy' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                How KavachUPI Complements & Differs from RBI's 2026 Fraud Proposals
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Addressing the RBI Discussion Paper (April 2026) on Digital Payment Safeguards without slowing down legitimate commerce.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4 font-semibold">Dimension</th>
                    <th className="py-3 px-4 font-semibold">RBI Discussion Paper (Apr 2026)</th>
                    <th className="py-3 px-4 font-semibold text-emerald-400">KavachUPI Layer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-white">Trigger Mechanism</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      Blanket amount threshold (P2P transfers above ₹10,000)
                    </td>
                    <td className="py-3.5 px-4 text-emerald-300 font-medium">
                      Real-time OS coercion context (Active Call + Unsaved Number / Screen Share)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-white">Funds Handling</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      Provisional debit at payer bank ("lagged credit" hold for 1 hour)
                    </td>
                    <td className="py-3.5 px-4 text-emerald-300 font-medium">
                      Pre-debit Intent pause (₹0 debited; paused before UPI PIN & NPCI settlement)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-white">Sub-₹10,000 Scams</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      Not covered by the ₹10,000 lagged-credit rule
                    </td>
                    <td className="py-3.5 px-4 text-emerald-300 font-medium">
                      Protected via user-configurable threshold (default ₹2,000)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-white">Legitimate High-Value Speed</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      Delayed by 1 hour unless payee was previously whitelisted
                    </td>
                    <td className="py-3.5 px-4 text-emerald-300 font-medium">
                      Settles in &lt;2 seconds whenever user is not under active call/screen coercion
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-white">Co-Signer / Trusted Person</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      Proposed primarily for seniors (70+) above ₹50,000
                    </td>
                    <td className="py-3.5 px-4 text-emerald-300 font-medium">
                      Available to all users with context-rich alert + 60m solo privacy fallback
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}