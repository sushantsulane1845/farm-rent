import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ImagePlus, Trash2, AlertCircle } from 'lucide-react';
import { Equipment, EquipmentCategory, PriceUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_IMAGES, MAHARASHTRA_HUBS } from '../data/locations';
import { apiFetch } from '../lib/api';
import { CascadingMaharashtraPicker, LocationAutocompleteInput } from './LocationSearchSelect';
import { SelectableImageFrame } from './SelectableImageFrame';

interface AddEquipmentPageProps {
  editingEquipment: Equipment | null;
  onBack: () => void;
  onSuccess: () => Promise<void>;
  onOpenAuth: () => void;
}

const ALL_CATEGORIES: EquipmentCategory[] = [
  'tractor',
  'rotavator',
  'harvester',
  'cultivator',
  'seed_drill',
  'sprayer',
  'thresher',
  'trailer',
  'plough',
  'jcb',
  'transport',
  'other',
];

export function AddEquipmentPage({
  editingEquipment,
  onBack,
  onSuccess,
  onOpenAuth,
}: AddEquipmentPageProps) {
  const { t } = useLanguage();
  const { user, refreshUser } = useAuth();

  const [category, setCategory] = useState<EquipmentCategory>(editingEquipment?.category || 'tractor');
  const [title, setTitle] = useState(editingEquipment?.title || '');
  const [brand, setBrand] = useState(editingEquipment?.brand || '');
  const [model, setModel] = useState(editingEquipment?.model || '');
  const [description, setDescription] = useState(editingEquipment?.description || '');
  const [price, setPrice] = useState(editingEquipment ? String(editingEquipment.price) : '750');
  const [priceUnit, setPriceUnit] = useState<PriceUnit>(editingEquipment?.priceUnit || 'hour');
  const [deliveryCharge, setDeliveryCharge] = useState(
    editingEquipment ? String(editingEquipment.deliveryCharge) : '0'
  );
  const [operatorIncluded, setOperatorIncluded] = useState(
    editingEquipment?.operatorIncluded ?? true
  );
  const [operatorCharge, setOperatorCharge] = useState(
    editingEquipment ? String(editingEquipment.operatorCharge) : '0'
  );

  const defaultHub = MAHARASHTRA_HUBS[0];
  const [village, setVillage] = useState(editingEquipment?.village || user?.village || defaultHub.village);
  const [taluka, setTaluka] = useState(editingEquipment?.taluka || user?.taluka || defaultHub.taluka);
  const [district, setDistrict] = useState(editingEquipment?.district || user?.district || defaultHub.district);
  const [stateName, setStateName] = useState(editingEquipment?.state || 'Maharashtra');
  const [lat, setLat] = useState(editingEquipment?.lat || user?.lat || defaultHub.lat);
  const [lng, setLng] = useState(editingEquipment?.lng || user?.lng || defaultHub.lng);
  const [locQueryLabel, setLocQueryLabel] = useState('');

  const [availableDatesText, setAvailableDatesText] = useState(
    editingEquipment?.availableDates.join(', ') ||
      [1, 2, 3, 5]
        .map((d) => {
          const dt = new Date();
          dt.setDate(dt.getDate() + d);
          return dt.toISOString().slice(0, 10);
        })
        .join(', ')
  );

  const [horsepower, setHorsepower] = useState(editingEquipment?.specs.horsepower || '');
  const [fuelType, setFuelType] = useState(editingEquipment?.specs.fuelType || 'Diesel');
  const [workingWidth, setWorkingWidth] = useState(editingEquipment?.specs.workingWidth || '');
  const [year, setYear] = useState(editingEquipment?.specs.year || '2023');
  const [rentalConditions, setRentalConditions] = useState(editingEquipment?.rentalConditions || '');
  const [contactPhone, setContactPhone] = useState(
    editingEquipment?.contactPhone || user?.phone || ''
  );

  const [images, setImages] = useState<string[]>(
    editingEquipment?.images.length ? editingEquipment.images : [CATEGORY_IMAGES.tractor]
  );
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#1C241E]">{t.owner.addEquipment}</h1>
        <p className="text-sm text-[#4B554D]">{t.owner.enableOwnerDesc}</p>
        <button
          type="button"
          onClick={onOpenAuth}
          className="min-h-[46px] px-6 py-3 rounded-xl bg-[#14532D] text-white text-sm font-semibold cursor-pointer"
        >
          {t.nav.signIn}
        </button>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Only image files (JPG, PNG, WebP) are allowed.');
        continue;
      }
      if (file.size > 1.5 * 1024 * 1024) {
        setErrorMsg('Each image must be smaller than 1.5 MB.');
        continue;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev.slice(0, 5), reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoUrl = () => {
    const trimmed = photoUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
      setErrorMsg('Photo URL must start with https:// or /');
      return;
    }
    setImages((prev) => [...prev.slice(0, 5), trimmed]);
    setPhotoUrlInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const numPrice = Number(price);
    if (!title.trim() || title.trim().length < 3) {
      setErrorMsg('Please enter an equipment name (min 3 characters).');
      return;
    }
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      setErrorMsg('Please enter a valid rental price greater than 0.');
      return;
    }
    if (!village.trim() || !taluka.trim() || !district.trim()) {
      setErrorMsg('Village, Taluka, and District are required.');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Please add at least one equipment image.');
      return;
    }

    const parsedDates = availableDatesText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s));

    const payload = {
      category,
      title: title.trim(),
      brand: brand.trim(),
      model: model.trim(),
      description: description.trim(),
      images,
      price: numPrice,
      priceUnit,
      deliveryCharge: Math.max(0, Number(deliveryCharge || 0)),
      operatorIncluded,
      operatorCharge: operatorIncluded ? Math.max(0, Number(operatorCharge || 0)) : 0,
      village: village.trim(),
      taluka: taluka.trim(),
      district: district.trim(),
      state: stateName.trim() || 'Maharashtra',
      lat,
      lng,
      availableDates: parsedDates,
      specs: {
        horsepower: horsepower.trim(),
        fuelType: fuelType.trim(),
        workingWidth: workingWidth.trim(),
        year: year.trim(),
      },
      rentalConditions: rentalConditions.trim(),
      contactPhone: contactPhone.trim(),
    };

    setSubmitting(true);
    try {
      if (editingEquipment) {
        await apiFetch(`/api/equipment/${editingEquipment.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/api/equipment', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      await refreshUser();
      await onSuccess();
      setSuccessMsg(t.form.successPublished);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not save equipment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12 space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#14532D] hover:underline min-h-[40px] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.common.back}</span>
      </button>

      <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 sm:p-8 space-y-6">
        <h1 className="text-2xl font-bold text-[#1C241E]">
          {editingEquipment ? t.owner.editEquipment : t.owner.addEquipment}
        </h1>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-sm text-[#14532D] font-semibold flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {successMsg}
            </span>
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-1.5 rounded-lg bg-[#14532D] text-white text-xs cursor-pointer"
            >
              {t.nav.ownerHub}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.category} *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const nextCat = e.target.value as EquipmentCategory;
                  setCategory(nextCat);
                  if (!editingEquipment && images.length === 1 && Object.values(CATEGORY_IMAGES).includes(images[0])) {
                    setImages([CATEGORY_IMAGES[nextCat]]);
                  }
                }}
                className="w-full min-h-[44px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t.categories[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.title} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.form.titlePlaceholder}
                className="w-full min-h-[44px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.brand}
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Mahindra / John Deere / Sonalika"
                className="w-full min-h-[44px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.model}
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="575 DI / 605 Novo"
                className="w-full min-h-[44px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374139] mb-1">
              {t.form.description}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
            />
          </div>

          {/* Pricing & Charges */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-[#EDF2EA]">
            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.price} *
              </label>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.priceUnit} *
              </label>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}
                className="w-full min-h-[44px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              >
                <option value="hour">{t.units.hour}</option>
                <option value="day">{t.units.day}</option>
                <option value="acre">{t.units.acre}</option>
                <option value="trip">{t.units.trip}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.deliveryCharge}
              </label>
              <input
                type="number"
                min="0"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.operatorCharge}
              </label>
              <input
                type="number"
                min="0"
                disabled={!operatorIncluded}
                value={operatorCharge}
                onChange={(e) => setOperatorCharge(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm tabular-nums disabled:opacity-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm font-medium text-[#1C241E] cursor-pointer">
            <input
              type="checkbox"
              checked={operatorIncluded}
              onChange={(e) => setOperatorIncluded(e.target.checked)}
              className="w-4 h-4 accent-[#14532D]"
            />
            <span>{t.form.operatorAvailable}</span>
          </label>

          {/* Location across all 36 Maharashtra Districts, 358 Talukas & Villages */}
          <div className="pt-4 border-t border-[#EDF2EA] space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.hubPreset}
              </label>
              <LocationAutocompleteInput
                valueLabel={locQueryLabel}
                placeholder={t.marketplace.searchLocationPlaceholder}
                onSelectLocation={(loc) => {
                  const display = [loc.village, loc.taluka, loc.district].filter(Boolean).join(', ');
                  setLocQueryLabel(display);
                  setDistrict(loc.district);
                  if (loc.taluka) setTaluka(loc.taluka);
                  if (loc.village) setVillage(loc.village);
                  setStateName('Maharashtra');
                  setLat(loc.lat);
                  setLng(loc.lng);
                }}
                onClear={() => setLocQueryLabel('')}
              />
            </div>

            <CascadingMaharashtraPicker
              allowAll={false}
              allowCustomVillage
              district={district}
              taluka={taluka}
              village={village}
              onChange={(next) => {
                setDistrict(next.district);
                setTaluka(next.taluka);
                setVillage(next.village);
                setStateName('Maharashtra');
                setLat(next.lat);
                setLng(next.lng);
              }}
            />
          </div>

          {/* Specs, Dates, Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EDF2EA]">
            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.horsepower}
              </label>
              <input
                type="text"
                value={horsepower}
                onChange={(e) => setHorsepower(e.target.value)}
                placeholder="50 HP"
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.workingWidth}
              </label>
              <input
                type="text"
                value={workingWidth}
                onChange={(e) => setWorkingWidth(e.target.value)}
                placeholder="6 Feet / 9 Tyne"
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.fuelType}
              </label>
              <input
                type="text"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.year}
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.availableDates}
              </label>
              <input
                type="text"
                value={availableDatesText}
                onChange={(e) => setAvailableDatesText(e.target.value)}
                placeholder="2026-11-26, 2026-11-27"
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.form.contactPhone}
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91..."
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374139] mb-1">
              {t.form.rentalConditions}
            </label>
            <input
              type="text"
              value={rentalConditions}
              onChange={(e) => setRentalConditions(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
            />
          </div>

          {/* Multi-Photo Upload & Gallery */}
          <div className="pt-4 border-t border-[#EDF2EA] space-y-3">
            <label className="block text-xs font-semibold text-[#374139]">{t.form.photos} *</label>

            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-28 h-20 shrink-0">
                  <SelectableImageFrame
                    selectionId={`add-eq-img-${i}`}
                    src={img}
                    alt={`Preview ${i + 1}`}
                    compact
                    className="w-28 h-20 rounded-xl border border-[#E2E8DF]"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImages((prev) => prev.filter((_, idx) => idx !== i));
                      }}
                      className="absolute top-1 left-1 z-20 w-6 h-6 rounded-full bg-black/75 text-white flex items-center justify-center cursor-pointer hover:bg-black transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              <label className="w-28 h-20 rounded-xl border-2 border-dashed border-[#C7D3C2] hover:border-[#14532D] flex flex-col items-center justify-center gap-1 text-xs font-semibold text-[#14532D] cursor-pointer">
                <ImagePlus className="w-5 h-5" />
                <span>{t.form.uploadPhoto}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder={t.form.addPhotoUrl}
                className="flex-1 min-h-[40px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-xs"
              />
              <button
                type="button"
                onClick={handleAddPhotoUrl}
                className="min-h-[40px] px-4 rounded-lg border border-[#14532D] text-[#14532D] text-xs font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[48px] rounded-xl bg-[#14532D] text-white font-bold text-base hover:bg-[#166534] disabled:opacity-60 cursor-pointer"
          >
            {submitting
              ? t.common.loading
              : editingEquipment
                ? t.form.updateEquipment
                : t.form.publishEquipment}
          </button>
        </form>
      </div>
    </div>
  );
}
