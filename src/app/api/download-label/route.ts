import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const labelUrl = searchParams.get('url'); // Get the real label URL

  if (!labelUrl) {
    return NextResponse.json({ error: 'Missing label URL' }, { status: 400 });
  }

  try {
    console.log(`Proxying download for label: ${labelUrl}`);
    // Fetch the actual PDF content from the real URL
    const pdfResponse = await fetch(labelUrl);

    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch label PDF: ${pdfResponse.statusText}`);
    }

    // Get the PDF content as an ArrayBuffer
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Create a new Response to send to the client
    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        // Crucial headers for download prompt
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="shipping-label-${Date.now()}.pdf"`, // Suggest a filename
      },
    });

    return response;

  } catch (error: any) {
    console.error('Error proxying label download:', error);
    return NextResponse.json({ error: 'Failed to download label.', details: error.message }, { status: 500 });
  }
}