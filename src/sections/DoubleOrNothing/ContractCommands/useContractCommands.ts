import { useCallback, useContext } from "react";
import { ETH_Value, Web3HookContext } from "../../../helpers/useWeb3";
import useContract from "../useContract";
import { ContractDataContext } from "../useContractData";

export interface UseContractCommands {
  handleJoin: () => void;
  handleClaimPrize: () => void;
}

const useContractCommands = (): UseContractCommands => {
  const { account } = useContext(Web3HookContext);
  const { reload } = useContext(ContractDataContext);
  const contract = useContract();
  const handleJoin = useCallback(() => {
    if (contract && account) {
      const confirmation = window.confirm(
        "Do you want to send 0.01 ETH to the smart contract for a 50% chance of winning 0.02 ETH?"
      );
      if (confirmation === true) {
        contract.methods
          .join()
          .send({
            from: account,
            value: new ETH_Value(0.01, "eth").wei,
          })
          .on("receipt", (x: any) => {
            // Joined ok!
          })
          .catch(() => {
            alert("Error while trying to join!");
          })
          .finally(() => {
            reload();
          });
      }
    } else {
      alert("Please connect your wallet first.");
    }
  }, [contract, account]);

  const handleClaimPrize = useCallback(() => {
    if (contract && account) {
      contract.methods
        .claimPrize()
        .send({
          from: account,
        })
        .on("receipt", (x: any) => {
          // Claimed ok!
          reload();
        })
        .catch((err: any) => {
          alert("Error while trying to claim the prize!");
          console.error(err);
        })
        .finally(() => {
          reload();
        });
    } else {
      alert("Please connect your wallet first.");
    }
  }, [contract, account]);

  return {
    handleJoin,
    handleClaimPrize,
  };
};

export default useContractCommands;
