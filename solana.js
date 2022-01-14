const web3 = require("@solana/web3.js");

const getWalletBalance = async (publicKey) => {
  try {
    const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
    const walletBalance = await connection.getBalance(new web3.PublicKey(publicKey));
    return walletBalance / web3.LAMPORTS_PER_SOL;
  } catch (error) {
    console.log(error);
  }
};

const airDropSol = async (userSecretKey, transferAmount) => {
    try {
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        const walletKeyPair = await web3.Keypair.fromSecretKey(userSecretKey);
    //   console.log(`-- Airdropping 2 SOL --`)
      const fromAirDropSignature = await connection.requestAirdrop(
        new web3.PublicKey(walletKeyPair.publicKey),
        transferAmount * web3.LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
      console.log(err);
    }
  };


const transferSOL=async (from,to,transferAmt)=>{
    try{
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        const transaction=new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey : new web3.PublicKey(from.publicKey.toString()),
                toPubkey : new web3.PublicKey(to.publicKey.toString()),
                lamports : transferAmt * web3.LAMPORTS_PER_SOL
            })
        )
        const signature=await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        return signature;
    }catch(err){
        console.log(err);
    }
};

module.exports = {
  getWalletBalance,
  airDropSol,
  transferSOL,
};