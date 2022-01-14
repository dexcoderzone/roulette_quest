const web3 = require("@solana/web3.js");

const { getWalletBalance, transferSOL, airDropSol } = require("./solana");
const { getReturnAmount, totalAmtToBePaid, randomNumber } = require("./helper");


const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require('figlet');

const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
//For checking whether the connection is successfully made
// console.log(connection);

// const userWallet=web3.Keypair.generate();//virtual wallet pair is generated to test
// console.log(userWallet);

//Generated the secretkey from Keypair.generate() for both treasury and user for wallets respectively
const userSecretKey = Uint8Array.from([
  205,  57,  49,  88, 139, 162,  13,  77, 104, 101,  61,
  138, 139,  65, 143, 207, 162, 119,  10, 197,  23, 120,
   76, 161, 207, 208, 186,   6,  37,  19,  77, 236, 253,
  231,  26, 190, 201,  51, 191, 196, 167,  35,  73,  70,
  108,  28, 227, 223,  27, 200,  75, 148, 243, 249, 160,
   45, 227, 218, 171, 157,  77, 145,  88, 242
]);

const treasurySecretKey = Uint8Array.from([
  117,  19,   7,  71, 170, 118,   0, 212,  39, 137, 145,
  230, 252, 192,  55, 200, 155,  74,  62,  74, 135, 252,
   18, 255, 226,  39, 225,  81, 127, 204,  71, 126, 167,
  173,  47,  37, 195, 223, 155, 199,  82, 253, 164, 180,
  246, 141, 123, 165, 183,  18,  91,  88, 242,  55,  93,
   50, 169,  77,  55,  48, 115, 222, 188, 220
]);

const userWallet = web3.Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
const treasuryWallet = web3.Keypair.fromSecretKey(Uint8Array.from(treasurySecretKey));


let winningAmount,stakingAmount,answer;

const gameFlow = async() => {
  // console.log(chalk.white("User Wallet Balance is ") + chalk.blue(await getWalletBalance(userWallet.publicKey)));
  // console.log(chalk.white("Treasury Wallet Balance is ") + chalk.blue(await getWalletBalance(treasuryWallet.publicKey)));
  console.log(chalk.yellow("The max bidding amount is 2.5 SOL here")); 
  try {
    stakingAmount = await inquirer.prompt([
    {
    name : 'stake_amt',
    message : 'What is the amount of SOL you want to stake? ',
    type : 'number',
    validate : (stake_amt) => {
        if (stake_amt <= 2.5){
            return true;
        }
        else{
            return "The maximum amount that can be staked is 2.5 Sol";
        }
    }
    },
    {
    name : 'ratio',
    message : 'What is the ratio of your staking? 1:x ',
    type : 'number'
    }
    ])
  }
  catch(err){
      console.log(err);
  };     
  console.log(chalk.white("You need to pay ") + chalk.green(stakingAmount.stake_amt) + chalk.white(" to move forward"));
  winningAmount = stakingAmount.stake_amt * stakingAmount.ratio;
  console.log(chalk.green("You will get ") + chalk.blue(winningAmount) + chalk.green(" if you guess the number correctly"));
  
  const rand = randomNumber(1,5);
  try{
  answer = await inquirer.prompt(
      [
          {
              name : 'guess_num',
              message : 'Guess a random number from 1 to 5 (both 1 and 5 included)',
              type : 'number'
          }
      ]
  )
  }
  catch(err){
      console.log(err);
  }
  console.log(chalk.white("Signature for payment for playing game is ") + chalk.green(await transferSOL(userWallet,treasuryWallet,stakingAmount.stake_amt)));
  if (answer.guess_num === rand){
      console.log(chalk.green("Your guess is absolutely correct "));
      console.log(chalk.white("Here is your price Siganture ") + chalk.green(await transferSOL(treasuryWallet,userWallet,winningAmount)));
  }
  else{
      console.log(chalk.yellow("Better Luck next time"));
  }

  console.log(chalk.white("Your Wallet Balance is ") + chalk.green(await getWalletBalance(userWallet.publicKey)));
  console.log(chalk.white("Treasury Wallet Balance is ") + chalk.green(await getWalletBalance(treasuryWallet.publicKey)));     
};


const workFlow = async() => {
  // airDropSol(treasurySecretKey,2);
  // console.log(chalk.white("User Wallet Balance is ") + chalk.blue(await getWalletBalance(userWallet.publicKey)));
  // console.log(chalk.white("Treasury Wallet Balance is ") + chalk.blue(await getWalletBalance(treasuryWallet.publicKey)));
  console.log(
    chalk.green(
      figlet.textSync("SOL Stake", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
  gameFlow();
}

workFlow();

