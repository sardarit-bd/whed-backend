import environment from "../../config/env.js";

/************* Handle root route response **************/
const health = async (req, res) => {

  try {

    res.json({ message: `Hello from ${environment} environment! I am healthy. All system services are running.` });

  } catch (error) {

    res.json({ message: `There was a server side error` });
  }

};


/*********** modules export from here ************/
export { health };

