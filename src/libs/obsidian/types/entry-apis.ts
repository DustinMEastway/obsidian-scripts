export type EntryApis = {
  quickAddApi: {
    /** Select multiple items from a list. */
    checkboxPrompt(
      items: string[],
      selectedItems: string[]
    ): Promise<string[]>;

    /** Input a text value. */
    inputPrompt(
      header: string,
      placeholder?: string | null,
      value?: string
    ): Promise<string>;

    /** Select one items from a list. */
    suggester<T>(
      displayItems: (
        string[]
        | ((actualItem: T, index: number, actualItems: T[]) => string)
      ),
      actualItems: T[]
    ): Promise<T>;

    utility: {
      /** Gets the value currently in the user's clipboard. */
      getClipboard(): Promise<string>;

      /** Sets the value currently in the user's clipboard. */
      setClipboard(text: string): Promise<void>;
    };
  };
  variables: Record<string, unknown> | null;
}
