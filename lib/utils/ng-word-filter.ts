/**
 * NGワードフィルタリング機能
 */

// NGワードリスト（将来的にはFirestoreから取得）
const NG_WORDS = [
  // 暴力的な表現
  '殺す', '死ね', '消えろ',
  // 差別的表現
  'バカ', 'アホ', 'クソ',
  // その他の不適切な表現
  // 必要に応じて追加
];

/**
 * NGワードフィルタリング結果
 */
export interface FilterResult {
  passed: boolean;
  matchedWords: string[];
}

/**
 * テキストをNGワードでフィルタリング
 * @param text フィルタリング対象のテキスト
 * @returns フィルタリング結果
 */
export function filterNGWords(text: string): FilterResult {
  const matchedWords: string[] = [];
  const lowerText = text.toLowerCase();

  // NGワードをチェック
  for (const word of NG_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      matchedWords.push(word);
    }
  }

  return {
    passed: matchedWords.length === 0,
    matchedWords,
  };
}

/**
 * テキストがNGワードを含むかチェック
 * @param text チェック対象のテキスト
 * @returns NGワードを含む場合true
 */
export function containsNGWords(text: string): boolean {
  return !filterNGWords(text).passed;
}

