"use client";

import { useState, useRef, useMemo } from "react";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Trash2,
  FileText,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import CountryFlag from "./CountryFlag";
import { type RefillOperator } from "@/lib/operators";

export interface BulkItem {
  id: string;
  phoneNumber: string;
  amountNgn: number;
  amountUsd: number;
  isValid: boolean;
  error?: string;
}

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: RefillOperator;
  countryProfile: {
    code: string;
    name: string;
    currencySymbol: string;
    minAmount: number;
    maxAmount: number;
    defaultAmount: number;
    usdRate: number;
    dialCode: string;
    localPhoneLength: number;
    intlPhoneLength: number;
  };
  onProceedToCheckout: (items: BulkItem[]) => void;
}

export default function BulkUploadModal({
  isOpen,
  onClose,
  operator,
  countryProfile,
  onProceedToCheckout,
}: BulkUploadModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [parsedItems, setParsedItems] = useState<BulkItem[]>([]);
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [defaultAmount, setDefaultAmount] = useState<number>(countryProfile.defaultAmount || 500);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate a single phone number based on country profile
  function validatePhoneNumber(raw: string): { isValid: boolean; error?: string; cleaned: string } {
    const trimmed = raw.trim();
    if (!trimmed) return { isValid: false, error: "Empty phone number", cleaned: "" };
    const digits = trimmed.replace(/\D/g, "");
    if (!digits) return { isValid: false, error: "No digits found", cleaned: "" };

    const isIntl = trimmed.startsWith("+") || trimmed.startsWith(countryProfile.dialCode.replace("+", ""));
    const targetLength = isIntl ? countryProfile.intlPhoneLength : countryProfile.localPhoneLength;

    if (digits.length < targetLength) {
      return { isValid: false, error: `Incomplete (${digits.length}/${targetLength} digits)`, cleaned: trimmed };
    }
    if (digits.length > targetLength) {
      return { isValid: false, error: `Too long (${digits.length}/${targetLength} digits)`, cleaned: trimmed };
    }
    return { isValid: true, cleaned: trimmed };
  }

  // Parse raw text (from file or paste)
  function parseTextContent(text: string) {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const items: BulkItem[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip header lines like "phone,amount" or "phone_number,amount"
      if (
        i === 0 &&
        (line.toLowerCase().includes("phone") ||
          line.toLowerCase().includes("number") ||
          line.toLowerCase().includes("amount") ||
          line.toLowerCase().includes("recipient"))
      ) {
        continue;
      }

      // Split by comma, semicolon, tab, or space
      const parts = line.split(/[,;\t]+/).map((p) => p.trim());
      const rawPhone = parts[0] || "";
      const rawAmt = parts[1] ? Number(parts[1].replace(/[^0-9.]/g, "")) : defaultAmount;

      const amt = isNaN(rawAmt) || rawAmt <= 0 ? defaultAmount : rawAmt;
      const phoneVal = validatePhoneNumber(rawPhone);

      let isValid = phoneVal.isValid;
      let error = phoneVal.error;

      if (amt < countryProfile.minAmount) {
        isValid = false;
        error = `Min amount is ${countryProfile.currencySymbol}${countryProfile.minAmount}`;
      } else if (amt > countryProfile.maxAmount) {
        isValid = false;
        error = `Max amount is ${countryProfile.currencySymbol}${countryProfile.maxAmount.toLocaleString()}`;
      }

      items.push({
        id: `bulk-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        phoneNumber: phoneVal.cleaned || rawPhone,
        amountNgn: amt,
        amountUsd: Number((amt * countryProfile.usdRate).toFixed(2)),
        isValid,
        error,
      });
    }

    setParsedItems(items);
  }

  // Handle file select
  function handleFile(file: File) {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        parseTextContent(content);
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  // Download Sample CSV template
  function handleDownloadSample() {
    const sampleContent =
      "phone_number,amount\n08062268255,1000\n08031234567,500\n08123456789,2000\n09012345678,1500\n";
    const blob = new Blob([sampleContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sample_bulk_${operator.id}_topup.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Remove individual item
  function handleRemoveItem(id: string) {
    setParsedItems((prev) => prev.filter((item) => item.id !== id));
  }

  // Filter valid items
  const validItems = useMemo(() => parsedItems.filter((i) => i.isValid), [parsedItems]);
  const invalidItems = useMemo(() => parsedItems.filter((i) => !i.isValid), [parsedItems]);

  const totalNgn = useMemo(
    () => validItems.reduce((acc, curr) => acc + curr.amountNgn, 0),
    [validItems]
  );
  const totalUsd = useMemo(
    () => Number((totalNgn * countryProfile.usdRate).toFixed(2)),
    [totalNgn, countryProfile.usdRate]
  );

  function handleProceed() {
    if (validItems.length === 0) return;
    onProceedToCheckout(validItems);
  }

  function handleReset() {
    setParsedItems([]);
    setFileName(null);
    setRawText("");
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">Bulk Top-up via CSV</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {operator.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Top up dozens of phone numbers in a single crypto transaction
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {parsedItems.length === 0 ? (
            /* Upload / Input view */
            <div>
              {/* Tab Selector */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4 max-w-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "upload"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Upload File (.csv, .txt)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("paste")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "paste"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Paste Numbers
                </button>
              </div>

              {/* Default Amount row */}
              <div className="mb-4 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">
                  Fallback amount if not specified in file:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-500">{countryProfile.currencySymbol}</span>
                  <input
                    type="number"
                    value={defaultAmount}
                    onChange={(e) => setDefaultAmount(Number(e.target.value))}
                    min={countryProfile.minAmount}
                    max={countryProfile.maxAmount}
                    className="w-24 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {activeTab === "upload" ? (
                /* Drag & Drop Zone */
                <div>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-[#00F0A0] bg-emerald-50/50"
                        : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="w-12 h-12 mx-auto rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 mb-3">
                      <UploadCloud className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-1">
                      Click to upload or drag & drop CSV
                    </p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Format: <code className="font-mono bg-slate-200/60 px-1 py-0.5 rounded text-[11px]">phone_number,amount</code> (or phone numbers only)
                    </p>
                  </div>

                  {/* Sample download */}
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Need a starting template?</span>
                    <button
                      type="button"
                      onClick={handleDownloadSample}
                      className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Sample CSV</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Paste Box */
                <div>
                  <textarea
                    rows={6}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Enter phone numbers, one per line:&#10;08062268255, 1000&#10;08031234567, 500&#10;08123456789"
                    className="w-full p-3.5 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 placeholder:text-slate-400"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleDownloadSample}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Sample CSV Template</span>
                    </button>
                    <button
                      type="button"
                      disabled={!rawText.trim()}
                      onClick={() => parseTextContent(rawText)}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Parse Numbers
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Parsed Review Table */
            <div>
              {/* Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500">Total Rows</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {parsedItems.length}
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-[11px] font-semibold text-emerald-700">Valid Numbers</div>
                  <div className="text-base font-extrabold text-emerald-800 mt-0.5">
                    {validItems.length}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500">Total Amount</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {countryProfile.currencySymbol}
                    {totalNgn.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-[11px] font-semibold text-emerald-700">Total USD</div>
                  <div className="text-base font-extrabold text-emerald-800 mt-0.5">
                    ${totalUsd}
                  </div>
                </div>
              </div>

              {invalidItems.length > 0 && (
                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{invalidItems.length}</strong> row(s) have invalid numbers or amounts and will be skipped.
                  </span>
                </div>
              )}

              {/* Table of items */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {parsedItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2.5 sm:px-4 text-xs transition-colors ${
                        item.isValid ? "hover:bg-slate-50" : "bg-rose-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.isValid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span className="font-mono font-medium text-slate-800 truncate">
                          {item.phoneNumber}
                        </span>
                        {!item.isValid && item.error && (
                          <span className="text-[10px] text-rose-600 font-semibold bg-rose-100/70 px-1.5 py-0.5 rounded">
                            {item.error}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-slate-900">
                          {countryProfile.currencySymbol}
                          {item.amountNgn.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          (${item.amountUsd})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          title="Remove item"
                          className="w-6 h-6 rounded-full hover:bg-slate-200 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset button */}
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Upload different file</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>

          {parsedItems.length > 0 && (
            <button
              type="button"
              disabled={validItems.length === 0}
              onClick={handleProceed}
              className="flex items-center gap-2 py-2.5 px-6 bg-[#00F0A0] hover:bg-[#05e598] text-[#030A16] font-bold text-xs sm:text-sm rounded-full transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95"
            >
              <span>
                Proceed to Checkout ({validItems.length} number{validItems.length === 1 ? "" : "s"} · ${totalUsd})
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
