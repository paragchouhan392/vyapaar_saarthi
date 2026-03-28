const axios = require("axios");
const fs = require("fs");

const payload = {
  Current_Revenue: 5000,
  Operating_Cost: 1000,
  Prev_Marketing_Budget: 500,
  Prev_RnD_Budget: 200,
  Current_Inventory: 0,
  Current_Investments: 100,
  Current_Debts: 0
};

const endpoints = [
  "https://rnd-model.onrender.com/predict",
  "https://investment-model-3eho.onrender.com/predict",
  "https://inventory-model.onrender.com/predict",
  "https://marketing-api-b0hg.onrender.com/predict"
];

const check = async () => {
  const responses = await Promise.all(
    endpoints.map((url) =>
      axios.post(url, payload)
        .then(res => ({ status: "fulfilled", url, value: res.data }))
        .catch(err => ({ status: "rejected", url, message: err.message, response: err.response?.data }))
    )
  );

  fs.writeFileSync('output.json', JSON.stringify(responses, null, 2), 'utf8');
};

check();
