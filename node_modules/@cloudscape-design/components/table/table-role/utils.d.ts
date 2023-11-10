import { FocusedCell } from './interfaces';
/**
 * Finds focused cell props corresponding the focused element inside the table.
 * The function relies on ARIA colindex/rowindex attributes being correctly applied.
 */
export declare function findFocusinCell(event: FocusEvent): null | FocusedCell;
/**
 * Moves table focus in the provided direction. The focus can transition between cells or interactive elements inside cells.
 */
export declare function moveFocusBy(table: HTMLTableElement, from: FocusedCell, delta: {
    y: number;
    x: number;
}): void;
/**
 * Makes the cell element, the first interactive element or the first cell of the table user-focusable.
 */
export declare function ensureSingleFocusable(table: HTMLElement, cell: null | FocusedCell): void;
/**
 * Makes all element focusable children pseudo-focusable unless the grid navigation is suppressed.
 */
export declare function muteElementFocusables(element: HTMLElement, suppressed: boolean): void;
/**
 * This cleanup code ensures all cells are no longer focusable but the interactive elements are.
 * Currently there are no use cases for it as we don't expect the navigation to be used conditionally.
 */
export declare function restoreElementFocusables(element: HTMLTableElement): void;
/**
 * Returns true if the target element or one of its parents is a dialog or is marked with data-awsui-table-suppress-navigation attribute.
 * This is used to suppress navigation for interactive content without a need to use a custom suppression check.
 */
export declare function defaultIsSuppressed(target: HTMLElement): boolean;
/**
 * Returns actually focusable or pseudo-focusable elements to find navigation targets.
 */
export declare function getFocusables(element: HTMLElement): HTMLElement[];
export declare function getFirstFocusable(element: HTMLElement): HTMLElement | null;
//# sourceMappingURL=utils.d.ts.map