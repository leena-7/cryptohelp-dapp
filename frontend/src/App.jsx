import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constants";
import "./App.css";
import { title } from "process";

const CAMPAIGNS_DATA = [
  { id:"1", title:"Help Baby Riya Fight Cancer", description:"Baby Riya is battling leukemia and needs immediate treatment at Tata Memorial Hospital. Her parents are daily wage workers who cannot afford the treatment costs.", image:"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop", category:"Humanitarian", raised:1250000, goal:2000000, backers:892, daysLeft:8 },
  { id:"2", title:"Educate 100 Village Children", description:"We aim to provide quality education, books, and digital tablets to 100 children in rural Maharashtra who currently walk 5km daily to reach school.", image:"https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop", category:"Education", raised:450000, goal:600000, backers:320, daysLeft:21 },
  { id:"3", title:"Rebuild Homes After Floods", description:"Devastating floods destroyed 200+ homes in Assam. Families are living in temporary shelters. Help us rebuild their lives and homes.", image:"https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&h=250&fit=crop", category:"Humanitarian", raised:3200000, goal:5000000, backers:1560, daysLeft:15 },
  { id:"4", title:"Feed Stray Animals This Winter", description:"Thousands of stray animals suffer during harsh winters. Your donation provides food, blankets, and medical care for stray dogs and cats.", image:"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop", category:"Community", raised:180000, goal:300000, backers:245, daysLeft:30 },
  { id:"5", title:"Wheelchair for Disabled Athletes", description:"Paralympic hopefuls need specialized sports wheelchairs to train for international competitions. Each wheelchair costs Rs.2 lakhs.", image:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop", category:"Global Health", raised:520000, goal:800000, backers:410, daysLeft:12 },
  { id:"6", title:"Solar Panels for Rural School", description:"A school with 300 students in Rajasthan has no electricity. Solar panels will power classrooms, computer labs, and water purifiers.", image:"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop", category:"Innovation", raised:280000, goal:400000, backers:189, daysLeft:25 },
];

const CATEGORIES = [
  { name:"Humanitarian", slug:"humanitarian", description:"Emergency relief and social welfare", icon:"❤️", color:"#ef4444", bg:"rgba(239,68,68,0.1)" },
  { name:"Education", slug:"education", description:"Schools, scholarships and learning", icon:"🎓", color:"#3b82f6", bg:"rgba(59,130,246,0.1)" },
  { name:"Environment", slug:"environment", description:"Conservation and sustainability", icon:"🌿", color:"#22c55e", bg:"rgba(34,197,94,0.1)" },
  { name:"Innovation", slug:"innovation", description:"Tech and research projects", icon:"💡", color:"#f59e0b", bg:"rgba(245,158,11,0.1)" },
  { name:"Community", slug:"community", description:"Local initiatives and DAOs", icon:"👥", color:"#8b5cf6", bg:"rgba(139,92,246,0.1)" },
  { name:"Infrastructure", slug:"infrastructure", description:"Building and development", icon:"🏗️", color:"#f97316", bg:"rgba(249,115,22,0.1)" },
  { name:"Arts & Culture", slug:"arts-culture", description:"Creative and cultural projects", icon:"🎨", color:"#ec4899", bg:"rgba(236,72,153,0.1)" },
  { name:"Global Health", slug:"global-health", description:"Medical and wellness initiatives", icon:"🌍", color:"#06b6d4", bg:"rgba(6,182,212,0.1)" },
];

const HOW_IT_WORKS = [
  { number:"01", title:"Connect Your Wallet", description:"Link your MetaMask wallet to get started. We support all major Web3 providers.", icon:"💼" },
  { number:"02", title:"Create or Discover", description:"Launch your own campaign or browse verified projects seeking funding.", icon:"📋" },
  { number:"03", title:"Fund Securely", description:"Contribute ETH to campaigns. Smart contracts ensure transparent fund management.", icon:"🔒" },
  { number:"04", title:"Track Progress", description:"Monitor campaign milestones on-chain. Funds released as creators achieve goals.", icon:"✅" },
];

function fmt(n) {
  if (n >= 10000000) return "Rs." + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "Rs." + (n / 100000).toFixed(1) + "L";
  if (n >= 1000) return "Rs." + (n / 1000).toFixed(0) + "K";
  return "Rs." + n;
}

function Navbar({ account, onConnect, onStartCampaign, onLiveClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  return (
    <header className="ch-navbar">
      <div className="ch-navbar-inner">
        <div className="ch-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src="/src/assets/logo.png" alt="CryptoHelp" style={{ height: "90px", width: "240px", objectFit: "contain", cursor: "pointer" }} />
        </div>
        <nav className="ch-nav-links">
          <span className="ch-nav-link" onClick={() => scrollTo("campaigns")}>Campaigns</span>
          <span className="ch-nav-link" onClick={onLiveClick} style={{ color: "#00b37f", fontWeight: "600" }}>🔴 Live Campaigns</span>
          <span className="ch-nav-link" onClick={() => scrollTo("categories")}>Categories</span>
          <span className="ch-nav-link" onClick={() => scrollTo("how-it-works")}>How It Works</span>
          <span className="ch-nav-link" onClick={() => scrollTo("ch-footer")}>About</span>
        </nav>
        <div className="ch-nav-actions">
          <button className="ch-btn-outline" onClick={onStartCampaign}>Start Campaign</button>
          <button className="ch-btn-primary" onClick={onConnect}>
            💼 {account ? account.slice(0, 6) + "..." + account.slice(-4) : "Connect Wallet"}
          </button>
        </div>
        <button className="ch-hamburger" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "✕" : "☰"}</button>
      </div>
      {menuOpen && (
        <div className="ch-mobile-menu">
          <span className="ch-nav-link" onClick={() => scrollTo("campaigns")}>Campaigns</span>
          <span className="ch-nav-link" onClick={() => scrollTo("categories")}>Categories</span>
          <span className="ch-nav-link" onClick={() => scrollTo("how-it-works")}>How It Works</span>
          <button className="ch-btn-outline ch-btn-full" onClick={() => { onStartCampaign(); setMenuOpen(false); }}>Start Campaign</button>
          <button className="ch-btn-primary ch-btn-full" onClick={() => { onConnect(); setMenuOpen(false); }}>
            💼 {account ? account.slice(0, 6) + "..." + account.slice(-4) : "Connect Wallet"}
          </button>
        </div>
      )}
    </header>
  );
}

function HeroSection({ onStartCampaign, onExplore }) {
  return (
    <section className="ch-hero">
      <div className="ch-hero-inner">
        <div className="ch-hero-badge"><span className="ch-badge-dot" />Powered by Blockchain Technology</div>
        <h1 className="ch-hero-title">Fund Ideas That Matter with <span className="ch-accent-text">Transparent</span> Crowdfunding</h1>
        <p className="ch-hero-sub">Launch campaigns, back projects you believe in, and make a real difference. Every transaction is transparent, secure, and decentralized.</p>
        <div className="ch-hero-btns">
          <button className="ch-btn-primary ch-btn-lg" onClick={onStartCampaign}>Start a Campaign →</button>
          <button className="ch-btn-outline ch-btn-lg" onClick={onExplore}>Explore Campaigns</button>
        </div>
        <div className="ch-hero-stats">
          {[["Rs.12.5Cr","Total Raised"],["2,847","Campaigns Funded"],["89K+","Backers"],["156","Countries"]].map(([n,l]) => (
            <div className="ch-stat" key={l}><div className="ch-stat-num">{n}</div><div className="ch-stat-label">{l}</div></div>
          ))}
        </div>
        <div className="ch-features">
          {[
            ["🛡️","Fully Secure","Smart contracts ensure funds go directly to verified campaigns."],
            ["⚡","Instant Funding","No waiting periods. Funds are transferred instantly on-chain."],
            ["🌐","Global Access","Anyone with a wallet can fund or create campaigns worldwide."]
          ].map(([icon,title,desc]) => (
            <div className="ch-feature-card" key={title}>
              <div className="ch-feature-icon">{icon}</div>
              <div><div className="ch-feature-title">{title}</div><div className="ch-feature-desc">{desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CampaignCard({ campaign, onNote }) {
  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  return (
    <div className="ch-card">
      <div className="ch-card-img-wrap">
        <img src={campaign.image} alt={campaign.title} className="ch-card-img" onError={e => e.target.style.display='none'} />
        <div className="ch-card-category">{campaign.category}</div>
      </div>
      <div className="ch-card-body">
        <h3 className="ch-card-title">{campaign.title}</h3>
        <p className="ch-card-desc">{campaign.description}</p>
        <div className="ch-card-progress-wrap"><div className="ch-card-progress-bar" style={{width:`${progress}%`}} /></div>
        <div className="ch-card-raised-row">
          <span className="ch-card-raised">{fmt(campaign.raised)}</span>
          <span className="ch-card-goal">of {fmt(campaign.goal)}</span>
        </div>
        <div className="ch-card-footer">
          <span>👥 {campaign.backers} backers</span>
          <span>⏰ {campaign.daysLeft} days left</span>
        </div>
        <button className="ch-btn-outline ch-btn-full ch-mt" onClick={() => onNote(campaign)}>Support This Campaign</button>
      </div>
    </div>
  );
}

function CampaignsSection({ blockchainCampaigns, account,onConnect, onNote, onDonate, onDelete, onViewDonors, onRefund, activeCategory, onClearFilter, }) {
  const filtered = activeCategory ? CAMPAIGNS_DATA.filter(c => c.category === activeCategory) : CAMPAIGNS_DATA;

  return (
    <section className="ch-section ch-section-muted" id="campaigns">
      <div className="ch-section-inner">
        <div className="ch-section-header-row">
          <div>
            <h2 className="ch-section-title">{activeCategory ? `${activeCategory} Campaigns` : "Featured Campaigns"}</h2>
            <p className="ch-section-sub">{activeCategory ? `Showing campaigns in ${activeCategory}` : "Discover projects making a real impact."}</p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {activeCategory && (
              <button className="ch-btn-outline" onClick={() => onClearFilter(null)} style={{ borderColor: "#ef4444", color: "#ef4444" }}>✕ Clear Filter</button>
            )}
            <button className="ch-btn-ghost" onClick={() => onClearFilter(null)}>View All →</button>
          </div>
        </div>

        <div style={{display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"32px"}}>
          {CATEGORIES.map(cat => (
            <button key={cat.slug} onClick={() => onClearFilter(cat.name)}
              style={{
                padding:"6px 16px", borderRadius:"50px", fontSize:"0.8rem", fontWeight:"600",
                border:"1.5px solid", cursor:"pointer", transition:"all 0.2s",
                borderColor: activeCategory===cat.name ? cat.color : "var(--border)",
                background: activeCategory===cat.name ? cat.bg : "white",
                color: activeCategory===cat.name ? cat.color : "var(--text2)"
              }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{textAlign:"center", padding:"60px", color:"var(--text3)"}}>
            <div style={{fontSize:"3rem", marginBottom:"16px"}}>🔍</div>
            <p>No campaigns found in this category yet.</p>
            <button className="ch-btn-primary ch-mt" onClick={() => onClearFilter(null)}>View All Campaigns</button>
          </div>
        ) : (
          <div className="ch-grid-3">
            {filtered.map(c => <CampaignCard key={c.id} campaign={c} onNote={onNote} />)}
          </div>
        )}

        {blockchainCampaigns.length > 0 && (
          <>
            <h3 className="ch-blockchain-title" id="live-campaigns">🔗 Live Blockchain Campaigns</h3>
            <div className="ch-grid-3">
              {blockchainCampaigns.filter(bc => bc.owner !== "0x0000000000000000000000000000000000000000").map((bc, i) => {
                const goal = parseFloat(ethers.formatEther(bc.goal));
                const collected = parseFloat(ethers.formatEther(bc.amountCollected));
                const pct = goal > 0 ? Math.min(Math.round((collected/goal)*100),100) : 0;
                const isExpired = Date.now()/1000 > Number(bc.deadline);
                const daysLeft = Math.max(0, Math.ceil((Number(bc.deadline)-Date.now()/1000)/86400));
                return (
                  <div className="ch-card" key={i}>
                    <div className="ch-card-img-wrap" style={{background: bc.image ? "none" : "linear-gradient(135deg, #ede9fe, #ddd6fe)"}}>
                      {bc.image ? (
                        <img src={bc.image} alt={bc.title} className="ch-card-img" onError={e => e.target.style.display='none'} />
                      ) : (
                        <span style={{fontSize:"3rem"}}>🔗</span>
                      )}
                      <div className="ch-card-category" style={{background:isExpired?"rgba(239,68,68,0.15)":"rgba(0,179,127,0.15)", color:isExpired?"#ef4444":"#00b37f"}}>
                        {isExpired ? "ENDED" : "LIVE"}
                      </div>
                    </div>
                    <div className="ch-card-body">
                      <h3 className="ch-card-title">{bc.title}</h3>
                      {bc.description && <p className="ch-card-desc">{bc.description}</p>}
                      <p style={{fontSize:"0.8rem", color:"var(--text3)", marginBottom:"12px"}}>by {bc.owner.slice(0,6)}...{bc.owner.slice(-4)}</p>
                      <div className="ch-card-progress-wrap"><div className="ch-card-progress-bar" style={{width:`${pct}%`}} /></div>
                      <div className="ch-card-raised-row">
                        <span className="ch-card-raised">{collected.toFixed(4)} ETH</span>
                        <span className="ch-card-goal">{pct}%</span>
                      </div>
                      <div className="ch-card-footer">
                        <span>Goal: {goal} ETH</span>
                        <span>{isExpired ? "Ended" : `${daysLeft}d left`}</span>
                      </div>
                      {/* Donate - only when wallet connected and campaign active */}
                      {!isExpired && account && (
                        <button className="ch-btn-primary ch-btn-full ch-mt" 
                          onClick={() => onDonate(bc, i)}>
                          Donate ETH
                        </button>
                      )}

                      {/* Show connect wallet if not connected */}
                      {!isExpired && !account && (
                        <button className="ch-btn-outline ch-btn-full ch-mt"
                          style={{borderColor:"var(--accent)", color:"var(--accent)"}}
                          onClick={onConnect}>
                          🦊 Connect Wallet to Donate
                        </button>
                      )}

                      {/* View Donors - always visible */}
                      <button className="ch-btn-outline ch-btn-full ch-mt"
                        style={{borderColor:"#3b82f6", color:"#3b82f6"}}
                        onClick={() => onViewDonors(i)}>
                        👥 View Donors
                      </button>

                      {/*Claim Refund */}
                      {isExpired && !( collected >= goal) && account && ( 
                      <button className="ch-btn-outline ch-btn-full ch-mt" 
                        style={{borderColor:"#f59e0b", color:"#f59e0b"}} 
                        onClick={() => onRefund(i)}> 
                        🔄 Claim Refund 
                      </button> )}


                      {/* Delete - only for owner */}
                      {account && bc.owner.toLowerCase() === account.toLowerCase() && (
                        <button className="ch-btn-outline ch-btn-full ch-mt" 
                          style={{borderColor:"#ef4444", color:"#ef4444"}} 
                          onClick={() => onDelete(i, bc.owner)}>
                          🗑️ Delete Campaign
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function CategoriesSection({ onCategoryClick }) {
  return (
    <section className="ch-section ch-section-white" id="categories">
      <div className="ch-section-inner">
        <div className="ch-section-header-center">
          <h2 className="ch-section-title">Explore Categories</h2>
          <p className="ch-section-sub">Find campaigns that align with your values and interests</p>
        </div>
        <div className="ch-grid-4">
          {CATEGORIES.map(c => (
            <div className="ch-category-card" key={c.slug} onClick={() => onCategoryClick(c.name)}>
              <div className="ch-category-icon" style={{background:c.bg, color:c.color}}>{c.icon}</div>
              <div>
                <div className="ch-category-name">{c.name}</div>
                <div className="ch-category-desc">{c.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="ch-section ch-section-muted" id="how-it-works">
      <div className="ch-section-inner">
        <div className="ch-section-header-center">
          <h2 className="ch-section-title">How CryptoHelp Works</h2>
          <p className="ch-section-sub">Four simple steps to start funding or creating campaigns</p>
        </div>
        <div className="ch-grid-4">
          {HOW_IT_WORKS.map((s,i) => (
            <div className="ch-step-card" key={i}>
              <div className="ch-step-icon">{s.icon}</div>
              <div className="ch-step-num">{s.number}</div>
              <div className="ch-step-title">{s.title}</div>
              <p className="ch-step-desc">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ch-footer" id="ch-footer">
      <div className="ch-footer-inner">
        <div className="ch-footer-grid">
          <div className="ch-footer-brand">
            <div className="ch-footer-logo">
              <img src="/src/assets/logo.png" alt="CryptoHelp" style={{ height: "100px", width: "220px", objectFit: "contain", objectPosition: "left", filter: "brightness(0) invert(1)" }} />
            </div>
            <p className="ch-footer-desc">Decentralized crowdfunding for a better world. Transparent, secure, and accessible to everyone.</p>
            <div className="ch-social-icons">
              {["🌍", "💻", "💬"].map((s, i) => <div key={i} className="ch-social-icon">{s}</div>)}
            </div>
          </div>
          {[
            { title: "Platform", links: ["Start Campaign", "Explore", "How It Works", "Pricing"] },
            { title: "Resources", links: ["Documentation", "API", "Smart Contracts", "Audit Reports"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="ch-footer-col-title">{col.title}</h4>
              <div className="ch-footer-links">
                {col.links.map(l => <span key={l} className="ch-footer-link">{l}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="ch-footer-bottom">
          <span>© {new Date().getFullYear()} CryptoHelp. All rights reserved.</span>
          <span>Built on Ethereum. Powered by the community.</span>
        </div>
      </div>
    </footer>
  );
}

function NoteModal({ show, onClose, campaign, onSubmit, account }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  if (!show || !campaign) return null;
  const quickAmounts = ["0.001","0.005","0.01","0.05","0.1"];
  return (
    <div className="ch-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="ch-modal">
        <button className="ch-modal-close" onClick={onClose}>✕</button>
        <div className="ch-modal-icon" style={{background:"rgba(139,92,246,0.1)"}}>❤️</div>
        <h3 className="ch-modal-title">Support This Campaign</h3>
        <p className="ch-modal-sub">{campaign.title}</p>
        {!account && (
          <div style={{background:"#fef3c7", border:"1px solid #f59e0b", borderRadius:"10px", padding:"12px", marginBottom:"16px", fontSize:"0.85rem", color:"#92400e", textAlign:"center"}}>
            ⚠️ Please connect your MetaMask wallet first to donate!
          </div>
        )}
        <div className="ch-quick-amts">
          {quickAmounts.map(a => (
            <button key={a} className={`ch-amt-btn${amount===a?" active":""}`} onClick={() => setAmount(a)}>{a} ETH</button>
          ))}
        </div>
        <div className="ch-form-group">
          <label className="ch-label">ETH Amount</label>
          <input className="ch-input" type="number" placeholder="e.g. 0.01" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="ch-form-group">
          <label className="ch-label">Add a Note (Optional)</label>
          <textarea className="ch-input ch-textarea" placeholder="Write a message of support..." value={note} onChange={e => setNote(e.target.value)} />
        </div>
        {amount && account && (
          <div style={{background:"#ede9fe", border:"1px solid #c4b5fd", borderRadius:"10px", padding:"12px", marginBottom:"16px", fontSize:"0.85rem", color:"#5b21b6", textAlign:"center"}}>
            🦊 MetaMask will open to confirm your <b>{amount} ETH</b> donation
          </div>
        )}
        <div className="ch-modal-btns">
          <button className="ch-btn-outline ch-btn-full" onClick={onClose}>Cancel</button>
          <button className="ch-btn-primary ch-btn-full" disabled={!amount || !account}
            onClick={() => { onSubmit(amount, note, campaign); setAmount(""); setNote(""); }}>
            🦊 Donate via MetaMask
          </button>
        </div>
        <p style={{textAlign:"center", fontSize:"0.75rem", color:"var(--text3)", marginTop:"12px"}}>
          🔒 Secured by Ethereum Sepolia blockchain
        </p>
      </div>
    </div>
  );
}

function CreateCampaignModal({ show, onClose, onSubmit, showToast }) {
  const [form, setForm] = useState({ title: "", description: "", category: "", goal: "", duration: "", image: "" });

  if (!show) return null;

  const handleCreate = () => {
    if (!form.title.trim()) {
      showToast("⚠️ Please enter a campaign title!");
      return;
    }
    if (!form.description.trim()) {
      showToast("⚠️ Please enter a campaign description!");
      return;
    }
    if (!form.category) {
      showToast("⚠️ Please select a category!");
      return;
    }
    if (!form.goal || parseFloat(form.goal) <= 0) {
      showToast("⚠️ Please enter a valid funding goal!");
      return;
    }
    if (!form.duration || parseInt(form.duration) <= 0) {
      showToast("⚠️ Please enter a valid campaign duration!");
      return;
    }

    onSubmit(form);
    setForm({ title: "", description: "", category: "", goal: "", duration: "", image: "" });
  };

  return (
    <div className="ch-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ch-modal ch-modal-lg">
        <button className="ch-modal-close" onClick={onClose}>✕</button>
        <h3 className="ch-modal-title">Create New Campaign</h3>
        <p className="ch-modal-sub">Launch your campaign on the blockchain. All fields are required.</p>

        <div className="ch-form-group">
          <label className="ch-label">Campaign Title <span style={{ color: "#ef4444" }}>*</span></label>
          <input className="ch-input" placeholder="Enter your campaign title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="ch-form-group">
          <label className="ch-label">Description <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea className="ch-input ch-textarea" placeholder="Describe your campaign and its impact..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="ch-form-group">
          <label className="ch-label">Category <span style={{ color: "#ef4444" }}>*</span></label>
          <select className="ch-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="">Select a category</option>
            {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div className="ch-form-group">
          <label className="ch-label">Funding Goal (ETH) <span style={{ color: "#ef4444" }}>*</span></label>
          <input className="ch-input" type="number" placeholder="e.g. 0.5" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} />
        </div>
        <div className="ch-form-group">
          <label className="ch-label">Campaign Duration (Days) <span style={{ color: "#ef4444" }}>*</span></label>
          <input className="ch-input" type="number" placeholder="e.g. 30" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
        </div>
        <div className="ch-form-group">
          <label className="ch-label">Campaign Image URL <span style={{ color: "var(--text3)", fontSize: "0.8rem" }}>(Optional)</span></label>
          <input className="ch-input" placeholder="https://example.com/image.jpg" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <p style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: "6px" }}>
            💡 Upload your image to <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer">postimages.org</a> and paste the direct link here
          </p>
        </div>

        <div className="ch-modal-btns">
          <button className="ch-btn-outline ch-btn-full" onClick={onClose}>Cancel</button>
          <button className="ch-btn-primary ch-btn-full" onClick={handleCreate}>
            Create Campaign →
          </button>
        </div>
      </div>
    </div>
  );
}

function DonorsModal({ show, onClose, donors }) {
  if (!show) return null;
  return (
    <div className="ch-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="ch-modal ch-modal-lg">
        <button className="ch-modal-close" onClick={onClose}>✕</button>
        <div className="ch-modal-icon" style={{background:"rgba(59,130,246,0.1)"}}>👥</div>
        <h3 className="ch-modal-title">Campaign Donors</h3>
        <p className="ch-modal-sub">{donors.length} people have donated</p>

        {donors.length === 0 ? (
          <div style={{textAlign:"center", padding:"30px", color:"var(--text3)"}}>
            <div style={{fontSize:"2rem", marginBottom:"12px"}}>🌱</div>
            <p>No donations yet. Be the first to donate!</p>
          </div>
        ) : (
          <div style={{maxHeight:"350px", overflowY:"auto"}}>
            {donors.map((d, i) => (
              <div key={i} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"14px 16px", borderRadius:"12px", marginBottom:"8px",
                background:"var(--muted)", border:"1px solid var(--border)"
              }}>
                <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
                  <div style={{
                    width:"36px", height:"36px", borderRadius:"50%",
                    background:"linear-gradient(135deg, #8b5cf6, #3b82f6)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"white", fontSize:"0.8rem", fontWeight:"700"
                  }}>
                    {i+1}
                  </div>
                  <div>
                    <div style={{fontWeight:"600", fontSize:"0.85rem", color:"var(--text)"}}>
                      {d.donor.slice(0,6)}...{d.donor.slice(-4)}
                    </div>
                    <div style={{fontSize:"0.75rem", color:"var(--text3)"}}>
                      {new Date(Number(d.timestamp)*1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{fontWeight:"700", color:"var(--accent)", fontSize:"0.9rem"}}>
                  {parseFloat(ethers.formatEther(d.amount)).toFixed(4)} ETH
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="ch-btn-outline ch-btn-full" style={{marginTop:"16px"}} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
function ConfirmModal({ show, onClose, onConfirm, title, message }) {
  if (!show) return null;
  return (
    <div className="ch-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="ch-modal" style={{maxWidth:"400px"}}>
        <div className="ch-modal-icon" style={{background:"rgba(239,68,68,0.1)"}}>⚠️</div>
        <h3 className="ch-modal-title">{title}</h3>
        <p className="ch-modal-sub" style={{marginBottom:"28px"}}>{message}</p>
        <div className="ch-modal-btns">
          <button className="ch-btn-outline ch-btn-full" onClick={onClose}>
            Cancel
          </button>
          <button className="ch-btn-full" onClick={onConfirm}
            style={{
              padding:"11px 20px", borderRadius:"var(--radius)", fontWeight:"600",
              fontSize:"0.875rem", border:"none", cursor:"pointer",
              background:"linear-gradient(135deg, #ef4444, #dc2626)",
              color:"white", transition:"all 0.2s"
            }}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}


function Toast({ show, msg }) {
  return (
    <div className={`ch-toast${show?" show":""}`}>
      <span>{msg}</span>
    </div>
  );
}

export default function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [blockchainCampaigns, setBlockchainCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showNote, setShowNote] = useState(false);
  const [showDonors, setShowDonors] = useState(false);
  const [donors, setDonors] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({title:"", message:"", onConfirm:null});
  const [toast, setToast] = useState({ show:false, msg:"" });
  useEffect(() => { loadCampaignsPublic(); }, []);
  const showToast = (msg) => { setToast({show:true, msg}); setTimeout(() => setToast({show:false, msg:""}), 3500); };

  const handleViewDonors = async (index) => {
    try {
      const data = await contract.getDonors(index);
      setDonors(data);
      setShowDonors(true);
    } catch(err) {
      showToast("Error loading donors");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setAccount(addr); setContract(c);
      showToast(`Wallet connected! ${addr.slice(0,6)}...${addr.slice(-4)} 🔐`);
      loadCampaigns(c);
    } catch(err) {
      if (err.code === 4001 || err.message.includes("rejected")) {
        showToast("Connection cancelled ❌");
      } else {
        showToast("Connection failed. Try again! ⚠️");
      }
    }
  };

  const loadCampaignsPublic = async () => { 
    try { const provider = new ethers.JsonRpcProvider( "https://eth-sepolia.g.alchemy.com/v2/cSDof8qLN7IvOz_wAHBGk" ); 
      const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider); 
      const data = await c.getCampaigns(); setBlockchainCampaigns(data.filter(bc => 
        bc.owner !== "0x0000000000000000000000000000000000000000" 
      )); 
    } catch(err) { console.error(err); } 
  };


  const loadCampaigns = async (c) => {
    try { const data = await (c || contract).getCampaigns(); setBlockchainCampaigns(data); }
    catch(err) { console.error(err); }
  };

  const handleNoteSubmit = async (amount, note, campaign) => {
    if (!account) { showToast("Connect wallet first! 🦊"); return; }
    try {
      setLoading(true);
      if (campaign.isBlockchain) {
        const tx = await contract.donateToCampaign(campaign.index, { value: ethers.parseEther(amount) });
        await tx.wait();
        loadCampaigns();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      showToast(`Thank you! ${amount} ETH donation recorded! ❤️`);
      setShowNote(false);
    } catch(err) {
      if (err.code === 4001 || err.message.includes("rejected")) { showToast("Transaction cancelled ❌"); }
      else if (err.message.includes("insufficient")) { showToast("Insufficient ETH balance! ⚠️"); }
      else { showToast("Transaction failed. Try again! ⚠️"); }
    } finally { setLoading(false); }
  };

  const handleCreateCampaign = async (form) => {
    if (!account) { showToast("Connect wallet first! 🦊"); return; }
    try {
      setLoading(true);
      const deadline = Math.floor(Date.now()/1000) + Number(form.duration)*86400;
      const tx = await contract.createCampaign(form.title, form.description, form.image || "", ethers.parseEther(form.goal), deadline);
      await tx.wait();
      showToast(`Campaign "${form.title}" launched! 🚀`);
      setShowCreate(false); loadCampaigns();
    } catch(err) {
      if (err.code === 4001 || err.message.includes("rejected")) { showToast("Transaction cancelled ❌"); }
      else { showToast("Error: " + err.message); }
    } finally { setLoading(false); }
  };

  const handleDelete = async (index, owner) => {
    if (!account) { showToast("Connect wallet first!"); return; }
    if (owner.toLowerCase() !== account.toLowerCase()) {
      showToast("Only the campaign owner can delete it!");
      return;
    }

    // Check if campaign is still active
    const campaign = blockchainCampaigns[index];
    const isActive = Date.now()/1000 < Number(campaign.deadline);
    const hasFunds = parseFloat(ethers.formatEther(campaign.amountCollected)) > 0;

    if (isActive && hasFunds) {
      showToast("Campaign cannot be deleted while it has donations!");
      return;
    }

    setConfirmData({
      title: "Delete Campaign",
      message: "Are you sure you want to delete this campaign? This action cannot be undone!",
      onConfirm: async () => {
        setShowConfirm(false);
        try {
          setLoading(true);
          const tx = await contract.deleteCampaign(index);
          await tx.wait();
          showToast("Campaign deleted successfully!");
          loadCampaigns();
        } catch(err) {
          if (err.message.includes("rejected")) {
            showToast("Transaction cancelled");
          } else {
            showToast("Error deleting campaign. Try again!");
          }
        } finally { setLoading(false); }
      }
    });
    setShowConfirm(true);
  };
  
  const handleEarlyWithdraw = async (index) => {
    if (!account) { showToast("Connect wallet first!"); return; }
    setConfirmData({
      title: "End & Withdraw Funds",
      message: "Are you sure? This will end the campaign immediately and withdraw all funds to your wallet!",
      onConfirm: async () => {
        setShowConfirm(false);
        try {
          setLoading(true);
          const tx = await contract.endAndWithdraw(index);
          await tx.wait();
          showToast("Campaign ended and funds withdrawn! 💰");
          loadCampaigns();
        } catch(err) {
          if (err.code === 4001 || err.message.includes("rejected")) {
            showToast("Transaction cancelled ❌");
          } else {
            showToast("Error: " + err.message);
          }
        } finally { setLoading(false); }
      }
    });
    setShowConfirm(true);
  };

  const handleRefund = async (index) => {
    if (!account) { showToast("Connect wallet first!"); return; }
    try {
      setLoading(true);
      const tx = await contract.claimRefund(index);
      await tx.wait();cd
      showToast("Refund claimed successfully! 💰");
      loadCampaigns();
    } catch(err) {
      if (err.code === 4001 || err.message.includes("rejected")) {
        showToast("Transaction cancelled ❌");
      } else {
        showToast("Error: " + err.message);
      }
    } finally { setLoading(false); }
  };


  return (
    <>
      <Navbar account={account} onConnect={connectWallet} onStartCampaign={() => setShowCreate(true)} onLiveClick={() => {
        if (!account) {
          showToast("Please connect your MetaMask wallet first! 🦊");
          } else {
            document.getElementById("live-campaigns")?.scrollIntoView({behavior:"smooth"});
          }
        }}
      />
      <main>
        <HeroSection
          onStartCampaign={() => setShowCreate(true)}
          onExplore={() => document.getElementById("campaigns")?.scrollIntoView({behavior:"smooth"})}
        />
        <CampaignsSection
          blockchainCampaigns={blockchainCampaigns}
          account={account}
          onConnect={connectWallet}
          onNote={c => { setSelectedCampaign(c); setShowNote(true); }}
          onDonate={(c,i) => { setSelectedCampaign({...c, isBlockchain:true, index:i}); setShowNote(true); }}
          onDelete={handleDelete}
          onViewDonors={handleViewDonors}
          activeCategory={activeCategory}
          onClearFilter={(name) => setActiveCategory(name || null)}
        />
        <DonorsModal show={showDonors} onClose={() => setShowDonors(false)} donors={donors} />
        <CategoriesSection
          onCategoryClick={(name) => {
            setActiveCategory(name);
            document.getElementById("campaigns")?.scrollIntoView({behavior:"smooth"});
          }}
        />
        <HowItWorksSection />
      </main>
      <Footer />
      <NoteModal show={showNote} onClose={() => setShowNote(false)} campaign={selectedCampaign} onSubmit={handleNoteSubmit} account={account} />
      <CreateCampaignModal show={showCreate} onClose={() => setShowCreate(false)} onSubmit={handleCreateCampaign} showToast={showToast} />
      <ConfirmModal show={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={confirmData.onConfirm} title={confirmData.title} message={confirmData.message}/>
      <Toast show={toast.show} msg={toast.msg} />
      {loading && (
        <div className="ch-loading-overlay">
          <div className="ch-loading-box">⏳ Processing transaction...</div>
        </div>
      )}
    </>
  );
}