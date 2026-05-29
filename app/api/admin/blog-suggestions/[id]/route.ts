import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogSuggestionModel from '@/lib/models/BlogSuggestion';
import BlogModel from '@/lib/models/Blog';
import { hasAdminSession } from '@/lib/admin';
import { sanitizeUserInput } from '@/lib/inputValidation';

interface ParamsContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: ParamsContext) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status, adminNotes } = body;

    if (!status || !['new', 'reviewed', 'resolved'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: new, reviewed, or resolved' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedSuggestion = await BlogSuggestionModel.findByIdAndUpdate(
      id,
      { status, adminNotes: sanitizeUserInput(typeof adminNotes === 'string' ? adminNotes : '') },
      { returnDocument: 'after' }
    );

    if (!updatedSuggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSuggestion, { status: 200 });
  } catch (error) {
    console.error('Error updating blog suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to update suggestion' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: ParamsContext) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    await connectToDatabase();

    const deletedSuggestion = await BlogSuggestionModel.findByIdAndDelete(id);

    if (!deletedSuggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    await BlogModel.updateMany({ suggestionIds: deletedSuggestion._id }, { $pull: { suggestionIds: deletedSuggestion._id } });

    return NextResponse.json(
      { message: 'Suggestion deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to delete suggestion' },
      { status: 500 }
    );
  }
}
