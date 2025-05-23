require('dotenv').config();

const { handler } = require('./api/stkpush');

const mockRequest = {
  body: {
    phone: "2547XXXXXXXX",
    amount: "100"
  }
};

const mockResponse = {
  status: (code) => {
    console.log(`Status Code: ${code}`);
    return {
      json: (data) => console.log('Response:', data)
    }
  }
};

// Execute
handler(mockRequest, mockResponse);