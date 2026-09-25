"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AsYouType,
  getCountryCallingCode,
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from "libphonenumber-js/max";
import examples from "libphonenumber-js/mobile/examples";
import type { Locale } from "@/lib/i18n";
import { PHONE_COUNTRY as country } from "@/lib/phone";
import styles from "./PhoneField.module.css";

const COPY: Record<Locale, { invalid: string }> = {
  en: { invalid: "Enter a valid Malaysian mobile number." },
  cn: { invalid: "请输入有效的马来西亚手机号码。" },
  ms: { invalid: "Masukkan nombor telefon bimbit Malaysia yang sah." },
};

const CODE = getCountryCallingCode(country);
const placeholder = getExampleNumber(country, examples)?.formatNational() ?? "";

function format(digits: string) {
  return new AsYouType(country).input(digits);
}

/**
 * A Malaysian mobile number field. The number is capped at Malaysia's
 * longest valid length as it is typed, and the browser refuses to submit one
 * that is not valid: the full ("max") metadata knows 012 numbers are 10
 * digits and 011 numbers are 11. The server repeats that check
 * (lib/phone.ts), so the cap cannot be skipped by posting the form directly.
 *
 * Posts `name` (the number as typed).
 */
export default function PhoneField({
  id,
  name = "phone",
  locale,
  required,
  disabled,
  className,
}: {
  id: string;
  name?: string;
  locale: Locale;
  required?: boolean;
  disabled?: boolean;
  /** Classes for the text input, so it matches the form it sits in. */
  className?: string;
}) {
  const t = COPY[locale];
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const [caretRender, setCaretRender] = useState(0);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const invalid = value !== "" && !isValidPhoneNumber(value, country);
    input.setCustomValidity(invalid ? t.invalid : "");
  }, [value, t]);

  // Runs before paint, after React has written the reformatted value (which moves the caret to the end).
  useLayoutEffect(() => {
    if (caret.current === null) return;
    inputRef.current?.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [caretRender]);

  /** Puts the caret back after the `n`th digit of `text` once React has rendered it. */
  function placeCaret(text: string, n: number) {
    let pos = 0;
    for (let seen = 0; pos < text.length && seen < n; pos++) if (/\d/.test(text[pos])) seen++;
    caret.current = pos;
    // Forces a render even when the value is unchanged (a refused digit), so the layout effect runs.
    setCaretRender((r) => r + 1);
  }

  function handleInput(raw: string, inputType: string, caretPos: number) {
    // A number typed or autofilled with its own "+" code: keep it as written
    // (the validity check rejects one that isn't +60), shown nationally when it is.
    if (raw.trim().startsWith("+")) {
      // 15 digits is the longest any number can be (E.164).
      if (raw.replace(/\D/g, "").length > 15) return;
      const parsed = parsePhoneNumberFromString(raw);
      setValue(parsed?.country === country ? parsed.formatNational() : new AsYouType().input(raw));
      return;
    }

    let digits = raw.replace(/\D/g, "");
    // Where the caret sits, counted in digits, so reformatting doesn't throw it to the end.
    let before = raw.slice(0, caretPos).replace(/\D/g, "").length;

    // Deleting a "-" or space the formatter added removes no digit, and the
    // formatter would put it straight back. Delete the digit beside it instead.
    if (digits === value.replace(/\D/g, "") && raw.length < value.length) {
      if (inputType === "deleteContentBackward" && before > 0) {
        digits = digits.slice(0, before - 1) + digits.slice(before);
        before -= 1;
      } else if (inputType === "deleteContentForward") {
        digits = digits.slice(0, before) + digits.slice(before + 1);
      }
    }

    if (validatePhoneNumberLength(digits, country) === "TOO_LONG") {
      // A pasted "60123456789" is Malaysia's code without the "+", not an overlong number.
      const withCode = digits.startsWith(CODE) ? parsePhoneNumberFromString(`+${digits}`) : undefined;
      if (withCode?.country === country) {
        setValue(withCode.formatNational());
      } else {
        // Refused: React restores the old value, so keep the caret where the digit would have gone.
        placeCaret(value, Math.max(0, before - 1));
      }
      return;
    }

    const next = format(digits);
    setValue(next);
    placeCaret(next, before);
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.prefix} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- one tiny SVG, nothing for next/image to optimise */}
        <img src={`/flags/${country}.svg`} alt="" width={22} height={15} className={styles.flag} />
        +{CODE}
      </span>

      <input
        ref={inputRef}
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          handleInput(
            e.target.value,
            (e.nativeEvent as InputEvent).inputType ?? "",
            e.target.selectionStart ?? e.target.value.length,
          )
        }
        className={className}
        style={{ paddingLeft: "5.25rem" }}
      />
    </div>
  );
}
