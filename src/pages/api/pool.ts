import type { NextApiRequest, NextApiResponse } from 'next'
const Blockfrost = require("@blockfrost/blockfrost-js");
 
const API = new Blockfrost.BlockFrostAPI({
  projectId: "api key", // see: https://blockfrost.io
});

type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // pool info
  const poolId = 'pool13la5erny3srx9u4fz9tujtl2490350f89r4w4qjhk0vdjmuv78v'

  const poolInfo = await API.poolMetadata(poolId)
  const pool = await API.poolsById(poolId)

  const output = {...poolInfo, ...pool}
  
  res.status(200).json(output)
}