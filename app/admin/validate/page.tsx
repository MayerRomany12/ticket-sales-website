"use client";

import { useState } from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { validateTicket, type ValidationResult } from "@/app/actions/validateTicket";
import { CheckCircle2, XCircle, AlertCircle, ScanLine, Keyboard, Loader2 } from "lucide-react";

export default function ValidatePage() {
  const [mode, setMode] = useState<"scan" | "manual">("scan");
  const [manualCode, setManualCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidation = async (code: string) => {
    if (!code) return;
    setIsProcessing(true);
    setResult(null);

    try {
      const res = await validateTicket(code);
      setResult(res);
    } catch (err) {
      setResult({ status: "INVALID", message: "An error occurred while validating." });
    } finally {
      setIsProcessing(false);
      setManualCode("");
    }
  };

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (isProcessing) return;
    if (detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue;
      if (code) {
        handleValidation(code);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidation(manualCode);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Scan Tickets</h2>
          <p className="text-slate-400 text-sm mt-1">Validate entry tickets</p>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => { setMode("scan"); setResult(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "scan" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <ScanLine className="w-4 h-4" />
            Scanner
          </button>
          <button
            onClick={() => { setMode("manual"); setResult(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "manual" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <Keyboard className="w-4 h-4" />
            Manual
          </button>
        </div>
      </div>

      {/* Validation Result Area */}
      {result && (
        <div className={`p-6 rounded-2xl border ${
          result.status === "VALID" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
          result.status === "USED" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
          "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          <div className="flex items-start gap-4">
            {result.status === "VALID" && <CheckCircle2 className="w-8 h-8 flex-shrink-0" />}
            {result.status === "USED" && <AlertCircle className="w-8 h-8 flex-shrink-0" />}
            {result.status === "INVALID" && <XCircle className="w-8 h-8 flex-shrink-0" />}
            
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">
                {result.status === "VALID" && "Access Granted"}
                {result.status === "USED" && "Already Scanned"}
                {result.status === "INVALID" && "Invalid Ticket"}
              </h3>
              <p className="text-sm opacity-90 mb-4">{result.message}</p>
              
              {result.status !== "INVALID" && (
                <div className="bg-black/20 rounded-lg p-4 space-y-2 text-sm text-slate-300">
                  <p><span className="text-slate-500 mr-2">Ticket:</span> <span className="font-mono text-white">{result.ticketCode}</span></p>
                  <p><span className="text-slate-500 mr-2">Name:</span> <span className="text-white">{result.customerName}</span></p>
                  <p><span className="text-slate-500 mr-2">Event:</span> <span className="text-white">{result.eventName}</span></p>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setResult(null)}
            className={`mt-6 w-full py-2.5 rounded-xl font-bold text-white transition-colors ${
              result.status === "VALID" ? "bg-emerald-600 hover:bg-emerald-500" :
              result.status === "USED" ? "bg-amber-600 hover:bg-amber-500" :
              "bg-red-600 hover:bg-red-500"
            }`}
          >
            Scan Next Ticket
          </button>
        </div>
      )}

      {/* Input Area */}
      {!result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
          {mode === "scan" ? (
            <div className="max-w-sm mx-auto">
              <div className="aspect-square bg-slate-800 rounded-xl overflow-hidden relative border-2 border-slate-700">
                <Scanner onScan={handleScan} />
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-center text-slate-400 text-sm mt-4">
                Position the QR code within the frame
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-2">
                  Ticket Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TV-A92KQ7"
                  disabled={isProcessing}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 font-mono focus:ring-2 focus:ring-violet-500/50 outline-none"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={!manualCode || isProcessing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Validate"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
