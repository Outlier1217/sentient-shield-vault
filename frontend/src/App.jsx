// App.jsx - Complete Fixed Version with Self-Verify
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StrategyPage from "./StrategyPage";

// ✅ Localhost Deployed Addresses (npx hardhat node se)
// const usdcAddress   = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const nexaidAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// const pairAddress   = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// const vaultAddress  = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

// ✅ HashKey Testnet :
const usdcAddress   = "0xfD36e42d57DdEF313457FFf750fEd831958E5cd2";
const nexaidAddress = "0x83660B2dc4C917558CAc56b24EeF98A1524D0bAE";
const pairAddress   = "0xB6Ab09336698DE498966bD5b522adD93C7CB78da";
const vaultAddress  = "0x48CBAD88B6df3D0510a45A5A10c0577CA6C037D4";

const usdcAbi = [
  "function mint(address to, uint amount)",
  "function approve(address spender, uint amount)",
  "function balanceOf(address account) view returns (uint)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint amount) returns (bool)"
];

const vaultAbi = [
  "function deposit(uint amount)",
  "function withdraw(uint amount)",
  "function harvest()",
  "function claim()",
  "function generateYield(uint amount)",
  "function rebalance()",
  "function rewards(address) view returns (uint)",
  "function balances(address) view returns (uint)",
  "function totalDeposits() view returns (uint)",
  "function totalYield() view returns (uint)",
  "function owner() view returns (address)",
  "function xp(address) view returns (uint)",
  "function level(address) view returns (uint)",
  "function bountiesEarned(address) view returns (uint)",
  "function getReputationBonus(address) view returns (uint)",
  "function isVerified(address) view returns (bool)",
  "function getNextLevelXP(address) view returns (uint)"
];

const nexaidAbi = [
  "function verify(address) view returns (bool)",
  "function getScore(address) view returns (uint)",
  "function setUser(address, bool, uint)",
  "function verifyMe()",
  "function selfVerify(uint)"
];

function VaultApp() {
  const [account, setAccount]               = useState("");
  const [signer, setSigner]                 = useState(null);
  const [status, setStatus]                 = useState("");
  const [loading, setLoading]               = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [shieldScore, setShieldScore]       = useState(0);

  const [amount, setAmount]                 = useState("");
  const [usdcBalance, setUsdcBalance]       = useState("0");
  const [vaultBalance, setVaultBalance]     = useState("0");
  const [pendingRewards, setPendingRewards] = useState("0");
  const [totalYield, setTotalYield]         = useState("0");
  const [vaultActualUsdc, setVaultActualUsdc] = useState("0");
  const [isOwner, setIsOwner]               = useState(false);
  const [decimals, setDecimals]             = useState(6);

  // Gamification
  const [userXP, setUserXP]           = useState(0);
  const [userLevel, setUserLevel]     = useState(1);
  const [nextLevelXP, setNextLevelXP] = useState(100);
  const [levelBonus, setLevelBonus]   = useState(0);

  // Bounty
  const [userBounties, setUserBounties] = useState("0");

  // NexaID
  const [nexaidVerified, setNexaidVerified]   = useState(false);
  const [nexaidScore, setNexaidScore]         = useState(0);
  const [reputationBonus, setReputationBonus] = useState(0);
  const [showNexaModal, setShowNexaModal]     = useState(false);

  // ─── Wallet Connect ───────────────────────────────────────────────────────
  const connectWallet = async () => {
    try {
      // ✅ FIX: Localhost ke liye MetaMask ko hardhat network add karna hoga
      // Network: localhost | RPC: http://127.0.0.1:8545 | ChainID: 31337
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const _signer  = await provider.getSigner();
      const address  = await _signer.getAddress();

      setSigner(_signer);
      setAccount(address);

      const vault = new ethers.Contract(vaultAddress, vaultAbi, _signer);
      const owner = await vault.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());

      setStatus("✅ Wallet Connected");
      await loadBalances(_signer, address);
      await loadGamification(_signer, address);
      await loadNexaID(_signer, address);
    } catch (err) {
      setStatus("❌ Failed to connect: " + err.message?.slice(0, 80));
      console.error(err);
    }
  };

  // ─── Load Balances ────────────────────────────────────────────────────────
  const loadBalances = async (signerInstance, address) => {
    try {
      const usdc  = new ethers.Contract(usdcAddress, usdcAbi, signerInstance);
      const vault = new ethers.Contract(vaultAddress, vaultAbi, signerInstance);

      const usdcDecimals = await usdc.decimals();
      setDecimals(Number(usdcDecimals));

      const [usdcBal, vaultBal, rewardsBal, yieldAmt, vaultUsdc, bounties] =
        await Promise.all([
          usdc.balanceOf(address),
          vault.balances(address),
          vault.rewards(address),
          vault.totalYield(),
          usdc.balanceOf(vaultAddress),
          vault.bountiesEarned(address),
        ]);

      setUsdcBalance(ethers.formatUnits(usdcBal, usdcDecimals));
      setVaultBalance(ethers.formatUnits(vaultBal, usdcDecimals));
      setPendingRewards(ethers.formatUnits(rewardsBal, usdcDecimals));
      setTotalYield(ethers.formatUnits(yieldAmt, usdcDecimals));
      setVaultActualUsdc(ethers.formatUnits(vaultUsdc, usdcDecimals));
      setUserBounties(ethers.formatUnits(bounties, usdcDecimals));
    } catch (err) {
      console.error("Error loading balances:", err);
    }
  };

  // ─── Load Gamification ────────────────────────────────────────────────────
  const loadGamification = async (signerInstance, address) => {
    try {
      const vault = new ethers.Contract(vaultAddress, vaultAbi, signerInstance);

      const [xpRaw, lvlRaw, nextXPRaw, repBonus] = await Promise.all([
        vault.xp(address),
        vault.level(address),
        vault.getNextLevelXP(address),
        vault.getReputationBonus(address),
      ]);

      const lvl = Number(lvlRaw);
      setUserXP(Number(xpRaw));
      setUserLevel(lvl);
      setNextLevelXP(Number(nextXPRaw));
      setReputationBonus(Number(repBonus));
      setLevelBonus(Math.min(lvl * 5, 50));
    } catch (err) {
      console.error("Error loading gamification:", err);
    }
  };

  // ─── Load NexaID ──────────────────────────────────────────────────────────
  const loadNexaID = async (signerInstance, address) => {
    try {
      const nexaid   = new ethers.Contract(nexaidAddress, nexaidAbi, signerInstance);
      const verified = await nexaid.verify(address);
      const score    = await nexaid.getScore(address);
      setNexaidVerified(verified);
      setNexaidScore(Number(score));
    } catch (err) {
      console.error("Error loading NexaID:", err);
      setNexaidVerified(false);
    }
  };

  // ─── NexaID Verify ────────────────────────────────────────────────────────
  const verifyWithNexaID = async () => {
    if (!signer || !account) {
      setStatus("❌ Please connect wallet first");
      return;
    }
    try {
      setLoading(true);
      setStatus("⏳ Verifying with NexaID...");

      const nexaid = new ethers.Contract(nexaidAddress, nexaidAbi, signer);

      // ✅ Pehle check karo agar already verified hai
      const alreadyVerified = await nexaid.verify(account);
      if (alreadyVerified) {
        setStatus("✅ Already verified with NexaID!");
        await loadNexaID(signer, account);
        return;
      }

      // verifyMe try karo, fail hone pe selfVerify
      let tx;
      try {
        tx = await nexaid.verifyMe();
      } catch {
        tx = await nexaid.selfVerify(750);
      }
      await tx.wait();

      setStatus("✅ NexaID Verified! Score: 750");
      await loadNexaID(signer, account);
      await loadGamification(signer, account);
    } catch (err) {
      console.error("Verification error:", err);
      setStatus("❌ NexaID verification failed: " + err.message?.slice(0, 80));
    } finally {
      setLoading(false);
    }
  };

  // ─── ShieldBot Mock ───────────────────────────────────────────────────────
  const checkShieldBot = () => {
    return new Promise((resolve) => {
      const randomScore = Math.floor(Math.random() * 100);
      setShieldScore(randomScore);
      setShowShieldModal(true);
      setTimeout(() => {
        setShowShieldModal(false);
        resolve(randomScore < 70); // true = allowed
      }, 2000);
    });
  };

  // ─── Refresh ──────────────────────────────────────────────────────────────
  const refreshBalances = async () => {
    if (signer && account) {
      await Promise.all([
        loadBalances(signer, account),
        loadGamification(signer, account),
        loadNexaID(signer, account),
      ]);
    }
  };

  useEffect(() => {
    if (signer && account) {
      refreshBalances();
      const interval = setInterval(refreshBalances, 5000);
      return () => clearInterval(interval);
    }
  }, [signer, account]);

  // ─── Contract helpers ─────────────────────────────────────────────────────
  const getUSDC  = () => new ethers.Contract(usdcAddress, usdcAbi, signer);
  const getVault = () => new ethers.Contract(vaultAddress, vaultAbi, signer);

  const parseAmount = (amt) => {
    if (!amt || amt === "0") return 0n;
    return ethers.parseUnits(amt.toString().replace(/,/g, ""), decimals);
  };

  // ─── Generic TX handler ───────────────────────────────────────────────────
  const handleTx = async (txPromise, message, requireShield = false) => {
    try {
      if (requireShield) {
        const allowed = await checkShieldBot();
        if (!allowed) {
          setStatus(`🛡️ ShieldBot blocked ${message} — Risk Score: ${shieldScore}`);
          return;
        }
      }
      setLoading(true);
      setStatus(`⏳ ${message} in progress...`);
      const tx = await txPromise;
      await tx.wait();
      setStatus(`✅ ${message} successful!`);
      await refreshBalances();
    } catch (err) {
      console.error("TX error:", err);
      const msg = err.message || "";
      if (msg.includes("No reward"))   setStatus(`❌ ${message} failed: No rewards to claim!`);
      else if (msg.includes("No yield")) setStatus(`❌ ${message} failed: No yield available!`);
      else if (msg.includes("NexaID"))  { setStatus(`❌ Please verify with NexaID first!`); setShowNexaModal(true); }
      else if (msg.includes("cooldown")) setStatus(`❌ ${message} failed: Harvest cooldown active, wait 60s`);
      else setStatus(`❌ ${message} failed: ${msg.slice(0, 100)}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── Actions ──────────────────────────────────────────────────────────────
  const mint = async () => {
    const parsed = parseAmount(amount);
    if (parsed === 0n) { setStatus("❌ Please enter a valid amount"); return; }
    await handleTx(getUSDC().mint(account, parsed), "Mint USDC");
  };

  const approve = async () => {
    const parsed = parseAmount(amount);
    if (parsed === 0n) { setStatus("❌ Please enter a valid amount"); return; }
    await handleTx(getUSDC().approve(vaultAddress, parsed), "Approve");
  };

  const deposit = async () => {
    const parsed = parseAmount(amount);
    if (parsed === 0n) { setStatus("❌ Please enter a valid amount"); return; }
    await handleTx(getVault().deposit(parsed), "Deposit", true);
  };

  const withdraw = async () => {
    const parsed = parseAmount(amount);
    if (parsed === 0n) { setStatus("❌ Please enter a valid amount"); return; }
    await handleTx(getVault().withdraw(parsed), "Withdraw", true);
  };

  const generateYield = async () => {
    const parsed = parseAmount(amount);
    if (parsed === 0n) { setStatus("❌ Please enter a valid amount"); return; }

    try {
      setLoading(true);
      const usdc = getUSDC();

      const ownerBal = await usdc.balanceOf(account);
      if (ownerBal < parsed) {
        setStatus("⏳ Minting USDC to owner...");
        const tx1 = await usdc.mint(account, parsed);
        await tx1.wait();
      }

      setStatus("⏳ Approving vault...");
      const tx2 = await usdc.approve(vaultAddress, parsed);
      await tx2.wait();

      setStatus("⏳ Transferring USDC to vault...");
      const tx3 = await usdc.transfer(vaultAddress, parsed);
      await tx3.wait();

      setStatus("⏳ Updating vault yield...");
      const tx4 = await getVault().generateYield(parsed);
      await tx4.wait();

      setStatus(`✅ Generated ${amount} USDC yield!`);
      await refreshBalances();
    } catch (err) {
      setStatus("❌ Generate yield failed: " + err.message?.slice(0, 100));
    } finally {
      setLoading(false);
    }
  };

  const harvest = async () => {
    await handleTx(getVault().harvest(), "Harvest", true);
  };

  const claim = async () => {
    if (parseFloat(pendingRewards) === 0) { setStatus("❌ No rewards to claim!"); return; }
    if (parseFloat(vaultActualUsdc) < parseFloat(pendingRewards)) {
      setStatus(`❌ Vault has only ${vaultActualUsdc} USDC. Need more!`); return;
    }
    await handleTx(getVault().claim(), "Claim Rewards");
  };

  const rebalance = async () => {
    await handleTx(getVault().rebalance(), "Rebalance");
  };

  // ─── Styles ───────────────────────────────────────────────────────────────
  const buttonStyle = {
    padding: "clamp(10px, 3vw, 12px)",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: "clamp(12px, 3.5vw, 14px)",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    width: "100%",
    opacity: loading ? 0.6 : 1,
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#0a0a0a", color: "#e5e5e5" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "clamp(12px, 4vw, 24px)", boxSizing: "border-box" }}>

        <h1 style={{ color: "#3b82f6", fontSize: "clamp(24px, 6vw, 42px)", margin: "0 0 8px 0", textAlign: "center" }}>
          🔥 Sentient Shield Vault
        </h1>
        <p style={{ fontSize: "clamp(14px, 4vw, 18px)", color: "#9ca3af", marginBottom: "clamp(16px, 5vw, 32px)", textAlign: "center" }}>
          Self-Operating DeFi Engine | AI + DeFi on HashKey Chain
        </p>

        {/* ── ShieldBot Modal ── */}
        {showShieldModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
            <div style={{ background: "#1a1a1a", padding: "clamp(20px, 5vw, 32px)", borderRadius: 16, maxWidth: "90%", width: 400, textAlign: "center", border: "1px solid #2a2a2a" }}>
              <h2 style={{ color: shieldScore < 30 ? "#10b981" : shieldScore < 70 ? "#f59e0b" : "#ef4444" }}>🛡️ ShieldBot Analysis</h2>
              <p style={{ fontSize: 48, fontWeight: "bold", margin: "16px 0", color: "#e5e5e5" }}>{shieldScore}</p>
              <p style={{ color: "#9ca3af" }}>Risk Score</p>
              {shieldScore < 30  && <p style={{ color: "#10b981" }}>✅ Safe Transaction — Allowed</p>}
              {shieldScore >= 30 && shieldScore < 70 && <p style={{ color: "#f59e0b" }}>⚠️ Medium Risk — Warning</p>}
              {shieldScore >= 70 && <p style={{ color: "#ef4444" }}>❌ High Risk — Blocked</p>}
              <button onClick={() => setShowShieldModal(false)} style={{ marginTop: 20, padding: "12px 20px", background: "#3b82f6", color: "white", border: "none", borderRadius: 8, cursor: "pointer", width: "100%", fontSize: 16, fontWeight: "bold" }}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── NexaID Modal ── */}
        {showNexaModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
            <div style={{ background: "#1a1a1a", padding: "clamp(20px, 5vw, 32px)", borderRadius: 16, maxWidth: "90%", width: 400, textAlign: "center", border: "1px solid #2a2a2a" }}>
              <h2 style={{ color: "#8b5cf6" }}>🔐 NexaID Verification Required</h2>
              <p style={{ color: "#9ca3af" }}>Please verify your identity with NexaID to use this vault.</p>
              <button onClick={() => { setShowNexaModal(false); verifyWithNexaID(); }} style={{ marginTop: 20, padding: "12px 20px", background: "#8b5cf6", color: "white", border: "none", borderRadius: 8, cursor: "pointer", width: "100%", fontSize: 16, fontWeight: "bold" }}>
                Verify with NexaID
              </button>
              <button onClick={() => setShowNexaModal(false)} style={{ marginTop: 10, padding: "12px 20px", background: "#374151", color: "white", border: "none", borderRadius: 8, cursor: "pointer", width: "100%", fontSize: 16, fontWeight: "bold" }}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* ── Wallet Section ── */}
        <div style={{ background: "#111111", padding: "clamp(16px, 4vw, 24px)", borderRadius: 12, marginBottom: "clamp(16px, 4vw, 24px)", border: "1px solid #2a2a2a" }}>
          <button onClick={connectWallet} disabled={loading} style={{ background: account ? "#065f46" : "#3b82f6", color: "white", padding: "clamp(12px, 3.5vw, 14px) clamp(16px, 4vw, 24px)", border: "none", borderRadius: 8, cursor: "pointer", width: "100%", fontSize: "clamp(14px, 4vw, 16px)", fontWeight: "bold" }}>
            {account ? `✅ Connected: ${account.slice(0,6)}...${account.slice(-4)}` : "🔗 Connect Wallet"}
          </button>

          {isOwner && <p style={{ color: "#10b981", marginTop: 8, margin: "8px 0 0 0" }}>👑 Owner Mode Active</p>}

          {nexaidVerified
            ? <p style={{ color: "#10b981", margin: "8px 0 0 0" }}>✅ NexaID Verified | Score: {nexaidScore}</p>
            : <p style={{ color: "#f59e0b", margin: "8px 0 0 0" }}>⚠️ NexaID Not Verified</p>
          }

          {status && (
            <p style={{ margin: "8px 0 0 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 13px)", wordBreak: "break-word" }}>
              {status}
            </p>
          )}

          {account && !nexaidVerified && (
            <button onClick={verifyWithNexaID} disabled={loading} style={{ marginTop: 12, padding: "clamp(10px, 3vw, 12px)", background: "#8b5cf6", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", width: "100%", fontSize: "clamp(12px, 3.5vw, 14px)" }}>
              🔐 Verify with NexaID
            </button>
          )}
        </div>

        {/* ── Balance Cards ── */}
        {account && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "clamp(10px, 3vw, 16px)", marginBottom: "clamp(16px, 4vw, 24px)" }}>
            {[
              { label: "💰 Wallet USDC",  value: usdcBalance,      bg: "#1e3a8a", border: "#3b82f6", color: "#e5e5e5" },
              { label: "🏦 Your Vault",   value: vaultBalance,     bg: "#1e3a8a", border: "#3b82f6", color: "#e5e5e5" },
              { label: "🏦 Vault USDC",   value: vaultActualUsdc,  bg: "#1e3a8a", border: "#3b82f6", color: "#e5e5e5" },
              { label: "🎁 Rewards",      value: pendingRewards,   bg: "#5b21b6", border: "#8b5cf6", color: "#c084fc" },
              { label: "💰 Bounties",     value: userBounties,     bg: "#065f46", border: "#10b981", color: "#34d399" },
              { label: "📊 Total Yield",  value: totalYield,       bg: "#1c1917", border: "#f59e0b", color: "#fbbf24" },
            ].map(({ label, value, bg, border, color }) => (
              <div key={label} style={{ background: bg, padding: "clamp(12px, 3vw, 16px)", borderRadius: 12, border: `1px solid ${border}` }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 13px)" }}>{label}</h4>
                <p style={{ fontSize: "clamp(16px, 5vw, 20px)", fontWeight: "bold", margin: 0, color }}>{parseFloat(value).toFixed(4)}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Gamification Card ── */}
        {account && (
          <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", padding: "clamp(16px, 4vw, 24px)", borderRadius: 12, marginBottom: "clamp(16px, 4vw, 24px)", border: "1px solid #f59e0b" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#f59e0b", fontSize: "clamp(18px, 5vw, 24px)" }}>🎮 Gamification Profile</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px, 4vw, 32px)", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ flex: 1, minWidth: 150 }}>
                <p style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: "bold", margin: 0, color: "#fbbf24" }}>⭐ Level {userLevel}</p>
                <p style={{ marginTop: 8, color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>XP: {userXP} / {nextLevelXP}</p>
                <div style={{ width: "100%", height: 8, background: "#2a2a2a", borderRadius: 4, overflow: "hidden", marginTop: 8 }}>
                  <div style={{ width: `${Math.min((userXP / nextLevelXP) * 100, 100)}%`, height: "100%", background: "#f59e0b", borderRadius: 4, transition: "width 0.3s ease" }} />
                </div>
              </div>
              <div>
                <p style={{ margin: 0, color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>🎁 <strong>Level Bonus:</strong> +{levelBonus}%</p>
                <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>🏆 <strong>NexaID Bonus:</strong> +{reputationBonus}%</p>
                <p style={{ margin: 0, color: "#fbbf24", fontSize: "clamp(12px, 3.5vw, 14px)" }}>✨ <strong>Total Bonus:</strong> +{levelBonus + reputationBonus}%</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Amount Input ── */}
        <div style={{ marginBottom: "clamp(16px, 4vw, 24px)" }}>
          <input
            type="number"
            placeholder="Enter amount (e.g., 100)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            style={{ padding: "clamp(12px, 3.5vw, 14px)", width: "100%", fontSize: "clamp(14px, 4vw, 16px)", borderRadius: 8, border: "1px solid #2a2a2a", backgroundColor: "#111111", color: "#e5e5e5", boxSizing: "border-box" }}
          />
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "clamp(10px, 3vw, 12px)", marginBottom: "clamp(16px, 4vw, 24px)" }}>
          <button onClick={mint}     disabled={loading || !account} style={{...buttonStyle, background: "#3b82f6"}}>💰 Mint USDC</button>
          <button onClick={approve}  disabled={loading || !account} style={{...buttonStyle, background: "#3b82f6"}}>✅ Approve</button>
          <button onClick={deposit}  disabled={loading || !account} style={{...buttonStyle, background: "#3b82f6"}}>📤 Deposit</button>
          <button onClick={withdraw} disabled={loading || !account} style={{...buttonStyle, background: "#ef4444"}}>📤 Withdraw</button>
          {isOwner && (
            <button onClick={generateYield} disabled={loading} style={{...buttonStyle, background: "#10b981"}}>🌟 Gen Yield</button>
          )}
          <button onClick={harvest}   disabled={loading || !account} style={{...buttonStyle, background: "#3b82f6"}}>🌾 Harvest</button>
          <button onClick={claim}     disabled={loading || !account || parseFloat(pendingRewards) === 0} style={{...buttonStyle, background: parseFloat(pendingRewards) > 0 ? "#8b5cf6" : "#374151"}}>🎁 Claim</button>
          <button onClick={rebalance} disabled={loading || !account} style={{...buttonStyle, background: "#f59e0b"}}>🔄 Rebalance</button>
        </div>

        {/* ── Vault Stats ── */}
        <div style={{ padding: "clamp(16px, 4vw, 24px)", background: "#111111", borderRadius: 12, border: "1px solid #2a2a2a" }}>
          <h3 style={{ margin: "0 0 12px 0", color: "#f59e0b", fontSize: "clamp(18px, 5vw, 24px)" }}>📊 Vault Stats</h3>
          <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>Total Yield Available:</strong> {parseFloat(totalYield).toFixed(4)} USDC</p>
          <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>Rebalance Bounty:</strong> 0.05% of total deposits</p>
          <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>Cooldown:</strong> 60s | <strong>Performance Fee:</strong> 10%</p>
          <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>Security:</strong> ShieldBot + NexaID + Reentrancy Guard</p>
        </div>

      </div>
    </div>
  );
}

// ─── App with Router ──────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)", background: "#0f0f0f", color: "white", display: "flex", flexWrap: "wrap", gap: "clamp(12px, 3vw, 16px)", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #2a2a2a", position: "sticky", top: 0, zIndex: 100 }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "clamp(14px, 4vw, 18px)", whiteSpace: "nowrap" }}>🏦 Sentient Shield Vault</Link>
        <div style={{ display: "flex", gap: "clamp(8px, 2.5vw, 12px)" }}>
          <Link to="/"         style={{ color: "#9ca3af", textDecoration: "none", padding: "4px 12px", borderRadius: 6, fontSize: "clamp(12px, 3.5vw, 14px)" }}>🏠 Vault</Link>
          <Link to="/strategy" style={{ color: "#9ca3af", textDecoration: "none", padding: "4px 12px", borderRadius: 6, fontSize: "clamp(12px, 3.5vw, 14px)" }}>📊 Strategy</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/"         element={<VaultApp />} />
        <Route path="/strategy" element={<StrategyPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "clamp(20px, 5vw, 32px)", color: "#6b7280", borderTop: "1px solid #2a2a2a", marginTop: "clamp(20px, 5vw, 32px)", background: "#0a0a0a" }}>
      <p style={{ color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)", marginBottom: 12 }}>
        🔥 Sentient Shield Vault — DeFi that doesn't wait, it acts.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px, 5vw, 32px)", flexWrap: "wrap", marginBottom: 12 }}>
        {[
          { href: "https://github.com/Outlier1217/sentient-shield-vault", label: "📦 GitHub" },
          { href: "https://t.me/ssv_defi_bot",                            label: "🤖 Telegram Bot" },
          { href: "https://www.youtube.com/@Outlier1217",                  label: "📺 YouTube" },
        ].map(({ href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            style={{ color: "#9ca3af", textDecoration: "none", fontSize: "clamp(12px, 3.5vw, 14px)" }}
            onMouseEnter={(e) => e.target.style.color = "#3b82f6"}
            onMouseLeave={(e) => e.target.style.color = "#9ca3af"}
          >{label}</a>
        ))}
      </div>
      <p style={{ fontSize: "clamp(10px, 3vw, 12px)", color: "#6b7280", margin: 0 }}>
        Built on HashKey Chain | Powered by NexaID | Secured by ShieldBot
      </p>
    </footer>
  );
}

export default App;