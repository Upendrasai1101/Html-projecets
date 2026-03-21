export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    mint: IDL.Func([IDL.Text], [IDL.Text], []),
    listForSale: IDL.Func([IDL.Text, IDL.Nat], [IDL.Text], []),
    unlist: IDL.Func([IDL.Text], [IDL.Text], []),
    buy: IDL.Func([IDL.Text], [IDL.Text], []),
    initialize: IDL.Func([], [IDL.Text], []),
    getWalletBalance: IDL.Func([], [IDL.Nat], []),
    getOwner: IDL.Func([IDL.Text], [IDL.Opt(IDL.Principal)], ["query"]),
    getNFTName: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ["query"]),
    getCreator: IDL.Func([IDL.Text], [IDL.Opt(IDL.Principal)], ["query"]),
    getPrice: IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ["query"]),
    getNFTDetails: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    getUserNFTs: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Text)], ["query"]),
    getListings: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], ["query"]),
    getAllNFTs: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], ["query"]),
    getTotalMinted: IDL.Func([], [IDL.Nat], ["query"]),
    getTotalListings: IDL.Func([], [IDL.Nat], ["query"]),
  });
};
