import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { createClient } from 'npm:@wix/sdk@1.15.17';
import { urls } from 'npm:@wix/urls@1.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accessToken = Deno.env.get('WIX_ACCESS_TOKEN');
    if (!accessToken) {
      return Response.json({ error: 'Wix token not found' }, { status: 500 });
    }

    const wixClient = createClient({
      modules: { urls },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const result = await wixClient.urls.listPublishedSiteUrls();

    return Response.json({ pages: result.urls ?? [], total: result.urls?.length ?? 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
