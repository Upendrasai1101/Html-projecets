import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Bool "mo:base/Bool";

actor Token {

    let tokenName : Text = "WavCoin";
    let tokenSymbol : Text = "WAV";
    let totalTokenSupply : Nat = 1_000_000;
    let faucetAmount : Nat = 10_000;
    var balances = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
    var faucetClaimed = HashMap.HashMap<Principal, Bool>(0, Principal.equal, Principal.hash);
    let owner : Principal = Principal.fromActor(Token);
    balances.put(owner, totalTokenSupply);

    public query func getName() : async Text { return tokenName };
    public query func getSymbol() : async Text { return tokenSymbol };
    public query func getTotalSupply() : async Nat { return totalTokenSupply };
    public query func getFaucetAmount() : async Nat { return faucetAmount };
    public query func getHolderCount() : async Nat { return balances.size() };

    public query func balanceOf(who : Principal) : async Nat {
        switch (balances.get(who)) { case (?a) { a }; case null { 0 } }
    };

    public query func getCanisterBalance() : async Nat {
        switch (balances.get(owner)) { case (?b) { b }; case null { 0 } }
    };

    public query func getAllBalances() : async [(Principal, Nat)] {
        Iter.toArray(balances.entries())
    };

    public query func hasClaimedFaucet(who : Principal) : async Bool {
        switch (faucetClaimed.get(who)) { case (?c) { c }; case null { false } }
    };

    public shared(msg) func transfer(to : Principal, amount : Nat) : async Text {
        let from = msg.caller;
        let fromBal = switch (balances.get(from)) { case (?b) { b }; case null { 0 } };
        if (fromBal < amount) { return "Error: Insufficient funds. You have " # Nat.toText(fromBal) # " WAV." };
        if (amount == 0) { return "Error: Amount must be > 0." };
        balances.put(from, fromBal - amount);
        let toBal = switch (balances.get(to)) { case (?b) { b }; case null { 0 } };
        balances.put(to, toBal + amount);
        return "Success: Transferred " # Nat.toText(amount) # " WAV."
    };

    public shared(msg) func payOut() : async Text {
        let caller = msg.caller;
        switch (faucetClaimed.get(caller)) {
            case (?c) { if (c) { return "Error: Already claimed!" } };
            case null {}
        };
        let cb = switch (balances.get(owner)) { case (?b) { b }; case null { 0 } };
        if (cb < faucetAmount) { return "Error: Faucet empty!" };
        balances.put(owner, cb - faucetAmount);
        let calBal = switch (balances.get(caller)) { case (?b) { b }; case null { 0 } };
        balances.put(caller, calBal + faucetAmount);
        faucetClaimed.put(caller, true);
        return "Success: Claimed " # Nat.toText(faucetAmount) # " WAV!"
    };

    stable var balanceEntries : [(Principal, Nat)] = [];
    stable var faucetEntries : [(Principal, Bool)] = [];

    system func preupgrade() {
        balanceEntries := Iter.toArray(balances.entries());
        faucetEntries := Iter.toArray(faucetClaimed.entries())
    };

    system func postupgrade() {
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 0, Principal.equal, Principal.hash);
        faucetClaimed := HashMap.fromIter<Principal, Bool>(faucetEntries.vals(), 0, Principal.equal, Principal.hash)
    };
};
