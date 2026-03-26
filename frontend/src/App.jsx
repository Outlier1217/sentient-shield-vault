// App.jsx - Complete Fixed Version
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StrategyPage from "./StrategyPage";

// ✅ HashKey Testnet Addresses (Update after deployment)
const usdcAddress = "0x84b6a3e3a7ffE62D339524d7C678c252aBD2d4b0";
const vaultAddress = "0x78c37Dcb5C3C072DAfb9D4e28638BBcdf297FeeB";
const nexaidAddress = "0x3a21b6C601B599AB9460e689f4cBb051e5737d0e";

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
  "function setUser(address, bool, uint) returns (bool)"
];

function VaultApp() {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [shieldScore, setShieldScore] = useState(0);
  
  const [amount, setAmount] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [vaultBalance, setVaultBalance] = useState("0");
  const [pendingRewards, setPendingRewards] = useState("0");
  const [totalYield, setTotalYield] = useState("0");
  const [vaultActualUsdc, setVaultActualUsdc] = useState("0");
  const [isOwner, setIsOwner] = useState(false);
  const [decimals, setDecimals] = useState(6);
  
  // ✅ Gamification states
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [nextLevelXP, setNextLevelXP] = useState(100);
  const [levelBonus, setLevelBonus] = useState(0);
  
  // ✅ Bounty states
  const [userBounties, setUserBounties] = useState("0");
  
  // ✅ NexaID states
  const [nexaidVerified, setNexaidVerified] = useState(false);
  const [nexaidScore, setNexaidScore] = useState(0);
  const [reputationBonus, setReputationBonus] = useState(0);
  const [showNexaModal, setShowNexaModal] = useState(false);

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setSigner(signer);
      setAccount(address);
      
      const vault = new ethers.Contract(vaultAddress, vaultAbi, signer);
      const owner = await vault.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
      
      setStatus("✅ Wallet Connected");
      await loadBalances(signer, address);
      await loadGamification(signer, address);
      await loadNexaID(signer, address);
    } catch (err) {
      setStatus("❌ Failed to connect");
      console.error(err);
    }
  };

  const loadBalances = async (signerInstance, address) => {
    try {
      const usdc = new ethers.Contract(usdcAddress, usdcAbi, signerInstance);
      const vault = new ethers.Contract(vaultAddress, vaultAbi, signerInstance);
      
      const usdcDecimals = await usdc.decimals();
      setDecimals(usdcDecimals);
      
      const usdcBal = await usdc.balanceOf(address);
      setUsdcBalance(ethers.formatUnits(usdcBal, usdcDecimals));
      
      const vaultBal = await vault.balances(address);
      setVaultBalance(ethers.formatUnits(vaultBal, usdcDecimals));
      
      const rewards = await vault.rewards(address);
      setPendingRewards(ethers.formatUnits(rewards, usdcDecimals));
      
      const yieldAmount = await vault.totalYield();
      setTotalYield(ethers.formatUnits(yieldAmount, usdcDecimals));
      
      const vaultUsdc = await usdc.balanceOf(vaultAddress);
      setVaultActualUsdc(ethers.formatUnits(vaultUsdc, usdcDecimals));
      
      const bounties = await vault.bountiesEarned(address);
      setUserBounties(ethers.formatUnits(bounties, usdcDecimals));
      
      console.log("Debug:", {
        vaultBal: ethers.formatUnits(vaultBal, usdcDecimals),
        vaultUsdc: ethers.formatUnits(vaultUsdc, usdcDecimals),
        totalYield: ethers.formatUnits(yieldAmount, usdcDecimals),
        rewards: ethers.formatUnits(rewards, usdcDecimals)
      });
    } catch (err) {
      console.error("Error loading balances:", err);
    }
  };
  
  const loadGamification = async (signerInstance, address) => {
    try {
      const vault = new ethers.Contract(vaultAddress, vaultAbi, signerInstance);
      
      const xp = await vault.xp(address);
      setUserXP(Number(ethers.formatUnits(xp, 0)));
      
      const level = await vault.level(address);
      setUserLevel(Number(level));
      
      const nextXP = await vault.getNextLevelXP(address);
      setNextLevelXP(Number(ethers.formatUnits(nextXP, 0)));
      
      const bonus = await vault.getReputationBonus(address);
      setReputationBonus(Number(bonus));
      
      // Level bonus (5% per level)
      setLevelBonus(Math.min(userLevel * 5, 50));
    } catch (err) {
      console.error("Error loading gamification:", err);
    }
  };
  
  const loadNexaID = async (signerInstance, address) => {
    if (nexaidAddress === "0x0000000000000000000000000000000000000000") {
      setNexaidVerified(true);
      return;
    }
    
    try {
      const nexaid = new ethers.Contract(nexaidAddress, nexaidAbi, signerInstance);
      const verified = await nexaid.verify(address);
      const score = await nexaid.getScore(address);
      setNexaidVerified(verified);
      setNexaidScore(Number(score));
    } catch (err) {
      console.error("Error loading NexaID:", err);
      setNexaidVerified(false);
    }
  };
  
  // ✅ Verify with NexaID
  const verifyWithNexaID = async () => {
    if (!signer || !account) {
      setStatus("❌ Please connect wallet first");
      return;
    }
    
    try {
      setLoading(true);
      setStatus("⏳ Verifying with NexaID...");
      
      const nexaid = new ethers.Contract(nexaidAddress, nexaidAbi, signer);
      const tx = await nexaid.setUser(account, true, 750);
      await tx.wait();
      
      setStatus("✅ NexaID Verified Successfully! Score: 750");
      await loadNexaID(signer, account);
      await loadGamification(signer, account);
    } catch (err) {
      console.error("Verification error:", err);
      setStatus("❌ NexaID verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const checkShieldBot = async (action) => {
    // Mock ShieldBot analysis
    const randomScore = Math.floor(Math.random() * 100);
    setShieldScore(randomScore);
    setShowShieldModal(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        setShowShieldModal(false);
        resolve(randomScore < 70);
      }, 2000);
    });
  };

  const refreshBalances = async () => {
    if (signer && account) {
      await loadBalances(signer, account);
      await loadGamification(signer, account);
      await loadNexaID(signer, account);
    }
  };

  useEffect(() => {
    if (signer && account) {
      refreshBalances();
      const interval = setInterval(refreshBalances, 5000);
      return () => clearInterval(interval);
    }
  }, [signer, account]);

  const getUSDC = () => new ethers.Contract(usdcAddress, usdcAbi, signer);
  const getVault = () => new ethers.Contract(vaultAddress, vaultAbi, signer);

  const parseAmount = (amt) => {
    if (!amt || amt === "0") return 0;
    const cleanAmount = amt.toString().replace(/,/g, '');
    return ethers.parseUnits(cleanAmount, decimals);
  };

  const handleTx = async (txPromise, message, requireShield = false) => {
    try {
      if (requireShield) {
        const allowed = await checkShieldBot(message);
        if (!allowed) {
          setStatus(`🛡️ ShieldBot blocked ${message} - Risk Score: ${shieldScore}`);
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
      console.error("Transaction error:", err);
      let errorMsg = err.message || "Unknown error";
      if (errorMsg.includes("No reward")) {
        setStatus(`❌ ${message} failed: No rewards to claim!`);
      } else if (errorMsg.includes("No yield")) {
        setStatus(`❌ ${message} failed: No yield available!`);
      } else if (errorMsg.includes("NexaID")) {
        setStatus(`❌ ${message} failed: Please verify with NexaID first!`);
        setShowNexaModal(true);
      } else {
        setStatus(`❌ ${message} failed: ${errorMsg.slice(0, 100)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const mint = async () => {
    const usdc = getUSDC();
    const amountToMint = parseAmount(amount);
    if (amountToMint === 0) {
      setStatus("❌ Please enter a valid amount");
      return;
    }
    await handleTx(usdc.mint(account, amountToMint), "Mint USDC");
  };

  const approve = async () => {
    const usdc = getUSDC();
    const amountToApprove = parseAmount(amount);
    if (amountToApprove === 0) {
      setStatus("❌ Please enter a valid amount");
      return;
    }
    await handleTx(usdc.approve(vaultAddress, amountToApprove), "Approve");
  };

  const deposit = async () => {
    const vault = getVault();
    const amountToDeposit = parseAmount(amount);
    if (amountToDeposit === 0) {
      setStatus("❌ Please enter a valid amount");
      return;
    }
    await handleTx(vault.deposit(amountToDeposit), "Deposit", true);
  };

  const generateYield = async () => {
    const usdc = getUSDC();
    const vault = getVault();
    const yieldAmount = parseAmount(amount);
    
    if (yieldAmount === 0) {
      setStatus("❌ Please enter a valid amount");
      return;
    }
    
    try {
      setLoading(true);
      
      const ownerBalance = await usdc.balanceOf(account);
      if (ownerBalance < yieldAmount) {
        setStatus(`⏳ Minting ${amount} USDC to owner first...`);
        const mintTx = await usdc.mint(account, yieldAmount);
        await mintTx.wait();
      }
      
      setStatus(`⏳ Approving vault...`);
      const approveTx = await usdc.approve(vaultAddress, yieldAmount);
      await approveTx.wait();
      
      setStatus(`⏳ Transferring ${amount} USDC to vault...`);
      const transferTx = await usdc.transfer(vaultAddress, yieldAmount);
      await transferTx.wait();
      
      setStatus(`⏳ Updating vault yield...`);
      const yieldTx = await vault.generateYield(yieldAmount);
      await yieldTx.wait();
      
      setStatus(`✅ Generated ${amount} USDC yield!`);
      await refreshBalances();
    } catch (err) {
      console.error("Yield generation error:", err);
      setStatus(`❌ Generate yield failed: ${err.message?.slice(0, 100)}`);
    } finally {
      setLoading(false);
    }
  };

  const harvest = async () => {
    await handleTx(getVault().harvest(), "Harvest", true);
  };

  const claim = async () => {
    const vault = getVault();
    const rewardsAmount = parseFloat(pendingRewards);
    
    if (rewardsAmount === 0) {
      setStatus("❌ No rewards to claim!");
      return;
    }
    
    const vaultUsdc = parseFloat(vaultActualUsdc);
    if (vaultUsdc < rewardsAmount) {
      setStatus(`❌ Vault only has ${vaultActualUsdc} USDC. Need more!`);
      return;
    }
    
    await handleTx(vault.claim(), "Claim Rewards");
  };

  const withdraw = async () => {
    const vault = getVault();
    const amountToWithdraw = parseAmount(amount);
    
    if (amountToWithdraw === 0) {
      setStatus("❌ Please enter a valid amount");
      return;
    }
    
    await handleTx(vault.withdraw(amountToWithdraw), "Withdraw", true);
  };
  
  const rebalance = async () => {
    await handleTx(getVault().rebalance(), "Rebalance");
  };

  const buttonStyle = {
    padding: "clamp(10px, 3vw, 12px)",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: "clamp(12px, 3.5vw, 14px)",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    width: "100%"
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      width: "100%",
      background: "#0a0a0a",
      color: "#e5e5e5"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "clamp(12px, 4vw, 24px)",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <h1 style={{ 
          color: "#3b82f6", 
          fontSize: "clamp(24px, 6vw, 42px)", 
          margin: "0 0 8px 0",
          textAlign: "center"
        }}>🔥 Sentient Shield Vault</h1>
        <p style={{ 
          fontSize: "clamp(14px, 4vw, 18px)", 
          color: "#9ca3af", 
          marginBottom: "clamp(16px, 5vw, 32px)",
          textAlign: "center"
        }}>Self-Operating DeFi Engine | AI + DeFi on HashKey Chain</p>
        
        {/* ShieldBot Modal */}
        {showShieldModal && (
          <div style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: "rgba(0,0,0,0.95)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            zIndex: 1000, 
            padding: "16px"
          }}>
            <div style={{ 
              background: "#1a1a1a", 
              padding: "clamp(20px, 5vw, 32px)", 
              borderRadius: 16, 
              maxWidth: "90%", 
              width: 400, 
              textAlign: "center", 
              border: "1px solid #2a2a2a"
            }}>
              <h2 style={{ color: shieldScore < 30 ? "#10b981" : shieldScore < 70 ? "#f59e0b" : "#ef4444" }}>🛡️ ShieldBot Analysis</h2>
              <p style={{ fontSize: 48, fontWeight: "bold", margin: "16px 0", color: "#e5e5e5" }}>{shieldScore}</p>
              <p style={{ color: "#9ca3af" }}>Risk Score</p>
              {shieldScore < 30 && <p style={{ color: "#10b981" }}>✅ Safe Transaction - Allowed</p>}
              {shieldScore >= 30 && shieldScore < 70 && <p style={{ color: "#f59e0b" }}>⚠️ Medium Risk - Warning</p>}
              {shieldScore >= 70 && <p style={{ color: "#ef4444" }}>❌ High Risk - Blocked</p>}
              <button 
                onClick={() => setShowShieldModal(false)} 
                style={{ 
                  marginTop: 20, 
                  padding: "12px 20px", 
                  background: "#3b82f6", 
                  color: "white", 
                  border: "none", 
                  borderRadius: 8, 
                  cursor: "pointer", 
                  width: "100%",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* NexaID Modal */}
        {showNexaModal && (
          <div style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: "rgba(0,0,0,0.95)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            zIndex: 1000, 
            padding: "16px"
          }}>
            <div style={{ 
              background: "#1a1a1a", 
              padding: "clamp(20px, 5vw, 32px)", 
              borderRadius: 16, 
              maxWidth: "90%", 
              width: 400, 
              textAlign: "center", 
              border: "1px solid #2a2a2a"
            }}>
              <h2 style={{ color: "#8b5cf6" }}>🔐 NexaID Verification Required</h2>
              <p style={{ color: "#9ca3af" }}>Please verify your identity with NexaID to use this vault.</p>
              <button 
                onClick={() => {
                  setShowNexaModal(false);
                  verifyWithNexaID();
                }}
                style={{ 
                  marginTop: 20, 
                  padding: "12px 20px", 
                  background: "#8b5cf6", 
                  color: "white", 
                  border: "none", 
                  borderRadius: 8, 
                  cursor: "pointer", 
                  width: "100%",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
              >
                Verify with NexaID
              </button>
              <button 
                onClick={() => setShowNexaModal(false)} 
                style={{ 
                  marginTop: 10, 
                  padding: "12px 20px", 
                  background: "#374151", 
                  color: "white", 
                  border: "none", 
                  borderRadius: 8, 
                  cursor: "pointer", 
                  width: "100%",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        {/* Wallet Section */}
        <div style={{ 
          background: "#111111", 
          padding: "clamp(16px, 4vw, 24px)", 
          borderRadius: 12, 
          marginBottom: "clamp(16px, 4vw, 24px)", 
          border: "1px solid #2a2a2a"
        }}>
          <button 
            onClick={connectWallet} 
            style={{ 
              background: "#3b82f6", 
              color: "white", 
              padding: "clamp(12px, 3.5vw, 14px) clamp(16px, 4vw, 24px)", 
              border: "none", 
              borderRadius: 8, 
              cursor: "pointer", 
              width: "100%", 
              fontSize: "clamp(14px, 4vw, 16px)", 
              fontWeight: "bold",
              transition: "opacity 0.2s"
            }} 
            disabled={loading}
          >
            {account ? "Wallet Connected" : "Connect Wallet"}
          </button>
          {account && (
            <p style={{ 
              marginTop: 12, 
              wordBreak: "break-all", 
              color: "#9ca3af",
              fontSize: "clamp(12px, 3.5vw, 14px)"
            }}>
              <strong>Address:</strong> {account.slice(0,6)}...{account.slice(-4)}
            </p>
          )}
          {isOwner && <p style={{ color: "#10b981", marginTop: 8 }}>👑 Owner Mode Active</p>}
          {nexaidVerified ? (
            <p style={{ color: "#10b981", marginTop: 8 }}>✅ NexaID Verified | Score: {nexaidScore}</p>
          ) : (
            <p style={{ color: "#f59e0b", marginTop: 8 }}>⚠️ NexaID Verification Required</p>
          )}
          <p style={{ marginTop: 8, color: "#9ca3af" }}>
            <strong>Status:</strong> {status}
          </p>
          
          {/* ✅ NexaID Verify Button */}
          {account && !nexaidVerified && (
            <button
              onClick={verifyWithNexaID}
              disabled={loading}
              style={{
                marginTop: 12,
                padding: "clamp(10px, 3vw, 12px)",
                background: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
                fontSize: "clamp(12px, 3.5vw, 14px)"
              }}
            >
              🔐 Verify with NexaID
            </button>
          )}
        </div>
        
        {/* Balance Cards - Responsive Grid */}
        {account && (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", 
            gap: "clamp(10px, 3vw, 16px)", 
            marginBottom: "clamp(16px, 4vw, 24px)"
          }}>
            <div style={{ background: "#1e3a8a", padding: "clamp(12px, 3vw, 16px)", borderRadius: 12, border: "1px solid #3b82f6" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>💰 USDC</h4>
              <p style={{ fontSize: "clamp(16px, 5vw, 20px)", fontWeight: "bold", margin: 0, color: "#e5e5e5" }}>{usdcBalance}</p>
            </div>
            <div style={{ background: "#1e3a8a", padding: "clamp(12px, 3vw, 16px)", borderRadius: 12, border: "1px solid #3b82f6" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>🏦 Your Vault</h4>
              <p style={{ fontSize: "clamp(16px, 5vw, 20px)", fontWeight: "bold", margin: 0, color: "#e5e5e5" }}>{vaultBalance}</p>
            </div>
            <div style={{ background: "#1e3a8a", padding: "clamp(12px, 3vw, 16px)", borderRadius: 12, border: "1px solid #3b82f6" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>🏦 Vault USDC</h4>
              <p style={{ fontSize: "clamp(16px, 5vw, 20px)", fontWeight: "bold", margin: 0, color: "#e5e5e5" }}>{vaultActualUsdc}</p>
            </div>
            <div style={{ background: "#5b21b6", padding: "clamp(12px, 3vw, 16px)", borderRadius: 12, border: "1px solid #8b5cf6" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>🎁 Rewards</h4>
              <p style={{ fontSize: "clamp(16px, 5vw, 20px)", fontWeight: "bold", margin: 0, color: "#c084fc" }}>{pendingRewards}</p>
            </div>
            <div style={{ background: "#065f46", padding: "clamp(12px, 3vw, 16px)", borderRadius: 12, border: "1px solid #10b981" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>💰 Bounties</h4>
              <p style={{ fontSize: "clamp(16px, 5vw, 20px)", fontWeight: "bold", margin: 0, color: "#34d399" }}>{userBounties}</p>
            </div>
          </div>
        )}
        
        {/* Gamification Card */}
        {account && (
          <div style={{ 
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", 
            padding: "clamp(16px, 4vw, 24px)", 
            borderRadius: 12, 
            marginBottom: "clamp(16px, 4vw, 24px)", 
            border: "1px solid #f59e0b"
          }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#f59e0b", fontSize: "clamp(18px, 5vw, 24px)" }}>🎮 Your Gamification Profile</h3>
            <div style={{ 
              display: "flex", 
              flexDirection: "row", 
              flexWrap: "wrap", 
              gap: "clamp(16px, 4vw, 32px)", 
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ flex: 1, minWidth: "150px" }}>
                <p style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: "bold", margin: 0, color: "#fbbf24" }}>⭐ Level {userLevel}</p>
                <p style={{ marginTop: 8, color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>XP: {userXP} / {nextLevelXP}</p>
                <div style={{ 
                  width: "100%", 
                  height: "8px", 
                  background: "#2a2a2a", 
                  borderRadius: 4, 
                  overflow: "hidden",
                  marginTop: 8
                }}>
                  <div style={{ 
                    width: `${(userXP / nextLevelXP) * 100}%`, 
                    height: "100%", 
                    background: "#f59e0b", 
                    borderRadius: 4,
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>
              <div>
                <p style={{ margin: 0, color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>🎁 Bonus:</strong> +{levelBonus}% on harvest</p>
                <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>🏆 NexaID Bonus:</strong> +{reputationBonus}%</p>
                <p style={{ margin: 0, color: "#fbbf24", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>Total Bonus:</strong> +{levelBonus + reputationBonus}%</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Input */}
        <div style={{ marginBottom: "clamp(16px, 4vw, 24px)" }}>
          <input 
            type="number" 
            placeholder="Enter amount (e.g., 100)" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            style={{ 
              padding: "clamp(12px, 3.5vw, 14px)", 
              width: "100%", 
              fontSize: "clamp(14px, 4vw, 16px)", 
              borderRadius: 8, 
              border: "1px solid #2a2a2a",
              backgroundColor: "#111111",
              color: "#e5e5e5",
              boxSizing: "border-box"
            }} 
            disabled={loading} 
          />
        </div>
        
        {/* Buttons - Responsive Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", 
          gap: "clamp(10px, 3vw, 12px)", 
          marginBottom: "clamp(16px, 4vw, 24px)"
        }}>
          <button onClick={mint} disabled={loading || !account} style={{...buttonStyle, background: "#3b82f6"}}>💰 Mint USDC</button>
          <button onClick={approve} disabled={loading || !account} style={{...buttonStyle, background: "#3b82f6"}}>✅ Approve</button>
          <button onClick={deposit} disabled={loading || !account} style={{...buttonStyle, background: "#3b82f6"}}>📤 Deposit</button>
          <button onClick={withdraw} disabled={loading || !account} style={{...buttonStyle, background: "#ef4444"}}>📤 Withdraw</button>
          
          {isOwner && <button onClick={generateYield} disabled={loading} style={{...buttonStyle, background: "#10b981"}}>🌟 Generate Yield</button>}
          <button onClick={harvest} disabled={loading || !account} style={{...buttonStyle, background: "#3b82f6"}}>🌾 Harvest</button>
          <button onClick={claim} disabled={loading || !account || parseFloat(pendingRewards) === 0} style={{...buttonStyle, background: parseFloat(pendingRewards) > 0 ? "#8b5cf6" : "#374151"}}>🎁 Claim</button>
          <button onClick={rebalance} disabled={loading || !account} style={{...buttonStyle, background: "#f59e0b"}}>🔄 Rebalance</button>
        </div>
        
        {/* Stats */}
        <div style={{ 
          padding: "clamp(16px, 4vw, 24px)", 
          background: "#111111", 
          borderRadius: 12, 
          border: "1px solid #2a2a2a"
        }}>
          <h3 style={{ margin: "0 0 12px 0", color: "#f59e0b", fontSize: "clamp(18px, 5vw, 24px)" }}>📊 Vault Stats</h3>
          <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>Total Yield Available:</strong> {totalYield}</p>
          <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>Rebalance Bounty:</strong> 0.05% of total deposits</p>
          <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>Cooldown:</strong> 60 seconds | <strong>Performance Fee:</strong> 10%</p>
          <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>Signal Score:</strong> 75 (Bull Regime) → AlphaVault Boost</p>
          <p style={{ margin: "8px 0", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}><strong>Security:</strong> ShieldBot | NexaID | Pause | Liquidity Check</p>
        </div>
      </div>
    </div>
  );
}

// ✅ Main Component with Router
function App() {
  return (
    <BrowserRouter>
      <nav style={{ 
        padding: "clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)", 
        background: "#0f0f0f", 
        color: "white", 
        display: "flex", 
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "clamp(12px, 3vw, 16px)", 
        alignItems: "center", 
        justifyContent: "space-between",
        borderBottom: "1px solid #2a2a2a",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{ 
          color: "white", 
          textDecoration: "none", 
          fontWeight: "bold", 
          fontSize: "clamp(14px, 4vw, 18px)",
          whiteSpace: "nowrap"
        }}>🏦 Sentient Shield Vault</Link>
        <div style={{ display: "flex", gap: "clamp(8px, 2.5vw, 12px)" }}>
          <Link to="/" style={{ 
            color: "#9ca3af", 
            textDecoration: "none", 
            padding: "4px 12px", 
            borderRadius: 6, 
            fontSize: "clamp(12px, 3.5vw, 14px)",
            transition: "color 0.2s"
          }}>🏠 Vault</Link>
          <Link to="/strategy" style={{ 
            color: "#9ca3af", 
            textDecoration: "none", 
            padding: "4px 12px", 
            borderRadius: 6, 
            fontSize: "clamp(12px, 3.5vw, 14px)",
            transition: "color 0.2s"
          }}>📊 Strategy</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<VaultApp />} />
        <Route path="/strategy" element={<StrategyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;