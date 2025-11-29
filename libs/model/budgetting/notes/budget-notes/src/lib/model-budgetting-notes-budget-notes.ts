export function modelBudgettingNotesBudgetNotes(): string {
  return 'model-budgetting-notes-budget-notes';
}
import { FunctionHandler } from '@iote/cqrs';
import { HandlerToolkit } from '@ngfire/functions'; // or similar name used elsewhere
import { AddNoteToBudgetCommand } from './add-note.command';


export interface AddNoteToBudgetResult {
  success: boolean;
  noteId?: string;
  errorMessage?: string;
}

export class AddNoteToBudgetHandler
  implements FunctionHandler<AddNoteToBudgetCommand, AddNoteToBudgetResult>
{
  async execute(
    command: AddNoteToBudgetCommand,
    toolkit: HandlerToolkit
  ): Promise<AddNoteToBudgetResult> {
     if (!command.budgetId) {
      return { success: false, errorMessage: 'Budget ID is required.' };
    }

    if (!command.content || !command.content.trim()) {
      return { success: false, errorMessage: 'Note content is required.' };
    }

    // 2. Get repository
    const repo = toolkit.getRepository('budget-notes'); // adjust key + type
    
    const createdAt =
      command.createdAt ?? new Date().toISOString();

    const note = {
      budgetId: command.budgetId,
      content: command.content,
      createdBy: command.createdBy,
      createdAt,
      noteId: command.noteId,
    };

    // 4. Persist via repository
    const noteId = await repo.addNote(command.budgetId, note);
    return {
      success: true,
      noteId,
    };
    
    try {
      // Simulate adding note logic
      const generatedNoteId = command.noteId || 'generated-note-id-123';

      return {
        success: true,
        noteId: generatedNoteId,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: (error as Error).message,
      };
    }
  }
}   
