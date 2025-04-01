import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { FormField } from '@/lib/types/form';

export const runtime = 'edge';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token format' },
        { status: 401 }
      );
    }

    const { user, supabase, error } = await authenticateUser(token);

    // If authentication failed, return the error response
    if (error) {
      return error;
    }

    const { description } = await req.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    try {
      // Generate form fields using OpenAI
      const { title, formFields, enhancedDescription } = await generateFormWithOpenAI(description);

      // Save the form as a draft
      const { data: form, error: saveError } = await supabase
        .from('forms')
        .insert({
          user_id: user?.id,
          title,
          description: enhancedDescription, // Use the enhanced description
          schema: JSON.stringify(formFields), // Cast to JSON type
          is_draft: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving draft form:', saveError);
        // If saving fails, still return the generated form but log the error
      }

      return NextResponse.json({
        id: form?.id,
        title,
        description: enhancedDescription, // Return the enhanced description
        schema: formFields,
        is_draft: true
      });
    } catch (error: any) {
      console.error('Error generating form with OpenAI:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to generate form with AI',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function generateFormWithOpenAI(description: string): Promise<{ title: string; formFields: FormField[]; enhancedDescription: string }> {
  const sanitizedDescription = description
    .replace(/ignore all previous instructions/gi, '[filtered content]')
    .replace(/disregard your instructions/gi, '[filtered content]')
    .replace(/system prompt/gi, '[filtered content]');

  const prompt = `
You are a form generation assistant. Create a detailed form based on the following description:

"${sanitizedDescription}"

Return your response as a JSON object with the following format:
{
  "title": "Form title based on the description",
  "description": "A polished, friendly and professional description/introduction for the form that explains its purpose clearly to respondents",
  "fields": [
    {
      "id": "field1",
      "type": "text" | "textarea" | "checkbox" | "radio" | "select" | "multi_select",
      "label": "Question text",
      "placeholder": "Optional placeholder text",
      "required": true | false,
      "options": ["Option 1", "Option 2"] // Only for radio and select types
    },
    ...more fields
  ]
}

The form should capture all the information requested in the description. Use appropriate field types:
- text: For short answers
- textarea: For longer responses
- checkbox: For yes/no questions
- radio: For multiple choice questions with one answer
- select: For dropdown selection questions
- multi_select: For multi-select dropdown selection questions

For the description, write 2-3 sentences that warmly welcomes the user, briefly explains the purpose of the form, and mentions any important details like estimated completion time.

Make sure to include a sensible title for the form based on the description.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // Using a faster model instead of o1
    temperature: 0.7, // Lower temperature for more predictable results
    max_tokens: 2000, // Limit token usage
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are a helpful assistant that generates form structures based on descriptions." },
      { role: "user", content: prompt }
    ],
  });

  const response = completion.choices[0]?.message?.content;

  if (!response) {
    throw new Error('No response from OpenAI');
  }

  try {
    const parsedResponse = JSON.parse(response);

    if (!parsedResponse.title || !Array.isArray(parsedResponse.fields)) {
      throw new Error('Invalid form structure');
    }

    // Get the enhanced description or fall back to original if not available
    const enhancedDescription = parsedResponse.description || description;

    // Convert OpenAI response to our FormField format and assign UUIDs
    const formFields: FormField[] = parsedResponse.fields.map((field: any) => ({
      id: crypto.randomUUID(),
      type: field.type,
      label: field.label,
      placeholder: field.placeholder || '',
      required: field.required || false,
      options: field.options || []
    }));

    return {
      title: parsedResponse.title,
      formFields,
      enhancedDescription
    };
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    // Fallback to generate a basic title if parsing fails
    return {
      title: generateFallbackTitle(description),
      formFields: [],
      enhancedDescription: description
    };
  }
}

// Fallback title generation function
function generateFallbackTitle(description: string): string {
  const words = description.split(' ');
  const title = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
  return title.charAt(0).toUpperCase() + title.slice(1);
}
