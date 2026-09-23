import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Video,
  Share2,
  CheckCircle,
  Clock,
  TrendingUp,
  X
} from 'lucide-react'
import { useLanguage } from '@/context/language-provider'

interface CompanyProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: {
    id: string
    name: string
    description: string
    domains: string[]
    location: string
    status: 'active' | 'inactive' | 'pending'
    score?: number
    contacts?: number
    opportunities?: number
    revenue?: number
  }
}

export function CompanyProfileDialog({ open, onOpenChange, company }: CompanyProfileDialogProps) {
  const { language } = useLanguage()
  const en = language === 'en'
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would implement the actual message sending logic
      if (en) {
        alert('Message sent successfully!')
      } else {
        alert('Xabar muvaffaqiyatli yuborildi!')
      }
      setMessage('')
    }
  }

  const activityItems = [
    {
      id: 1,
      user: 'Jacob Müller',
      action: en ? 'Updated company profile' : 'Kompaniya profilini yangiladi',
      time: '2 hours ago',
      type: 'update'
    },
    {
      id: 2,
      user: 'Aiden Hudson',
      action: en ? 'Added new contact' : 'Yangi kontakt qo\'shdi',
      time: '5 hours ago',
      type: 'create'
    },
    {
      id: 3,
      user: 'Emma Collins',
      action: en ? 'Scheduled a call' : 'Chaqqalashuv rejalashtirdi',
      time: '1 day ago',
      type: 'schedule'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                <Building2 className="size-8 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">{company.name}</DialogTitle>
                <DialogDescription className="mt-1">
                  {company.description}
                </DialogDescription>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                    {company.status === 'active' ? (en ? 'Active' : 'Faol') : 
                     company.status === 'inactive' ? (en ? 'Inactive' : 'Nofaol') : 
                     (en ? 'Pending' : 'Kutilmoqda')}
                  </Badge>
                  {company.score && (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      {en ? 'Score' : 'Ball'}: {company.score}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{en ? 'Overview' : 'Ko\'rinish'}</TabsTrigger>
            <TabsTrigger value="activity">{en ? 'Activity' : 'Faoliyat'}</TabsTrigger>
            <TabsTrigger value="contacts">{en ? 'Contacts' : 'Kontaktlar'}</TabsTrigger>
            <TabsTrigger value="deals">{en ? 'Deals' : 'Bitimlar'}</TabsTrigger>
            <TabsTrigger value="docs">{en ? 'Docs' : 'Hujjatlar'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="size-4 text-primary" />
                    {en ? 'Company Info' : 'Kompaniya Ma\'lumoti'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span>{company.location}</span>
                  </div>
                  {company.domains.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{en ? 'Domains' : 'Domenlar'}:</p>
                      {company.domains.map((domain, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="size-4 text-emerald-600" />
                    {en ? 'Metrics' : 'Metrikalar'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {company.contacts !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{en ? 'Contacts' : 'Kontaktlar'}:</span>
                      <span className="font-semibold">{company.contacts}</span>
                    </div>
                  )}
                  {company.opportunities !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{en ? 'Opportunities' : 'Imkoniyatlar'}:</span>
                      <span className="font-semibold">{company.opportunities}</span>
                    </div>
                  )}
                  {company.revenue !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{en ? 'Revenue' : 'Daromad'}:</span>
                      <span className="font-semibold text-emerald-600">
                        ${company.revenue.toLocaleString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="size-4 text-blue-600" />
                    {en ? 'Quick Actions' : 'Tezkor Harakatlar'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Share2 className="mr-2 size-4" />
                    {en ? 'Share case study' : 'Case study ulashish'}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <CheckCircle className="mr-2 size-4" />
                    {en ? 'Verify details' : 'Tafsilotlarni tasdiqlash'}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Video className="mr-2 size-4" />
                    {en ? 'Schedule call' : 'Chaqqalashuv rejalashtirish'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{en ? 'Send Message' : 'Xabar Yuborish'}</CardTitle>
                <CardDescription>{en ? 'Send a message to the company team' : 'Kompaniya jamoasiga xabar yuboring'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder={en ? 'Write your message here...' : 'Xabaringizni shu yerga yozing...'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSendMessage} className="flex-1">
                    <MessageSquare className="mr-2 size-4" />
                    {en ? 'Send Message' : 'Xabar Yuborish'}
                  </Button>
                  <Button variant="outline">
                    <Phone className="mr-2 size-4" />
                    {en ? 'Contact' : 'Aloqa'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{en ? 'Recent Activity' : 'So\'nggi Faoliyat'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b last:border-0">
                      <div className={`flex size-8 items-center justify-center rounded-full ${
                        item.type === 'update' ? 'bg-blue-500/10 text-blue-600' :
                        item.type === 'create' ? 'bg-emerald-500/10 text-emerald-600' :
                        'bg-purple-500/10 text-purple-600'
                      }`}>
                        {item.type === 'update' ? <FileText className="size-4" /> :
                         item.type === 'create' ? <CheckCircle className="size-4" /> :
                         <Calendar className="size-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.user} · {item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{en ? 'Company Contacts' : 'Kompaniya Kontaktlari'}</CardTitle>
                <CardDescription>{en ? 'People associated with this company' : 'Bu kompaniya bilan bog\'liq odamlar'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="mx-auto size-12 mb-3 opacity-50" />
                  <p>{en ? 'No contacts added yet' : 'Hali kontaktlar qo\'shilmagan'}</p>
                  <Button variant="outline" className="mt-4">
                    {en ? 'Add Contact' : 'Kontakt Qo\'shish'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{en ? 'Active Deals' : 'Faol Bitimlar'}</CardTitle>
                <CardDescription>{en ? 'Current opportunities with this company' : 'Bu kompaniya bilan joriy imkoniyatlar'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="mx-auto size-12 mb-3 opacity-50" />
                  <p>{en ? 'No active deals' : 'Faol bitimlar yo\'q'}</p>
                  <Button variant="outline" className="mt-4">
                    {en ? 'Create Deal' : 'Bitim Yaratish'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{en ? 'Documents' : 'Hujjatlar'}</CardTitle>
                <CardDescription>{en ? 'Shared documents and files' : 'Ulamgan hujjatlar va fayllar'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto size-12 mb-3 opacity-50" />
                  <p>{en ? 'No documents shared' : 'Hujjatlar ulanmagan'}</p>
                  <Button variant="outline" className="mt-4">
                    {en ? 'Upload Document' : 'Hujjat Yuklash'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}