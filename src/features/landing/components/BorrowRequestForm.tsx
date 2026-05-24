"use client";

import { useCallback, useRef, useState } from "react";
import BorrowSuccessModal from "./BorrowSuccessModal";

export type BorrowFormData = {
  fullName: string;
  email: string;
  courseYearSection: string;
  contactNumber: string;
  organization: string;
  purpose: string;
  additionalInfo: string;
  item: string;
  startDate: string;
  startHour: string;
  startMinute: string;
  startPeriod: string;
  endDate: string;
  endHour: string;
  endMinute: string;
  endPeriod: string;
  letterFile: File | null;
};

const INITIAL_FORM: BorrowFormData = {
  fullName: "",
  email: "",
  courseYearSection: "",
  contactNumber: "",
  organization: "",
  purpose: "",
  additionalInfo: "",
  item: "",
  startDate: "",
  startHour: "01",
  startMinute: "30",
  startPeriod: "AM",
  endDate: "",
  endHour: "01",
  endMinute: "30",
  endPeriod: "AM",
  letterFile: null,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = Partial<Record<keyof BorrowFormData | "form", string>>;

function toDateTime(
  date: string,
  hour: string,
  minute: string,
  period: string
): Date | null {
  if (!date) return null;
  let h = parseInt(hour, 10);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d, h, parseInt(minute, 10));
}

function validateStep1(form: BorrowFormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.courseYearSection.trim()) errors.courseYearSection = "Course, year, and section is required.";
  if (!form.contactNumber.trim()) errors.contactNumber = "Contact number is required.";
  if (!form.organization.trim()) errors.organization = "Organization is required.";
  if (!form.purpose.trim()) errors.purpose = "Purpose is required.";

  return errors;
}

function validateStep2(form: BorrowFormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.item) errors.item = "Please choose an item.";
  if (!form.startDate) errors.startDate = "Start date is required.";
  if (!form.endDate) errors.endDate = "End date is required.";

  if (form.startDate && form.endDate) {
    const start = toDateTime(form.startDate, form.startHour, form.startMinute, form.startPeriod);
    const end = toDateTime(form.endDate, form.endHour, form.endMinute, form.endPeriod);
    if (start && end && end <= start) {
      errors.endDate = "End date and time must be after the start.";
    }
  }

  return errors;
}

const EQUIPMENT_ITEMS = [
  "Speaker",
  "Microphone",
  "Projector",
  "Extension Cord",
  "Camera",
  "Tripod",
];

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"];

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const glassCardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
};

type BorrowRequestFormProps = {
  onBackToLanding: () => void;
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-white/90">
      {children}
      {required && <span className="text-[#FFB89A]"> *</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        className={`w-full rounded-lg border-0 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 ${
          error ? "ring-2 ring-red-400 focus:ring-red-400" : "focus:ring-[#F26223]/50"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  className = "",
  placeholder,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`rounded-lg border-0 bg-white px-2 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 ${
          error ? "ring-2 ring-red-400 focus:ring-red-400" : "focus:ring-[#F26223]/50"
        } ${className}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}

export default function BorrowRequestForm({ onBackToLanding }: BorrowRequestFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<BorrowFormData>(INITIAL_FORM);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof BorrowFormData>(key: K, value: BorrowFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      delete next.form;
      return next;
    });
  };

  const validateFile = (file: File): string | null => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExt = ["pdf", "doc", "docx"];
    if (!ACCEPTED_FILE_TYPES.includes(file.type) && !validExt.includes(ext ?? "")) {
      return "Upload only PDF, Doc, or Docs files.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File must be 5 MB or smaller.";
    }
    return null;
  };

  const handleFile = useCallback((file: File | null) => {
    if (!file) {
      updateField("letterFile", null);
      setFileError(null);
      return;
    }
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      updateField("letterFile", null);
      return;
    }
    setFileError(null);
    updateField("letterFile", file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clearForm = () => {
    setForm(INITIAL_FORM);
    setStep(1);
    setFileError(null);
    setFieldErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBack = () => {
    if (step === 2) {
      setFieldErrors({});
      setStep(1);
    } else {
      onBackToLanding();
    }
  };

  const handleNext = () => {
    const errors = validateStep1(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors({ ...errors, form: "Please complete all required fields before continuing." });
      return;
    }
    setFieldErrors({});
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateStep2(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors({ ...errors, form: "Please complete all required fields before submitting." });
      return;
    }
    setFieldErrors({});
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    clearForm();
    onBackToLanding();
  };

  return (
    <>
      <div
        className="relative w-full max-w-3xl rounded-3xl px-6 py-8 sm:px-10 sm:py-10 text-left"
        style={glassCardStyle}
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Step {step} of 2
          </p>
          <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-wide title-header">
            Borrow Equipments
          </h2>
          <p className="mt-2 text-sm text-white/90">
            Submit your request easily and track your borrowing anytime, anywhere.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8">
          {fieldErrors.form && (
            <p className="mb-5 rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-100" role="alert">
              {fieldErrors.form}
            </p>
          )}

          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Full Name</FieldLabel>
                  <TextInput
                    value={form.fullName}
                    onChange={(v) => updateField("fullName", v)}
                    placeholder="Last Name First Name"
                    error={fieldErrors.fullName}
                    required
                  />
                </div>
                <div>
                  <FieldLabel required>Email</FieldLabel>
                  <TextInput
                    type="email"
                    value={form.email}
                    onChange={(v) => updateField("email", v)}
                    placeholder="e.g. juandelacruz@gmail.com"
                    error={fieldErrors.email}
                    required
                  />
                </div>
                <div>
                  <FieldLabel required>Course, Year, and Section</FieldLabel>
                  <TextInput
                    value={form.courseYearSection}
                    onChange={(v) => updateField("courseYearSection", v)}
                    placeholder="e.g. BSCpE 3-7"
                    error={fieldErrors.courseYearSection}
                    required
                  />
                </div>
                <div>
                  <FieldLabel required>Contact Number</FieldLabel>
                  <TextInput
                    value={form.contactNumber}
                    onChange={(v) => updateField("contactNumber", v)}
                    placeholder="(+63) 000 000 0000"
                    error={fieldErrors.contactNumber}
                    required
                  />
                </div>
                <div>
                  <FieldLabel required>Organization</FieldLabel>
                  <TextInput
                    value={form.organization}
                    onChange={(v) => updateField("organization", v)}
                    placeholder="e.g. Engineering Spectrum"
                    error={fieldErrors.organization}
                    required
                  />
                </div>
                <div>
                  <FieldLabel required>Purpose</FieldLabel>
                  <TextInput
                    value={form.purpose}
                    onChange={(v) => updateField("purpose", v)}
                    placeholder="e.g. For CE Month"
                    error={fieldErrors.purpose}
                    required
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Additional Information</FieldLabel>
                <textarea
                  value={form.additionalInfo}
                  onChange={(e) => updateField("additionalInfo", e.target.value)}
                  placeholder="Type here..."
                  rows={4}
                  className="w-full resize-none rounded-lg border-0 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#F26223]/50"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <FieldLabel required>Choose item</FieldLabel>
                <SelectInput
                  value={form.item}
                  onChange={(v) => updateField("item", v)}
                  options={EQUIPMENT_ITEMS}
                  placeholder="Select an item"
                  className="w-full"
                  error={fieldErrors.item}
                />
              </div>

              <div>
                <FieldLabel required>Set Date and Time</FieldLabel>
                <DateTimeRange
                  startDate={form.startDate}
                  startHour={form.startHour}
                  startMinute={form.startMinute}
                  startPeriod={form.startPeriod}
                  endDate={form.endDate}
                  endHour={form.endHour}
                  endMinute={form.endMinute}
                  endPeriod={form.endPeriod}
                  startDateError={fieldErrors.startDate}
                  endDateError={fieldErrors.endDate}
                  onStartDateChange={(v) => updateField("startDate", v)}
                  onStartHourChange={(v) => updateField("startHour", v)}
                  onStartMinuteChange={(v) => updateField("startMinute", v)}
                  onStartPeriodChange={(v) => updateField("startPeriod", v)}
                  onEndDateChange={(v) => updateField("endDate", v)}
                  onEndHourChange={(v) => updateField("endHour", v)}
                  onEndMinuteChange={(v) => updateField("endMinute", v)}
                  onEndPeriodChange={(v) => updateField("endPeriod", v)}
                />
              </div>

              <div>
                <FieldLabel>Upload Letter</FieldLabel>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
                    isDragging
                      ? "border-[#F26223] bg-white/10"
                      : "border-white/50 bg-white/5"
                  }`}
                >
                  <svg
                    className="mb-3 text-white/80"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="text-sm text-white/90">Choose a file or drag and drop it here</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 rounded-full px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
                    style={{ background: "rgba(255, 255, 255, 0.15)" }}
                  >
                    Choose File
                  </button>
                  {form.letterFile && (
                    <p className="mt-3 text-xs text-white/80">{form.letterFile.name}</p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                {fileError && <p className="mt-2 text-xs text-red-300">{fileError}</p>}
                <p className="mt-2 text-xs text-white/70">
                  Note: Upload only PDF, Doc, Docs file (Max 5mb)
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: "rgba(60, 30, 20, 0.85)" }}
              >
                Back
              </button>
              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-95 hover:shadow-[0_6px_20px_rgba(242,98,35,0.5)]"
                  style={{
                    background: "#F26223",
                    boxShadow: "0 4px 16px rgba(242,98,35,0.35)",
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-95 hover:shadow-[0_6px_20px_rgba(242,98,35,0.5)]"
                  style={{
                    background: "#F26223",
                    boxShadow: "0 4px 16px rgba(242,98,35,0.35)",
                  }}
                >
                  Submit
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={clearForm}
              className="text-sm font-medium text-white/90 underline-offset-2 transition-colors hover:text-white hover:underline"
            >
              Clear Request
            </button>
          </div>
        </form>
      </div>

      {showSuccess && <BorrowSuccessModal onClose={handleSuccessClose} />}
    </>
  );
}

function DateTimeRange({
  startDate,
  startHour,
  startMinute,
  startPeriod,
  endDate,
  endHour,
  endMinute,
  endPeriod,
  startDateError,
  endDateError,
  onStartDateChange,
  onStartHourChange,
  onStartMinuteChange,
  onStartPeriodChange,
  onEndDateChange,
  onEndHourChange,
  onEndMinuteChange,
  onEndPeriodChange,
}: {
  startDate: string;
  startHour: string;
  startMinute: string;
  startPeriod: string;
  endDate: string;
  endHour: string;
  endMinute: string;
  endPeriod: string;
  startDateError?: string;
  endDateError?: string;
  onStartDateChange: (v: string) => void;
  onStartHourChange: (v: string) => void;
  onStartMinuteChange: (v: string) => void;
  onStartPeriodChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onEndHourChange: (v: string) => void;
  onEndMinuteChange: (v: string) => void;
  onEndPeriodChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
        <DateTimeGroup
          date={startDate}
          hour={startHour}
          minute={startMinute}
          period={startPeriod}
          dateError={startDateError}
          onDateChange={onStartDateChange}
          onHourChange={onStartHourChange}
          onMinuteChange={onStartMinuteChange}
          onPeriodChange={onStartPeriodChange}
        />
        <span className="shrink-0 px-0.5 text-xs font-medium text-white/80">to</span>
        <DateTimeGroup
          date={endDate}
          hour={endHour}
          minute={endMinute}
          period={endPeriod}
          dateError={endDateError}
          onDateChange={onEndDateChange}
          onHourChange={onEndHourChange}
          onMinuteChange={onEndMinuteChange}
          onPeriodChange={onEndPeriodChange}
        />
      </div>
      {(startDateError || endDateError) && (
        <div className="mt-1 space-y-0.5">
          {startDateError && <p className="text-xs text-red-300">{startDateError}</p>}
          {endDateError && endDateError !== startDateError && (
            <p className="text-xs text-red-300">{endDateError}</p>
          )}
        </div>
      )}
    </div>
  );
}

function DateTimeGroup({
  date,
  hour,
  minute,
  period,
  dateError,
  onDateChange,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
}: {
  date: string;
  hour: string;
  minute: string;
  period: string;
  dateError?: string;
  onDateChange: (v: string) => void;
  onHourChange: (v: string) => void;
  onMinuteChange: (v: string) => void;
  onPeriodChange: (v: string) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        aria-invalid={!!dateError}
        className={`w-[7.25rem] sm:w-[8.75rem] shrink-0 rounded-lg border-0 bg-white px-2 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 [color-scheme:light] ${
          dateError ? "ring-2 ring-red-400 focus:ring-red-400" : "focus:ring-[#F26223]/50"
        }`}
      />
      <SelectInput value={hour} onChange={onHourChange} options={HOURS} className="w-[3.25rem] sm:w-[4rem]" />
      <SelectInput
        value={minute}
        onChange={onMinuteChange}
        options={MINUTES}
        className="w-[3.25rem] sm:w-[4rem]"
      />
      <SelectInput
        value={period}
        onChange={onPeriodChange}
        options={PERIODS}
        className="w-[3.25rem] sm:w-[4rem]"
      />
    </div>
  );
}
