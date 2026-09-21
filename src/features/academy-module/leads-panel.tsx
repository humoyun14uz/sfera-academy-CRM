import { useMemo, useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export type LeadRecord = {
  name: string
  phone: string
  email: string
  course: string
  source: string
  manager: string
  status: string
  date: string
  notes: string
  followUp?: string
}

const initialLeads: LeadRecord[] = [
  {
    name: 'Zarina Abdullayeva',
    phone: '+998 90 555 12 12',
    email: 'zarina@example.uz',
    course: 'Frontend Development',
    source: 'Telegram',
    manager: 'Quvonchbek',
    status: 'New',
    date: '2026-09-05',
    notes: 'Kurs narxi bilan qiziqdi.',
    followUp: '2026-09-10 15:00',
  },
  {
    name: 'Jasur Karimov',
    phone: '+998 91 222 34 34',
    email: 'jasur@example.uz',
    course: 'Java Backend',
    source: 'Instagram',
    manager: 'Quvonchbek',
    status: 'Trial Lesson',
    date: '2026-09-04',
    notes: 'Sinov darsiga yozildi.',
  },
  {
    name: 'Mohira Saidova',
    phone: '+998 93 888 45 45',
    email: 'mohira@example.uz',
    course: 'AI Automation',
    source: 'Website',
    manager: 'Quvonchbek',
    status: 'Interested',
    date: '2026-09-03',
    notes: 'AI yo‘nalishiga qiziqmoqda.',
  },
]

const stages = ['New', 'Contacted', 'Interested', 'Trial Lesson', 'Enrolled', 'Lost']
const sources = ['Instagram', 'Telegram', 'Website', 'Phone', 'Referral', 'Walk-in', 'Advertisement', 'Other']

export function LeadsPanel({ english }: { english: boolean }) {
  const [rows, setRows] = useState(initialLeads)
  const [view, setView] = useState<'table' | 'kanban'>('table')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [detail, setDetail] = useState<LeadRecord | null>(null)
  const [activity, setActivity] = useState<Record<string, string[]>>({})
  const [activityType, setActivityType] = useState('Call')
  const [activityNote, setActivityNote] = useState('')
  const [trialOpen, setTrialOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'Frontend Development',
    source: 'Website',
    manager: 'Quvonchbek',
    followUp: '',
    notes: '',
  })

  const filtered = useMemo(
    () =>
      rows.filter(
        (lead) =>
          (!query ||
            `${lead.name} ${lead.phone} ${lead.course} ${lead.email}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (status === 'all' || lead.status === status)
      ),
    [rows, query, status]
  )

  const label = (value: string) =>
    english
      ? value
      : ({
          New: 'Yangi',
          Contacted: 'Bog‘lanildi',
          Interested: 'Qiziqdi',
          'Trial Lesson': 'Sinov darsi',
          Enrolled: 'Qabul qilindi',
          Lost: 'Yo‘qotildi',
        } as Record<string, string>)[value] ?? value

  const updateStatus = (lead: LeadRecord, next: string) => {
    setRows((items) =>
      items.map((item) => (item.name === lead.name ? { ...item, status: next } : item))
    )
    toast.success(english ? 'Lead status updated.' : 'Ariza holati yangilandi.')
  }

  const createLead = () => {
    const phoneOk = /^\+?[0-9 ()-]{7,20}$/.test(newLead.phone.trim())
    if (!newLead.name.trim() || !newLead.phone.trim() || !newLead.course) {
      toast.error(english ? 'Name, phone, and course are required.' : 'Ism, telefon va kursni kiriting.')
      return
    }
    if (!phoneOk) {
      toast.error(english ? 'Enter a valid phone number (e.g. +998 90 123 45 67).' : 'To‘g‘ri telefon raqam kiriting (masalan: +998 90 123 45 67).')
      return
    }
    setRows((items) => [
      { ...newLead, status: 'New', date: new Date().toISOString().slice(0, 10) },
      ...items,
    ])
    setNewLead({
      name: '',
      phone: '',
      email: '',
      course: 'Frontend Development',
      source: 'Website',
      manager: 'Quvonchbek',
      followUp: '',
      notes: '',
    })
    setAddOpen(false)
    toast.success(english ? 'Application added successfully.' : 'Ariza muvaffaqiyatli qo‘shildi.')
  }

  const addActivity = () => {
    if (!detail || !activityNote.trim()) return
    setActivity((items) => ({
      ...items,
      [detail.name]: [
        ...(items[detail.name] ?? []),
        `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${activityType} · ${activityNote}`,
      ],
    }))
    setActivityNote('')
    toast.success(english ? 'Activity added.' : 'Faoliyat qo‘shildi.')
  }

  const convert = () => {
    if (!detail) return
    updateStatus(detail, 'Enrolled')
    setConvertOpen(false)
    toast.success(english ? 'Student profile and enrollment created.' : 'O‘quvchi profili va enrollment yaratildi.')
  }

  return (
    <>
      <Card>
        <CardHeader className='space-y-4'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <CardTitle>{english ? 'Applications' : 'Arizalar'}</CardTitle>
              <p className='mt-1 text-sm text-muted-foreground'>
                {english
                  ? 'Manage potential students before enrollment.'
                  : 'Hali o‘quvchiga aylanmagan qiziqqan mijozlarni boshqaring.'}
              </p>
            </div>
            <Button onClick={() => setAddOpen(true)}>
              + {english ? 'Add application' : 'Ariza qo‘shish'}
            </Button>
          </div>

          <div className='grid min-w-0 gap-2 sm:flex sm:flex-wrap sm:items-center'>
            <Input
              className='w-full sm:max-w-xs'
              placeholder={
                english
                  ? 'Search name, phone or course'
                  : 'O‘quvchi, telefon yoki kurs bo‘yicha qidirish'
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='w-full sm:w-[180px]'>
                <SelectValue placeholder={english ? 'All students' : 'Barcha o‘quvchilar'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>
                  {english ? 'All students' : 'Barcha o‘quvchilar'}
                </SelectItem>
                {stages.map((item) => (
                  <SelectItem key={item} value={item}>
                    {label(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={view === 'table' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setView('table')}
            >
              {english ? 'Table' : 'Jadval'}
            </Button>
            <Button
              variant={view === 'kanban' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setView('kanban')}
            >
              Kanban
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {view === 'table' ? (
            <div className='overflow-x-auto rounded-lg border'>
              <table className='w-full min-w-[1050px] border-collapse text-left text-sm'>
                <thead>
                  <tr className='border-b bg-muted/40 text-xs font-medium text-muted-foreground'>
                    <th className='py-3 px-4'>{english ? 'Name' : 'Ism'}</th>
                    <th className='py-3 px-4'>{english ? 'Phone' : 'Telefon'}</th>
                    <th className='py-3 px-4'>{english ? 'Course' : 'Kurs'}</th>
                    <th className='py-3 px-4'>{english ? 'Source' : 'Manba'}</th>
                    <th className='py-3 px-4'>{english ? 'Assigned to' : 'Mas’ul'}</th>
                    <th className='py-3 px-4'>{english ? 'Status' : 'Holati'}</th>
                    <th className='py-3 px-4 whitespace-nowrap'>{english ? 'Follow-up' : 'Qayta aloqa'}</th>
                    <th className='py-3 px-4'>{english ? 'Created' : 'Yaratilgan'}</th>
                    <th className='py-3 px-4 text-right'>{english ? 'Actions' : 'Amallar'}</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {filtered.map((lead) => (
                    <tr
                      key={`${lead.name}-${lead.date}`}
                      className='transition-colors hover:bg-muted/30'
                    >
                      <td className='py-3.5 px-4 min-w-[200px]'>
                        <button
                          className='text-start font-semibold text-foreground hover:underline block'
                          onClick={() => setDetail(lead)}
                        >
                          {lead.name}
                          <span className='block text-xs font-normal text-muted-foreground mt-0.5'>
                            {lead.email}
                          </span>
                        </button>
                      </td>
                      <td className='py-3.5 px-4 whitespace-nowrap font-sans tabular-nums text-xs text-foreground/85'>{lead.phone}</td>
                      <td className='py-3.5 px-4 whitespace-nowrap font-medium text-xs'>{lead.course}</td>
                      <td className='py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground'>{lead.source}</td>
                      <td className='py-3.5 px-4 whitespace-nowrap text-xs'>{lead.manager}</td>
                      <td className='py-3.5 px-4'>
                        <Select
                          value={lead.status}
                          onValueChange={(next) => updateStatus(lead, next)}
                        >
                          <SelectTrigger size='sm' className='h-8 w-[130px] text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stages.map((item) => (
                              <SelectItem key={item} value={item} className='text-xs'>
                                {label(item)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className='py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground'>{lead.followUp ?? '—'}</td>
                      <td className='py-3.5 px-4 whitespace-nowrap font-sans tabular-nums text-xs text-muted-foreground'>{lead.date}</td>
                      <td className='py-3.5 px-4 text-right whitespace-nowrap'>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground'
                            onClick={() => setDetail(lead)}
                            title={english ? 'View details' : 'Ko‘rish'}
                            aria-label={english ? 'View details' : 'Ko‘rish'}
                          >
                            <Eye className='size-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                            onClick={() => {
                              setRows((items) =>
                                items.filter((item) => item.name !== lead.name)
                              )
                              toast.success(
                                english ? 'Application deleted.' : 'Ariza o‘chirildi.'
                              )
                            }}
                            title={english ? 'Delete application' : 'O‘chirish'}
                            aria-label={english ? 'Delete application' : 'O‘chirish'}
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className='py-8 text-center text-sm text-muted-foreground'>
                        {english ? 'No applications found.' : 'Arizalar topilmadi.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='grid gap-4 overflow-x-auto md:grid-cols-3 xl:grid-cols-6'>
              {stages.map((stage) => (
                <div
                  key={stage}
                  className='min-w-[190px] rounded-lg bg-muted/40 p-3'
                >
                  <h3 className='mb-3 text-sm font-semibold'>
                    {label(stage)} (
                    {filtered.filter((lead) => lead.status === stage).length})
                  </h3>
                  <div className='space-y-2'>
                    {filtered
                      .filter((lead) => lead.status === stage)
                      .map((lead) => (
                        <button
                          key={lead.name}
                          className='w-full rounded-md border bg-background p-3 text-start text-sm hover:shadow'
                          onClick={() => setDetail(lead)}
                        >
                          <strong>{lead.name}</strong>
                          <span className='block text-xs text-muted-foreground'>
                            {lead.course}
                          </span>
                          <span className='mt-2 block text-xs'>{lead.phone}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Application Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>{english ? 'Add application' : 'Ariza qo‘shish'}</DialogTitle>
          </DialogHeader>
          <div className='grid gap-3'>
            <Input
              placeholder={`${english ? 'Full name' : 'To‘liq ism'} *`}
              value={newLead.name}
              onChange={(event) =>
                setNewLead({ ...newLead, name: event.target.value })
              }
            />
            <Input
              placeholder={`${english ? 'Phone' : 'Telefon'} *`}
              value={newLead.phone}
              onChange={(event) =>
                setNewLead({
                  ...newLead,
                  phone: event.target.value.replace(/[^\d+()\s-]/g, ''),
                })
              }
            />
            <Input
              type='email'
              placeholder='Email'
              value={newLead.email}
              onChange={(event) =>
                setNewLead({ ...newLead, email: event.target.value })
              }
            />
            <div className='space-y-1'>
              <label className='text-xs font-medium text-muted-foreground'>
                {english ? 'Course' : 'Kurs'} *
              </label>
              <Select
                value={newLead.course}
                onValueChange={(course) => setNewLead({ ...newLead, course })}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={english ? 'Select course' : 'Kursni tanlang'} />
                </SelectTrigger>
                <SelectContent>
                  {[
                    'Frontend Development',
                    'Python Backend',
                    'Java Backend',
                    'AI Automation',
                    'Foundation',
                  ].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-muted-foreground'>
                {english ? 'Source' : 'Manba'}
              </label>
              <Select
                value={newLead.source}
                onValueChange={(source) => setNewLead({ ...newLead, source })}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={english ? 'Select source' : 'Manbani tanlang'} />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder={english ? 'Next follow-up' : 'Keyingi aloqa sanasi'}
              value={newLead.followUp}
              onChange={(event) =>
                setNewLead({ ...newLead, followUp: event.target.value })
              }
            />
            <Input
              placeholder={english ? 'Notes' : 'Izohlar'}
              value={newLead.notes}
              onChange={(event) =>
                setNewLead({ ...newLead, notes: event.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setAddOpen(false)}>
              {english ? 'Cancel' : 'Bekor qilish'}
            </Button>
            <Button
              disabled={!newLead.name.trim() || !newLead.phone.trim() || !newLead.course}
              onClick={createLead}
            >
              {english ? 'Add application' : 'Ariza qo‘shish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Lead Details Dialog */}
      <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{detail?.name}</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className='space-y-4'>
              <div className='grid gap-2 rounded-lg border p-3 text-sm sm:grid-cols-2'>
                <span>
                  <b>{english ? 'Phone' : 'Telefon'}:</b> {detail.phone}
                </span>
                <span>
                  <b>Email:</b> {detail.email || '—'}
                </span>
                <span>
                  <b>{english ? 'Course' : 'Kurs'}:</b> {detail.course}
                </span>
                <span>
                  <b>{english ? 'Source' : 'Manba'}:</b> {detail.source}
                </span>
                <span>
                  <b>{english ? 'Manager' : 'Mas’ul'}:</b> {detail.manager}
                </span>
                <span>
                  <b>{english ? 'Created' : 'Yaratilgan'}:</b> {detail.date}
                </span>
              </div>

              <div>
                <h3 className='mb-2 font-semibold'>
                  {english ? 'Activity timeline' : 'Faoliyat tarixi'}
                </h3>
                <div className='max-h-40 space-y-2 overflow-y-auto'>
                  {(
                    activity[detail.name] ?? [
                      `${detail.date} · ${english ? 'Lead created' : 'Ariza yaratildi'}`,
                    ]
                  ).map((item) => (
                    <div key={item} className='rounded-md border p-2 text-sm'>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex flex-wrap gap-2'>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger className='w-[140px]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Call', 'Message', 'Meeting', 'Trial lesson'].map((item) => (
                      <SelectItem key={item} value={item}>
                        {english
                          ? item
                          : ({
                              Call: 'Qo‘ng‘iroq',
                              Message: 'Xabar',
                              Meeting: 'Uchrashuv',
                              'Trial lesson': 'Sinov darsi',
                            } as Record<string, string>)[item] ?? item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className='min-w-[200px] flex-1'
                  placeholder={english ? 'Activity note' : 'Faoliyat izohi'}
                  value={activityNote}
                  onChange={(event) => setActivityNote(event.target.value)}
                />
                <Button onClick={addActivity}>
                  {english ? 'Add activity' : 'Faoliyat qo‘shish'}
                </Button>
              </div>

              <div className='flex flex-wrap gap-2 pt-2'>
                <Button variant='outline' onClick={() => setTrialOpen(true)}>
                  {english ? 'Schedule trial lesson' : 'Sinov darsini belgilash'}
                </Button>
                {detail.status === 'Enrolled' && (
                  <Button onClick={() => setConvertOpen(true)}>
                    {english ? 'Convert to student' : 'Studentga aylantirish'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Trial Dialog */}
      <Dialog open={trialOpen} onOpenChange={setTrialOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {english ? 'Schedule trial lesson' : 'Sinov darsini belgilash'}
            </DialogTitle>
          </DialogHeader>
          <div className='grid gap-3'>
            <Input type='date' />
            <Input type='time' />
            <Input placeholder={english ? 'Teacher' : 'O‘qituvchi'} />
            <Input placeholder={english ? 'Room' : 'Xona'} />
            <Input placeholder={english ? 'Note' : 'Izoh'} />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setTrialOpen(false)
                if (detail) updateStatus(detail, 'Trial Lesson')
                toast.success(
                  english ? 'Trial lesson scheduled.' : 'Sinov darsi belgilandi.'
                )
              }}
            >
              {english ? 'Schedule' : 'Belgilash'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Lead to Student Dialog */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {english ? 'Convert lead to student' : 'Leadni studentga aylantirish'}
            </DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            {english
              ? 'Create a student profile and enrollment using this lead’s name, phone, email and course.'
              : 'Ushbu lead ma’lumotlari asosida student profili va enrollment yaratiladi.'}
          </p>
          <DialogFooter>
            <Button variant='outline' onClick={() => setConvertOpen(false)}>
              {english ? 'Cancel' : 'Bekor qilish'}
            </Button>
            <Button onClick={convert}>
              {english ? 'Create student' : 'Student yaratish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
