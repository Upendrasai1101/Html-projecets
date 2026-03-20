export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    getName: IDL.Func([], [IDL.Text], ["query"]),
    getSymbol: IDL.Func([], [IDL.Text], ["query"]),
    getTotalSupply: IDL.Func([], [IDL.Nat], ["query"]),
    getFaucetAmount: IDL.Func([], [IDL.Nat], ["query"]),
    getHolderCount: IDL.Func([], [IDL.Nat], ["query"]),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),
    getCanisterBalance: IDL.Func([], [IDL.Nat], ["query"]),
    getAllBalances: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ["query"]),
    hasClaimedFaucet: IDL.Func([IDL.Principal], [IDL.Bool], ["query"]),
    transfer: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    payOut: IDL.Func([], [IDL.Text], []),
  });
};
