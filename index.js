const fs = require('fs');

/**
 * HW3_Better_Results Automation Pipeline
 * This project demonstrates lead validation, AI classification, data persistence, 
 * social media content generation, and VIP conditional logic.
 */

const mockCRM = [];

function validateLead(payload) {
  let isValid = true;
  let validationErrors = [];
  let missingFields = [];
  let emailValid = true;

  if (!payload.name || payload.name.trim() === '') {
    isValid = false;
    validationErrors.push('Missing name');
    missingFields.push('name');
  }

  if (!payload.email || !payload.email.includes('@') || !payload.email.includes('.')) {
    isValid = false;
    validationErrors.push('Invalid email format');
    emailValid = false;
  }

  return {
    ...payload,
    isValid: isValid,
    validation_status: isValid ? 'Valid' : 'Invalid',
    validationErrors: validationErrors,
    missing_fields: missingFields,
    email_valid: emailValid
  };
}

function mockLLM(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('classify the following lead message')) {
    let intent = "General";
    let urgency = "Low";

    if (lowerPrompt.match(/buy|license|pricing|demo|discount|purchase/)) {
      intent = "Sales";
    } else if (lowerPrompt.match(/help|setup|problem|dashboard|issue/)) {
      intent = "Support";
    } else if (lowerPrompt.match(/collaboration|partner|integration/)) {
      intent = "Partnership";
    }

    if (lowerPrompt.match(/asap|urgent|right now/)) {
      urgency = "High";
    } else if (lowerPrompt.match(/tomorrow|soon/)) {
      urgency = "Medium";
    }

    return { intent, urgency };
  }

  if (lowerPrompt.includes('generate engaging social media content')) {
    return [
      {
        platform: "Twitter/X",
        text: "Boost your workflow with our awesome new tool! Ready to scale? 🚀",
        hashtags: ["#Tech", "#Innovation", "#Growth"]
      },
      {
        platform: "LinkedIn",
        text: "We are thrilled to share the benefits of our latest offering and how it can drive enterprise value. Let's connect and discuss how we can help your team succeed.",
        hashtags: ["#Enterprise", "#BusinessGrowth", "#Leadership"]
      },
      {
        platform: "Instagram",
        text: "Loving this aesthetic! ✨ Swipe up to get yours today and level up your daily routine! 🛍️",
        hashtags: ["#Lifestyle", "#DailyInspo", "#MustHave"]
      }
    ];
  }

  return { error: "Unknown prompt type for mock LLM." };
}

function classifyLeadMessage(message) {
  if (!message) {
    return { intent: "General", urgency: "Low" };
  }
  const prompt = `Classify the following lead message into 'Intent' (Sales, Support, Partnership, General) and 'Urgency' (High, Medium, Low). 
  Respond ONLY with a JSON object containing keys 'intent' and 'urgency'.
  Message: "${message}"`;
  return mockLLM(prompt);
}

function generateSocialVariants(productOrMessage) {
  const prompt = `Generate engaging social media content variants for Twitter/X, LinkedIn, and Instagram based on this topic: "${productOrMessage}".
  Respond ONLY with a JSON array of 3 objects containing keys 'platform', 'text', and 'hashtags'.`;
  return mockLLM(prompt);
}

function summarizeOrder(order) {
  const { name, items, order_total, expected_delivery } = order;
  const displayName = name && name.trim() !== '' ? name : 'Valued Customer';
  const itemsList = items && items.length > 0 ? items.join(', ') : 'None';
  return `Hi ${displayName}! Thank you for your order. Items: ${itemsList}. Your total is $${order_total}. Expected delivery: ${expected_delivery || 'N/A'}.`;
}

function getCustomerType(order_total) {
  if (order_total > 500) {
    return {
      customer_type: "VIP",
      confirmation_copy: "Thank you for your premium order! Enjoy this exclusive VIP perk: a free 1-on-1 consultation session with our experts."
    };
  } else {
    return {
      customer_type: "Regular",
      confirmation_copy: "Thanks for your order! We appreciate your business and are excited to serve you."
    };
  }
}

function saveToCRM(record) {
  mockCRM.push(record);
  console.log(`Saved record for ${record.email || 'Unknown Email'} to CRM.`);
}

function runPipeline() {
  console.log('--- Starting HW3_Better_Results Automation Pipeline ---\n');

  let rawLeads = [];
  try {
    const rawData = fs.readFileSync('sample_inputs.json');
    rawLeads = JSON.parse(rawData);
  } catch (err) {
    console.error('Failed to read sample_inputs.json.');
    return;
  }

  rawLeads.forEach(lead => {
    console.log(`Processing lead ID: ${lead.id}...`);

    const validatedLead = validateLead(lead);
    const classification = classifyLeadMessage(validatedLead.message);
    const socialMedia = generateSocialVariants(validatedLead.product);
    const orderSummary = summarizeOrder(validatedLead);
    const customerInfo = getCustomerType(validatedLead.order_total);

    const finalRecord = {
      ...validatedLead,
      classification: classification,
      social_media_variants: socialMedia,
      order_summary: orderSummary,
      ...customerInfo,
      processed_at: new Date().toISOString()
    };

    saveToCRM(finalRecord);
  });

  try {
    fs.writeFileSync('output.json', JSON.stringify(mockCRM, null, 2));
    console.log('\nPipeline finished successfully! Results saved to output.json.');
  } catch (err) {
    console.error('Failed to write output.json', err);
  }
}

runPipeline();
