import { Asset, BlockfrostProvider, BrowserWallet, Transaction, checkSignature, generateNonce } from "@meshsdk/core";
import { useEffect, useState } from "react";

export default function Home() {
  const poolId = 'pool13la5erny3srx9u4fz9tujtl2490350f89r4w4qjhk0vdjmuv78v' // ALFA
  
  const [wallets, setWallets] = useState<null | any>(null)
  const [browserWallet, setBrowserWallet] = useState<null | any>(null)
  const [balance, setBalance] = useState<null | any>(null)
  const [assets, setAssets] = useState<null | any>(null)
  const [rewardAddresses, setRewardAddresses] = useState<null | any>(null)
  const [stakeKey, setStakeKey] = useState<null | any>(null)
  const [accountInfo, setAccountInfo] = useState<null | any>(null)
  const [nonce, setNonce] = useState<null | any>(null)
  const [signature, setSignature] = useState<null | any>(null)
  const [recipientAddress, setRecipientAddress] = useState<null | any>(null)
  const [adaAmount, setAdaAmount] = useState<null | any>(null)

  const blockfrostProvider = new BlockfrostProvider('api key')

  const getInstalledWallets = () => {
    const _wallets = BrowserWallet.getInstalledWallets()
    console.log(_wallets)
    setWallets(_wallets)
  }

  const connectWallet = async (walletName: string) => {
    try {
      const _browserWallet = await BrowserWallet.enable(walletName)
      setBrowserWallet(_browserWallet)
    } catch (err) {
      console.log(err)
    }
  }

  const getBalance = async () => {
    const _balance = await browserWallet.getBalance()
    setBalance(_balance)
  }

  const getAssets = async () => {
    const _assets = await browserWallet.getAssets()
    setAssets(_assets)
  }

  const getRewardAddresses = async () => {
    const _rewardAddresses = await browserWallet.getRewardAddresses()
    console.log(_rewardAddresses)
    setStakeKey(_rewardAddresses[0])
  }

  const fetchAccountInfo = async () => {
    const _accountInfo = await blockfrostProvider.fetchAccountInfo(stakeKey)
    setAccountInfo(_accountInfo)
  }

  const registerAndDelegate = async () => {
    const tx = new Transaction({ initiator: browserWallet });
    tx.registerStake(stakeKey);
    tx.delegateStake(stakeKey, poolId);

    // tx => cbor (unsigned)
    const unsignedTx = await tx.build()
    const signedTx = await browserWallet.signTx(unsignedTx)
    const txHash = await browserWallet.submitTx(signedTx)
    console.log(txHash)
  }

  const delegate = async () => {
    const tx = new Transaction({ initiator: browserWallet })
    tx.delegateStake(stakeKey, poolId)

    // tx => cbor (unsigned)
    const unsignedTx = await tx.build()
    const signedTx = await browserWallet.signTx(unsignedTx)
    const txHash = await browserWallet.submitTx(signedTx)
    console.log(txHash)
  }

  // prove the ownership of an account
  // payload is a nonce (random) generated from the backend + save to db
  const signData = async (payload: string) => {
    const _signature = await browserWallet.signData(stakeKey, payload)
    setSignature(_signature)
    console.log(_signature)
  }

  const verify = () => {
    const result = checkSignature(nonce, stakeKey, signature)
    console.log(result)
  }

  const sendAda = async (address: string, ada: string) => {
    const lovelace = parseInt(ada) * 1_000_000
    const tx = new Transaction({ initiator: browserWallet })
      .sendLovelace(address, lovelace.toString())

    const unsignedTx = await tx.build()
    const signedTx = await browserWallet.signTx(unsignedTx)
    const txHash = await browserWallet.submitTx(signedTx)
    console.log(txHash)
  }

  const sendAdaAndAsset = async (address: string, ada: string) => {
    let assets: Asset[] = []

    assets.push({
      unit: '05cf1f9c1e4cdcb6702ed2c978d55beff5e178b206b4ec7935d5e0563232325050424c32303233436f64616e6172',
      quantity: '1'
    })

    const lovelace = parseInt(ada) * 1_000_000

    const tx = new Transaction({ initiator: browserWallet })
      .sendLovelace(address, lovelace.toString())
      .sendAssets(address, assets)

    const unsignedTx = await tx.build()
    const signedTx = await browserWallet.signTx(unsignedTx)
    const txHash = await browserWallet.submitTx(signedTx)
    console.log(txHash)
  }

  // mount
  useEffect(() => {
    const _nonce = generateNonce()
    setNonce(_nonce)
  }, []) // dependency array )

  return (
    <div>
      <h1>Cardano Training</h1>
      <div>
        <h2>Get installed wallets</h2>
        <button className="btn" onClick={() => getInstalledWallets()}>Get Installed Wallets</button>
        {wallets ? (
          wallets.map((w: any) => {
            return (
              <>
                <button className="btn" onClick={() => connectWallet(w.name)}>
                  Connect {w.name}
                </button><br/>
              </>
            )
          })
        ) : (
          <h2>No Cardano wallets</h2>
        )} 
      </div>
      <hr/>
      <div>
        <h2>Connect Wallet</h2>
        {browserWallet ? (
          <>
            <div>
              <h2>Balance</h2>
              <button className="btn" onClick={() => getBalance()}>Get Balance</button>
              {balance ? (
                <pre>
                  <code>
                    {JSON.stringify(balance, null, 2)}
                  </code>
                </pre>
              ) : (
                <h2>No balance</h2>
              )}
            </div>
            <hr/>
            <div>
              <h2>Assets</h2>
              <button className="btn" onClick={() => getAssets()}>Get Assets</button>
              {assets ? (
                <pre>
                  <code>
                    {JSON.stringify(assets, null, 2)}
                  </code>
                </pre>
              ) : (
                <h2>No Assets</h2>
              )}
            </div>
            <hr/>
            <div>
              <h2>Reward Address</h2>
              <button className="btn" onClick={() => getRewardAddresses()}>Get StakeKey</button>
              {stakeKey ? <h2>{stakeKey}</h2> : <h2>No stakekey</h2>}
            </div>
            <hr/>
            <div>
              <h2>Account Info</h2>
              <button className="btn" onClick={() => fetchAccountInfo()}>Fetch Info</button>
              {accountInfo ? (
                <pre>
                  <code>
                    {JSON.stringify(accountInfo, null, 2)}
                  </code>
                </pre>
              ) : (
                <h2>No accountInfo</h2>
              )}
            </div>
            <div>
              {accountInfo?.active !== undefined && (
                accountInfo.active
                  ? <button className="btn" onClick={() => delegate()}>Delegate</button>
                  : <button className="btn" onClick={() => registerAndDelegate()}>Register & Delegate</button>
              )}
            </div>
            <hr/>
            <div>
                <h2>Nonce: {nonce}</h2>
                <button className="btn" onClick={() => signData(nonce)}>Sign Data</button>
                <button className="btn" onClick={() => verify()}>Verify</button>
            </div>
            <hr/>
            <div>
              <h2>Send Lovelace (ADA)</h2>
              <input type="text" 
                value={recipientAddress}
                onChange={e => setRecipientAddress(e.target.value)}
                style={{color: 'black'}} />
              <h3>Ada Amount</h3>
              <input type="number" 
                value={adaAmount}
                onChange={e => setAdaAmount(e.target.value)}
                style={{color: 'black'}} />
              <button className="btn"
                onClick={() => sendAda(recipientAddress, adaAmount)}>
                  Send ADA
              </button>
              <button className="btn"
                onClick={() => sendAdaAndAsset(recipientAddress, adaAmount)}>
                  Send Ada and Asset
              </button>
            </div>
          </>
        ): (
          <h2>Not connected</h2>
        )}
      </div>
    </div>
  );
}
