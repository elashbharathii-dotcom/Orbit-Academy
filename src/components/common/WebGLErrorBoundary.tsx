import { Component, ErrorInfo, ReactNode } from 'react';
import { Compass, RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackHeight?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ORBIT ACADEMY — RESILIENT WEBGL ERROR BOUNDARY
 * Protects the application tree from WebGL context creation failures, GPU exhaustion,
 * and Three.js runtime shader crashes. Gracefully renders a tactical 2D avionics HUD.
 */
export class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(
      '[ORBIT ACADEMY] WebGL Rendering Error caught by WebGLErrorBoundary:',
      error.message,
      errorInfo
    );
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      const {
        fallbackTitle = 'Tactical 2D Avionics Mode Active',
        fallbackDescription = 'The 3D WebGL context is currently operating in low-resource or compatibility mode. Flight instrumentation, telemetry, and scientific data remain 100% operational.',
        fallbackHeight = 'h-full',
      } = this.props;

      return (
        <div
          role="region"
          aria-label="3D WebGL Fallback Avionics Screen"
          className={`relative w-full ${fallbackHeight} flex flex-col items-center justify-center bg-[#02050D] text-[#F8FAFC] p-6 text-center select-none overflow-hidden`}
        >
          {/* Subtle cosmic grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.06),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#070C1B]/95 border border-cyan-500/30 shadow-[0_0_50px_rgba(56,189,248,0.15)] backdrop-blur-2xl flex flex-col items-center">
            {/* Sensor Emblem */}
            <div className="h-14 w-14 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.3)] mb-4">
              <Compass className="h-7 w-7 animate-spin-slow" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider mb-3">
              <AlertTriangle className="h-3 w-3" />
              <span>COMPATIBILITY TELEMETRY ENGAGED</span>
            </div>

            <h3 className="font-sans font-extrabold text-base sm:text-lg text-white tracking-wide">
              {fallbackTitle}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {fallbackDescription}
            </p>

            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/40 font-mono text-xs font-bold text-cyan-200 transition-all shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>RE-INITIALIZE 3D CONTEXT</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
