import React, { useState, useEffect } from 'react';
import getWeb3 from '../../utils/web3';
import getContract from '../../utils/contract';
import './AgroCoinDashboard.css';

const AgroCoinDashboard = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [metrics, setMetrics] = useState({
        currentBlock: 0,
        blocksCreated: 0,
        totalVolume: 0,
        gasUsage: 0,
        agroCoinPrice: 0.10 // Static price in USD
    });
    const [transactions, setTransactions] = useState([]);
    const [walletBalances, setWalletBalances] = useState([]);
    const [initialBlock, setInitialBlock] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const web3Instance = await getWeb3();
                const contractInstance = await getContract();
                setWeb3(web3Instance);
                setContract(contractInstance);

                // Get initial block number
                const blockNumber = await web3Instance.eth.getBlockNumber();
                setInitialBlock(blockNumber);
                setMetrics(prev => ({ ...prev, currentBlock: blockNumber }));

                // Set up event listeners
                setupEventListeners(contractInstance);
                
                // Initial data fetch
                fetchWalletBalances(web3Instance, contractInstance);
                fetchTransactionHistory(contractInstance);
                fetchGasUsage(contractInstance);
                fetchTotalVolume(contractInstance);

                // Set up block number polling
                const blockInterval = setInterval(async () => {
                    const currentBlock = await web3Instance.eth.getBlockNumber();
                    setMetrics(prev => ({
                        ...prev,
                        currentBlock,
                        blocksCreated: currentBlock - initialBlock
                    }));
                }, 10000); // Poll every 10 seconds

                return () => clearInterval(blockInterval);
            } catch (error) {
                console.error('Error initializing AgroCoin Dashboard:', error);
            }
        };

        init();
    }, []);

    const setupEventListeners = (contractInstance) => {
        contractInstance.events.Transfer({}, (error, event) => {
            if (error) {
                console.error('Error in Transfer event:', error);
                return;
            }
            setTransactions(prev => [{
                from: event.returnValues.from,
                to: event.returnValues.to,
                amount: web3.utils.fromWei(event.returnValues.value, 'ether'),
                timestamp: new Date().toLocaleString()
            }, ...prev].slice(0, 10)); // Keep last 10 transactions
        });
    };

    const fetchWalletBalances = async (web3Instance, contractInstance) => {
        try {
            const accounts = await web3Instance.eth.getAccounts();
            const balances = await Promise.all(
                accounts.map(async (account) => {
                    const balance = await contractInstance.methods.balanceOf(account).call();
                    return {
                        address: account,
                        balance: web3Instance.utils.fromWei(balance, 'ether')
                    };
                })
            );
            setWalletBalances(balances);
        } catch (error) {
            console.error('Error fetching wallet balances:', error);
        }
    };

    const fetchTransactionHistory = async (contractInstance) => {
        try {
            const events = await contractInstance.getPastEvents('Transfer', {
                fromBlock: initialBlock,
                toBlock: 'latest'
            });
            
            const formattedEvents = events.map(event => ({
                from: event.returnValues.from,
                to: event.returnValues.to,
                amount: web3.utils.fromWei(event.returnValues.value, 'ether'),
                timestamp: new Date().toLocaleString()
            }));
            
            setTransactions(formattedEvents.slice(0, 10));
        } catch (error) {
            console.error('Error fetching transaction history:', error);
        }
    };

    const fetchGasUsage = async (contractInstance) => {
        try {
            const events = await contractInstance.getPastEvents('Transfer', {
                fromBlock: initialBlock,
                toBlock: 'latest'
            });
            
            const totalGas = events.reduce((sum, event) => sum + event.transactionGas, 0);
            setMetrics(prev => ({ ...prev, gasUsage: totalGas }));
        } catch (error) {
            console.error('Error fetching gas usage:', error);
        }
    };

    const fetchTotalVolume = async (contractInstance) => {
        try {
            const events = await contractInstance.getPastEvents('Transfer', {
                fromBlock: initialBlock,
                toBlock: 'latest'
            });
            
            const volume = events.reduce((sum, event) => 
                sum + parseFloat(web3.utils.fromWei(event.returnValues.value, 'ether')), 0);
            setMetrics(prev => ({ ...prev, totalVolume: volume }));
        } catch (error) {
            console.error('Error fetching total volume:', error);
        }
    };

    return (
        <div className="agrocoin-dashboard">
            <div className="metrics-grid">
                <div className="metric-card">
                    <h3>AgroCoin Price</h3>
                    <p>${metrics.agroCoinPrice} USD</p>
                </div>
                
                <div className="metric-card">
                    <h3>Current Block</h3>
                    <p>{metrics.currentBlock}</p>
                </div>
                
                <div className="metric-card">
                    <h3>Blocks Created</h3>
                    <p>{metrics.blocksCreated}</p>
                </div>
                
                <div className="metric-card">
                    <h3>Total Volume</h3>
                    <p>{metrics.totalVolume.toFixed(2)} AGC</p>
                </div>
                
                <div className="metric-card">
                    <h3>Gas Usage</h3>
                    <p>{metrics.gasUsage} units</p>
                </div>
                
                <div className="metric-card">
                    <h3>Layer</h3>
                    <p>Layer 1 (Local Node)</p>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="section">
                    <h3>Wallet Balances</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Address</th>
                                    <th>Balance (AGC)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {walletBalances.map((wallet, index) => (
                                    <tr key={index}>
                                        <td>{wallet.address}</td>
                                        <td>{wallet.balance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="section">
                    <h3>Recent Transactions</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Amount</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, index) => (
                                    <tr key={index}>
                                        <td>{tx.from}</td>
                                        <td>{tx.to}</td>
                                        <td>{tx.amount} AGC</td>
                                        <td>{tx.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgroCoinDashboard; 