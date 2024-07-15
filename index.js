import axios from "axios";
import express from "express";

const app = express();
const PORT = 3000;

const WINDOW_SIZE = 10;

let numbersStorage = [];

let token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxMDMwNjM1LCJpYXQiOjE3MjEwMzAzMzUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjY4NTJjMDA0LTA0NmQtNDVmOS1hY2VkLTZjZmM3ODg4Y2JmMiIsInN1YiI6ImRpdnlhbWFyeWEwMkBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJkaXZ5YW01NjciLCJjbGllbnRJRCI6IjY4NTJjMDA0LTA0NmQtNDVmOS1hY2VkLTZjZmM3ODg4Y2JmMiIsImNsaWVudFNlY3JldCI6IlB6VGd2RHlmTURtbUJMVHoiLCJvd25lck5hbWUiOiJEaXZ5YW0iLCJvd25lckVtYWlsIjoiZGl2eWFtYXJ5YTAyQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMDEzMDEwNDEifQ.4jZnI_eHbO4zSI-kWnYU-WCJmfCcW-58wYp7cgT6KOM"
 ;

const fetchNumber = async (type) => {
  const conditionalEndpoints = {
    'p': 'primes',
    'f': 'fibo',
    'e': 'even',
    'r': 'random',
  }
  const toUse = conditionalEndpoints[type];
  try {
    const response = await axios.get(`http://20.244.56.144/test/${toUse}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data && response.data.numbers) {
      return response.data.numbers;
    }
  } catch (error) {
    console.error('Status Code', error.response.status);
    console.error('Error fetching number:', error.message);
  }
  return null;
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

app.get('/numbers/:numberid', async (req, res) => {
  const numberType = req.params.numberid;
  if (!['p', 'f', 'e', 'r'].includes(numberType)) {
    return res.status(400).send('Invalid number ID');
  }

  const newNumbers = await fetchNumber(numberType);
  const receivedNumbers = newNumbers;
  if (!newNumbers) {
    return res.status(500).send('Error fetching numbers');
  }

  const windowPrevState = [...numbersStorage];

  numbersStorage = numbersStorage.concat(newNumbers);
  if (numbersStorage.length > WINDOW_SIZE) {
    numbersStorage = numbersStorage.slice(-WINDOW_SIZE);
  }

  const windowCurrentState = [...numbersStorage];

  const average = calculateAverage(numbersStorage);

  res.json({
    windowPrevState: windowPrevState,
    windowCurrState: windowCurrentState,
    numbers: receivedNumbers,
    avg: average,
  });
});

app.listen(PORT, () => {
  console.log(`Average Calculator microservice is running on port ${PORT}`);
});
