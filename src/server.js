import environment from "./config/env.js";

import 'dotenv/config';
import app from "./app.js";

/******** PORT Define *******/
const PORT = process.env.PORT || 5000;


if (environment === "development") {
  /*********** Start The Server ***********/
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT} in ${environment} mode`);
  });

}

export default app;
