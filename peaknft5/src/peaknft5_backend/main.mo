import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import List "mo:base/List";

actor NFTMarketplace {

    var nftOwners = HashMap.HashMap<Text, Principal>(0, Text.equal, Text.hash);
    var nftCreators = HashMap.HashMap<Text, Principal>(0, Text.equal, Text.hash);
    var nftNames = HashMap.HashMap<Text, Text>(0, Text.equal, Text.hash);
    var userCollections = HashMap.HashMap<Principal, List.List<Text>>(0, Principal.equal, Principal.hash);
    var listings = HashMap.HashMap<Text, Nat>(0, Text.equal, Text.hash);
    var walletBalances = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
    var initializedUsers = HashMap.HashMap<Principal, Bool>(0, Principal.equal, Principal.hash);

    stable var nextNftId : Nat = 1;
    let startingBalance : Nat = 100_000;

    let defaultNFTs = ["Mountain Aurora","Snowy Peak","Eagle Heights","Forest Valley","Glacier Lake"];

    // ── Auto initialize new user ──────────────────────────
    private func initUser(caller : Principal) : () {
        switch (initializedUsers.get(caller)) {
            case (?true) { return };
            case _ {
                initializedUsers.put(caller, true);
                walletBalances.put(caller, startingBalance);
                for (name in defaultNFTs.vals()) {
                    let nftId = "nft-" # Nat.toText(nextNftId);
                    nextNftId += 1;
                    nftOwners.put(nftId, caller);
                    nftCreators.put(nftId, caller);
                    nftNames.put(nftId, name);
                    let existing = switch (userCollections.get(caller)) {
                        case (?list) { list };
                        case null { List.nil<Text>() }
                    };
                    userCollections.put(caller, List.push(nftId, existing));
                };
            };
        };
    };

    // ── Get WAV Balance ───────────────────────────────────
    public shared(msg) func getWalletBalance() : async Nat {
        initUser(msg.caller);
        switch (walletBalances.get(msg.caller)) {
            case (?b) { b };
            case null { startingBalance };
        }
    };

    // ── Mint NFT ──────────────────────────────────────────
    public shared(msg) func mint(name : Text) : async Text {
        let caller = msg.caller;
        initUser(caller);
        if (name == "") { return "Error: Name cannot be empty!" };
        let nftId = "nft-" # Nat.toText(nextNftId);
        nextNftId += 1;
        nftOwners.put(nftId, caller);
        nftCreators.put(nftId, caller);
        nftNames.put(nftId, name);
        let existing = switch (userCollections.get(caller)) {
            case (?list) { list };
            case null { List.nil<Text>() }
        };
        userCollections.put(caller, List.push(nftId, existing));
        return "Success: Minted '" # name # "' with ID: " # nftId
    };

    // ── List for Sale ─────────────────────────────────────
    public shared(msg) func listForSale(nftId : Text, price : Nat) : async Text {
        let caller = msg.caller;
        switch (nftOwners.get(nftId)) {
            case (?owner) {
                if (not Principal.equal(owner, caller)) { return "Error: You don't own this NFT!" };
                if (price == 0) { return "Error: Price must be > 0!" };
                listings.put(nftId, price);
                let name = switch (nftNames.get(nftId)) { case (?n) { n }; case null { nftId } };
                return "Success: Listed '" # name # "' for " # Nat.toText(price) # " WAV"
            };
            case null { return "Error: NFT not found!" }
        }
    };

    // ── Unlist ────────────────────────────────────────────
    public shared(msg) func unlist(nftId : Text) : async Text {
        let caller = msg.caller;
        switch (nftOwners.get(nftId)) {
            case (?owner) {
                if (not Principal.equal(owner, caller)) { return "Error: You don't own this NFT!" };
                listings.delete(nftId);
                return "Success: Unlisted " # nftId
            };
            case null { return "Error: NFT not found!" }
        }
    };

    // ── Buy NFT ───────────────────────────────────────────
    public shared(msg) func buy(nftId : Text) : async Text {
        let buyer = msg.caller;
        initUser(buyer);
        switch (listings.get(nftId)) {
            case (?price) {
                switch (nftOwners.get(nftId)) {
                    case (?seller) {
                        if (Principal.equal(seller, buyer)) { return "Error: You already own this!" };
                        let buyerBalance = switch (walletBalances.get(buyer)) { case (?b) { b }; case null { startingBalance } };
                        if (buyerBalance < price) {
                            return "Error: Insufficient WAV! Need " # Nat.toText(price) # " WAV, have " # Nat.toText(buyerBalance) # " WAV"
                        };
                        walletBalances.put(buyer, buyerBalance - price);
                        let sellerBalance = switch (walletBalances.get(seller)) { case (?b) { b }; case null { 0 } };
                        walletBalances.put(seller, sellerBalance + price);
                        nftOwners.put(nftId, buyer);
                        switch (userCollections.get(seller)) {
                            case (?sellerList) {
                                userCollections.put(seller, List.filter<Text>(sellerList, func(id) { id != nftId }))
                            };
                            case null {}
                        };
                        let buyerNFTs = switch (userCollections.get(buyer)) { case (?list) { list }; case null { List.nil<Text>() } };
                        userCollections.put(buyer, List.push(nftId, buyerNFTs));
                        listings.delete(nftId);
                        let name = switch (nftNames.get(nftId)) { case (?n) { n }; case null { nftId } };
                        return "Success: Bought '" # name # "' for " # Nat.toText(price) # " WAV!"
                    };
                    case null { return "Error: NFT not found!" }
                }
            };
            case null { return "Error: Not listed for sale!" }
        }
    };

    public query func getOwner(nftId : Text) : async ?Principal { nftOwners.get(nftId) };
    public query func getNFTName(nftId : Text) : async ?Text { nftNames.get(nftId) };
    public query func getCreator(nftId : Text) : async ?Principal { nftCreators.get(nftId) };
    public query func getPrice(nftId : Text) : async ?Nat { listings.get(nftId) };

    public query func getNFTDetails(nftId : Text) : async Text {
        let name = switch (nftNames.get(nftId)) { case (?n) { n }; case null { return "Error: NFT not found!" } };
        let owner = switch (nftOwners.get(nftId)) { case (?o) { Principal.toText(o) }; case null { "None" } };
        let creator = switch (nftCreators.get(nftId)) { case (?c) { Principal.toText(c) }; case null { "None" } };
        let price = switch (listings.get(nftId)) { case (?p) { Nat.toText(p) # " WAV [LISTED]" }; case null { "Not for sale" } };
        return "Name: " # name # " | Owner: " # owner # " | Creator: " # creator # " | Price: " # price
    };

    public query func getUserNFTs(user : Principal) : async [Text] {
        switch (userCollections.get(user)) {
            case (?list) { List.toArray(list) };
            case null { [] }
        }
    };

    public query func getListings() : async [(Text, Nat)] { Iter.toArray(listings.entries()) };
    public query func getAllNFTs() : async [(Text, Text)] { Iter.toArray(nftNames.entries()) };
    public query func getTotalMinted() : async Nat { nftNames.size() };
    public query func getTotalListings() : async Nat { listings.size() };

    stable var ownerEntries : [(Text, Principal)] = [];
    stable var creatorEntries : [(Text, Principal)] = [];
    stable var nameEntries : [(Text, Text)] = [];
    stable var listingEntries : [(Text, Nat)] = [];
    stable var collectionEntries : [(Principal, List.List<Text>)] = [];
    stable var walletEntries : [(Principal, Nat)] = [];
    stable var initUserEntries : [(Principal, Bool)] = [];

    system func preupgrade() {
        ownerEntries := Iter.toArray(nftOwners.entries());
        creatorEntries := Iter.toArray(nftCreators.entries());
        nameEntries := Iter.toArray(nftNames.entries());
        listingEntries := Iter.toArray(listings.entries());
        collectionEntries := Iter.toArray(userCollections.entries());
        walletEntries := Iter.toArray(walletBalances.entries());
        initUserEntries := Iter.toArray(initializedUsers.entries());
    };

    system func postupgrade() {
        nftOwners := HashMap.fromIter<Text, Principal>(ownerEntries.vals(), 0, Text.equal, Text.hash);
        nftCreators := HashMap.fromIter<Text, Principal>(creatorEntries.vals(), 0, Text.equal, Text.hash);
        nftNames := HashMap.fromIter<Text, Text>(nameEntries.vals(), 0, Text.equal, Text.hash);
        listings := HashMap.fromIter<Text, Nat>(listingEntries.vals(), 0, Text.equal, Text.hash);
        userCollections := HashMap.fromIter<Principal, List.List<Text>>(collectionEntries.vals(), 0, Principal.equal, Principal.hash);
        walletBalances := HashMap.fromIter<Principal, Nat>(walletEntries.vals(), 0, Principal.equal, Principal.hash);
        initializedUsers := HashMap.fromIter<Principal, Bool>(initUserEntries.vals(), 0, Principal.equal, Principal.hash);
    };
};
