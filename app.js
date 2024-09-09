import { ethers } from './ethers.js'; // Make sure to include ethers.js

// Replace with your actual staking contract address
const contractAddress = '0xcE3E021038C4f62209EFf23f1d2D3B3EbE83b600';
const abi = [
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
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
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
]


let provider;
let signer;
let stakingContract;

const connectWalletButton = document.getElementById("connectWallet");
const walletAddressDisplay = document.getElementById("walletAddress");
const totalStakedDisplay = document.getElementById("total-staked");

async function loadWeb3() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    stakingContract = new ethers.Contract(contractAddress, abi, signer);

    // Connect Wallet Button
    connectWalletButton.addEventListener("click", connectWallet);

    // Load the Total Staked
    loadTotalStaked();
  } else {
    alert("Please install MetaMask or any Ethereum wallet browser extension.");
  }
}

async function connectWallet() {
  try {
    await provider.send("eth_requestAccounts", []);
    const address = await signer.getAddress();

    // Display shortened address (0x0***00)
    const shortenedAddress = `${address.substring(0, 4)}***${address.substring(address.length - 3)}`;
    walletAddressDisplay.textContent = `Connected: ${shortenedAddress}`;

    // Change the Connect button to the shortened address
    connectWalletButton.textContent = shortenedAddress;
    connectWalletButton.disabled = true; // Disable after connecting
  } catch (error) {
    console.error("Error connecting wallet:", error);
  }
}

async function loadTotalStaked() {
  try {
    const totalStaked = await stakingContract.getTotalStaked();
    const formattedStaked = ethers.utils.formatEther(totalStaked);
    totalStakedDisplay.textContent = formattedStaked;
  } catch (error) {
    console.error("Error loading total staked:", error);
  }
}

// Stake, Unstake, Withdraw functionality
async function stake() {
  const amount = prompt("Enter amount to stake (in ETH):");
  if (!amount) return;

  const tx = await stakingContract.stake({ value: ethers.utils.parseEther(amount) });
  await tx.wait();
  alert("Staked successfully!");
}

async function unstake() {
  const amount = prompt("Enter amount to unstake (in ETH):");
  if (!amount) return;

  const tx = await stakingContract.unstake(ethers.utils.parseEther(amount));
  await tx.wait();
  alert("Unstaked successfully!");
}

async function withdraw() {
  const tx = await stakingContract.withdrawReward();
  await tx.wait();
  alert("Withdrawn rewards successfully!");
}

// Attach functions to buttons
document.getElementById("stakeBtn").addEventListener("click", stake);
document.getElementById("unstakeBtn").addEventListener("click", unstake);
document.getElementById("withdrawBtn").addEventListener("click", withdraw);

// Initialize web3
window.addEventListener("load", loadWeb3);
