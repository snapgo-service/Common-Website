'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Download,
  Inbox,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useConfirmDialog } from '@/components/ui/confirm-dialog'
import { useToast } from '@/components/ui/use-toast'
import { galgotiaAPI, type GalgotiaSubmission } from '@/lib/admin-client'
import { cn } from '@/lib/utils'

const INTERESTED_FILTERS = ['all', 'Yes', 'Maybe', 'No'] as const
const DAILY_FILTERS = ['all', 'Yes', 'No'] as const

type InterestedFilter = (typeof INTERESTED_FILTERS)[number]
type DailyFilter = (typeof DAILY_FILTERS)[number]

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function csvEscape(value: unknown): string {
  const str = String(value ?? '')
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function buildCsv(rows: GalgotiaSubmission[]): string {
  const headers = [
    'Submitted At',
    'Full Name',
    'Email',
    'Phone',
    'Daily Travel?',
    'Morning Pickup',
    'Pickup (Other)',
    'Evening Return',
    'Return (Other)',
    'Current Travel',
    'Interested',
  ]
  const lines = [headers.map(csvEscape).join(',')]
  for (const r of rows) {
    lines.push(
      [
        r.submittedAt ?? '',
        r.fullName,
        r.email,
        r.phone,
        r.dailyTravel,
        r.pickupTime,
        r.pickupTimeOther ?? '',
        r.returnTime,
        r.returnTimeOther ?? '',
        r.currentTravel,
        r.interested,
      ]
        .map(csvEscape)
        .join(','),
    )
  }
  return lines.join('\r\n')
}

export default function GalgotiaSubmissionsPage() {
  const [submissions, setSubmissions] = useState<GalgotiaSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [interestedFilter, setInterestedFilter] = useState<InterestedFilter>('all')
  const [dailyFilter, setDailyFilter] = useState<DailyFilter>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { toast } = useToast()

  const fetchSubmissions = async () => {
    setLoading(true)
    const { data, error } = await galgotiaAPI.list()
    if (error) {
      toast({
        title: 'Failed to load submissions',
        description: error,
        variant: 'destructive',
      })
      setSubmissions([])
    } else {
      setSubmissions(data?.submissions ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return submissions.filter((s) => {
      if (interestedFilter !== 'all' && s.interested !== interestedFilter) return false
      if (dailyFilter !== 'all' && s.dailyTravel !== dailyFilter) return false
      if (!q) return true
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q)
      )
    })
  }, [submissions, search, interestedFilter, dailyFilter])

  const stats = useMemo(() => {
    const total = submissions.length
    const yes = submissions.filter((s) => s.interested === 'Yes').length
    const maybe = submissions.filter((s) => s.interested === 'Maybe').length
    const daily = submissions.filter((s) => s.dailyTravel === 'Yes').length
    return { total, yes, maybe, daily }
  }, [submissions])

  const handleDelete = async (submission: GalgotiaSubmission) => {
    const confirmed = await confirm({
      title: 'Delete this submission?',
      description: `This permanently removes the response from ${submission.fullName} (${submission.email}). This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'destructive',
    })
    if (!confirmed) return

    setDeletingId(submission.id)
    const { error } = await galgotiaAPI.delete(submission.id)
    setDeletingId(null)

    if (error) {
      toast({
        title: 'Could not delete',
        description: error,
        variant: 'destructive',
      })
      return
    }
    setSubmissions((prev) => prev.filter((s) => s.id !== submission.id))
    toast({ title: 'Submission deleted' })
  }

  const handleExportCsv = () => {
    if (!filtered.length) {
      toast({ title: 'Nothing to export', description: 'No submissions match the current filters.' })
      return
    }
    const csv = buildCsv(filtered)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `galgotia-signups-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Inbox className="h-6 w-6 text-primary" />
            Galgotia Signups
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cab-pool service responses from /galgotia-alpha2.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSubmissions} disabled={loading}>
            <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleExportCsv} disabled={!filtered.length}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Interested (Yes)" value={stats.yes} icon={Users} accent="emerald" />
        <StatCard label="Maybe" value={stats.maybe} icon={Users} accent="amber" />
        <StatCard label="Daily commuters" value={stats.daily} icon={Users} accent="indigo" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className="pl-9"
            />
          </div>
          <Select value={interestedFilter} onValueChange={(v) => setInterestedFilter(v as InterestedFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Interested" />
            </SelectTrigger>
            <SelectContent>
              {INTERESTED_FILTERS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt === 'all' ? 'All interest levels' : `Interested: ${opt}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dailyFilter} onValueChange={(v) => setDailyFilter(v as DailyFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Daily travel" />
            </SelectTrigger>
            <SelectContent>
              {DAILY_FILTERS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt === 'all' ? 'Daily: all' : `Daily: ${opt}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {submissions.length === 0
                ? 'No signups yet. Share /galgotia-alpha2 to start collecting responses.'
                : 'No submissions match your filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Daily?</th>
                  <th className="px-4 py-3 font-medium">Pickup</th>
                  <th className="px-4 py-3 font-medium">Return</th>
                  <th className="px-4 py-3 font-medium">Now travels by</th>
                  <th className="px-4 py-3 font-medium">Interested</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(s.submittedAt)}
                    </td>
                    <td className="px-4 py-3 font-medium">{s.fullName}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${s.email}`}
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        {s.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`tel:${s.phone.replace(/\s/g, '')}`}
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        {s.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.dailyTravel === 'Yes' ? 'default' : 'outline'}>
                        {s.dailyTravel || '—'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {s.pickupTime === 'Other' ? `Other · ${s.pickupTimeOther || ''}` : s.pickupTime}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {s.returnTime === 'Other' ? `Other · ${s.returnTimeOther || ''}` : s.returnTime}
                    </td>
                    <td className="px-4 py-3 text-xs">{s.currentTravel}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          s.interested === 'Yes'
                            ? 'default'
                            : s.interested === 'Maybe'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {s.interested || '—'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(s)}
                        disabled={deletingId === s.id}
                      >
                        {deletingId === s.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {ConfirmDialog}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: number
  icon: typeof Users
  accent: 'primary' | 'emerald' | 'amber' | 'indigo'
}) {
  const accentClass = {
    primary: 'bg-primary/10 text-primary',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  }[accent]

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', accentClass)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
        </div>
      </div>
    </Card>
  )
}
