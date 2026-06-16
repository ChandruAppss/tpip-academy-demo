import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const BG     = '#0d1117'
const CARD   = '#161b22'
const CARD2  = '#1c2128'
const BORDER = '#21262d'
const LIME   = '#adff2f'
const PURPLE = '#8d59ff'
const TEXT   = '#e6edf3'
const MUTED  = 'rgba(230,237,243,0.4)'

function Label({ children, sub }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:MUTED }}>{children}</div>
      {sub && <div style={{ fontSize:12, color:'rgba(230,237,243,0.3)', marginTop:3 }}>{sub}</div>}
    </div>
  )
}

function SectionCard({ title, icon, children, accent = LIME }) {
  return (
    <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:'22px 24px', marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ width:36, height:36, borderRadius:9, background:`${accent}18`, border:`1px solid ${accent}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{icon}</div>
        <div style={{ fontSize:15, fontWeight:700, color:TEXT }}>{title}</div>
      </div>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', mono, disabled }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width:'100%', boxSizing:'border-box', background:BG, border:`1.5px solid ${BORDER}`,
        borderRadius:9, color:TEXT, fontSize: mono ? 12 : 13, padding:'10px 14px',
        fontFamily: mono ? 'monospace' : 'inherit', outline:'none', transition:'border-color 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
      onFocus={e => e.target.style.borderColor = LIME + '66'}
      onBlur={e => e.target.style.borderColor = BORDER}
    />
  )
}

function Badge({ children, color = LIME }) {
  return (
    <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:12, fontSize:11, fontWeight:700, background:`${color}18`, border:`1px solid ${color}40`, color }}>
      {children}
    </span>
  )
}

export default function AdminAISettings() {
  const [settings,     setSettings]     = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)

  // Local editable state
  const [provider,       setProvider]       = useState('anthropic')
  const [anthropicKey,   setAnthropicKey]   = useState('')
  const [openaiKey,      setOpenaiKey]      = useState('')
  const [modelAnthropic, setModelAnthropic] = useState('claude-3-5-haiku-20241022')
  const [modelOpenai,    setModelOpenai]    = useState('gpt-4o-mini')
  const [systemPrompt,   setSystemPrompt]   = useState('')
  const [packages,       setPackages]       = useState([])
  const [ytResources,    setYtResources]    = useState([])
  const [suggestedPkgs,  setSuggestedPkgs]  = useState([])

  // New YouTube resource form
  const [newYt, setNewYt] = useState({ title:'', url:'', category:'Batting', tags:'' })
  // New suggested package form
  const [newPkg, setNewPkg] = useState({ title:'', price_inr:'', highlight:'', cta_url:'' })

  useEffect(() => { loadSettings() }, [])

  async function loadSettings() {
    try {
      const res = await adminAPI.getAISettings()
      const s = res.data
      setSettings(s)
      setProvider(s.provider || 'anthropic')
      setAnthropicKey(s.has_anthropic_key ? '••••••••••••••••••••' : '')
      setOpenaiKey(s.has_openai_key ? '••••••••••••••••••••' : '')
      setModelAnthropic(s.model_anthropic || 'claude-3-5-haiku-20241022')
      setModelOpenai(s.model_openai || 'gpt-4o-mini')
      setSystemPrompt(s.system_prompt_prefix || '')
      setPackages(s.packages || [])
      setYtResources(s.youtube_resources || [])
      setSuggestedPkgs(s.suggested_packages || [])
    } catch { toast.error('Failed to load AI settings') }
    finally { setLoading(false) }
  }

  async function saveAll() {
    setSaving(true)
    try {
      const payload = {
        provider,
        model_anthropic: modelAnthropic,
        model_openai: modelOpenai,
        system_prompt_prefix: systemPrompt,
        packages,
        youtube_resources: ytResources,
        suggested_packages: suggestedPkgs,
      }
      // Only send keys if user typed a real value (not masked)
      if (anthropicKey && !anthropicKey.startsWith('•')) payload.anthropic_key = anthropicKey
      if (openaiKey    && !openaiKey.startsWith('•'))    payload.openai_key    = openaiKey
      await adminAPI.updateAISettings(payload)
      toast.success('AI settings saved!')
      loadSettings()
    } catch { toast.error('Failed to save settings') }
    finally { setSaving(false) }
  }

  function updatePackage(idx, field, val) {
    setPackages(prev => prev.map((p, i) => i === idx ? { ...p, [field]: field === 'daily_limit' ? parseInt(val) || 0 : val } : p))
  }

  function addYtResource() {
    if (!newYt.title || !newYt.url) return toast.error('Title and URL required')
    const r = { id:`yt${Date.now()}`, ...newYt, tags: newYt.tags.split(',').map(t => t.trim()).filter(Boolean) }
    setYtResources(prev => [...prev, r])
    setNewYt({ title:'', url:'', category:'Batting', tags:'' })
    toast.success('Resource added')
  }

  function removeYtResource(id) { setYtResources(prev => prev.filter(r => r.id !== id)) }

  function addSuggestedPkg() {
    if (!newPkg.title || !newPkg.price_inr) return toast.error('Title and price required')
    const p = { id:`sp${Date.now()}`, ...newPkg, price_inr: parseInt(newPkg.price_inr) }
    setSuggestedPkgs(prev => [...prev, p])
    setNewPkg({ title:'', price_inr:'', highlight:'', cta_url:'' })
    toast.success('Package added')
  }

  function removeSuggestedPkg(id) { setSuggestedPkgs(prev => prev.filter(p => p.id !== id)) }

  if (loading) return (
    <div style={{ padding:'40px', textAlign:'center', color:MUTED }}>Loading AI settings…</div>
  )

  const hasKey = (provider === 'anthropic' && settings?.has_anthropic_key) || (provider === 'openai' && settings?.has_openai_key)

  return (
    <div style={{ padding:'28px 32px', minHeight:'100%', background:BG, fontFamily:"'Inter',system-ui,sans-serif", color:TEXT }}>
      <style>{`
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(230,237,243,0.2) !important; }
        textarea:focus, input:focus { outline:none; }
        .tab-btn { transition: all 0.15s; }
        .tab-btn:hover { border-color: rgba(173,255,47,0.4) !important; }
        .remove-btn:hover { background: rgba(239,68,68,0.2) !important; color: #fca5a5 !important; }
        .remove-btn { transition: all 0.15s; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`${PURPLE}20`, border:`1px solid ${PURPLE}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🤖</div>
          <div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:TEXT }}>AI Settings</h1>
            <p style={{ margin:0, fontSize:12, color:MUTED, marginTop:2 }}>Configure AI provider, daily limits, YouTube content & suggested packages</p>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {hasKey
            ? <Badge color="#22c55e">✓ API Key Active</Badge>
            : <Badge color="#f97316">⚠ No API Key</Badge>
          }
          <button onClick={saveAll} disabled={saving} style={{
            background: saving ? CARD2 : `linear-gradient(135deg, ${LIME}, #84cc16)`,
            color: saving ? MUTED : '#000', border:'none', borderRadius:10,
            padding:'10px 24px', fontWeight:700, fontSize:13, cursor: saving ? 'not-allowed' : 'pointer',
          }}>
            {saving ? 'Saving…' : '💾 Save All Settings'}
          </button>
        </div>
      </div>

      {/* ── SECTION 1: API PROVIDER ── */}
      <SectionCard title="AI Provider & API Keys" icon="🔑" accent={LIME}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <div>
            <Label>Provider</Label>
            <div style={{ display:'flex', gap:10, marginBottom:20 }}>
              {['anthropic','openai'].map(p => (
                <button key={p} onClick={() => setProvider(p)} className="tab-btn" style={{
                  flex:1, padding:'12px', borderRadius:10, border:`1.5px solid ${provider===p ? LIME : BORDER}`,
                  background: provider===p ? `${LIME}10` : BG, color: provider===p ? LIME : MUTED,
                  fontWeight:600, fontSize:13, cursor:'pointer',
                }}>
                  {p === 'anthropic' ? '🟠 Anthropic (Claude)' : '🟢 OpenAI (GPT)'}
                  {provider===p && <span style={{ marginLeft:6, fontSize:10 }}>✓ Active</span>}
                </button>
              ))}
            </div>

            <Label sub="Starts with sk-ant-... — stored securely, never exposed to frontend">Anthropic API Key</Label>
            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
              <Input
                value={anthropicKey}
                onChange={e => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                type="password"
                mono
              />
              {settings?.has_anthropic_key && (
                <button onClick={() => setAnthropicKey('')} style={{ padding:'10px 14px', borderRadius:9, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', fontSize:12, cursor:'pointer', whiteSpace:'nowrap' }}>
                  Clear
                </button>
              )}
            </div>

            <Label sub="Starts with sk-... — for GPT-4o-mini / GPT-4o">OpenAI API Key</Label>
            <div style={{ display:'flex', gap:8 }}>
              <Input
                value={openaiKey}
                onChange={e => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                type="password"
                mono
              />
              {settings?.has_openai_key && (
                <button onClick={() => setOpenaiKey('')} style={{ padding:'10px 14px', borderRadius:9, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', fontSize:12, cursor:'pointer', whiteSpace:'nowrap' }}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <div>
            <Label>Anthropic Model</Label>
            <select value={modelAnthropic} onChange={e => setModelAnthropic(e.target.value)} style={{ width:'100%', background:BG, border:`1.5px solid ${BORDER}`, borderRadius:9, color:TEXT, fontSize:13, padding:'10px 14px', outline:'none', marginBottom:16 }}>
              <option value="claude-3-5-haiku-20241022">claude-3-5-haiku (Fast · Cheap)</option>
              <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet (Balanced)</option>
              <option value="claude-opus-4-5">claude-opus-4 (Best Quality)</option>
            </select>

            <Label>OpenAI Model</Label>
            <select value={modelOpenai} onChange={e => setModelOpenai(e.target.value)} style={{ width:'100%', background:BG, border:`1.5px solid ${BORDER}`, borderRadius:9, color:TEXT, fontSize:13, padding:'10px 14px', outline:'none', marginBottom:16 }}>
              <option value="gpt-4o-mini">gpt-4o-mini (Fast · Cheap)</option>
              <option value="gpt-4o">gpt-4o (Balanced)</option>
              <option value="gpt-4-turbo">gpt-4-turbo (Best Quality)</option>
            </select>

            <div style={{ background:`${LIME}08`, border:`1px solid ${LIME}20`, borderRadius:10, padding:'12px 14px' }}>
              <div style={{ fontSize:12, color:LIME, fontWeight:600, marginBottom:6 }}>💡 No API Key?</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>
                Without a key, students get smart pre-built responses. Add a key for real AI chat powered by actual student data + coach feedback.
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop:20 }}>
          <Label sub="This prefix is added before every AI conversation. Customize the AI's persona and sports coaching style.">System Prompt Prefix</Label>
          <textarea
            value={systemPrompt}
            onChange={e => setSystemPrompt(e.target.value)}
            rows={3}
            style={{ width:'100%', background:BG, border:`1.5px solid ${BORDER}`, borderRadius:9, color:TEXT, fontSize:13, padding:'10px 14px', fontFamily:'inherit', outline:'none', resize:'vertical', lineHeight:1.55 }}
            onFocus={e => e.target.style.borderColor = LIME + '66'}
            onBlur={e => e.target.style.borderColor = BORDER}
          />
        </div>
      </SectionCard>

      {/* ── SECTION 2: DAILY LIMITS ── */}
      <SectionCard title="Daily Question Limits by Package" icon="📊" accent="#3b82f6">
        <div style={{ fontSize:12, color:MUTED, marginBottom:16 }}>Control how many AI questions each student can ask per day based on their subscription plan. Set -1 for unlimited.</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {packages.map((pkg, idx) => (
            <div key={pkg.id} style={{ background:BG, border:`1.5px solid ${BORDER}`, borderRadius:12, padding:'18px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ fontSize:14, fontWeight:700, color:TEXT }}>{pkg.name}</div>
                <Badge color={idx === 0 ? MUTED : idx === 1 ? '#3b82f6' : idx === 2 ? LIME : '#f97316'}>
                  {pkg.id}
                </Badge>
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:MUTED, marginBottom:6 }}>Daily limit (questions)</div>
                <Input
                  value={pkg.daily_limit === -1 ? '-1' : pkg.daily_limit}
                  onChange={e => updatePackage(idx, 'daily_limit', e.target.value)}
                  placeholder="-1 for unlimited"
                />
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:4 }}>
                  {pkg.daily_limit === -1 ? '∞ Unlimited' : `${pkg.daily_limit} questions/day`}
                </div>
              </div>
              <div>
                <div style={{ fontSize:11, color:MUTED, marginBottom:6 }}>Price (₹/month)</div>
                <Input
                  value={pkg.price_inr}
                  onChange={e => updatePackage(idx, 'price_inr', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16, fontSize:12, color:MUTED, background:`rgba(59,130,246,0.05)`, border:'1px solid rgba(59,130,246,0.15)', borderRadius:8, padding:'10px 14px' }}>
          💡 Assign packages to students in <strong style={{ color:'#60a5fa' }}>Students → Edit Student → AI Package</strong>. Default is Free tier.
        </div>
      </SectionCard>

      {/* ── SECTION 3: YOUTUBE RESOURCES ── */}
      <SectionCard title="YouTube Resources — Suggested in AI Chat" icon="📹" accent="#ef4444">
        <div style={{ fontSize:12, color:MUTED, marginBottom:16 }}>
          These videos are automatically suggested to students during AI chat when relevant keywords are detected. Add your coaching YouTube content here.
        </div>

        {/* Existing resources */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
          {ytResources.map(r => (
            <div key={r.id} style={{ display:'flex', alignItems:'center', gap:12, background:BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:'12px 14px' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>▶</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:TEXT, marginBottom:2 }}>{r.title}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  <Badge color="#ef4444">{r.category}</Badge>
                  {r.tags?.map(t => <span key={t} style={{ fontSize:10, color:MUTED, background:CARD2, padding:'1px 7px', borderRadius:8, border:`1px solid ${BORDER}` }}>#{t}</span>)}
                </div>
              </div>
              <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:'#60a5fa', textDecoration:'none', padding:'4px 10px', border:'1px solid rgba(96,165,250,0.3)', borderRadius:6 }}>Open ↗</a>
              <button className="remove-btn" onClick={() => removeYtResource(r.id)} style={{ padding:'4px 10px', borderRadius:6, background:'transparent', border:`1px solid ${BORDER}`, color:MUTED, fontSize:11, cursor:'pointer' }}>Remove</button>
            </div>
          ))}
        </div>

        {/* Add new */}
        <div style={{ background:CARD2, border:`1px dashed ${BORDER}`, borderRadius:12, padding:'18px 20px' }}>
          <div style={{ fontSize:12, fontWeight:600, color:MUTED, marginBottom:14, textTransform:'uppercase', letterSpacing:'0.5px' }}>+ Add YouTube Resource</div>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr 2fr', gap:10, marginBottom:12 }}>
            <div>
              <div style={{ fontSize:11, color:MUTED, marginBottom:5 }}>Title</div>
              <Input value={newYt.title} onChange={e => setNewYt(p => ({...p, title:e.target.value}))} placeholder="Batting Footwork Guide" />
            </div>
            <div>
              <div style={{ fontSize:11, color:MUTED, marginBottom:5 }}>YouTube URL</div>
              <Input value={newYt.url} onChange={e => setNewYt(p => ({...p, url:e.target.value}))} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div>
              <div style={{ fontSize:11, color:MUTED, marginBottom:5 }}>Category</div>
              <select value={newYt.category} onChange={e => setNewYt(p => ({...p, category:e.target.value}))} style={{ width:'100%', background:BG, border:`1.5px solid ${BORDER}`, borderRadius:9, color:TEXT, fontSize:13, padding:'10px 10px', outline:'none' }}>
                {['Batting','Bowling','Fielding','Fitness','Mental','Keeping','Strategy'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:11, color:MUTED, marginBottom:5 }}>Tags (comma-separated)</div>
              <Input value={newYt.tags} onChange={e => setNewYt(p => ({...p, tags:e.target.value}))} placeholder="footwork, technique, agility" />
            </div>
          </div>
          <button onClick={addYtResource} style={{ background:`${LIME}18`, border:`1px solid ${LIME}40`, color:LIME, borderRadius:9, padding:'8px 20px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            + Add Resource
          </button>
        </div>
      </SectionCard>

      {/* ── SECTION 4: SUGGESTED PACKAGES ── */}
      <SectionCard title="Suggested Packages — Shown in AI Chat" icon="💼" accent={PURPLE}>
        <div style={{ fontSize:12, color:MUTED, marginBottom:16 }}>
          These programs/packages are suggested to students during AI chat when the AI detects a relevant opportunity. Edit or add new ones below.
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
          {suggestedPkgs.map(p => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, background:BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:'12px 14px' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:`${PURPLE}18`, border:`1px solid ${PURPLE}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>📦</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:TEXT }}>{p.title}</div>
                <div style={{ display:'flex', gap:8, marginTop:3 }}>
                  <Badge color={PURPLE}>₹{p.price_inr?.toLocaleString('en-IN')}</Badge>
                  {p.highlight && <Badge color="#f97316">{p.highlight}</Badge>}
                </div>
              </div>
              {p.cta_url && <a href={p.cta_url} style={{ fontSize:11, color:'#60a5fa', textDecoration:'none', padding:'4px 10px', border:'1px solid rgba(96,165,250,0.3)', borderRadius:6 }}>Link ↗</a>}
              <button className="remove-btn" onClick={() => removeSuggestedPkg(p.id)} style={{ padding:'4px 10px', borderRadius:6, background:'transparent', border:`1px solid ${BORDER}`, color:MUTED, fontSize:11, cursor:'pointer' }}>Remove</button>
            </div>
          ))}
        </div>

        {/* Add new */}
        <div style={{ background:CARD2, border:`1px dashed ${BORDER}`, borderRadius:12, padding:'18px 20px' }}>
          <div style={{ fontSize:12, fontWeight:600, color:MUTED, marginBottom:14, textTransform:'uppercase', letterSpacing:'0.5px' }}>+ Add Suggested Package</div>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 2fr', gap:10, marginBottom:12 }}>
            <div>
              <div style={{ fontSize:11, color:MUTED, marginBottom:5 }}>Package Title</div>
              <Input value={newPkg.title} onChange={e => setNewPkg(p => ({...p, title:e.target.value}))} placeholder="Elite Performance Masterclass" />
            </div>
            <div>
              <div style={{ fontSize:11, color:MUTED, marginBottom:5 }}>Price (₹)</div>
              <Input value={newPkg.price_inr} onChange={e => setNewPkg(p => ({...p, price_inr:e.target.value}))} placeholder="12000" />
            </div>
            <div>
              <div style={{ fontSize:11, color:MUTED, marginBottom:5 }}>Highlight</div>
              <Input value={newPkg.highlight} onChange={e => setNewPkg(p => ({...p, highlight:e.target.value}))} placeholder="Most Popular" />
            </div>
            <div>
              <div style={{ fontSize:11, color:MUTED, marginBottom:5 }}>CTA URL</div>
              <Input value={newPkg.cta_url} onChange={e => setNewPkg(p => ({...p, cta_url:e.target.value}))} placeholder="/enroll?program=p1" />
            </div>
          </div>
          <button onClick={addSuggestedPkg} style={{ background:`${PURPLE}18`, border:`1px solid ${PURPLE}40`, color:'#a78bfa', borderRadius:9, padding:'8px 20px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            + Add Package
          </button>
        </div>
      </SectionCard>

      {/* ── SECTION 5: STATUS OVERVIEW ── */}
      <SectionCard title="AI Usage Overview" icon="📈" accent="#22c55e">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {[
            { label:'Active Provider', value: provider === 'anthropic' ? 'Anthropic Claude' : 'OpenAI GPT', sub: provider === 'anthropic' ? modelAnthropic : modelOpenai, color:LIME },
            { label:'API Key Status',  value: hasKey ? 'Configured ✓' : 'Not Set ⚠', sub: hasKey ? 'Ready for AI chat' : 'Students get smart fallback responses', color: hasKey ? '#22c55e' : '#f97316' },
            { label:'YouTube Resources', value: ytResources.length, sub:`${ytResources.length} videos configured`, color:'#ef4444' },
            { label:'Suggested Packages', value: suggestedPkgs.length, sub:'shown in AI chat', color:PURPLE },
            { label:'Package Tiers',  value: packages.length, sub:'daily limit tiers', color:'#3b82f6' },
            { label:'Free Plan Limit', value: packages.find(p=>p.id==='free')?.daily_limit ?? 5, sub:'questions per day', color:MUTED },
          ].map((item, i) => (
            <div key={i} style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:10, padding:'16px 18px' }}>
              <div style={{ fontSize:11, color:MUTED, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>{item.label}</div>
              <div style={{ fontSize:22, fontWeight:700, color:item.color, marginBottom:4 }}>{item.value}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Save button bottom */}
      <div style={{ display:'flex', justifyContent:'flex-end', paddingBottom:32 }}>
        <button onClick={saveAll} disabled={saving} style={{
          background: saving ? CARD2 : `linear-gradient(135deg, ${LIME}, #84cc16)`,
          color: saving ? MUTED : '#000', border:'none', borderRadius:10,
          padding:'12px 32px', fontWeight:700, fontSize:14, cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: saving ? 'none' : '0 4px 16px rgba(173,255,47,0.3)',
        }}>
          {saving ? 'Saving…' : '💾 Save All Settings'}
        </button>
      </div>
    </div>
  )
}
