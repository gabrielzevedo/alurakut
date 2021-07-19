import { SiteClient } from 'datocms-client';

const client = new SiteClient(process.env.DATO_API_FULL_ACCESS_KEY);

export default async function receiver(req, res) {
  if (req.method === 'POST') {
    const communityCreate = await client.items.create({
      itemType: '976877',
      ...req.body,
    });

    res.json(communityCreate);

    return;
  }

  res.status(405).json({
    message: 'Method not allowed'
  });
}