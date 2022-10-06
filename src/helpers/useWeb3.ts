import React, { useCallback, useEffect, useState } from "react";
import Web3 from "web3";

// Events:
//  - connect
//  - disconnect
//  - accountsChanged
//  - chainChanged
//  - message

export interface Chain {
    id: string;
    name: string;
}

export class ETH_Value {
    private internal_wei: number = 0;
    private conversion = {
        eth: 10 ** 18,
        finney: 10 ** 15,
        gwei: 10 ** 9,
        wei: 1,
    };
    constructor(value: number, unit: "eth" | "gwei" | "wei") {
        this.internal_wei = value * this.conversion[unit];
    }

    // Getters
    get eth() {
        return this.internal_wei / this.conversion["eth"];
    }
    get finney() {
        return this.internal_wei / this.conversion["finney"];
    }
    get gwei() {
        return this.internal_wei / this.conversion["gwei"];
    }
    get wei() {
        return this.internal_wei;
    }

    // Setters
    set eth(value: number) {
        this.internal_wei = value * this.conversion["eth"];
    }
    set finney(value: number) {
        this.internal_wei = value * this.conversion["finney"];
    }
    set gwei(value: number) {
        this.internal_wei = value * this.conversion["gwei"];
    }
    set wei(value: number) {
        this.internal_wei = value;
    }
}

const get_chain_name_by_id = (chainId: string): string => {
    if (Object.keys(SUPPORTED_CHAINS).includes(parseInt(chainId).toString())) {
        return SUPPORTED_CHAINS[
            parseInt(chainId) as keyof typeof SUPPORTED_CHAINS
        ];
    } else {
        return "Unknown";
    }
};

export const SUPPORTED_CHAINS = {
    0x1: "Ethereum Main Network",
    0x3: "Ropsten Test Network",
    0x4: "Rinkeby Test Network",
    0x5: "Goerli Test Network",
    0x2a: "Kovan Test Network",
};

export const Web3HookContext = React.createContext<UseWeb3Hook>({
    ethereum: (window as any).ethereum ?? undefined,
    web3: undefined,
    connect: () => {},
    sendTransaction: (accountTo: string, value: number) => {},
    account: undefined,
    chain: undefined,
});

export interface UseWeb3Hook {
    ethereum: any;
    web3: Web3 | undefined;
    connect: () => void;
    sendTransaction: (
        accountTo: string,
        value: number,
        unit: "eth" | "gwei" | "wei"
    ) => void;
    account: string | undefined;
    chain: Chain | undefined;
}

const useWeb3 = (): UseWeb3Hook => {
    const [account, setAccount] = useState<string | undefined>();
    const [chain, setChain] = useState<Chain | undefined>();
    const ethereum = (window as any).ethereum;
    let web3 = undefined;
    let connect = () => {};

    useEffect(() => {
        if (ethereum) {
            ethereum
                .request({
                    method: "eth_accounts",
                })
                .then((accounts: any) => {
                    setAccount(accounts[0]);
                })
                .catch((err: any) => {
                    if (err.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        // If this happens, the user rejected the connection request.
                        alert(
                            "You neet to connect into your wallet for this dApp to work."
                        );
                    } else {
                        console.error(err);
                    }
                });
            ethereum
                .request({
                    method: "eth_chainId",
                })
                .then((chain: string) => {
                    setChain({
                        id: chain,
                        name: get_chain_name_by_id(chain),
                    });
                });
            ethereum.on("accountsChanged", function (accounts: any) {
                // Time to reload your interface with accounts[0]!
                setAccount(accounts[0]);
            });
            ethereum.on("chainChanged", function (chain: any) {
                // Time to reload your interface with accounts[0]!
                setChain({
                    id: chain,
                    name: get_chain_name_by_id(chain),
                });
            });
        }
    }, [ethereum]);

    const sendTransaction = useCallback(
        (accountTo: string, amount: number, unit: "eth" | "gwei" | "wei") => {
            const value = new ETH_Value(amount, unit);
            const accountFrom: string | undefined = account;
            if (accountFrom) {
                ethereum
                    .request({
                        method: "eth_sendTransaction",
                        params: [
                            {
                                from: accountFrom,
                                to: accountTo,
                                value: `0x${value.wei.toString(16)}`,
                                // gasPrice: "0x09184e72a000",
                                // gas: "0x2710",
                            },
                        ],
                    })
                    .then((txHash: any) => console.log(txHash))
                    .catch((error: any) => console.error);
            } else {
                ethereum
                    .request({
                        method: "eth_requestAccounts",
                    })
                    .then((accounts: any) => {
                        setAccount(accounts[0]);
                        ethereum
                            .request({
                                method: "eth_sendTransaction",
                                params: [
                                    {
                                        from: accounts[0],
                                        to: accountTo,
                                        value: `0x${value.wei.toString(16)}`,
                                        // gasPrice: "0x09184e72a000",
                                        // gas: "0x2710",
                                    },
                                ],
                            })
                            .then((txHash: any) => console.log(txHash))
                            .catch((error: any) => console.error);
                    })
                    .catch((err: any) => {
                        if (err.code === 4001) {
                            // EIP-1193 userRejectedRequest error
                            // If this happens, the user rejected the connection request.
                            alert(
                                "You neet to connect into your wallet for this dApp to work."
                            );
                        } else {
                            console.error(err);
                        }
                    });
            }
        },
        [account, ethereum]
    );
    if (ethereum) {
        web3 = new Web3(ethereum);
        connect = () => {
            ethereum
                .request({
                    method: "eth_requestAccounts",
                })
                .then((accounts: any) => {
                    setAccount(accounts[0]);
                })
                .catch((err: any) => {
                    if (err.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        // If this happens, the user rejected the connection request.
                        alert(
                            "You neet to connect into your wallet for this dApp to work."
                        );
                    } else {
                        console.error(err);
                    }
                });
            ethereum
                .request({
                    method: "eth_chainId",
                })
                .then((chain: string) => {
                    setChain({
                        id: chain,
                        name: get_chain_name_by_id(chain),
                    });
                });
        };
    } else {
        alert("Browser not compatible. Please install MetaMask.");
    }
    return {
        ethereum,
        web3,
        connect,
        sendTransaction,
        account,
        chain,
    };
};

export const disconnectWeb3 = async () => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
        await ethereum.disconnect();
    } else {
        console.error("window.ethereum API is not available.");
    }
};

export default useWeb3;
