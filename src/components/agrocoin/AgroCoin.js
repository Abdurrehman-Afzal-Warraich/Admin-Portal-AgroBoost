import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import getWeb3 from '../../utils/web3';
import getContract from '../../utils/contract';
import './AgroCoin.css';

const AgroCoin = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');
    try {
      const web3Instance = await getWeb3();
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }
      setAccount(accounts[0]);

      const contractInstance = await getContract();
      setContract(contractInstance);

      const balance = await contractInstance.methods.balanceOf(accounts[0]).call();
      setBalance(web3Instance.utils.fromWei(balance, 'ether'));

      const supply = await contractInstance.methods.totalSupply().call();
      setTotalSupply(web3Instance.utils.fromWei(supply, 'ether'));

      // Set up event listener for transfers
      contractInstance.events.Transfer({}, (error, event) => {
        if (error) {
          console.error('Error in Transfer event:', error);
          return;
        }
        setRecentTransactions(prev => [{
          from: event.returnValues.from,
          to: event.returnValues.to,
          amount: web3Instance.utils.fromWei(event.returnValues.value, 'ether'),
          timestamp: new Date().toLocaleString()
        }, ...prev].slice(0, 5));
      });
    } catch (err) {
      if (err.message.includes('denied account access')) {
        setError('Please connect your MetaMask wallet to use this feature. Click the "Connect Wallet" button and accept the connection request.');
      } else {
        setError('Failed to load account data: ' + err.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsTransferring(true);

    try {
      if (!web3 || !contract) {
        throw new Error('Please connect your wallet first');
      }

      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }

      const amountWei = web3.utils.toWei(amount, 'ether');

      await contract.methods.transfer(recipient, amountWei).send({
        from: accounts[0]
      });

      const newBalance = await contract.methods.balanceOf(accounts[0]).call();
      setBalance(web3.utils.fromWei(newBalance, 'ether'));
      
      setSuccess('Transfer successful!');
      setRecipient('');
      setAmount('');
    } catch (err) {
      setError('Transfer failed: ' + err.message);
    } finally {
      setIsTransferring(false);
    }
  };

  if (!account) {
    return (
      <div className="p-4 text-center">
        <Card className="mx-auto wallet-connect-card">
          <Card.Body>
            <h3 className="mb-4">Connect Your Wallet</h3>
            <p className="mb-4">
              To use the AgroCoin Dashboard, you need to connect your MetaMask wallet.
              Make sure you have MetaMask installed and are connected to your local Ganache network.
            </p>
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}
            <Button 
              variant="primary" 
              onClick={connectWallet}
              disabled={isConnecting}
              className="connect-wallet-btn"
            >
              {isConnecting ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </Button>
            <div className="mt-4 setup-instructions">
              <h5>Setup Instructions:</h5>
              <ol className="text-start">
                <li>Install MetaMask browser extension if you haven't already</li>
                <li>Connect MetaMask to your local Ganache network:
                  <ul>
                    <li>Network Name: Localhost 8545</li>
                    <li>RPC URL: http://localhost:8545</li>
                    <li>Chain ID: 1337</li>
                    <li>Currency Symbol: ETH</li>
                  </ul>
                </li>
                <li>Import your Ganache account into MetaMask</li>
                <li>Click "Connect Wallet" above</li>
              </ol>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="transfer-container">
      <Row>
        <Col md={6}>
          <Card className="account-info-card">
            <Card.Header>
              <h4>Account Information</h4>
            </Card.Header>
            <Card.Body>
              <div className="info-item">
                <span className="label">Connected Account:</span>
                <span className="value account-address">{account}</span>
              </div>
              <div className="info-item">
                <span className="label">Token Balance:</span>
                <span className="value balance">{balance} AGC</span>
              </div>
              <div className="info-item">
                <span className="label">Total Supply:</span>
                <span className="value supply">{totalSupply} AGC</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="transfer-form-card">
            <Card.Header>
              <h4>Transfer Tokens</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleTransfer}>
                <Form.Group className="mb-4">
                  <Form.Label>Recipient Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter recipient address"
                    required
                    className="form-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Amount (AGC)</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    required
                    min="0"
                    step="0.000001"
                    className="form-input"
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isTransferring}
                  className="transfer-btn"
                >
                  {isTransferring ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Transferring...
                    </>
                  ) : (
                    'Transfer'
                  )}
                </Button>
              </Form>

              {error && (
                <Alert variant="danger" className="mt-3 alert-animate">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mt-3 alert-animate">
                  {success}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {recentTransactions.length > 0 && (
        <Card className="mt-4 recent-transactions-card">
          <Card.Header>
            <h4>Recent Transactions</h4>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx, index) => (
                    <tr key={index} className="transaction-row">
                      <td>{tx.from}</td>
                      <td>{tx.to}</td>
                      <td>{tx.amount} AGC</td>
                      <td>{tx.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AgroCoin; 