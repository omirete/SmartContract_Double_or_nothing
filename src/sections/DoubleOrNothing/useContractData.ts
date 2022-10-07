import { Contract } from "web3-eth-contract";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useContract from "./useContract";
import { ETH_Value, Web3HookContext } from "../../helpers/useWeb3";

export interface ContractData {
  participants_list: Array<string[]>;
  participants_awaiting: string[];
  winners_list: WinnerData[];
  pot_jar: number;
  fees_jar: number;
  player_stats?: PlayerStats;
}

export interface PlayerStats {
  pending_claims: number;
  times_participated: number;
  times_won: number;
  total_earnings: number;
}

export interface WinnerData {
  address: string;
  txHash: string;
  blockNr: number;
  prize_won: number;
}

export interface UseContractData {
  reload: () => void;
  contractData: ContractData;
}

export const ContractDataContext = createContext<UseContractData>({
  reload: () => {},
  contractData: {
    participants_list: [],
    participants_awaiting: [],
    winners_list: [],
    pot_jar: 0,
    fees_jar: 0,
  },
});

const useContractData = (): UseContractData => {
  const [contractData, setContractData] = useState<ContractData>({
    participants_list: [],
    participants_awaiting: [],
    winners_list: [],
    pot_jar: 0,
    fees_jar: 0,
  });

  const { account } = useContext(Web3HookContext);
  const contract = useContract();

  const reload_pot_jar = (contract: Contract) => {
    contract.methods
      .pot_jar()
      .call()
      .then((x: number) => {
        setContractData((prev) => ({
          ...prev,
          pot_jar: x,
        }));
      })
      .catch(() => {
        console.error("Error while trying to check the pot!");
      });
  };

  const reload_fees_jar = (contract: Contract) => {
    contract.methods
      .fees_jar()
      .call()
      .then((x: number) => {
        setContractData((prev) => ({
          ...prev,
          fees_jar: x,
        }));
      })
      .catch(() => {
        console.error("Error while trying to check the pot!");
      });
  };

  const reload_winners_list = (contract: Contract) => {
    contract
      .getPastEvents("WinnerPicked", {
        fromBlock: 0,
        toBlock: "latest",
      })
      .then((events) => {
        setContractData((prev) => ({
          ...prev,
          winners_list: events.map((ev) => ({
            address: ev.returnValues.winner,
            txHash: ev.transactionHash,
            blockNr: ev.blockNumber,
            prize_won: parseFloat(ev.returnValues.prize_won),
          })),
        }));
      });
  };

  const reload_participants_list = (contract: Contract) => {
    contract
      .getPastEvents("ParticipantsUpdated", {
        fromBlock: 0,
        toBlock: "latest",
      })
      .then((events) => {
        setContractData((prev) => ({
          ...prev,
          participants_list: events
            .filter((ev) => ev.returnValues.is_complete === true)
            .map((ev) => ev.returnValues.participants_list),
        }));
      });
  };

  const reload_participants_awaiting = (contract: Contract) => {
    contract
      .getPastEvents("ParticipantsUpdated", {
        fromBlock: "latest",
        toBlock: "latest",
      })
      .then((events) => {
        const ev = events[0];
        if (ev) {
          if (ev.returnValues.is_complete === true) {
            setContractData((prev) => ({
              ...prev,
              participants_awaiting: [],
            }));
          } else {
            setContractData((prev) => ({
              ...prev,
              participants_awaiting: ev.returnValues.participants_list,
            }));
          }
        }
      });
  };

  const reload_pending_claims = (contract: Contract, address: string) => {
    contract.methods
      .pending_claims(address)
      .call()
      .then((x: number) => {
        setContractData((prev) => ({
          ...prev,
          player_stats: {
            times_participated: prev.player_stats?.times_participated ?? 0,
            times_won: prev.player_stats?.times_won ?? 0,
            total_earnings: prev.player_stats?.total_earnings ?? 0,
            pending_claims: new ETH_Value(x, "wei").eth,
          },
        }));
      })
      .catch(() => {
        console.error("Error while trying to check the pot!");
      });
  };

  const recalculate_player_stats = useCallback(
    (address: string) => {
      let times_participated: number = 0;
      contractData.participants_list.forEach((participants_in_run) =>
        participants_in_run.forEach((p) => {
          if (p.toLowerCase() === address.toLowerCase())
            times_participated += 1;
        })
      );
      let total_earnings: number = 0;
      contractData.winners_list.forEach((w) => {
        if (w.address.toLowerCase() === address.toLowerCase())
          total_earnings += w.prize_won;
      });
      const times_won = contractData.winners_list.filter(
        (w) => w.address.toLowerCase() === address.toLowerCase()
      ).length;
      setContractData((prev) => ({
        ...prev,
        player_stats: {
          pending_claims: prev.player_stats?.pending_claims ?? 0,
          times_participated: times_participated,
          times_won: times_won,
          total_earnings: new ETH_Value(total_earnings, "wei").eth,
        },
      }));
    },
    [contractData.participants_list, contractData.winners_list]
  );

  useEffect(() => {
    if (account) {
      console.log("Trigerred effect1!");
      recalculate_player_stats(account);
      if (contract) {
        reload_pending_claims(contract, account);
      }
    } else {
      console.log("Trigerred effect2!");
      setContractData((prev) => ({
        ...prev,
        player_stats: undefined,
      }));
    }
  }, [
    contract,
    contractData.participants_list,
    contractData.winners_list,
    account,
    recalculate_player_stats,
  ]);

  const reload = useCallback(() => {
    if (contract) {
      reload_participants_list(contract);
      reload_participants_awaiting(contract);
      reload_winners_list(contract);
      reload_pot_jar(contract);
      reload_fees_jar(contract);
    }
  }, [contract]);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    reload,
    contractData,
  };
};

export default useContractData;
