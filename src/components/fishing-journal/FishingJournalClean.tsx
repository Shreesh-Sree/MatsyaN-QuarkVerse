'use client';

// Import the enhanced fishing journal component
import { EnhancedFishingJournal } from './EnhancedFishingJournal';

/**
 * Fishing Journal Component
 * 
 * This is a wrapper component that renders the enhanced fishing journal.
 * The enhanced version includes:
 * - Complete CRUD operations (Create, Read, Update, Delete)
 * - Advanced analytics with 6 different chart types
 * - Search and filter functionality
 * - Modal-based editing and viewing
 * - Safe data handling for Firebase data
 */
export function FishingJournal() {
  return <EnhancedFishingJournal />;
}
