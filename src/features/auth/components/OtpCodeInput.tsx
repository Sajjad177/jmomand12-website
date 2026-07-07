"use client";

import { ClipboardEvent, KeyboardEvent, useRef } from "react";

type OtpCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
};

export default function OtpCodeInput({
  value,
  onChange,
  length = 6,
  disabled = false,
}: OtpCodeInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index] || "");

  const updateDigit = (index: number, digit: string) => {
    const nextDigits = digits.slice();
    nextDigits[index] = digit;
    onChange(nextDigits.join("").slice(0, length));

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Backspace" || digits[index]) return;

    inputsRef.current[index - 1]?.focus();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    onChange(pastedCode);
    inputsRef.current[Math.min(pastedCode.length, length - 1)]?.focus();
  };

  return (
    <div className="grid grid-cols-6 gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(input) => {
            inputsRef.current[index] = input;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onPaste={handlePaste}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onChange={(event) =>
            updateDigit(index, event.target.value.replace(/\D/g, "").slice(-1))
          }
          className="h-14 w-full rounded-xl border border-gray-200 text-center text-lg font-semibold text-gray-900 outline-none transition focus:border-[#0057FF] disabled:cursor-not-allowed disabled:opacity-60"
        />
      ))}
    </div>
  );
}

