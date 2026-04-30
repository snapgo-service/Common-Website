'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CornerDownLeft,
  Loader2,
  Mail,
  Phone,
  Sparkles,
  User,
} from 'lucide-react'
import { ConfettiBurst } from '@/components/ui/AnimatedInput'
import { cn } from '@/lib/utils'

type FormState = {
  email: string
  fullName: string
  phone: string
  dailyTravel: string
  pickupTime: string
  pickupTimeOther: string
  returnTime: string
  returnTimeOther: string
  currentTravel: string
  interested: string
}

type FieldId = keyof FormState

type TextQuestion = {
  kind: 'text'
  id: Extract<FieldId, 'fullName' | 'email' | 'phone'>
  inputType: 'text' | 'email' | 'tel'
  icon: typeof User
  title: string
  subtitle?: string
  placeholder: string
  validate: (value: string) => string | null
}

type ChoiceQuestion = {
  kind: 'choice'
  id: Extract<FieldId, 'dailyTravel' | 'pickupTime' | 'returnTime' | 'currentTravel' | 'interested'>
  title: string
  subtitle?: string
  options: string[]
  allowOther?: boolean
  otherFieldId?: Extract<FieldId, 'pickupTimeOther' | 'returnTimeOther'>
  otherPlaceholder?: string
}

type Question = TextQuestion | ChoiceQuestion

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[+\d][\d\s\-+()]{6,19}$/

const INITIAL_STATE: FormState = {
  email: '',
  fullName: '',
  phone: '',
  dailyTravel: '',
  pickupTime: '',
  pickupTimeOther: '',
  returnTime: '',
  returnTimeOther: '',
  currentTravel: '',
  interested: '',
}

const QUESTIONS: Question[] = [
  {
    kind: 'text',
    id: 'fullName',
    inputType: 'text',
    icon: User,
    title: 'What should we call you?',
    subtitle: 'Your full name will help us reserve your seat.',
    placeholder: 'e.g. Aanya Sharma',
    validate: (value) => {
      const trimmed = value.trim()
      if (trimmed.length < 2) return 'Please enter your full name.'
      if (trimmed.length > 100) return 'Keep it under 100 characters.'
      return null
    },
  },
  {
    kind: 'text',
    id: 'email',
    inputType: 'email',
    icon: Mail,
    title: "What's the best email to reach you?",
    subtitle: "We'll send service updates and seat confirmations here.",
    placeholder: 'you@example.com',
    validate: (value) => {
      const trimmed = value.trim()
      if (!trimmed) return 'Email is required.'
      if (!EMAIL_REGEX.test(trimmed)) return 'That email looks off. Mind double-checking?'
      if (trimmed.length > 254) return 'That email is unusually long.'
      return null
    },
  },
  {
    kind: 'text',
    id: 'phone',
    inputType: 'tel',
    icon: Phone,
    title: 'And your phone number?',
    subtitle: 'For day-of pickup updates only — never spam.',
    placeholder: '+91 98xxx xxxxx',
    validate: (value) => {
      const trimmed = value.trim()
      if (!trimmed) return 'Phone number is required.'
      if (!PHONE_REGEX.test(trimmed)) return 'Please enter a valid phone number.'
      return null
    },
  },
  {
    kind: 'choice',
    id: 'dailyTravel',
    title: 'Do you travel daily from Galgotia to Alpha 2?',
    subtitle: 'Daily commuters get priority on fixed-timing slots.',
    options: ['Yes', 'No'],
  },
  {
    kind: 'choice',
    id: 'pickupTime',
    title: 'Preferred morning pickup time?',
    subtitle: 'Pick the slot that fits your day. You can change it later.',
    options: ['8:00 AM', '8:30 AM', '9:00 AM', 'Other'],
    allowOther: true,
    otherFieldId: 'pickupTimeOther',
    otherPlaceholder: 'e.g. 9:30 AM',
  },
  {
    kind: 'choice',
    id: 'returnTime',
    title: 'Preferred evening return time?',
    subtitle: "We'll match you to a return cab heading back the same way.",
    options: ['4:00 PM', '5:00 PM', '6:00 PM', 'Other'],
    allowOther: true,
    otherFieldId: 'returnTimeOther',
    otherPlaceholder: 'e.g. 7:00 PM',
  },
  {
    kind: 'choice',
    id: 'currentTravel',
    title: 'How do you currently travel?',
    subtitle: 'Helps us understand what to improve over your existing commute.',
    options: ['Auto', 'Cab (Ola/Uber)', 'Personal vehicle', 'Friends / Carpool'],
  },
  {
    kind: 'choice',
    id: 'interested',
    title: 'Would you be interested in a shared cab at ₹50–60 per ride?',
    subtitle: 'No commitment yet — this just helps us gauge demand.',
    options: ['Yes', 'Maybe', 'No'],
  },
]

// Welcome screen + N questions + final submit + done
type Screen =
  | { type: 'welcome' }
  | { type: 'question'; index: number }
  | { type: 'review' }
  | { type: 'done' }

const TOTAL_QUESTIONS = QUESTIONS.length

function HotkeyKbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-white/30 bg-white/10 px-1.5 font-mono text-xs font-semibold text-white/90 shadow-sm">
      {children}
    </kbd>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-white/10">
      <motion.div
        className="h-full bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400"
        initial={false}
        animate={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

function Counter({ current, total }: { current: number; total: number }) {
  return (
    <div className="fixed right-4 top-4 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur sm:right-8 sm:top-8">
      <span className="tabular-nums">{current}</span>
      <span className="text-white/40">/</span>
      <span className="tabular-nums text-white/50">{total}</span>
    </div>
  )
}

function BackToHomeLink() {
  return (
    <Link
      href="/"
      className="fixed left-4 top-4 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur transition hover:bg-white/10 sm:left-8 sm:top-8"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to Snapgo
    </Link>
  )
}

const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { y: 0, opacity: 1 },
  exit: (direction: number) => ({
    y: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
}

export default function GalgotiaFormClient() {
  const [screen, setScreen] = useState<Screen>({ type: 'welcome' })
  const [direction, setDirection] = useState(1)
  const [data, setData] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<Partial<Record<FieldId, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const setValue = useCallback((id: FieldId, value: string) => {
    setData((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => ({ ...prev, [id]: undefined }))
  }, [])

  const goToWelcome = () => {
    setDirection(-1)
    setScreen({ type: 'welcome' })
  }

  const goToQuestion = (index: number, dir: 1 | -1 = 1) => {
    if (index < 0 || index >= TOTAL_QUESTIONS) return
    setDirection(dir)
    setScreen({ type: 'question', index })
  }

  const goToReview = () => {
    setDirection(1)
    setScreen({ type: 'review' })
  }

  const goToDone = () => {
    setDirection(1)
    setScreen({ type: 'done' })
    setShowConfetti(true)
    window.setTimeout(() => setShowConfetti(false), 2200)
  }

  const validateQuestion = (q: Question): string | null => {
    if (q.kind === 'text') {
      return q.validate(data[q.id])
    }
    const value = data[q.id]
    if (!value) return 'Please pick an option.'
    if (q.allowOther && q.otherFieldId && value === 'Other') {
      const other = data[q.otherFieldId]?.trim() ?? ''
      if (other.length < 1) return 'Please tell us your preferred time.'
      if (other.length > 100) return 'Keep it short — under 100 characters.'
    }
    return null
  }

  const advanceFromQuestion = useCallback(
    (index: number) => {
      const q = QUESTIONS[index]
      const err = validateQuestion(q)
      if (err) {
        setErrors((prev) => ({ ...prev, [q.id]: err }))
        return
      }
      setErrors((prev) => ({ ...prev, [q.id]: undefined }))
      if (index === TOTAL_QUESTIONS - 1) {
        goToReview()
      } else {
        goToQuestion(index + 1, 1)
      }
    },
    [data], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const response = await fetch('/api/galgotia-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result?.error || 'Could not submit. Please try again.')
      }
      goToDone()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const restart = () => {
    setData(INITIAL_STATE)
    setErrors({})
    setSubmitError(null)
    goToWelcome()
  }

  // Global keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isTextarea = target?.tagName === 'TEXTAREA'

      if (screen.type === 'welcome') {
        if (e.key === 'Enter') {
          e.preventDefault()
          goToQuestion(0, 1)
        }
        return
      }

      if (screen.type === 'question') {
        if (e.key === 'Enter' && !isTextarea && !e.shiftKey) {
          e.preventDefault()
          advanceFromQuestion(screen.index)
        }
        return
      }

      if (screen.type === 'review') {
        if (e.key === 'Enter' && !submitting) {
          e.preventDefault()
          handleSubmit()
        }
        return
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen, advanceFromQuestion, submitting]) // eslint-disable-line react-hooks/exhaustive-deps

  const progress = useMemo(() => {
    if (screen.type === 'welcome') return 0
    if (screen.type === 'done') return 1
    if (screen.type === 'review') return 1
    return (screen.index + 1) / (TOTAL_QUESTIONS + 1)
  }, [screen])

  const counter = useMemo(() => {
    if (screen.type === 'question') return { current: screen.index + 1, total: TOTAL_QUESTIONS }
    if (screen.type === 'review') return { current: TOTAL_QUESTIONS, total: TOTAL_QUESTIONS }
    return null
  }, [screen])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary text-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.12),transparent_60%)]" />

      <ProgressBar value={progress} />
      <BackToHomeLink />
      {counter && <Counter current={counter.current} total={counter.total} />}

      <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-20 sm:px-8">
        <AnimatePresence mode="wait" custom={direction}>
          {screen.type === 'welcome' && (
            <motion.div
              key="welcome"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <WelcomeScreen onStart={() => goToQuestion(0, 1)} />
            </motion.div>
          )}

          {screen.type === 'question' && (
            <motion.div
              key={`q-${screen.index}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <QuestionScreen
                index={screen.index}
                question={QUESTIONS[screen.index]}
                data={data}
                error={errors[QUESTIONS[screen.index].id]}
                onChange={setValue}
                onBack={
                  screen.index === 0
                    ? () => goToWelcome()
                    : () => goToQuestion(screen.index - 1, -1)
                }
                onNext={() => advanceFromQuestion(screen.index)}
              />
            </motion.div>
          )}

          {screen.type === 'review' && (
            <motion.div
              key="review"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ReviewScreen
                data={data}
                onEdit={(index) => goToQuestion(index, -1)}
                onSubmit={handleSubmit}
                onBack={() => goToQuestion(TOTAL_QUESTIONS - 1, -1)}
                submitting={submitting}
                error={submitError}
              />
            </motion.div>
          )}

          {screen.type === 'done' && (
            <motion.div
              key="done"
              variants={slideVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <DoneScreen onRestart={restart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ConfettiBurst isActive={showConfetti} />
    </div>
  )
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center sm:text-left">
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        className="mx-auto mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-lg shadow-teal-500/30 sm:mx-0"
      >
        <Sparkles className="h-7 w-7 text-white" />
      </motion.div>

      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
        Snapgo · Daily Shared Cab
      </p>
      <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
        Galgotia <span className="text-teal-300">↔</span> Alpha 2
        <br />
        <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
          for ₹50–60 a ride.
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
        We&apos;re launching a fixed-timing shared cab service for students and daily
        commuters between Galgotia College and Alpha 2 (Greater Noida). Take 2
        minutes to tell us how you travel — we&apos;ll save you a seat.
      </p>

      <ul className="mt-8 grid gap-3 text-sm text-white/80 sm:grid-cols-3">
        {[
          { label: 'Affordable', value: '₹50–60 per ride' },
          { label: 'Reliable', value: 'Fixed daily timings' },
          { label: 'Verified', value: 'Trusted co-riders' },
        ].map((item) => (
          <li
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
          >
            <p className="text-xs uppercase tracking-wider text-teal-300">{item.label}</p>
            <p className="mt-1 font-medium text-white">{item.value}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onStart}
          className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-xl shadow-teal-500/10 transition hover:scale-[1.02] hover:bg-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-400/40"
        >
          Start
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
        <p className="text-xs text-white/50">
          Press <HotkeyKbd>Enter</HotkeyKbd> · Takes about 2 minutes
        </p>
      </div>
    </div>
  )
}

function QuestionHeader({
  index,
  title,
  subtitle,
}: {
  index: number
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-8">
      <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
        <span className="font-mono text-base">{String(index + 1).padStart(2, '0')}</span>
        <span className="h-px w-6 bg-teal-300/50" />
        Question
      </p>
      <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-pretty text-base leading-relaxed text-white/60 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}

function QuestionFooter({
  onBack,
  onNext,
  nextLabel = 'OK',
  showHint = true,
  isLast = false,
  disabled = false,
}: {
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  showHint?: boolean
  isLast?: boolean
  disabled?: boolean
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-teal-500/20 transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-teal-300/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {nextLabel}
        {isLast ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        )}
      </button>
      {showHint && (
        <p className="flex items-center gap-1.5 text-xs text-white/50">
          press <HotkeyKbd>Enter</HotkeyKbd>
          <CornerDownLeft className="h-3 w-3" />
        </p>
      )}
      <button
        type="button"
        onClick={onBack}
        className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
  )
}

function QuestionScreen({
  index,
  question,
  data,
  error,
  onChange,
  onBack,
  onNext,
}: {
  index: number
  question: Question
  data: FormState
  error?: string
  onChange: (id: FieldId, value: string) => void
  onBack: () => void
  onNext: () => void
}) {
  if (question.kind === 'text') {
    return (
      <div>
        <QuestionHeader index={index} title={question.title} subtitle={question.subtitle} />
        <TextInput
          inputType={question.inputType}
          icon={question.icon}
          value={data[question.id]}
          placeholder={question.placeholder}
          onChange={(v) => onChange(question.id, v)}
          error={error}
          autoFocus
        />
        <QuestionFooter
          onBack={onBack}
          onNext={onNext}
          isLast={index === TOTAL_QUESTIONS - 1}
          nextLabel={index === TOTAL_QUESTIONS - 1 ? 'Review' : 'OK'}
        />
      </div>
    )
  }

  return (
    <div>
      <QuestionHeader index={index} title={question.title} subtitle={question.subtitle} />
      <ChoiceGrid
        options={question.options}
        value={data[question.id]}
        onSelect={(value) => {
          onChange(question.id, value)
          // Auto-advance unless it's "Other" needing extra input
          if (!(question.allowOther && value === 'Other')) {
            window.setTimeout(() => onNext(), 220)
          }
        }}
      />
      {question.allowOther && question.otherFieldId && data[question.id] === 'Other' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-4"
        >
          <TextInput
            inputType="text"
            icon={Sparkles}
            value={data[question.otherFieldId]}
            placeholder={question.otherPlaceholder ?? 'Type here'}
            onChange={(v) => onChange(question.otherFieldId!, v)}
            autoFocus
          />
        </motion.div>
      )}
      {error && (
        <p className="mt-4 text-sm font-medium text-red-300">{error}</p>
      )}
      <QuestionFooter
        onBack={onBack}
        onNext={onNext}
        isLast={index === TOTAL_QUESTIONS - 1}
        nextLabel={index === TOTAL_QUESTIONS - 1 ? 'Review' : 'OK'}
      />
    </div>
  )
}

function TextInput({
  inputType,
  icon: Icon,
  value,
  placeholder,
  onChange,
  error,
  autoFocus,
}: {
  inputType: 'text' | 'email' | 'tel'
  icon: typeof User
  value: string
  placeholder: string
  onChange: (value: string) => void
  error?: string
  autoFocus?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      const t = window.setTimeout(() => ref.current?.focus(), 350)
      return () => window.clearTimeout(t)
    }
  }, [autoFocus])

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-3 border-b-2 pb-3 transition-colors',
          error
            ? 'border-red-400/80'
            : 'border-white/20 focus-within:border-teal-300',
        )}
      >
        <Icon className="h-5 w-5 text-white/40 transition group-focus-within:text-teal-300" />
        <input
          ref={ref}
          type={inputType}
          inputMode={inputType === 'tel' ? 'tel' : inputType === 'email' ? 'email' : 'text'}
          autoComplete={
            inputType === 'email' ? 'email' : inputType === 'tel' ? 'tel' : 'name'
          }
          spellCheck={inputType === 'text'}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-2xl font-medium text-white placeholder:text-white/30 focus:outline-none sm:text-3xl"
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm font-medium text-red-300"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

function ChoiceGrid({
  options,
  value,
  onSelect,
}: {
  options: string[]
  value: string
  onSelect: (option: string) => void
}) {
  return (
    <ul className="space-y-3">
      {options.map((option, idx) => {
        const selected = value === option
        const letter = String.fromCharCode(65 + idx) // A, B, C…
        return (
          <li key={option}>
            <button
              type="button"
              onClick={() => onSelect(option)}
              className={cn(
                'group flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all',
                'focus:outline-none focus:ring-2 focus:ring-teal-300/60',
                selected
                  ? 'border-teal-300 bg-teal-300/15 text-white shadow-lg shadow-teal-500/10'
                  : 'border-white/15 bg-white/5 text-white/85 hover:border-white/40 hover:bg-white/10',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition',
                  selected
                    ? 'border-teal-200/50 bg-white text-slate-900'
                    : 'border-white/20 bg-white/5 text-white/70 group-hover:border-white/40',
                )}
              >
                {letter}
              </span>
              <span className="flex-1 text-base font-medium sm:text-lg">{option}</span>
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition',
                  selected
                    ? 'bg-teal-300 text-slate-900 opacity-100'
                    : 'bg-white/10 text-transparent opacity-0 group-hover:opacity-100 group-hover:text-white/40',
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

const REVIEW_LABELS: Record<FieldId, string> = {
  fullName: 'Full name',
  email: 'Email',
  phone: 'Phone',
  dailyTravel: 'Travels daily',
  pickupTime: 'Morning pickup',
  pickupTimeOther: 'Morning pickup (custom)',
  returnTime: 'Evening return',
  returnTimeOther: 'Evening return (custom)',
  currentTravel: 'Current travel',
  interested: 'Interested in shared cab',
}

function ReviewScreen({
  data,
  onEdit,
  onSubmit,
  onBack,
  submitting,
  error,
}: {
  data: FormState
  onEdit: (questionIndex: number) => void
  onSubmit: () => void
  onBack: () => void
  submitting: boolean
  error: string | null
}) {
  const rows = QUESTIONS.map((q, i) => {
    let value = data[q.id]
    if (q.kind === 'choice' && q.allowOther && q.otherFieldId && value === 'Other') {
      value = `Other — ${data[q.otherFieldId] || '(not specified)'}`
    }
    return { key: q.id, label: REVIEW_LABELS[q.id], value, index: i }
  })

  return (
    <div>
      <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
        <Sparkles className="h-3.5 w-3.5" />
        Almost done
      </p>
      <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        Quick review before we save your seat.
      </h2>
      <p className="mt-3 text-pretty text-white/60 sm:text-lg">
        Tap any answer to edit. Hit submit when it looks right.
      </p>

      <ul className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        {rows.map((row) => (
          <li key={row.key}>
            <button
              type="button"
              onClick={() => onEdit(row.index)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/5"
            >
              <span className="flex-1">
                <span className="block text-xs uppercase tracking-wider text-white/50">
                  {row.label}
                </span>
                <span className="mt-0.5 block text-base font-medium text-white">
                  {row.value || <span className="text-white/30">— not set —</span>}
                </span>
              </span>
              <span className="text-xs font-medium text-teal-300 transition group-hover:text-teal-200">
                Edit
              </span>
            </button>
          </li>
        ))}
      </ul>

      {error && (
        <div className="mt-6 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-teal-500/20 transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-teal-300/50 disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              Submit
              <CheckCircle2 className="h-4 w-4" />
            </>
          )}
        </button>
        <p className="flex items-center gap-1.5 text-xs text-white/50">
          press <HotkeyKbd>Enter</HotkeyKbd>
          <CornerDownLeft className="h-3 w-3" />
        </p>
        <button
          type="button"
          onClick={onBack}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    </div>
  )
}

function DoneScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
        className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 to-emerald-400 shadow-2xl shadow-teal-400/40"
      >
        <CheckCircle2 className="h-10 w-10 text-slate-900" strokeWidth={2.5} />
      </motion.div>

      <h2 className="text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
        You&apos;re on the list.
      </h2>
      <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
        Thanks for signing up. We&apos;ll email you the moment seats open up for the
        Galgotia ↔ Alpha 2 service. Tell a friend — the more interest, the
        sooner we launch.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.02] hover:bg-teal-300"
        >
          Back to homepage
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
        >
          Submit another response
        </button>
      </div>
    </div>
  )
}
