import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main(){
  await prisma.settings.upsert({
    where:{ id:1 }, update:{}, create:{
      id:1, nebPriceUSD:1, minBuyUSD:10, maxBuyUSD:100000,
      minWithdrawalUSD:20, maxWithdrawalUSD:100000, withdrawFeePct:5,
      trc20USDTAddress: process.env.TRC20_USDT_ADDRESS ?? "",
      bep20USDTAddress: process.env.BEP20_USDT_ADDRESS ?? ""
    }
  });
  const masters = [
    {code:"ASSET:USDT_RECEIVABLE", name:"USDT Receivable", type:"ASSET"},
    {code:"LIAB:POOL:VIP", name:"VIP Pool", type:"LIABILITY"},
    {code:"LIAB:POOL:ELITE", name:"Elite Pool", type:"LIABILITY"},
    {code:"LIAB:POOL:WITHDRAW_FEE", name:"Withdraw Service Fee Pool", type:"LIABILITY"}
  ];
  for (const m of masters) {
    await prisma.ledgerAccount.upsert({ where:{ code:m.code }, update:{}, create:m });
  }
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
