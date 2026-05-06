# HW3_Better_Results

This is a Node.js homework project demonstrating an automated lead processing pipeline.

## Features

1. **Lead Validation**: Checks if the lead has a valid name and email address.
2. **Lead Flagging**: Marks leads as `isValid: true/false` without deleting invalid leads.
3. **AI Classification**: Uses a mock LLM function to simulate classifying the lead's message into Intent and Urgency.
4. **Data Persistence**: Saves processed leads into a local mock CRM array and exports the final records to `output.json`.
5. **Social Media Generation**: Simulates AI generation of social media variants for Twitter/X, LinkedIn, and Instagram based on the product.
6. **Order Summary**: Generates a friendly, readable summary of the order.
7. **VIP Logic**: Flags customers as VIP if their `order_total` is $1000 or more.

## Files
- `index.js`: The main application script containing all pipeline logic and functions.
- `package.json`: Project metadata and run scripts.
- `sample_inputs.json`: Mock data representing incoming leads.
- `output.json`: The final output file generated after running the pipeline.

## How to Run

1. Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
2. Open your terminal and navigate to the project directory:
   ```bash
   cd HW3_Better_Results
   ```
3. Run the pipeline:
   ```bash
   npm start
   ```
   *(Alternatively, you can run `node index.js`)*
4. Check the generated `output.json` file to see the processed CRM records.

## Functions Overview
- `validateLead(payload)`: Adds validation flags based on name/email checks.
- `mockLLM(prompt)`: Simulates an AI API call. Includes comments showing where real fetch/axios code for OpenAI/Gemini would go.
- `classifyLeadMessage(message)`: Calls the mock LLM to get intent and urgency.
- `generateSocialVariants(productOrMessage)`: Calls the mock LLM to get social media posts.
- `summarizeOrder(order)`: Creates a friendly text summary.
- `isVip(order_total)`: Returns boolean based on a $1000 threshold.
- `saveToCRM(record)`: Pushes the final object to the `mockCRM` array.
