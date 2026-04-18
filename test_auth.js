const axios = require('axios');
async function test() {
  try {
    const loginObj = {
      email: "test@northgate.com",
      password: "TestPassword123!"
    };
    console.log("1. Logging in...");
    const res1 = await axios.post('http://localhost:3001/api/v1/auth/login', loginObj);
    const token = res1.data.access_token;
    console.log("Got token!", token.substring(0, 15) + "...");
    
    console.log("2. Hitting /create...");
    const res2 = await axios.post('http://localhost:3001/api/v1/invoice/create', { "test": "test" }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Success! Status:", res2.status);
  } catch (err) {
    if (err.response) {
      console.log("Failed with status:", err.response.status);
      console.log(err.response.data);
    } else {
      console.log("Failed:", err.message);
    }
  }
}
test();
