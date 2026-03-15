// ============================================================
// DBANK — main.mo
// Motoko smart contract for Internet Computer
// Features: deposit, withdraw, compound interest
// ============================================================

actor DBank {

  // ── State Variables ───────────────────────────────────────
  // stable = persists across canister upgrades
  stable var currentBalance : Float = 300;
  stable var startTime      : Int   = 0;

  // Import Time module
  import Time "mo:base/Time";
  import Float "mo:base/Float";

  // ── Initialize start time ─────────────────────────────────
  // Called when canister is first deployed
  public func initializeTimer() : async () {
    startTime := Time.now();
  };

  // ── Deposit ───────────────────────────────────────────────
  // Adds amount to current balance
  public func topUp(amount : Float) : async () {
    currentBalance += amount;
  };

  // ── Withdraw ──────────────────────────────────────────────
  // Subtracts amount from balance — checks for sufficient funds
  public func withdraw(amount : Float) : async () {
    let tempBalance : Float = currentBalance - amount;
    if (tempBalance >= 0) {
      currentBalance := tempBalance;
    } else {
      Debug.print("Amount too large — insufficient funds!");
    };
  };

  // ── Check Balance ─────────────────────────────────────────
  // Returns current balance
  public query func checkBalance() : async Float {
    return currentBalance;
  };

  // ── Compound Interest ─────────────────────────────────────
  // Automatically compounds interest based on time elapsed
  // Interest rate: 0.01% per second (demo purposes)
  public func compound() : async () {
    let currentTime  : Int   = Time.now();
    let timeElapsed  : Float = Float.fromInt(currentTime - startTime);
    let timeElapsedS : Float = timeElapsed / 1000000000; // nanoseconds to seconds

    // Compound interest formula: A = P * (1 + r)^t
    currentBalance := currentBalance * (1.01 ** timeElapsedS);
    startTime      := currentTime;
  };

};
