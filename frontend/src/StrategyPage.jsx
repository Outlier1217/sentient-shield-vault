import React from "react";

const StrategyPage = () => {
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
        padding: "clamp(16px, 4vw, 32px)",
        width: "100%",
        boxSizing: "border-box"
      }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(24px, 6vw, 48px)" }}>
          <h1 style={{ 
            color: "#3b82f6", 
            fontSize: "clamp(28px, 7vw, 48px)",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "clamp(8px, 2vw, 12px)"
          }}>🔥 Sentient Shield Vault</h1>
          <p style={{ fontSize: "clamp(14px, 4vw, 20px)", color: "#9ca3af" }}>Self-Operating DeFi Engine | AI + DeFi on HashKey Chain</p>
          <p style={{ color: "#6b7280", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Technical Strategy & Implementation Documentation</p>
        </div>

        {/* Overview */}
        <div style={{ 
          background: "#111111", 
          padding: "clamp(20px, 5vw, 32px)", 
          borderRadius: 16, 
          marginBottom: "clamp(20px, 5vw, 32px)", 
          border: "1px solid #2a2a2a"
        }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "clamp(12px, 3vw, 16px)", fontSize: "clamp(20px, 5vw, 28px)" }}>📋 System Overview</h2>
          <p style={{ color: "#9ca3af", fontSize: "clamp(14px, 4vw, 16px)" }}>Sentient Shield Vault (SSV) is an autonomous DeFi vault that combines:</p>
          <ul style={{ marginTop: 12, lineHeight: 1.8, paddingLeft: "clamp(20px, 5vw, 32px)", color: "#9ca3af", fontSize: "clamp(14px, 4vw, 16px)" }}>
            <li><strong style={{ color: "#3b82f6" }}>Dynamic Asset Allocation</strong> — Based on market signal (Bull/Neutral/Bear)</li>
            <li><strong style={{ color: "#3b82f6" }}>Keeperless Rebalancing</strong> — Anyone can rebalance and earn bounty</li>
            <li><strong style={{ color: "#3b82f6" }}>Fair Yield Distribution</strong> — User share-based rewards with performance fee</li>
            <li><strong style={{ color: "#3b82f6" }}>Gamification</strong> — XP & Level system with harvest bonuses</li>
            <li><strong style={{ color: "#3b82f6" }}>ZK Identity Layer</strong> — NexaID integration for compliance</li>
            <li><strong style={{ color: "#3b82f6" }}>Pre-Transaction Security</strong> — ShieldBot risk analysis</li>
          </ul>
        </div>

        {/* Core Architecture */}
        <div style={{ 
          background: "#111111", 
          padding: "clamp(20px, 5vw, 32px)", 
          borderRadius: 16, 
          marginBottom: "clamp(20px, 5vw, 32px)", 
          border: "1px solid #2a2a2a"
        }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "clamp(12px, 3vw, 16px)", fontSize: "clamp(20px, 5vw, 28px)" }}>🏗️ Core Architecture</h2>
          
          <h3 style={{ color: "#3b82f6", marginTop: 20, fontSize: "clamp(16px, 4.5vw, 20px)" }}>1️⃣ Prediction Signal Engine</h3>
          <p style={{ color: "#9ca3af", fontSize: "clamp(14px, 4vw, 16px)" }}><strong style={{ color: "#f59e0b" }}>Current Implementation:</strong> Deterministic mock signal (value: 75 → Bull Regime)</p>
          <p style={{ color: "#9ca3af", fontSize: "clamp(14px, 4vw, 16px)" }}><strong style={{ color: "#f59e0b" }}>Future Upgrade:</strong> Chainlink price feeds + Pyth market data + CDP health metrics</p>
          <pre style={{ 
            background: "#1a1a1a", 
            padding: "clamp(12px, 3vw, 16px)", 
            borderRadius: 8, 
            overflowX: "auto", 
            color: "#10b981", 
            border: "1px solid #2a2a2a", 
            fontFamily: "monospace", 
            fontSize: "clamp(10px, 3vw, 12px)", 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            marginTop: 12
          }}>
{`Signal Formula (Future):
Signal = (0.4 × Volatility EWMA) + (0.3 × CDP Health Factor) + (0.3 × Funding Rate Delta)

Output:
- 0-40   → Bear / Risk Off → RiskGuard +15%
- 40-70  → Neutral → No change
- 70-100 → Bull / Risk On → AlphaVault +10%`}
          </pre>

          <h3 style={{ color: "#3b82f6", marginTop: 20, fontSize: "clamp(16px, 4.5vw, 20px)" }}>2️⃣ Dynamic Asset Allocation</h3>
          <p style={{ color: "#9ca3af", fontSize: "clamp(14px, 4vw, 16px)" }}>Based on signal score, deposits are allocated across three strategies:</p>
          <div style={{ overflowX: "auto", marginTop: 12, WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr style={{ background: "#1f1f1f", borderBottom: "1px solid #2a2a2a" }}>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Strategy</th>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Bull (70)</th>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Neutral (40-70)</th>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Bear (40)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>AlphaVault (High Risk)</td>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>60%</td>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#f59e0b", fontSize: "clamp(12px, 3.5vw, 14px)" }}>50%</td>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#ef4444", fontSize: "clamp(12px, 3.5vw, 14px)" }}>30%</td>
                </tr>
                <tr>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>StableCore (Low Risk)</td>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>25%</td>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#f59e0b", fontSize: "clamp(12px, 3.5vw, 14px)" }}>30%</td>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#ef4444", fontSize: "clamp(12px, 3.5vw, 14px)" }}>30%</td>
                </tr>
                <tr>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>RiskGuard (Hedge)</td>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>15%</td>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#f59e0b", fontSize: "clamp(12px, 3.5vw, 14px)" }}>20%</td>
                  <td style={{ padding: "clamp(8px, 2vw, 10px)", border: "1px solid #2a2a2a", color: "#ef4444", fontSize: "clamp(12px, 3.5vw, 14px)" }}>40%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Flows */}
        <div style={{ 
          background: "#111111", 
          padding: "clamp(20px, 5vw, 32px)", 
          borderRadius: 16, 
          marginBottom: "clamp(20px, 5vw, 32px)", 
          border: "1px solid #2a2a2a"
        }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "clamp(12px, 3vw, 16px)", fontSize: "clamp(20px, 5vw, 28px)" }}>🔄 Transaction Flows</h2>
          
          <h3 style={{ color: "#10b981", marginTop: 20, fontSize: "clamp(16px, 4.5vw, 20px)" }}>💰 DEPOSIT Flow</h3>
          <pre style={{ 
            background: "#1a1a1a", 
            padding: "clamp(12px, 3vw, 16px)", 
            borderRadius: 8, 
            color: "#9ca3af", 
            border: "1px solid #2a2a2a", 
            fontFamily: "monospace", 
            fontSize: "clamp(10px, 3vw, 12px)", 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowX: "auto"
          }}>
{`1. User approves Vault to spend USDC
2. Vault.transferFrom() moves USDC from user to contract
3. User balance increases in balances mapping
4. totalDeposits increases
5. _allocate() distributes funds based on current signal
6. Emit Deposited event
7. User earns +10 XP for deposit`}
          </pre>

          <h3 style={{ color: "#f59e0b", marginTop: 20, fontSize: "clamp(16px, 4.5vw, 20px)" }}>🌟 GENERATE YIELD Flow (Owner Only)</h3>
          <pre style={{ 
            background: "#1a1a1a", 
            padding: "clamp(12px, 3vw, 16px)", 
            borderRadius: 8, 
            color: "#9ca3af", 
            border: "1px solid #2a2a2a", 
            fontFamily: "monospace", 
            fontSize: "clamp(10px, 3vw, 12px)", 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowX: "auto"
          }}>
{`1. Owner calls generateYield(amount)
2. Requires owner has enough USDC balance
3. USDC transferred from owner to vault
4. totalYield += amount (yield pool increases)
5. Emit YieldGenerated event
6. In production: yield would come from Aave/Compound/Lido`}
          </pre>

          <h3 style={{ color: "#8b5cf6", marginTop: 20, fontSize: "clamp(16px, 4.5vw, 20px)" }}>🌾 HARVEST Flow</h3>
          <pre style={{ 
            background: "#1a1a1a", 
            padding: "clamp(12px, 3vw, 16px)", 
            borderRadius: 8, 
            color: "#9ca3af", 
            border: "1px solid #2a2a2a", 
            fontFamily: "monospace", 
            fontSize: "clamp(10px, 3vw, 12px)", 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowX: "auto"
          }}>
{`1. User calls harvest()
2. Checks: totalYield > 0 AND cooldown passed (60 sec)
3. Calculate userShare = (userBalance × 1e18) / totalDeposits
4. Calculate grossReward = (totalYield × userShare) / 1e18
5. Calculate fee = (grossReward × 10%) / 100
6. Calculate netReward = grossReward - fee
7. Add netReward to user's rewards mapping
8. Add fee to owner's rewards mapping
9. totalYield -= grossReward
10. User earns +25 XP for harvest
11. Apply level bonus: +5% per level
12. Emit Harvested event`}
          </pre>

          <h3 style={{ color: "#ef4444", marginTop: 20, fontSize: "clamp(16px, 4.5vw, 20px)" }}>🎁 CLAIM Flow</h3>
          <pre style={{ 
            background: "#1a1a1a", 
            padding: "clamp(12px, 3vw, 16px)", 
            borderRadius: 8, 
            color: "#9ca3af", 
            border: "1px solid #2a2a2a", 
            fontFamily: "monospace", 
            fontSize: "clamp(10px, 3vw, 12px)", 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowX: "auto"
          }}>
{`1. User calls claim()
2. Checks: rewards[user] > 0
3. Checks: vault has enough USDC balance
4. reward = rewards[user]
5. rewards[user] = 0 (reentrancy protection)
6. USDC.transfer(user, reward)
7. User earns +15 XP for claiming
8. Emit RewardClaimed event`}
          </pre>

          <h3 style={{ color: "#f97316", marginTop: 20, fontSize: "clamp(16px, 4.5vw, 20px)" }}>🔄 REBALANCE Flow</h3>
          <pre style={{ 
            background: "#1a1a1a", 
            padding: "clamp(12px, 3vw, 16px)", 
            borderRadius: 8, 
            color: "#9ca3af", 
            border: "1px solid #2a2a2a", 
            fontFamily: "monospace", 
            fontSize: "clamp(10px, 3vw, 12px)", 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowX: "auto"
          }}>
{`1. Anyone calls rebalance()
2. Get current signal value (75 → Bull)
3. Recalculate allocations based on signal
4. Update alphaVault, stableCore, riskGuard
5. Pay bounty: (totalDeposits × 0.05%) / 10000
6. Transfer bounty from vault to caller
7. User earns +20 XP for rebalancing
8. Emit Rebalanced and BountyPaid events`}
          </pre>

          <h3 style={{ color: "#dc2626", marginTop: 20, fontSize: "clamp(16px, 4.5vw, 20px)" }}>📤 WITHDRAW Flow</h3>
          <pre style={{ 
            background: "#1a1a1a", 
            padding: "clamp(12px, 3vw, 16px)", 
            borderRadius: 8, 
            color: "#9ca3af", 
            border: "1px solid #2a2a2a", 
            fontFamily: "monospace", 
            fontSize: "clamp(10px, 3vw, 12px)", 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowX: "auto"
          }}>
{`1. User calls withdraw(amount)
2. Checks: userBalance >= amount AND vault USDC balance >= amount
3. Reduce user balance and totalDeposits
4. Transfer USDC from vault to user
5. User earns +5 XP for withdrawal
6. Emit Withdrawn event`}
          </pre>
        </div>

        {/* Gamification System */}
        <div style={{ 
          background: "#111111", 
          padding: "clamp(20px, 5vw, 32px)", 
          borderRadius: 16, 
          marginBottom: "clamp(20px, 5vw, 32px)", 
          border: "1px solid #2a2a2a"
        }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "clamp(12px, 3vw, 16px)", fontSize: "clamp(20px, 5vw, 28px)" }}>🎮 Gamification System</h2>
          
          <h3 style={{ color: "#f59e0b", fontSize: "clamp(16px, 4.5vw, 20px)" }}>XP Rewards Table</h3>
          <div style={{ overflowX: "auto", marginTop: 12, WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "300px" }}>
              <thead>
                <tr style={{ background: "#1f1f1f" }}>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Action</th>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>XP Reward</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Deposit</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+10 XP</td></tr>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Harvest</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+25 XP</td></tr>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Claim</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+15 XP</td></tr>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Rebalance</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+20 XP</td></tr>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Withdraw</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+5 XP</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 20, color: "#f59e0b", fontSize: "clamp(16px, 4.5vw, 20px)" }}>Level System</h3>
          <div style={{ overflowX: "auto", marginTop: 12, WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
              <thead>
                <tr style={{ background: "#1f1f1f" }}>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Level</th>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>XP Required</th>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Harvest Bonus</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>1</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>0-99</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+5%</td></tr>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>2</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>100-299</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+10%</td></tr>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>3</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>300-599</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+15%</td></tr>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>4</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>600-999</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+20%</td></tr>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>5</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>1000-1499</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+25%</td></tr>
                <tr><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>10+</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>5000+</td><td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>+50% (max)</td></tr>
              </tbody>
            </table>
          </div>

          <div style={{ 
            background: "linear-gradient(135deg, #1a1a2e, #1a1a2e)", 
            padding: "clamp(16px, 4vw, 24px)", 
            borderRadius: 12, 
            marginTop: 20, 
            border: "1px solid #3b82f6"
          }}>
            <h4 style={{ color: "#3b82f6", marginBottom: 8, fontSize: "clamp(14px, 4vw, 18px)" }}>🔮 Future Gamification Upgrades</h4>
            <ul style={{ marginLeft: "clamp(20px, 5vw, 32px)", lineHeight: 1.8, color: "#9ca3af", paddingRight: "8px", fontSize: "clamp(12px, 3.5vw, 14px)" }}>
              <li><strong style={{ color: "#f59e0b" }}>Fee Discounts:</strong> Higher level users will pay lower performance fees</li>
              <li><strong style={{ color: "#f59e0b" }}>Soulbound NFTs:</strong> Unique badges minted on each level up</li>
              <li><strong style={{ color: "#f59e0b" }}>Priority Withdrawals:</strong> High-level users get faster withdrawal processing</li>
              <li><strong style={{ color: "#f59e0b" }}>Governance Power:</strong> Level-based voting weight in DAO</li>
              <li><strong style={{ color: "#f59e0b" }}>Exclusive Access:</strong> High-level users get early access to new vaults</li>
              <li><strong style={{ color: "#f59e0b" }}>Leaderboard Rewards:</strong> Monthly bonus for top XP earners</li>
            </ul>
          </div>
        </div>

        {/* Security Layer */}
        <div style={{ 
          background: "#111111", 
          padding: "clamp(20px, 5vw, 32px)", 
          borderRadius: 16, 
          marginBottom: "clamp(20px, 5vw, 32px)", 
          border: "1px solid #2a2a2a"
        }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "clamp(12px, 3vw, 16px)", fontSize: "clamp(20px, 5vw, 28px)" }}>🛡️ Security Infrastructure</h2>
          
          <h3 style={{ color: "#3b82f6", fontSize: "clamp(16px, 4.5vw, 20px)" }}>1. ShieldBot Real-Time Firewall</h3>
          <p style={{ color: "#9ca3af", fontSize: "clamp(14px, 4vw, 16px)" }}>Pre-transaction security analysis:</p>
          <pre style={{ 
            background: "#1a1a1a", 
            padding: "clamp(12px, 3vw, 16px)", 
            borderRadius: 8, 
            color: "#9ca3af", 
            border: "1px solid #2a2a2a", 
            fontFamily: "monospace", 
            fontSize: "clamp(10px, 3vw, 12px)", 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowX: "auto"
          }}>
{`Risk Score Calculation:
- Transaction simulation
- Honeypot detection
- Sandwich attack prevention
- Mempool monitoring

Decision Matrix:
- Score < 30  → ALLOW (Safe transaction)
- Score 30-70 → WARN (User confirmation required)
- Score > 70  → BLOCK (Transaction rejected)`}
          </pre>

          <h3 style={{ marginTop: 20, color: "#3b82f6", fontSize: "clamp(16px, 4.5vw, 20px)" }}>2. NexaID Zero-Knowledge Identity Layer</h3>
          <p style={{ color: "#9ca3af", fontSize: "clamp(14px, 4vw, 16px)" }}>ZK-based identity verification for compliance:</p>
          <ul style={{ marginLeft: "clamp(20px, 5vw, 32px)", lineHeight: 1.8, color: "#9ca3af", paddingRight: "8px", fontSize: "clamp(12px, 3.5vw, 14px)" }}>
            <li>Users verify identity without revealing personal data</li>
            <li>ZK proofs ensure privacy-preserving KYC</li>
            <li>Only verified users can deposit/withdraw</li>
            <li>Reputation scores give bonus yield (up to 20%)</li>
            <li>Built on HashKey Chain for regulatory compliance</li>
          </ul>
          <pre style={{ 
            background: "#1a1a1a", 
            padding: "clamp(12px, 3vw, 16px)", 
            borderRadius: 8, 
            color: "#10b981", 
            border: "1px solid #2a2a2a", 
            fontFamily: "monospace", 
            marginTop: 12, 
            fontSize: "clamp(10px, 3vw, 12px)", 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowX: "auto"
          }}>
{`NexaID Integration:
- Verify user: nexaid.verify(user) → bool
- Get reputation: nexaid.getScore(user) → uint
- Score > 800 → +20% bonus on harvest
- Score > 500 → +10% bonus on harvest
- Unverified → Cannot deposit`}
          </pre>

          <h3 style={{ marginTop: 20, color: "#3b82f6", fontSize: "clamp(16px, 4.5vw, 20px)" }}>3. Additional Security Layers</h3>
          <ul style={{ marginLeft: "clamp(20px, 5vw, 32px)", lineHeight: 1.8, color: "#9ca3af", paddingRight: "8px", fontSize: "clamp(12px, 3.5vw, 14px)" }}>
            <li><strong style={{ color: "#f59e0b" }}>Pause Mechanism:</strong> Owner can pause all operations in emergency</li>
            <li><strong style={{ color: "#f59e0b" }}>Liquidity Check:</strong> Withdrawals require vault USDC balance</li>
            <li><strong style={{ color: "#f59e0b" }}>Reentrancy Protection:</strong> Checks-Effects-Interactions pattern</li>
            <li><strong style={{ color: "#f59e0b" }}>Cooldown Period:</strong> 60 seconds between harvests to prevent spam</li>
            <li><strong style={{ color: "#f59e0b" }}>Performance Fee:</strong> 10% fee for protocol sustainability</li>
          </ul>
        </div>

        {/* Economic Model */}
        <div style={{ 
          background: "#111111", 
          padding: "clamp(20px, 5vw, 32px)", 
          borderRadius: 16, 
          marginBottom: "clamp(20px, 5vw, 32px)", 
          border: "1px solid #2a2a2a"
        }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "clamp(12px, 3vw, 16px)", fontSize: "clamp(20px, 5vw, 28px)" }}>💰 Economic Model</h2>
          
          <h3 style={{ color: "#f59e0b", fontSize: "clamp(16px, 4.5vw, 20px)" }}>Revenue Streams</h3>
          <div style={{ overflowX: "auto", marginTop: 12, WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
              <thead>
                <tr style={{ background: "#1f1f1f" }}>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Source</th>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Rate</th>
                  <th style={{ padding: "clamp(8px, 2vw, 12px)", border: "1px solid #2a2a2a", textAlign: "left", color: "#f3f4f6", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Recipient</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Performance Fee</td>
                  <td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>10% of harvest</td>
                  <td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Protocol Treasury</td>
                </tr>
                <tr>
                  <td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Rebalance Bounty</td>
                  <td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#10b981", fontSize: "clamp(12px, 3.5vw, 14px)" }}>0.05% of deposits</td>
                  <td style={{ padding: "clamp(8px, 2vw, 8px)", border: "1px solid #2a2a2a", color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>Rebalance Caller</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Implementation */}
        <div style={{ 
          background: "#111111", 
          padding: "clamp(20px, 5vw, 32px)", 
          borderRadius: 16, 
          marginBottom: "clamp(20px, 5vw, 32px)", 
          border: "1px solid #2a2a2a"
        }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "clamp(12px, 3vw, 16px)", fontSize: "clamp(20px, 5vw, 28px)" }}>⚙️ Technical Implementation</h2>
          
          <h3 style={{ color: "#3b82f6", fontSize: "clamp(16px, 4.5vw, 20px)" }}>Smart Contract Architecture</h3>
          <pre style={{ 
            background: "#1a1a1a", 
            padding: "clamp(12px, 3vw, 16px)", 
            borderRadius: 8, 
            color: "#10b981", 
            border: "1px solid #2a2a2a", 
            fontFamily: "monospace", 
            fontSize: "clamp(10px, 3vw, 12px)", 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowX: "auto"
          }}>
{`Vault.sol (Main Contract)
├── IERC20 Interface (USDC)
├── INexaID Interface (ZK Identity)
├── State Variables
│   ├── balances: User deposits
│   ├── rewards: Pending rewards
│   ├── xp: Gamification points
│   ├── level: User level
│   └── bountiesEarned: Rebalancing rewards
├── Core Functions
│   ├── deposit() → Allocate funds + XP
│   ├── withdraw() → Return funds
│   ├── harvest() → Distribute yield + XP + Level Bonus
│   ├── claim() → Transfer rewards
│   └── rebalance() → Update allocations + Pay bounty
├── Security Modifiers
│   ├── onlyOwner
│   ├── notPaused
│   └── onlyVerified (NexaID)
└── Events
    ├── Deposited, Withdrawn, Harvested
    ├── Rebalanced, BountyPaid
    └── XPEarned, LevelUp`}
          </pre>

          <h3 style={{ marginTop: 20, color: "#3b82f6", fontSize: "clamp(16px, 4.5vw, 20px)" }}>Tech Stack</h3>
          <ul style={{ marginLeft: "clamp(20px, 5vw, 32px)", lineHeight: 1.8, color: "#9ca3af", paddingRight: "8px", fontSize: "clamp(12px, 3.5vw, 14px)" }}>
            <li><strong style={{ color: "#f59e0b" }}>Smart Contracts:</strong> Solidity 0.8.24</li>
            <li><strong style={{ color: "#f59e0b" }}>Development:</strong> Hardhat</li>
            <li><strong style={{ color: "#f59e0b" }}>Frontend:</strong> React + Vite + ethers.js</li>
            <li><strong style={{ color: "#f59e0b" }}>Blockchain:</strong> HashKey Chain (EVM Compatible)</li>
            <li><strong style={{ color: "#f59e0b" }}>Identity:</strong> NexaID (ZK Proofs)</li>
            <li><strong style={{ color: "#f59e0b" }}>Security:</strong> ShieldBot (Pre-Tx Analysis)</li>
          </ul>
        </div>

        {/* Future Roadmap */}
        <div style={{ 
          background: "#111111", 
          padding: "clamp(20px, 5vw, 32px)", 
          borderRadius: 16, 
          marginBottom: "clamp(20px, 5vw, 32px)", 
          border: "1px solid #2a2a2a"
        }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "clamp(12px, 3vw, 16px)", fontSize: "clamp(20px, 5vw, 28px)" }}>🚀 Future Roadmap</h2>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", 
            gap: "clamp(16px, 4vw, 24px)"
          }}>
            <div style={{ background: "#1a1a1a", padding: "clamp(16px, 4vw, 24px)", borderRadius: 12, border: "1px solid #2a2a2a" }}>
              <h3 style={{ color: "#10b981", fontSize: "clamp(14px, 4vw, 18px)" }}>Phase 1 (MVP - Complete)</h3>
              <ul style={{ marginLeft: "clamp(20px, 5vw, 32px)", lineHeight: 1.8, color: "#9ca3af", paddingRight: "8px", fontSize: "clamp(12px, 3.5vw, 14px)" }}>
                <li>✅ Core vault mechanics</li>
                <li>✅ Dynamic allocation</li>
                <li>✅ Yield distribution</li>
                <li>✅ Gamification (XP/Levels)</li>
                <li>✅ Bounty system</li>
                <li>✅ NexaID integration</li>
                <li>✅ ShieldBot mock</li>
              </ul>
            </div>
            
            <div style={{ background: "#1a1a1a", padding: "clamp(16px, 4vw, 24px)", borderRadius: 12, border: "1px solid #2a2a2a" }}>
              <h3 style={{ color: "#f59e0b", fontSize: "clamp(14px, 4vw, 18px)" }}>Phase 2 (Coming Soon)</h3>
              <ul style={{ marginLeft: "clamp(20px, 5vw, 32px)", lineHeight: 1.8, color: "#9ca3af", paddingRight: "8px", fontSize: "clamp(12px, 3.5vw, 14px)" }}>
                <li>🔲 Chainlink oracle integration</li>
                <li>🔲 Real yield sources (Aave/Compound)</li>
                <li>🔲 DAO governance</li>
                <li>🔲 Cross-chain expansion</li>
                <li>🔲 Advanced prediction models</li>
                <li>🔲 Fee discounts for high-level users</li>
              </ul>
            </div>
            
            <div style={{ background: "#1a1a1a", padding: "clamp(16px, 4vw, 24px)", borderRadius: 12, border: "1px solid #2a2a2a" }}>
              <h3 style={{ color: "#3b82f6", fontSize: "clamp(14px, 4vw, 18px)" }}>Phase 3 (Vision)</h3>
              <ul style={{ marginLeft: "clamp(20px, 5vw, 32px)", lineHeight: 1.8, color: "#9ca3af", paddingRight: "8px", fontSize: "clamp(12px, 3.5vw, 14px)" }}>
                <li>🔲 DeFi OS layer</li>
                <li>🔲 Institutional adoption</li>
                <li>🔲 AI-powered strategies</li>
                <li>🔲 Automated risk management</li>
                <li>🔲 Cross-protocol arbitrage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: "center", 
          padding: "clamp(20px, 5vw, 32px)", 
          color: "#6b7280", 
          borderTop: "1px solid #2a2a2a", 
          marginTop: "clamp(20px, 5vw, 32px)"
        }}>
          <p style={{ color: "#9ca3af", fontSize: "clamp(12px, 3.5vw, 14px)" }}>🔥 Sentient Shield Vault — DeFi that doesn't wait, it acts.</p>
          <p style={{ fontSize: "clamp(10px, 3vw, 12px)", color: "#6b7280" }}>Built on HashKey Chain | Powered by NexaID | Secured by ShieldBot</p>
        </div>
      </div>
    </div>
  );
};

export default StrategyPage;