import getWeb3 from "./web3";
import AgroCoinContract from "./contracts/AgroCoin.json";

const getAgroCoinContract = async () => {
    try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AgroCoinContract.networks[networkId];
        
        if (!deployedNetwork) {
            throw new Error("Contract not deployed to detected network");
        }

        const contract = new web3.eth.Contract(
            AgroCoinContract.abi,
            deployedNetwork.address
        );

        return contract;
    } catch (error) {
        console.error("Error loading contract:", error);
        throw error;
    }
};

export default getAgroCoinContract; 