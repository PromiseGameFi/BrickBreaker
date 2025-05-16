import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.REACT_APP_THIRDWEB_CLIENT_ID;

export const client = createThirdwebClient({
  clientId: clientId,
})