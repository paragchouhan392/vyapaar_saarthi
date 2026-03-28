import { useState, useEffect } from "react";
import { getOrgProfile, createOrgProfile, updateOrgProfile } from "../services/orgService";

const panelStyle = { background: "rgba(0,40,30,0.45)", backdropFilter: "blur(12px)" };
const inputCls   = "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm";

const EMPTY = { companyName: "", industry: "", companySize: "", location: "", description: "" };

const OrgProfile = () => {
  const [profile, setProfile]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [editing, setEditing]   = useState(false);
  const [isNew, setIsNew]       = useState(false);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getOrgProfile();
        setProfile(res.data.data);
        setForm(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) setIsNew(true);
        else setError("Failed to load profile.");
      } finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      let res;
      if (isNew) {
        res = await createOrgProfile(form);
        setIsNew(false);
      } else {
        res = await updateOrgProfile(form);
      }
      setProfile(res.data.data);
      setForm(res.data.data);
      setEditing(false);
      setSuccess("Organisation profile saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="p-7 flex items-center justify-center h-64">
      <p className="text-green-200/50 text-sm">Loading profile…</p>
    </div>
  );

  const companySizes = ["", "1-10", "11-50", "51-200", "200+"];

  return (
    <div className="p-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Organisation Profile</h2>
          <p className="text-green-200/60 text-sm mt-1">Manage your company information</p>
        </div>
        {!isNew && !editing && (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-white text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      {error   && <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-teal-500/20 border border-teal-400 text-teal-300 px-4 py-3 rounded-xl text-sm">{success}</div>}

      {/* Display Mode */}
      {!isNew && !editing && profile && (
        <div className="space-y-4">
          {/* Company Card */}
          <div className="rounded-xl p-6 border border-white/10 shadow-lg" style={panelStyle}>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-teal-300">
                  {profile.companyName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-white text-xl font-bold">{profile.companyName}</h3>
                {profile.industry && <p className="text-green-200/60 text-sm mt-0.5">{profile.industry}</p>}
                {profile.description && (
                  <p className="text-green-100/70 text-sm mt-3 leading-relaxed">{profile.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Industry",     value: profile.industry    || "—" },
              { label: "Company Size", value: profile.companySize || "—" },
              { label: "Location",     value: profile.location    || "—" },
            ].map(f => (
              <div key={f.label} className="rounded-xl p-5 border border-white/10" style={panelStyle}>
                <p className="text-green-200/50 text-xs mb-1">{f.label}</p>
                <p className="text-white font-medium text-sm">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit / Create Form */}
      {(editing || isNew) && (
        <div className="rounded-xl p-6 border border-teal-400/20 shadow-lg" style={panelStyle}>
          <h3 className="text-white font-semibold mb-5">
            {isNew ? "Create Your Organisation Profile" : "Edit Profile"}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-green-200/70">Company Name *</label>
                <input className={inputCls} placeholder="Acme Pvt Ltd"
                  value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-green-200/70">Industry</label>
                <input className={inputCls} placeholder="e.g. FinTech, Retail, Manufacturing"
                  value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-green-200/70">Company Size</label>
                <select className={inputCls} value={form.companySize} onChange={e => setForm({...form, companySize: e.target.value})}>
                  {companySizes.map(s => <option key={s} value={s}>{s || "Select size"}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-green-200/70">Location</label>
                <input className={inputCls} placeholder="e.g. Mumbai, India"
                  value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-green-200/70">Company Description</label>
              <textarea className={`${inputCls} resize-none`} rows={4}
                placeholder="Brief description of what your company does…"
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving}
                className="bg-white text-black font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-all disabled:opacity-60">
                {saving ? "Saving…" : isNew ? "Create Profile" : "Save Changes"}
              </button>
              {!isNew && (
                <button type="button" onClick={() => { setEditing(false); setForm(profile); }}
                  className="px-6 py-2.5 rounded-lg text-sm border border-white/20 text-white/70 hover:bg-white/10 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrgProfile;
