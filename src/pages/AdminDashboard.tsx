import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import { toast } from 'sonner';

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.1 };

type Tab = 'guests' | 'rsvp' | 'wishes' | 'photos' | 'wedding' | 'map' | 'bank' | 'contacts';

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('guests');
  const data = useWeddingData();
  const [newGuest, setNewGuest] = useState('');
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  const baseUrl = window.location.origin;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'wedding2025') {
      setAuthed(true);
    } else {
      toast.error('Incorrect password');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          className="bg-card rounded-2xl p-8 shadow-surface border border-border w-full max-w-sm text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={spring}
        >
          <div className="text-4xl mb-4">💍</div>
          <h1 className="font-display text-2xl font-semibold text-foreground mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full min-h-[48px] rounded-xl border border-border bg-background px-4 text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <motion.button
              type="submit"
              className="w-full bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 font-display shadow-surface"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Login
            </motion.button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">Demo: wedding2025</p>
        </motion.div>
      </div>
    );
  }

  const addGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest.trim()) return;
    data.addGuest(newGuest.trim());
    setNewGuest('');
    toast.success('Guest added!');
  };

  const exportCSV = () => {
    const header = 'Name,RSVP Status,Number of Guests\n';
    const rows = data.guests.map(g => `${g.name},${g.rsvpStatus},${g.numberOfGuests}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest_list.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadQR = (guestName: string) => {
    const svg = document.getElementById(`qr-${guestName}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement('a');
      a.download = `invitation-${guestName}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'guests', label: '👥 Guests' },
    { key: 'rsvp', label: '📋 RSVP' },
    { key: 'wishes', label: '💌 Wishes' },
    { key: 'photos', label: '📸 Photos' },
    { key: 'wedding', label: '💍 Wedding Info' },
    { key: 'map', label: '📍 Map' },
    { key: 'bank', label: '🏦 Bank/Gift' },
    { key: 'contacts', label: '📱 Contacts' },
  ];

  const inputClass = "w-full min-h-[48px] rounded-xl border border-border bg-background px-4 text-foreground focus:ring-2 focus:ring-ring";
  const labelClass = "text-sm text-muted-foreground block mb-1";
  const sectionCard = "bg-card rounded-2xl p-6 shadow-surface border border-border space-y-5";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-foreground">💍 Wedding Admin</h1>
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm text-accent hover:underline">← View Site</a>
          <button onClick={() => setAuthed(false)} className="text-sm text-muted-foreground hover:text-foreground">
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card px-6 flex gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              tab === t.key ? 'border-accent text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main className="max-w-4xl mx-auto p-6">
        {/* GUESTS TAB */}
        {tab === 'guests' && (
          <div className="space-y-6">
            <form onSubmit={addGuest} className="flex gap-3">
              <input
                type="text"
                value={newGuest}
                onChange={e => setNewGuest(e.target.value)}
                placeholder="Guest name..."
                maxLength={100}
                className={`flex-1 ${inputClass}`}
              />
              <motion.button
                type="submit"
                className="bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 font-display shadow-surface"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                + Add
              </motion.button>
            </form>

            <div className="flex justify-end">
              <button onClick={exportCSV} className="text-sm text-accent-foreground bg-accent/20 rounded-full px-4 py-2 hover:bg-accent/30">
                📥 Export CSV
              </button>
            </div>

            <div className="bg-card rounded-2xl shadow-surface border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Link</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.guests.map(g => (
                    <tr key={g.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium text-foreground">{g.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          g.rsvpStatus === 'attending' ? 'bg-green-100 text-green-800' :
                          g.rsvpStatus === 'not_attending' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {g.rsvpStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${baseUrl}/?guest=${encodeURIComponent(g.name)}`);
                            toast.success('Link copied!');
                          }}
                          className="text-accent hover:underline text-xs"
                        >
                          Copy link
                        </button>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => setSelectedQR(selectedQR === g.name ? null : g.name)}
                          className="text-xs bg-primary/30 rounded-full px-3 py-1 hover:bg-primary/50"
                        >
                          QR
                        </button>
                        <button
                          onClick={() => data.removeGuest(g.id)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* QR Modal */}
            {selectedQR && (
              <motion.div
                className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedQR(null)}
              >
                <motion.div
                  className="bg-card rounded-2xl p-8 shadow-surface border border-border text-center max-w-sm w-full"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={e => e.stopPropagation()}
                >
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    Invitation for {selectedQR}
                  </h3>
                  <div className="flex justify-center mb-4">
                    <QRCodeSVG
                      id={`qr-${selectedQR}`}
                      value={`${baseUrl}/?guest=${encodeURIComponent(selectedQR)}`}
                      size={256}
                      fgColor="hsl(30, 10%, 30%)"
                      bgColor="transparent"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 break-all">
                    {baseUrl}/?guest={encodeURIComponent(selectedQR)}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <motion.button
                      onClick={() => downloadQR(selectedQR)}
                      className="bg-accent text-accent-foreground rounded-full px-4 py-2 text-sm shadow-surface"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      📥 Download
                    </motion.button>
                    <motion.button
                      onClick={() => setSelectedQR(null)}
                      className="bg-muted text-muted-foreground rounded-full px-4 py-2 text-sm"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}

        {/* RSVP TAB */}
        {tab === 'rsvp' && (
          <div className="bg-card rounded-2xl shadow-surface border border-border overflow-hidden">
            <div className="p-4 bg-muted flex justify-between items-center">
              <span className="font-medium text-foreground">RSVP Responses</span>
              <span className="text-sm text-muted-foreground">
                {data.guests.filter(g => g.rsvpStatus === 'attending').length} attending / {data.guests.length} total
              </span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground"># Guests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.guests.map(g => (
                  <tr key={g.id}>
                    <td className="px-4 py-3 text-foreground">{g.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                        g.rsvpStatus === 'attending' ? 'bg-green-100 text-green-800' :
                        g.rsvpStatus === 'not_attending' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {g.rsvpStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{g.numberOfGuests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* WISHES TAB */}
        {tab === 'wishes' && (
          <div className="space-y-4">
            {data.wishes.length === 0 && <p className="text-muted-foreground text-center py-8">No wishes yet.</p>}
            {data.wishes.map(w => (
              <div key={w.id} className="bg-card rounded-2xl p-5 shadow-surface border border-border">
                <p className="text-foreground mb-2">{w.message}</p>
                <p className="text-sm text-muted-foreground">— {w.guestName} · {new Date(w.timestamp).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* PHOTOS TAB */}
        {tab === 'photos' && (
          <div className="space-y-6">
            <div className={sectionCard}>
              <h3 className="font-display text-lg font-semibold text-foreground">📸 Manage Photos</h3>
              <p className="text-sm text-muted-foreground">Add photo URLs to display in the gallery. Photos appear on the invitation page.</p>
              <form onSubmit={e => {
                e.preventDefault();
                const input = (e.target as HTMLFormElement).elements.namedItem('url') as HTMLInputElement;
                if (input.value.trim()) {
                  data.addPhoto(input.value.trim());
                  input.value = '';
                  toast.success('Photo added!');
                }
              }} className="flex gap-3">
                <input
                  name="url"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className={`flex-1 ${inputClass}`}
                />
                <motion.button
                  type="submit"
                  className="bg-accent text-accent-foreground rounded-full px-6 min-h-[48px] shadow-surface"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  + Add
                </motion.button>
              </form>
            </div>
            {data.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.photos.map((p, i) => (
                  <div key={i} className="relative group rounded-2xl overflow-hidden shadow-surface border border-border">
                    <img src={p} alt="" className="w-full h-40 object-cover" />
                    <button
                      onClick={() => { data.removePhoto(p); toast.success('Photo removed'); }}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-7 h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            {data.photos.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No photos yet. Default placeholder photos will be shown.</p>
            )}
          </div>
        )}

        {/* WEDDING INFO TAB */}
        {tab === 'wedding' && (
          <div className={sectionCard}>
            <h3 className="font-display text-lg font-semibold text-foreground">💍 Wedding Details</h3>
            <p className="text-sm text-muted-foreground">Edit couple names, date, time, venue, and calendar link.</p>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.target as HTMLFormElement);
              data.updateSettings({
                coupleNames: fd.get('coupleNames') as string,
                coupleNamesKm: fd.get('coupleNamesKm') as string,
                weddingDate: fd.get('weddingDate') as string,
                weddingDateKm: fd.get('weddingDateKm') as string,
                weddingTime: fd.get('weddingTime') as string,
                weddingTimeKm: fd.get('weddingTimeKm') as string,
                venueName: fd.get('venueName') as string,
                venueNameKm: fd.get('venueNameKm') as string,
                weddingDateTime: fd.get('weddingDateTime') as string,
                calendarUrl: fd.get('calendarUrl') as string,
              });
              toast.success('Wedding info saved!');
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Couple Names (EN)</label>
                  <input name="coupleNames" defaultValue={data.settings.coupleNames} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Couple Names (KM)</label>
                  <input name="coupleNamesKm" defaultValue={data.settings.coupleNamesKm} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Wedding Date (EN)</label>
                  <input name="weddingDate" defaultValue={data.settings.weddingDate} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Wedding Date (KM)</label>
                  <input name="weddingDateKm" defaultValue={data.settings.weddingDateKm} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Time (EN)</label>
                  <input name="weddingTime" defaultValue={data.settings.weddingTime} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Time (KM)</label>
                  <input name="weddingTimeKm" defaultValue={data.settings.weddingTimeKm} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Venue (EN)</label>
                  <input name="venueName" defaultValue={data.settings.venueName} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Venue (KM)</label>
                  <input name="venueNameKm" defaultValue={data.settings.venueNameKm} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Wedding Date/Time (for countdown, ISO format)</label>
                <input name="weddingDateTime" type="datetime-local" defaultValue={data.settings.weddingDateTime.slice(0, 16)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Google Calendar URL</label>
                <input name="calendarUrl" defaultValue={data.settings.calendarUrl} className={inputClass} />
              </div>
              <motion.button
                type="submit"
                className="bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 shadow-surface"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                💾 Save Wedding Info
              </motion.button>
            </form>
          </div>
        )}

        {/* MAP TAB */}
        {tab === 'map' && (
          <div className={sectionCard}>
            <h3 className="font-display text-lg font-semibold text-foreground">📍 Map & Location</h3>
            <p className="text-sm text-muted-foreground">Set the Google Maps embed URL and coordinates for the "Open in Maps" button.</p>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.target as HTMLFormElement);
              data.updateSettings({
                mapLat: fd.get('mapLat') as string,
                mapLng: fd.get('mapLng') as string,
                mapEmbedUrl: fd.get('mapEmbedUrl') as string,
              });
              toast.success('Map settings saved!');
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Latitude</label>
                  <input name="mapLat" defaultValue={data.settings.mapLat} className={inputClass} placeholder="11.5564" />
                </div>
                <div>
                  <label className={labelClass}>Longitude</label>
                  <input name="mapLng" defaultValue={data.settings.mapLng} className={inputClass} placeholder="104.9282" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Google Maps Embed URL</label>
                <textarea
                  name="mapEmbedUrl"
                  defaultValue={data.settings.mapEmbedUrl}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground text-sm focus:ring-2 focus:ring-ring"
                  placeholder="Paste the src URL from Google Maps embed code..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Go to Google Maps → Share → Embed → Copy the src="..." URL
                </p>
              </div>
              {/* Preview */}
              {data.settings.mapEmbedUrl && (
                <div className="rounded-xl overflow-hidden border border-border">
                  <iframe
                    src={data.settings.mapEmbedUrl}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Map preview"
                  />
                </div>
              )}
              <motion.button
                type="submit"
                className="bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 shadow-surface"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                💾 Save Map Settings
              </motion.button>
            </form>
          </div>
        )}

        {/* BANK/GIFT TAB */}
        {tab === 'bank' && (
          <div className={sectionCard}>
            <h3 className="font-display text-lg font-semibold text-foreground">🏦 Bank & Gift Settings</h3>
            <p className="text-sm text-muted-foreground">Set bank name, account number, and upload QR code image.</p>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.target as HTMLFormElement);
              data.setBankInfo(
                fd.get('bankName') as string,
                fd.get('bankAccount') as string,
                fd.get('bankQR') as string,
              );
              toast.success('Bank info saved!');
            }} className="space-y-4">
              <div>
                <label className={labelClass}>Bank Name</label>
                <input name="bankName" defaultValue={data.bankName} className={inputClass} placeholder="ABA Bank" />
              </div>
              <div>
                <label className={labelClass}>Account Number</label>
                <input name="bankAccount" defaultValue={data.bankAccount} className={inputClass} placeholder="001 234 567" />
              </div>
              <div>
                <label className={labelClass}>Bank QR Code Image URL</label>
                <input name="bankQR" defaultValue={data.bankQR} type="url" className={inputClass} placeholder="https://example.com/qr.png" />
                <p className="text-xs text-muted-foreground mt-1">Upload your bank QR image to any image host and paste the URL here.</p>
              </div>
              {/* QR Preview */}
              {data.bankQR && (
                <div className="flex justify-center">
                  <img src={data.bankQR} alt="Bank QR" className="w-48 h-48 object-contain rounded-xl border border-border" />
                </div>
              )}
              <motion.button
                type="submit"
                className="bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 shadow-surface"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                💾 Save Bank Info
              </motion.button>
            </form>
          </div>
        )}

        {/* CONTACTS TAB */}
        {tab === 'contacts' && (
          <div className={sectionCard}>
            <h3 className="font-display text-lg font-semibold text-foreground">📱 Contact Links</h3>
            <p className="text-sm text-muted-foreground">Set the contact links displayed on the invitation page.</p>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.target as HTMLFormElement);
              data.updateSettings({
                contactTelegram: fd.get('contactTelegram') as string,
                contactPhone: fd.get('contactPhone') as string,
                contactFacebook: fd.get('contactFacebook') as string,
                contactEmail: fd.get('contactEmail') as string,
              });
              toast.success('Contact info saved!');
            }} className="space-y-4">
              <div>
                <label className={labelClass}>📱 Telegram URL</label>
                <input name="contactTelegram" defaultValue={data.settings.contactTelegram} className={inputClass} placeholder="https://t.me/username" />
              </div>
              <div>
                <label className={labelClass}>📞 Phone Number</label>
                <input name="contactPhone" defaultValue={data.settings.contactPhone} className={inputClass} placeholder="+85512345678" />
              </div>
              <div>
                <label className={labelClass}>📘 Facebook URL</label>
                <input name="contactFacebook" defaultValue={data.settings.contactFacebook} className={inputClass} placeholder="https://facebook.com/username" />
              </div>
              <div>
                <label className={labelClass}>✉️ Email</label>
                <input name="contactEmail" defaultValue={data.settings.contactEmail} className={inputClass} placeholder="wedding@example.com" />
              </div>
              <motion.button
                type="submit"
                className="bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 shadow-surface"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                💾 Save Contacts
              </motion.button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
