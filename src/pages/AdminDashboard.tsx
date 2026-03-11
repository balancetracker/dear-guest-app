import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useWeddingData, Guest } from '@/contexts/WeddingDataContext';
import { toast } from 'sonner';

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.1 };

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'guests' | 'rsvp' | 'wishes' | 'photos' | 'settings'>('guests');
  const data = useWeddingData();
  const [newGuest, setNewGuest] = useState('');
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  const baseUrl = window.location.origin;

  // Simple auth (demo only)
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

  const tabs = [
    { key: 'guests' as const, label: '👥 Guests', },
    { key: 'rsvp' as const, label: '📋 RSVP', },
    { key: 'wishes' as const, label: '💌 Wishes', },
    { key: 'photos' as const, label: '📸 Photos', },
    { key: 'settings' as const, label: '⚙️ Settings', },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-foreground">💍 Wedding Admin</h1>
        <button onClick={() => setAuthed(false)} className="text-sm text-muted-foreground hover:text-foreground">
          Logout
        </button>
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
                className="flex-1 min-h-[48px] rounded-xl border border-border bg-card px-4 text-foreground focus:ring-2 focus:ring-ring"
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
            <div className="bg-card rounded-2xl p-6 shadow-surface border border-border text-center">
              <p className="text-muted-foreground mb-4">Add photo URL</p>
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
                  placeholder="https://..."
                  className="flex-1 min-h-[48px] rounded-xl border border-border bg-background px-4 text-foreground focus:ring-2 focus:ring-ring"
                />
                <motion.button
                  type="submit"
                  className="bg-accent text-accent-foreground rounded-full px-6 min-h-[48px] shadow-surface"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Add
                </motion.button>
              </form>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.photos.map((p, i) => (
                <div key={i} className="relative group rounded-2xl overflow-hidden shadow-surface border border-border">
                  <img src={p} alt="" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => { data.removePhoto(p); toast.success('Photo removed'); }}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div className="bg-card rounded-2xl p-6 shadow-surface border border-border space-y-6">
            <h3 className="font-display text-lg font-semibold text-foreground">Bank / Gift Settings</h3>
            <form onSubmit={e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const name = (form.elements.namedItem('bankName') as HTMLInputElement).value;
              const account = (form.elements.namedItem('bankAccount') as HTMLInputElement).value;
              data.setBankInfo(name, account, '');
              toast.success('Bank info updated!');
            }} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Bank Name</label>
                <input name="bankName" defaultValue={data.bankName} className="w-full min-h-[48px] rounded-xl border border-border bg-background px-4 text-foreground focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Account Number</label>
                <input name="bankAccount" defaultValue={data.bankAccount} className="w-full min-h-[48px] rounded-xl border border-border bg-background px-4 text-foreground focus:ring-2 focus:ring-ring" />
              </div>
              <motion.button
                type="submit"
                className="bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 shadow-surface"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Save Settings
              </motion.button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
