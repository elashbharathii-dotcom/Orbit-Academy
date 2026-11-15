import React, { useState } from 'react';
import { X, CheckCircle2, Radio, Mail, User, Send, RadioTower, Sparkles } from 'lucide-react';
import { ClippedButton } from './ClippedButton';

interface MissionControlSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MissionControlSupportModal: React.FC<MissionControlSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Mars Rover Operations');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setName('');
      setEmail('');
      setMessage('');
    }, 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-up"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-[#0A0A0A] p-6 sm:p-8 text-white shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EE3F2C] text-white shadow-[0_0_15px_rgba(238,63,44,0.4)]">
                <Radio className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-white uppercase font-sans">
                    Mission Control Comms
                  </h2>
                  <span className="text-[10px] font-mono text-[#EE3F2C] border border-[#EE3F2C]/30 bg-[#EE3F2C]/10 px-2 py-0.5 rounded-full font-semibold">
                    DSN 43
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  Direct communication with Orbit Academy Flight Directorate & Laura AI.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3.5 mt-1">
              {/* Cadet Name */}
              <div>
                <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-medium font-mono">
                  Cadet Name / Call Sign
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    required
                    placeholder="Commander Shepard / Explorer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-sm text-white placeholder-white/40 focus:border-[#EE3F2C] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Email / Frequency */}
              <div>
                <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-medium font-mono">
                  Comms Channel / Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <input
                    type="email"
                    required
                    placeholder="cadet@orbitacademy.nasa.gov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-sm text-white placeholder-white/40 focus:border-[#EE3F2C] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Mission Topic */}
              <div>
                <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-medium font-mono">
                  Mission Inquiries
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-white/20 bg-[#141414] text-sm text-white focus:border-[#EE3F2C] focus:outline-none transition"
                >
                  <option value="Mars Rover Operations">Mars Rover Operations & Controls</option>
                  <option value="Spectroscopy & Core Sampling">Raman Spectroscopy & Core Sampling</option>
                  <option value="Jezero Navigation & Radar">Jezero Navigation & RIMFAX Radar</option>
                  <option value="Outpost Alpha Habitat">Outpost Alpha Habitat Life Support</option>
                  <option value="Cadet Curriculum & XP">Cadet Curriculum, Badges & XP</option>
                </select>
              </div>

              {/* Telemetry Notes / Message */}
              <div>
                <label className="text-xs uppercase tracking-wider text-white/70 block mb-1 font-medium font-mono">
                  Telemetry Report / Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your inquiry, telemetry observation, or flight request..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-lg border border-white/20 bg-white/5 text-sm text-white placeholder-white/40 focus:border-[#EE3F2C] focus:outline-none transition resize-none"
                />
              </div>
            </div>

            {/* Comm Delay Advisory */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-[11px] font-mono text-white/60">
              <RadioTower className="h-4 w-4 text-[#EE3F2C] shrink-0" />
              <span>Mars-Earth Comm Light Delay: ~14.2 min. Priority queues processed via Laura AI.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <ClippedButton type="submit" className="!px-6 !py-2.5 text-xs font-bold uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Send className="h-3.5 w-3.5" />
                  <span>Transmit to Mission Control</span>
                </span>
              </ClippedButton>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-4 animate-fade-up">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                Transmission Received
              </h3>
              <p className="text-xs font-mono text-emerald-400">
                DEEP SPACE NETWORK PACKET ACKNOWLEDGED
              </p>
            </div>
            <p className="text-sm text-white/70 max-w-sm">
              Thank you, <strong className="text-white">{name || 'Cadet'}</strong>. Mission Control and Laura AI have logged your dispatch for <strong className="text-[#EE3F2C]">{topic}</strong>. Comms uplink established with {email}.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/50 font-mono mt-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>+25 XP Awarded for Mission Control Protocol</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionControlSupportModal;
