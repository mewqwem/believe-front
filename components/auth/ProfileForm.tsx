'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { AccountUser } from '@/lib/auth/session';
import { useI18n } from '@/components/I18nProvider';

async function preparePhoto(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('photo');
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 192;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('canvas');
    context.fillStyle = '#16382c';
    context.fillRect(0, 0, 192, 192);
    const side = Math.min(bitmap.width, bitmap.height);
    context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 192, 192);
    const photo = canvas.toDataURL('image/jpeg', 0.8);
    if (photo.length > 65536) throw new Error('size');
    return photo;
  } finally { bitmap.close(); }
}

export function ProfileForm({ user }: { user: AccountUser }) {
  const { t } = useI18n();
  const router = useRouter();
  const [saved, setSaved] = useState(user);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [pending, setPending] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const changed = name.trim() !== saved.name || avatar !== saved.avatar;
  return <form onSubmit={async (event) => {
    event.preventDefault();
    setError(''); setSuccess(false);
    if (name.trim().length < 2 || name.trim().length > 32) { setError('profile.nameError'); return; }
    setPending(true);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), avatar }),
      });
      if (!response.ok) { setError(response.status === 401 ? 'profile.signIn' : 'profile.error'); return; }
      const data: { user: AccountUser } = await response.json();
      setSaved(data.user); setName(data.user.name); setAvatar(data.user.avatar); setSuccess(true);
      router.refresh();
    } catch { setError('account.connectionError'); }
    finally { setPending(false); }
  }}>
    <h1 className="mb-6 font-display text-2xl text-gold">{t('profile.title')}</h1>
    <fieldset disabled={pending || processing} className="space-y-5 disabled:opacity-70">
      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold/15 text-3xl text-gold">
          {avatar && failedAvatar !== avatar ? <Image src={avatar} alt="" width={80} height={80} unoptimized onError={() => setFailedAvatar(avatar)} className="size-20 object-cover" /> : Array.from(name.trim())[0]?.toUpperCase()}
        </div>
        <div className="min-w-0"><p className="break-words font-display text-xl text-gold">{saved.name}</p><p className="break-all text-sm text-ivory/70">{user.email}</p></div>
      </div>
      <div>
        <label htmlFor="profile-photo" className="mb-2 block text-sm text-ivory">{t('profile.upload')}</label>
        <input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="photo-hint" className="w-full min-w-0 text-sm text-ivory/70 file:mr-3 file:rounded-lg file:border-0 file:bg-gold/15 file:px-3 file:py-2 file:text-gold" onChange={async (event) => {
          const file = event.currentTarget.files?.[0]; event.currentTarget.value = '';
          if (!file) return;
          setProcessing(true); setError(''); setSuccess(false);
          try { setAvatar(await preparePhoto(file)); setFailedAvatar(null); }
          catch { setError('profile.photoError'); }
          finally { setProcessing(false); }
        }} />
        <p id="photo-hint" className="mt-2 text-xs text-ivory/50">{t('profile.hint')}</p>
        {avatar && <button type="button" className="mt-2 text-sm text-gold underline" onClick={() => { setAvatar(null); setSuccess(false); setError(''); }}>{t('profile.remove')}</button>}
      </div>
      <div>
        <label htmlFor="profile-name" className="mb-2 block text-sm text-ivory">{t('auth.name')}</label>
        <input id="profile-name" autoComplete="nickname" required minLength={2} maxLength={32} value={name} onChange={(event) => { setName(event.target.value); setSuccess(false); setError(''); }} className="w-full rounded-xl border border-gold/30 bg-felt px-4 py-3 text-ivory outline-none focus:border-gold" />
      </div>
      <button disabled={!changed || pending || processing} type="submit" className="w-full rounded-xl bg-gold px-4 py-3 font-semibold text-ink disabled:opacity-50">{t(pending ? 'profile.saving' : 'profile.save')}</button>
    </fieldset>
    <div aria-live="polite" className="mt-3 text-sm text-gold">{processing ? t('profile.processing') : success ? t('profile.saved') : ''}</div>
    {error && <p role="alert" className="mt-3 text-sm text-red-300">{t(error)}</p>}
  </form>;
}
