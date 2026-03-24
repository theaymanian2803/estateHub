import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { Mail, Phone, CheckCircle, ExternalLink, Clock, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface Inquiry {
  id: string
  property_id: string
  sender_name: string
  sender_email: string
  sender_phone: string | null
  message: string
  status: 'pending' | 'resolved'
  created_at: string
  property?: {
    title: string
  }
}

export default function SellerInquiries() {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (user) fetchInquiries()
  }, [user])

  const fetchInquiries = async () => {
    setIsLoading(true)
    try {
      // ONLY fetch inquiries that belong to this specific seller
      const { data, error } = await supabase
        .from('inquiries')
        .select(`*, property:properties(title)`)
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInquiries(data as Inquiry[])
    } catch (error: any) {
      console.error('Error fetching inquiries:', error)
      toast({
        title: 'Failed to load messages',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const markAsResolved = async (id: string) => {
    try {
      const { error } = await supabase.from('inquiries').update({ status: 'resolved' }).eq('id', id)

      if (error) throw error
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: 'resolved' } : inq))
      )
      toast({ title: 'Message marked as resolved!' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground animate-pulse">
        Loading messages...
      </div>
    )
  }

  if (inquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
        <Mail className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <h3 className="text-xl font-bold font-display text-foreground">No Messages Yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          When buyers are interested in your properties, their messages will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Buyer Messages</h2>
          <p className="text-sm text-muted-foreground">Manage inquiries for your listings.</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-sm bg-accent/10 text-accent">
          {inquiries.filter((i) => i.status === 'pending').length} Unread
        </Badge>
      </div>

      <div className="grid gap-4">
        {inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className={`relative flex flex-col gap-4 rounded-xl border p-6 transition-all ${inquiry.status === 'pending' ? 'border-accent/30 bg-accent/5' : 'border-border bg-card opacity-75'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-border/50 pb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  {inquiry.sender_name}
                  {inquiry.status === 'pending' && (
                    <span className="flex h-2 w-2 rounded-full bg-accent"></span>
                  )}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <a
                    href={`mailto:${inquiry.sender_email}`}
                    className="flex items-center gap-1 hover:text-accent transition-colors">
                    <Mail className="h-4 w-4" /> {inquiry.sender_email}
                  </a>
                  {inquiry.sender_phone && (
                    <a
                      href={`tel:${inquiry.sender_phone}`}
                      className="flex items-center gap-1 hover:text-accent transition-colors">
                      <Phone className="h-4 w-4" /> {inquiry.sender_phone}
                    </a>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />{' '}
                    {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <Badge
                className={
                  inquiry.status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-600'
                    : 'bg-green-500/10 text-green-600'
                }>
                {inquiry.status === 'pending' ? 'New Message' : 'Resolved'}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-secondary/30 w-fit px-3 py-1.5 rounded-md">
              <Home className="h-4 w-4 text-accent" />
              Regarding:
              <Link
                to={`/property/${inquiry.property_id}`}
                className="hover:text-accent hover:underline flex items-center gap-1">
                {inquiry.property?.title || 'Unknown Property'} <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-lg bg-background p-4 text-sm text-foreground/90 border border-border/50 whitespace-pre-wrap">
              {inquiry.message}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {inquiry.status === 'pending' && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => markAsResolved(inquiry.id)}>
                  <CheckCircle className="mr-1 h-4 w-4" /> Mark as Read / Resolved
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
