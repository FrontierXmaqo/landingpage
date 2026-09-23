"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  type CountryCode,
} from "libphonenumber-js/max";
import examples from "libphonenumber-js/mobile/examples";
import { HTML_LANG, fill, type Locale } from "@/lib/i18n";
import { DEFAULT_PHONE_COUNTRY } from "@/lib/phone";
import styles from "./PhoneField.module.css";

const COPY: Record<Locale, { country: string; picked: string; invalid: string }> = {
  en: {
    country: "Country code",
    picked: "Country code: {country} {code}",
    invalid: "Enter a valid mobile number for {country}.",
  },
  cn: { country: "国家代码", picked: "国家代码：{country} {code}", invalid: "请输入有效的{country}手机号码。" },
  ms: {
    country: "Kod negara",
    picked: "Kod negara: {country} {code}",
    invalid: "Masukkan nombor telefon bimbit yang sah untuk {country}.",
  },
};

// Nearly every lead is Malaysian, so it heads the list instead of sitting between Malawi and Maldives.
const PINNED: CountryCode[] = ["MY"];

/** Flags are the 3x2 set from country-flag-icons (MIT), copied into public/flags. */
function Flag({ country }: { country: CountryCode }) {
  // eslint-disable-next-line @next/next/no-img-element -- 245 tiny SVGs, nothing for next/image to optimise
  return <img src={`/flags/${country}.svg`} alt="" width={22} height={15} loading="lazy" className={styles.flag} />;
}

function format(digits: string, country: CountryCode) {
  return new AsYouType(country).input(digits);
}

/**
 * A mobile number field with a country-code picker. The number is capped at
 * the chosen country's longest valid length as it is typed, and the browser
 * refuses to submit one that is not valid there: the full ("max") metadata
 * knows 012 numbers are 10 digits and 011 numbers are 11. The server
 * repeats that check (lib/phone.ts), so the cap cannot be skipped by posting
 * the form directly.
 *
 * Posts `name` (the number as typed) and `${name}_country` (ISO code).
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
  const [country, setCountry] = useState<CountryCode>(DEFAULT_PHONE_COUNTRY);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", timer: 0 });
  const caret = useRef<number | null>(null);
  const [caretRender, setCaretRender] = useState(0);

  const names = useMemo(() => new Intl.DisplayNames([HTML_LANG[locale]], { type: "region" }), [locale]);
  const nameOf = (c: CountryCode) => names.of(c) ?? c;
  const countries = useMemo(() => {
    const rest = getCountries()
      .filter((c) => !PINNED.includes(c))
      .sort((a, b) => (names.of(a) ?? a).localeCompare(names.of(b) ?? b, HTML_LANG[locale]));
    return [...PINNED, ...rest];
  }, [names, locale]);

  const placeholder = getExampleNumber(country, examples)?.formatNational() ?? "";

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const invalid = value !== "" && !isValidPhoneNumber(value, country);
    input.setCustomValidity(invalid ? fill(t.invalid, { country: nameOf(country) }) : "");
    // nameOf only reads `names`, which changes with `locale`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, country, t, names]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Runs before paint, after React has written the reformatted value (which moves the caret to the end).
  useLayoutEffect(() => {
    if (caret.current === null) return;
    inputRef.current?.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [caretRender]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  /** Puts the caret back after the `n`th digit of `text` once React has rendered it. */
  function placeCaret(text: string, n: number) {
    let pos = 0;
    for (let seen = 0; pos < text.length && seen < n; pos++) if (/\d/.test(text[pos])) seen++;
    caret.current = pos;
    // Forces a render even when the value is unchanged (a refused digit), so the layout effect runs.
    setCaretRender((r) => r + 1);
  }

  function handleInput(raw: string, inputType: string, caretPos: number) {
    // A number typed or autofilled with its own "+" code picks the country for the visitor.
    if (raw.trim().startsWith("+")) {
      // 15 digits is the longest any number can be (E.164).
      if (raw.replace(/\D/g, "").length > 15) return;
      const parsed = parsePhoneNumberFromString(raw);
      if (parsed?.country) {
        setCountry(parsed.country);
        setValue(parsed.formatNational());
      } else {
        setValue(new AsYouType().input(raw));
      }
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
      // A pasted "60123456789" is this country's code without the "+", not an overlong number.
      const withCode = digits.startsWith(getCountryCallingCode(country))
        ? parsePhoneNumberFromString(`+${digits}`)
        : undefined;
      if (withCode?.country === country) {
        setValue(withCode.formatNational());
      } else {
        // Refused: React restores the old value, so keep the caret where the digit would have gone.
        placeCaret(value, Math.max(0, before - 1));
      }
      return;
    }

    const next = format(digits, country);
    setValue(next);
    placeCaret(next, before);
  }

  function openList() {
    setActive(Math.max(0, countries.indexOf(country)));
    setOpen(true);
    requestAnimationFrame(() => listRef.current?.focus());
  }

  function choose(c: CountryCode) {
    setCountry(c);
    setValue((v) => (v.startsWith("+") ? v : format(v.replace(/\D/g, ""), c)));
    setOpen(false);
    inputRef.current?.focus();
  }

  function onListKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    const last = countries.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      PageDown: Math.min(active + 8, last),
      PageUp: Math.max(active - 8, 0),
      Home: 0,
      End: last,
    };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(countries[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key.length === 1 && /\S/.test(e.key)) {
      // Type-ahead: "sin" jumps to Singapore.
      const ta = typeahead.current;
      window.clearTimeout(ta.timer);
      ta.text += e.key.toLocaleLowerCase();
      ta.timer = window.setTimeout(() => (ta.text = ""), 700);
      const hit = countries.findIndex((c) => nameOf(c).toLocaleLowerCase().startsWith(ta.text));
      if (hit >= 0) setActive(hit);
    }
  }

  const listId = `${id}-countries`;

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={fill(t.picked, { country: nameOf(country), code: `+${getCountryCallingCode(country)}` })}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            openList();
          }
        }}
      >
        <Flag country={country} />
        <span aria-hidden className={`${styles.caret} ${open ? styles.caretOpen : ""}`} />
      </button>

      <input
        ref={inputRef}
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
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
        style={{ paddingLeft: "4.25rem" }}
      />
      <input type="hidden" name={`${name}_country`} value={country} />

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={t.country}
          aria-activedescendant={`${id}-opt-${countries[active]}`}
          className={styles.list}
          onKeyDown={onListKeyDown}
        >
          {countries.map((c, i) => (
            <li
              key={c}
              id={`${id}-opt-${c}`}
              data-index={i}
              role="option"
              aria-selected={c === country}
              className={`${styles.option} ${i === active ? styles.optionActive : ""} ${
                i === PINNED.length - 1 ? styles.optionPinnedEnd : ""
              }`}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(c)}
            >
              <Flag country={c} />
              <span className={styles.name}>{nameOf(c)}</span>
              <span className={styles.code}>+{getCountryCallingCode(c)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
