import { useContext, useMemo } from "react";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { Web3HookContext } from "../../helpers/useWeb3";
import abi from "../../abi/DoubleOrNothing.json";

const useContract = (): Contract | undefined => {
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const {web3} = useContext(Web3HookContext)
    const contract: Contract | undefined = useMemo(() => {
        if (web3) {
            return new web3.eth.Contract(abi as AbiItem[], CONTRACT_ADDRESS);
        } else {
            return undefined;
        }
    }, [web3]);
    return contract
}

export default useContract