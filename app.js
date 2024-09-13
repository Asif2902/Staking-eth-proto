
const { ethers } = window;


const stakingABI = [
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "_rewardToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "initialOwner",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "APY",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "SECONDS_IN_A_YEAR",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_staker",
                "type": "address"
            }
        ],
        "name": "getReward",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalStaked",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stake",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "stakers",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountStaked",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastStakedTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "rewardDebt",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalStaked",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
;
const stakingContractAddress = '0xcE3E021038C4f62209EFf23f1d2D3B3EbE83b600'; // Replace with your contract address

// Global variables for wallet connection
let provider;
let signer;
let contract;
let walletAddress;

// Minato Network Parameters
const minatoNetwork = {
  chainId: '0x79a', // 1946 in hexadecimal
  chainName: 'Minato',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://rpc.minato.soneium.org'],
  blockExplorerUrls: ['https://explorer-testnet.soneium.org']
};

// Check and Switch to Minato Network
async function switchToMinatoNetwork() {
  try {
    await provider.send("wallet_switchEthereumChain", [{ chainId: minatoNetwork.chainId }]);
  } catch (error) {
    // If the network has not been added, add it
    if (error.code === 4902) {
      try {
        await provider.send("wallet_addEthereumChain", [minatoNetwork]);
      } catch (addError) {
        alert("Failed to switch to the Minato network. Please try again.");
      }
    } else {
      alert("Error switching network: " + error.message);
    }
  }
}

// MetaMask Connection and Switching Network
async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    walletAddress = await signer.getAddress();
    
    // Switch to Minato Network
    await switchToMinatoNetwork();
    
    // Display the shortened wallet address
    document.getElementById("connectButton").innerText = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    
    // Initialize contract
    contract = new ethers.Contract(stakingContractAddress, stakingABI, signer);
    
    // Fetch initial data
    updateTotalStaked();
    updateWalletBalance();
    updateRewards();
  } else {
    alert("MetaMask is not installed. Please install MetaMask to use this feature.");
  }
}

// Fetch and Display Total Staked and ETH Price from CoinGecko
async function updateTotalStaked() {
  const totalStaked = await contract.getTotalStaked();
  const ethPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');

  const totalStakedETH = ethers.utils.formatEther(totalStaked);
  document.getElementById("totalStaked").innerText = `${totalStakedETH} ETH`;
  document.getElementById("ethInUSD").innerText = `${(totalStakedETH * ethPrice.data.ethereum.usd).toFixed(2)} USD`;
}

// Fetch Wallet Balance
async function updateWalletBalance() {
  const balance = await provider.getBalance(walletAddress);
  document.getElementById("walletBalance").innerText = ethers.utils.formatEther(balance);
}

// Fetch Rewards for Withdrawal
async function updateRewards() {
  const [_, reward] = await contract.getReward(walletAddress);
  document.getElementById("rewardAvailable").innerText = ethers.utils.formatUnits(reward, 18); // Assuming the reward token has 18 decimals
}

// Stake Function
document.getElementById("stakeButton").onclick = async function () {
  const stakeAmount = document.getElementById("stakeAmount").value;
  const stakeAmountWei = ethers.utils.parseEther(stakeAmount);
  
  await contract.stake({ value: stakeAmountWei });
  updateTotalStaked();
  updateWalletBalance();
};

// Unstake Function
document.getElementById("unstakeButton").onclick = async function () {
  const stakerData = await contract.stakers(walletAddress);
  const stakedAmount = stakerData.amountStaked;

  await contract.unstake(stakedAmount);
  updateTotalStaked();
  updateWalletBalance();
};

// Withdraw Reward Function
document.getElementById("withdrawButton").onclick = async function () {
  await contract.withdrawReward();
  updateRewards();
};

// Max Button for Staking
document.getElementById("maxStake").onclick = async function () {
  const balance = await provider.getBalance(walletAddress);
  const gasReserve = ethers.utils.parseEther("0.001"); // Reserve 0.001 ETH for gas
  const availableBalance = balance.sub(gasReserve); // Subtract gas reserve from balance

  // Ensure available balance is not negative
  const stakeAmount = availableBalance.isNegative() ? ethers.BigNumber.from("0") : availableBalance;

  document.getElementById("stakeAmount").value = ethers.utils.formatEther(stakeAmount);
};

// Connect Wallet on Button Click
document.getElementById("connectButton").onclick = connectWallet;
