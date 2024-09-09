import abi from './abi.js';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const stakingContract = new ethers.Contract(contractAddress, abi, signer);




// Elements
const totalStakedElement = document.getElementById('totalStaked');
const availableAmountElement = document.getElementById('availableAmount');
const stakeAmountElement = document.getElementById('stakeAmount');
const unstakeAmountElement = document.getElementById('unstakeAmount');
const notificationElement = document.getElementById('notification');

// Tab switching
document.getElementById('stake-tab').addEventListener('click', () => {
    document.querySelector('.stake-section').classList.remove('hidden');
    document.querySelector('.unstake-section').classList.add('hidden');
    document.querySelector('.withdraw-section').classList.add('hidden');
});

document.getElementById('unstake-tab').addEventListener('click', () => {
    document.querySelector('.stake-section').classList.add('hidden');
    document.querySelector('.unstake-section').classList.remove('hidden');
    document.querySelector('.withdraw-section').classList.add('hidden');
});

document.getElementById('withdraw-tab').addEventListener('click', () => {
    document.querySelector('.stake-section').classList.add('hidden');
    document.querySelector('.unstake-section').classList.add('hidden');
    document.querySelector('.withdraw-section').classList.remove('hidden');
});

// Fetch total BNB staked
async function fetchTotalStaked() {
    const totalStaked = await stakingContract.getTotalStaked();
    totalStakedElement.textContent = ethers.utils.formatEther(totalStaked);
}

// Stake function
document.getElementById('stakeBtn').addEventListener('click', async () => {
    const stakeAmount = stakeAmountElement.value;
    if (stakeAmount > 0) {
        try {
            const tx = await stakingContract.stake({ value: ethers.utils.parseEther(stakeAmount) });
            await tx.wait();
            notificationElement.textContent = 'Stake successful!';
            fetchTotalStaked();
        } catch (error) {
            notificationElement.textContent = 'Error during staking: ' + error.message;
        }
    } else {
        notificationElement.textContent = 'Enter a valid amount to stake.';
    }
});

// Unstake function
document.getElementById('unstakeBtn').addEventListener('click', async () => {
    const unstakeAmount = unstakeAmountElement.value;
    if (unstakeAmount > 0) {
        try {
            const tx = await stakingContract.unstake(ethers.utils.parseEther(unstakeAmount));
            await tx.wait();
            notificationElement.textContent = 'Unstake successful!';
            fetchTotalStaked();
        } catch (error) {
            notificationElement.textContent = 'Error during unstaking: ' + error.message;
        }
    } else {
        notificationElement.textContent = 'Enter a valid amount to unstake.';
    }
});

// Withdraw reward function
document.getElementById('withdrawBtn').addEventListener('click', async () => {
    try {
        const tx = await stakingContract.withdrawReward();
        await tx.wait();
        notificationElement.textContent = 'Reward withdrawn successfully!';
    } catch (error) {
        notificationElement.textContent = 'Error during reward withdrawal: ' + error.message;
    }
});

// Initialize the UI
fetchTotalStaked();
