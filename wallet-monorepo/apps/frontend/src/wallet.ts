import detectEthereumProvider from '@metamask/detect-provider'

export type ConnectResult = {
  address: string | null
  chainId: string | null
  error?: string
}

declare global {
  interface Window { ethereum?: any }
}

export async function hasMetaMask(): Promise<boolean> {
  const provider = (await detectEthereumProvider()) as any
  return !!provider
}

export async function connectWallet(): Promise<ConnectResult> {
  const provider = (await detectEthereumProvider()) as any
  if (!provider) return { address: null, chainId: null, error: 'No wallet detected' }
  try {
    // Request permissions to ensure MetaMask shows a prompt when needed
    await provider.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    })
    const accounts: string[] = await provider.request({ method: 'eth_accounts' })
    const chainId: string = await provider.request({ method: 'eth_chainId' })
    const address = accounts?.[0] ?? null
    return { address, chainId }
  } catch (e: any) {
    return { address: null, chainId: null, error: e?.message ?? 'Failed to connect' }
  }
}

export async function onAccountsChanged(cb: (accounts: string[]) => void) {
  const provider = (await detectEthereumProvider()) as any
  provider?.on?.('accountsChanged', cb)
  return () => provider?.removeListener?.('accountsChanged', cb)
}

export async function onChainChanged(cb: (chainId: string) => void) {
  const provider = (await detectEthereumProvider()) as any
  provider?.on?.('chainChanged', cb)
  return () => provider?.removeListener?.('chainChanged', cb)
}

// Note: MetaMask does not expose a programmatic "disconnect" for security.
// We clear local UI state; users can disconnect in MetaMask settings if needed.
export async function disconnectWallet(): Promise<void> {
  const provider = (await detectEthereumProvider()) as any
  if (!provider) return
  try {
    // Revoke account permission so next connect will prompt again
    await provider.request({
      method: 'wallet_revokePermissions',
      params: [{ eth_accounts: {} }],
    })
  } catch (e) {
    // Some wallets may not support revoke; ignore and just clear UI state
  }
}
