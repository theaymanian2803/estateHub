import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

export interface Review {
  id: string
  propertyId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

function Stars({
  rating,
  interactive,
  onRate,
}: {
  rating: number
  interactive?: boolean
  onRate?: (r: number) => void
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-5 w-5 transition-colors ${
            i <= rating ? 'fill-gold text-gold' : 'text-muted'
          } ${interactive ? 'cursor-pointer hover:text-gold' : ''}`}
          onClick={() => interactive && onRate?.(i)}
        />
      ))}
    </div>
  )
}

export default function ReviewSection({
  reviews = [],
  propertyId,
}: {
  reviews?: Review[]
  propertyId: string
}) {
  const { toast } = useToast()
  const { user } = useAuth()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Keep local state in sync with props
  const safeReviews = Array.isArray(reviews) ? reviews : []
  const [localReviews, setLocalReviews] = useState<Review[]>(safeReviews)

  // Update localReviews if props change (e.g., when the fetch completes)
  useEffect(() => {
    setLocalReviews(Array.isArray(reviews) ? reviews : [])
  }, [reviews])

  const avgRating =
    localReviews?.length > 0
      ? localReviews.reduce((s, r) => s + r.rating, 0) / localReviews.length
      : 0

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to leave a review.',
        variant: 'destructive',
      })
      return
    }

    if (rating === 0) {
      toast({ title: 'Please select a rating', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          property_id: propertyId,
          user_id: user.id,
          rating,
          comment,
        })
        .select('*, profiles(full_name)')
        .single()

      if (error) throw error

      const newReview: Review = {
        id: data.id,
        propertyId: data.property_id,
        userName: data.profiles?.full_name || user.user_metadata?.full_name || 'Verified User',
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date(data.created_at).toISOString().slice(0, 10),
      }

      setLocalReviews([newReview, ...(localReviews || [])])
      setRating(0)
      setComment('')
      toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h3 className="font-display text-xl font-bold text-foreground">
          Reviews ({localReviews?.length || 0})
        </h3>
        {localReviews?.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} avg</span>
          </div>
        )}
      </div>

      {user ? (
        <div className="mb-8 rounded-lg border border-border bg-card p-4">
          <p className="mb-2 text-sm font-medium text-foreground">Write a Review</p>
          <Stars rating={rating} interactive onRate={setRating} />
          <Textarea
            className="mt-3"
            placeholder="Share your experience…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
          <Button
            size="sm"
            className="mt-3 gradient-caramel text-white hover:opacity-90"
            onClick={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      ) : (
        <div className="mb-8 rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Please sign in to share your experience about this property.
          </p>
          <Button
            asChild
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-white">
            <Link to="/auth">Sign In to Review</Link>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {(localReviews || []).map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{r.userName}</span>
              <span className="text-xs text-muted-foreground">{r.createdAt}</span>
            </div>
            <Stars rating={r.rating} />
            {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
