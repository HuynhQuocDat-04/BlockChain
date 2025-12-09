import { useEffect, useState } from 'react'
import { connectWallet, disconnectWallet, hasMetaMask, onAccountsChanged, onChainChanged } from './wallet'

export default function App() {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const shortAddress = (addr: string | null) => {
    if (!addr) return '—'
    const head = addr.slice(0, 6)
    const tail = addr.slice(-6)
    return `${head}…${tail}`
  }

  const onConnect = async () => {
    setLoading(true)
    setError(null)
    const res = await connectWallet()
    if (res.error) setError(res.error)
    setAddress(res.address)
    setChainId(res.chainId)
    setLoading(false)
  }

  const onDisconnect = async () => {
    setLoading(true)
    try {
      await disconnectWallet()
    } finally {
      setAddress(null)
      setChainId(null)
      setLoading(false)
    }
  }

  const [supported, setSupported] = useState<boolean>(true)

  useEffect(() => {
    let unAcc: (() => void) | undefined
    let unChain: (() => void) | undefined
    hasMetaMask().then(setSupported)
    ;(async () => {
      unAcc = await onAccountsChanged((accs) => setAddress(accs?.[0] ?? null))
      unChain = await onChainChanged((cid) => setChainId(cid))
    })()
    return () => {
      unAcc?.()
      unChain?.()
    }
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f7fafc',
        position: 'relative',
        paddingTop: 72, // space for the top-right button
        paddingRight: 16,
        paddingLeft: 16,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
      }}
    >
      {/* Top-right connect/disconnect button */}
      <div style={{ position: 'fixed', top: 16, right: 16 }}>
        <button onClick={address ? onDisconnect : onConnect} disabled={loading || !supported} style={{
          padding: '10px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600
        }}>
          {loading ? (address ? 'Disconnecting…' : 'Connecting…') : (address ? 'Disconnect' : 'Connect wallet')}
        </button>
      </div>
      <div style={{ background: 'transparent', border: 'none', borderRadius: 0, padding: 0, width: 'auto', boxShadow: 'none' }}>
        {!supported && (
          <div style={{ padding: 12, background: '#fff3cd', color: '#664d03', border: '1px solid #ffecb5', borderRadius: 8, marginBottom: 12 }}>
            No wallet detected. Please install MetaMask.
          </div>
        )}
        <div style={{ marginTop: 8, fontSize: 14, color: '#334155' }}>
          <div>
            <strong>Address:</strong> <span title={address ?? ''}>{shortAddress(address)}</span>
          </div>
          <div><strong>Chain ID:</strong> {chainId ?? '—'}</div>
        </div>
        {error && <div style={{ marginTop: 12, color: '#b91c1c' }}>{error}</div>}
      </div>
    </div>
  )
}
