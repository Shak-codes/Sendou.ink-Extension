const axios = require("axios");
const BACKEND = process.env.BACKEND;

const runJob = async () => {
  console.log("Starting job!");
  const response = await axios.post(`${BACKEND}/redis/update`);
  console.log(response.data);
  return response.data;
};

// Local run (for testing)
if (require.main === module) {
  runJob()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error running cron job locally:", err);
      process.exit(1);
    });
}

// AWS Lambda handler
exports.handler = async () => {
  try {
    const job = await runJob();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Job ran successfully",
        job,
      }),
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
