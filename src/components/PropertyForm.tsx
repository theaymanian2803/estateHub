import AddressAutocomplete from '@/components/AddressAutocomplete'
import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useListingOptions } from '@/hooks/useListingOptions'
import { Loader2, MapPin } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export interface PropertyFormData {
  title: string
  description: string
  price: number
  beds: number | null
  baths: number | null
  sqft: number | null
  lot_size: number | null
  city: string
  state: string | null
  zip_code: string | null
  location: string | null
  neighborhood: string | null
  latitude: number | null
  longitude: number | null
  type: string | null
  property_style: string | null
  year_built: number | null
  parking: number | null
  stories: number | null
  heating: string | null
  cooling: string | null
  flooring: string | null
  roof: string | null
  hoa_fee: number | null
  amenities: string[]
  images: string[]
}

interface PropertyFormProps {
  userId: string
  initialData?: Partial<PropertyFormData>
  onSubmit: (data: PropertyFormData) => Promise<void>
  submitLabel: string
}

export default function PropertyForm({
  userId,
  initialData,
  onSubmit,
  submitLabel,
}: PropertyFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [submitting, setSubmitting] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || [])
  const { getByCategory, loading: optionsLoading } = useListingOptions()
  const latRef = useRef<HTMLInputElement>(null)
  const lngRef = useRef<HTMLInputElement>(null)
  const cityRef = useRef<HTMLInputElement>(null)
  const stateRef = useRef<HTMLInputElement>(null)
  const zipRef = useRef<HTMLInputElement>(null)
  const neighborhoodRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleAddressSelect = (s: any) => {
    const addr = s.address || {}
    if (cityRef.current) cityRef.current.value = addr.city || addr.town || addr.village || ''
    if (stateRef.current) stateRef.current.value = addr.state || ''
    if (zipRef.current) zipRef.current.value = addr.postcode || ''
    if (neighborhoodRef.current)
      neighborhoodRef.current.value = addr.neighbourhood || addr.suburb || ''
    if (latRef.current) latRef.current.value = parseFloat(s.lat).toFixed(6)
    if (lngRef.current) lngRef.current.value = parseFloat(s.lon).toFixed(6)
    toast.success('Adresse sélectionnée — champs remplis automatiquement !')
  }

  const handleGeocode = async () => {
    if (!formRef.current) return
    const f = new FormData(formRef.current)
    const street = (f.get('location') as string) || ''
    const city = (f.get('city') as string) || ''
    const state = (f.get('state') as string) || ''
    const zip = (f.get('zip_code') as string) || ''

    const query = [street, city, state, zip].filter(Boolean).join(', ')
    if (!query.trim()) {
      toast.error("Entrez d'abord une adresse, une ville ou un état")
      return
    }

    setGeocoding(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        if (latRef.current) latRef.current.value = parseFloat(lat).toFixed(6)
        if (lngRef.current) lngRef.current.value = parseFloat(lon).toFixed(6)
        toast.success('Coordonnées trouvées et remplies !')
      } else {
        toast.error('Aucun résultat trouvé. Essayez une adresse plus précise.')
      }
    } catch {
      toast.error('Échec du géocodage. Veuillez réessayer.')
    } finally {
      setGeocoding(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const f = new FormData(e.currentTarget)
    const str = (name: string) => (f.get(name) as string) || ''
    const strOrNull = (name: string) => (f.get(name) as string) || null
    const num = (name: string) => Number(f.get(name)) || 0
    const numOrNull = (name: string) => {
      const v = f.get(name) as string
      return v ? Number(v) : null
    }

    await onSubmit({
      title: str('title'),
      description: str('description'),
      price: num('price'),
      beds: numOrNull('beds'),
      baths: numOrNull('baths'),
      sqft: numOrNull('sqft'),
      lot_size: numOrNull('lot_size'),
      city: str('city'),
      state: strOrNull('state'),
      zip_code: strOrNull('zip_code'),
      location: strOrNull('location'),
      neighborhood: strOrNull('neighborhood'),
      latitude: numOrNull('latitude'),
      longitude: numOrNull('longitude'),
      type: strOrNull('type'),
      property_style: strOrNull('property_style'),
      year_built: numOrNull('year_built'),
      parking: numOrNull('parking'),
      stories: numOrNull('stories'),
      heating: strOrNull('heating'),
      cooling: strOrNull('cooling'),
      flooring: strOrNull('flooring'),
      roof: strOrNull('roof'),
      hoa_fee: numOrNull('hoa_fee'),
      amenities: selectedAmenities,
      images,
    })
    setSubmitting(false)
  }

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="mt-6 mb-3 font-display text-lg font-semibold text-foreground border-b border-border pb-2">
      {children}
    </h3>
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-2">
      {/* Basic Info */}
      <SectionTitle>Informations de base</SectionTitle>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Titre *</label>
        <Input
          name="title"
          placeholder="ex. Villa de luxe moderne"
          defaultValue={initialData?.title}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Description *</label>
        <Textarea
          name="description"
          placeholder="Décrivez la propriété…"
          rows={4}
          defaultValue={initialData?.description}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Prix ($) *</label>
          <Input
            name="price"
            type="number"
            placeholder="500000"
            defaultValue={initialData?.price}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Type de propriété
          </label>
          <select
            name="type"
            defaultValue={initialData?.type || ''}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Sélectionner le type</option>
            {getByCategory('property_type').map((o) => (
              <option key={o.id} value={o.value}>
                {o.value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Style</label>
          <select
            name="property_style"
            defaultValue={initialData?.property_style || ''}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Sélectionner le style</option>
            {getByCategory('property_style').map((o) => (
              <option key={o.id} value={o.value}>
                {o.value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Specs */}
      <SectionTitle>Spécifications de la propriété</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Chambres</label>
          <Input name="beds" type="number" placeholder="3" defaultValue={initialData?.beds ?? ''} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Salles de bain</label>
          <Input
            name="baths"
            type="number"
            placeholder="2"
            defaultValue={initialData?.baths ?? ''}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Superficie (pi²)</label>
          <Input
            name="sqft"
            type="number"
            placeholder="2500"
            defaultValue={initialData?.sqft ?? ''}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Taille du terrain (pi²)
          </label>
          <Input
            name="lot_size"
            type="number"
            placeholder="5000"
            defaultValue={initialData?.lot_size ?? ''}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Année de construction
          </label>
          <Input
            name="year_built"
            type="number"
            placeholder="2020"
            defaultValue={initialData?.year_built ?? ''}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Places de parking
          </label>
          <Input
            name="parking"
            type="number"
            placeholder="2"
            defaultValue={initialData?.parking ?? ''}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Étages</label>
          <Input
            name="stories"
            type="number"
            placeholder="2"
            defaultValue={initialData?.stories ?? ''}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Frais de copropriété ($/mois)
          </label>
          <Input
            name="hoa_fee"
            type="number"
            placeholder="0"
            defaultValue={initialData?.hoa_fee ?? ''}
          />
        </div>
      </div>

      {/* Interior */}
      <SectionTitle>Intérieur & Extérieur</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Chauffage</label>
          <select
            name="heating"
            defaultValue={initialData?.heating || ''}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Sélectionner le chauffage</option>
            {getByCategory('heating').map((o) => (
              <option key={o.id} value={o.value}>
                {o.value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Climatisation</label>
          <select
            name="cooling"
            defaultValue={initialData?.cooling || ''}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Sélectionner la climatisation</option>
            {getByCategory('cooling').map((o) => (
              <option key={o.id} value={o.value}>
                {o.value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Revêtement de sol
          </label>
          <select
            name="flooring"
            defaultValue={initialData?.flooring || ''}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Sélectionner le sol</option>
            {getByCategory('flooring').map((o) => (
              <option key={o.id} value={o.value}>
                {o.value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Toit</label>
          <select
            name="roof"
            defaultValue={initialData?.roof || ''}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Sélectionner le type de toit</option>
            {getByCategory('roof').map((o) => (
              <option key={o.id} value={o.value}>
                {o.value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <SectionTitle>Emplacement</SectionTitle>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Adresse postale</label>
        <AddressAutocomplete
          name="location"
          placeholder="Commencez à taper une adresse…"
          defaultValue={initialData?.location ?? ''}
          onSelect={handleAddressSelect}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Ville *</label>
          <Input
            ref={cityRef}
            name="city"
            placeholder="Los Angeles"
            defaultValue={initialData?.city}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">État</label>
          <Input
            ref={stateRef}
            name="state"
            placeholder="CA"
            defaultValue={initialData?.state ?? ''}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Code postal</label>
          <Input
            ref={zipRef}
            name="zip_code"
            placeholder="90210"
            defaultValue={initialData?.zip_code ?? ''}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Quartier</label>
          <Input
            ref={neighborhoodRef}
            name="neighborhood"
            placeholder="ex. Centre-ville"
            defaultValue={initialData?.neighborhood ?? ''}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Latitude</label>
          <Input
            ref={latRef}
            name="latitude"
            type="number"
            step="any"
            placeholder="34.0522"
            defaultValue={initialData?.latitude ?? ''}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Longitude</label>
          <Input
            ref={lngRef}
            name="longitude"
            type="number"
            step="any"
            placeholder="-118.2437"
            defaultValue={initialData?.longitude ?? ''}
          />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGeocode}
        disabled={geocoding}
        className="mt-1">
        {geocoding ? (
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="mr-1 h-4 w-4" />
        )}
        {geocoding
          ? 'Recherche de coordonnées…'
          : "Remplissage automatique des coordonnées à partir de l'adresse"}
      </Button>

      {/* Amenities */}
      <SectionTitle>Équipements & Caractéristiques</SectionTitle>
      <div className="flex flex-wrap gap-3">
        {getByCategory('amenity').map((o) => (
          <label
            key={o.id}
            className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <Checkbox
              checked={selectedAmenities.includes(o.value)}
              onCheckedChange={(checked) => {
                setSelectedAmenities((prev) =>
                  checked ? [...prev, o.value] : prev.filter((a) => a !== o.value)
                )
              }}
            />
            {o.value}
          </label>
        ))}
        {getByCategory('amenity').length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Aucun équipement configuré pour le moment
          </p>
        )}
      </div>

      {/* Images */}
      <SectionTitle>Photos</SectionTitle>
      <ImageUpload userId={userId} images={images} onImagesChange={setImages} maxImages={10} />

      <div className="pt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="gradient-caramel text-accent-foreground hover:opacity-90">
          {submitting ? 'Enregistrement…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
