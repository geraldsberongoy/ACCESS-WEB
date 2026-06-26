"use client";

import { useState } from "react";
import ContactSuccessModal from "./ContactSuccessModal";

type ContactFormData = {
  fullName: string;
  email: string;
  courseYearSection: string;
  contactNumber: string;
  organization: string;
  purpose: string;
  concern: string;
};

const INITIAL_FORM: ContactFormData = {
  fullName: "",
  email: "",
  courseYearSection: "",
  contactNumber: "",
  organization: "",
  purpose: "",
  concern: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = Partial<Record<keyof ContactFormData | "form", string>>;

const glassCardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
};

function validateForm(form: ContactFormData): FormErrors {
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
  if (!form.concern.trim()) errors.concern = "Concern is required.";

  return errors;
}

type ContactUsFormProps = {
  onBack: () => void;
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
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`w-full rounded-lg border-0 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 ${
          error ? "ring-2 ring-red-400 focus:ring-red-400" : "focus:ring-[#F26223]/50"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}

export default function ContactUsForm({ onBack }: ContactUsFormProps) {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      delete next.form;
      return next;
    });
  };

  const clearForm = () => {
    setForm(INITIAL_FORM);
    setFieldErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(form);
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
    onBack();
  };

  return (
    <>
      <div
        className="relative w-full max-w-3xl rounded-3xl px-6 py-8 sm:px-10 sm:py-10 text-left"
        style={glassCardStyle}
      >
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide title-header">
            Contact Us
          </h2>
          <p className="mt-2 text-sm text-white/90">
            Reach out to ACCESS anytime for inquiries, assistance, and concerns.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8">
          {fieldErrors.form && (
            <p className="mb-5 rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-100" role="alert">
              {fieldErrors.form}
            </p>
          )}

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Full Name</FieldLabel>
                <TextInput
                  value={form.fullName}
                  onChange={(v) => updateField("fullName", v)}
                  placeholder="Last Name First Name"
                  error={fieldErrors.fullName}
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
                />
              </div>
              <div>
                <FieldLabel required>Course, Year, and Section</FieldLabel>
                <TextInput
                  value={form.courseYearSection}
                  onChange={(v) => updateField("courseYearSection", v)}
                  placeholder="e.g. BSCpE 3-7"
                  error={fieldErrors.courseYearSection}
                />
              </div>
              <div>
                <FieldLabel required>Contact Number</FieldLabel>
                <TextInput
                  value={form.contactNumber}
                  onChange={(v) => updateField("contactNumber", v)}
                  placeholder="(+63) 000 000 0000"
                  error={fieldErrors.contactNumber}
                />
              </div>
              <div>
                <FieldLabel required>Organization</FieldLabel>
                <TextInput
                  value={form.organization}
                  onChange={(v) => updateField("organization", v)}
                  placeholder="e.g. Engineering Spectrum"
                  error={fieldErrors.organization}
                />
              </div>
              <div>
                <FieldLabel required>Purpose</FieldLabel>
                <TextInput
                  value={form.purpose}
                  onChange={(v) => updateField("purpose", v)}
                  placeholder="e.g. For CE Month"
                  error={fieldErrors.purpose}
                />
              </div>
            </div>
            <div>
              <FieldLabel required>Concern</FieldLabel>
              <div>
                <textarea
                  value={form.concern}
                  onChange={(e) => updateField("concern", e.target.value)}
                  placeholder="Type here..."
                  rows={4}
                  aria-invalid={!!fieldErrors.concern}
                  className={`w-full resize-none rounded-lg border-0 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 ${
                    fieldErrors.concern
                      ? "ring-2 ring-red-400 focus:ring-red-400"
                      : "focus:ring-[#F26223]/50"
                  }`}
                />
                {fieldErrors.concern && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.concern}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onBack}
                className="rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: "rgba(60, 30, 20, 0.85)" }}
              >
                Back
              </button>
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

      {showSuccess && <ContactSuccessModal onClose={handleSuccessClose} />}
    </>
  );
}
