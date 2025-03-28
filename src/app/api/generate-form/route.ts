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
    const { user, supabase, error } = await authenticateUser();

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
      const { title, formFields } = await generateFormWithOpenAI(description);

      // Save the form as a draft
      const { data: form, error: saveError } = await supabase
        .from('forms')
        .insert({
          user_id: user?.id,
          title,
          description,
          schema: formFields,
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
        id: form?.Id,
        title,
        description,
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

async function generateFormWithOpenAI(description: string): Promise<{ title: string; formFields: FormField[] }> {
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

Make sure to include a sensible title for the form based on the description.
`;

  const completion = await openai.chat.completions.create({
    model: 'o1',
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
      formFields
    };
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    // Fallback to generate a basic title if parsing fails
    return {
      title: generateFallbackTitle(description),
      formFields: []
    };
  }
}

// Fallback title generation function
function generateFallbackTitle(description: string): string {
  const words = description.split(' ');
  const title = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
  return title.charAt(0).toUpperCase() + title.slice(1);
}
