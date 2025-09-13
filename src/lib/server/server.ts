import { COHERE_API_KEY } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";
import { CohereClientV2 } from 'cohere-ai';

const prompt = `
You are an archivist assistant trained to follow the South Asian Canadian Digital Archive (SACDA) Metadata Manual.  
Your goal is to extract complete and accurate metadata for archival images.  

The conversation proceeds in cycles:
1. Analyze the image and generate metadata.
2. If any fields are missing or uncertain, output clarifying questions to the user.
3. When the user provides answers, incorporate them into the metadata and update the output.
4. Continue until all fields are filled or the user confirms they are unknown.

At every step, your response must strictly follow this JSON structure:

\`\`\`json
{
  "is_done": boolean,          // true if all fields are filled or confirmed as unknown
  "metadata": {                    // all metadata fields must always be present 
    "accessIdentifier": "...",
    "parent_id": "...",
    "fileTitle": "...",
    "title": "...",
    "field_linked_agent": "...",
    "field_edtf_date_created": "...",
    "field_extent": "...",
    "field_description": "...",
    "field_rights": "...",
    "field_resource_type": "...",
    "field_language": "...",
    "field_note": "...",
    "field_subject": "...",
    "field_sacda_thesaurus": "...",
    "field_subjects_name": "...",
    "field_subject_name__organization": "...",
    "field_geographic_subject": "...",
    "field_coordinates": "...",
    "field_member_of": "...",
    "file": "...",
    "file_extention": "...",
    "field_viewer_override": "..."
  },
  "questions": [
    "string"
  ]
}
\`\`\`

Rules:
- If any field cannot be determined, leave it as an empty string "" (not null).
- Add a clear and concise follow-up question for each missing or uncertain field.
- Use **Rules for Archival Description (RAD)** when applicable.
- Dates must follow **ISO 8601 (YYYY-MM-DD)**.
- Geographic locations: use **CGNDB** (Canada) or **TGN** (outside Canada).
- Coordinates: always in **decimal degrees**.
- Subjects: use **LCSH**, **TGM**, or **SACDA Thesaurus** (narrowest possible heading).
- Rights: select exactly one value from **rightsstatement.org** list in the SACDA manual.
- Continue asking questions until all fields are filled or explicitly confirmed as “unknown”.
- When all fields are completed or confirmed, set \`"is_done": true\` and return \`"questions": []\`.

The assistant must never break JSON format and must always include all fields in \`"metadata"\`.
`;

const responseFormat = {
  type: "json_object" as const,
  properties: {
    is_done: {
      type: 'boolean',
      description: 'True if all metadata fields are confidently filled, false if any field is missing or requires clarification'
    },
    data: {
      type: 'object',
      properties: {
        accessIdentifier: { type: 'string', description: 'Unique identifier used to access the resource' },
        parent_id: { type: 'string', description: 'Identifier of the parent record or object' },
        fileTitle: { type: 'string', description: 'Title of the file' },
        title: { type: 'string', description: 'General title of the record or resource' },
        field_linked_agent: { type: 'string', description: 'Agent (person, organization) linked to this resource' },
        field_edtf_date_created: { type: 'string', description: 'Date the resource was created, in EDTF format' },
        field_extent: { type: 'string', description: 'Extent or size of the resource' },
        field_description: { type: 'string', description: 'Description of the resource' },
        field_rights: { type: 'string', description: 'Rights or usage restrictions for the resource' },
        field_resource_type: { type: 'string', description: 'Type of the resource (e.g., text, image, audio)' },
        field_language: { type: 'string', description: 'Language(s) of the resource' },
        field_note: { type: 'string', description: 'Additional notes related to the resource' },
        field_subject: { type: 'string', description: 'Subject or topic of the resource' },
        field_sacda_thesaurus: { type: 'string', description: 'Controlled vocabulary or thesaurus term (SACDA)' },
        field_subjects_name: { type: 'string', description: 'Name of the subject entity' },
        field_subject_name__organization: { type: 'string', description: 'Organization associated with the subject' },
        field_geographic_subject: { type: 'string', description: 'Geographic subject or location associated with the resource' },
        field_coordinates: { type: 'string', description: 'Geographic coordinates related to the resource' },
        field_member_of: { type: 'string', description: 'Collection or group this resource belongs to' },
        file: { type: 'string', description: 'File path or identifier' },
        file_extention: { type: 'string', description: 'File extension (e.g., pdf, jpg, txt)' },
        field_viewer_override: { type: 'string', description: 'Override option for viewer or display settings' }
      },
      required: [
        'accessIdentifier',
        'parent_id',
        'fileTitle',
        'title',
        'field_linked_agent',
        'field_edtf_date_created',
        'field_extent',
        'field_description',
        'field_rights',
        'field_resource_type',
        'field_language',
        'field_note',
        'field_subject',
        'field_sacda_thesaurus',
        'field_subjects_name',
        'field_subject_name__organization',
        'field_geographic_subject',
        'field_coordinates',
        'field_member_of',
        'file',
        'file_extention',
        'field_viewer_override'
      ]
    },
    questions: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of follow-up questions for the user to clarify missing or uncertain fields'
    }
  },
  required: ['is_done', 'data', 'questions']
};

const cohere = new CohereClientV2({
  token: COHERE_API_KEY,
});

export async function queryCohere() {
  const response = await cohere.chat({
    model: 'command-a-vision-07-2025',
    messages: [
      {
        role: 'system',
        content: [
          { type: 'text', text: prompt }
        ]
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the logo!' },
          {
            type: 'image_url',
            imageUrl: {
              url: 'https://bpb-us-w2.wpmucdn.com/sites.uwm.edu/dist/4/404/files/2016/12/ad000001-yaguxo-e1499062679869.jpg',
              detail: 'auto',
            },
          },
        ],
      },
    ],
    responseFormat: responseFormat
  });

  console.log(response.message.content);
  return response.message.content;
}
