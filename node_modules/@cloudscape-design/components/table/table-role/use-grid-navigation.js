// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useMemo } from 'react';
import { defaultIsSuppressed, findFocusinCell, moveFocusBy, muteElementFocusables, restoreElementFocusables, ensureSingleFocusable, getFirstFocusable, } from './utils';
import { KeyCode } from '../../internal/keycode';
import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
/**
 * Makes table navigable with keyboard commands.
 * See https://www.w3.org/WAI/ARIA/apg/patterns/grid
 *
 * The hook attaches the GridNavigationHelper helper when active=true.
 * See GridNavigationHelper for more details.
 */
export function useGridNavigation({ active, pageSize, getTable, isSuppressed }) {
    const gridNavigation = useMemo(() => new GridNavigationHelper(), []);
    const getTableStable = useStableCallback(getTable);
    const isSuppressedStable = useStableCallback((element) => { var _a; return (_a = isSuppressed === null || isSuppressed === void 0 ? void 0 : isSuppressed(element)) !== null && _a !== void 0 ? _a : false; });
    // Initialize the model with the table container assuming it is mounted synchronously and only once.
    useEffect(() => {
        if (active) {
            const table = getTableStable();
            table && gridNavigation.init(table, isSuppressedStable);
        }
        return () => gridNavigation.cleanup();
    }, [active, gridNavigation, getTableStable, isSuppressedStable]);
    // Notify the model of the props change.
    useEffect(() => {
        gridNavigation.update({ pageSize });
    }, [gridNavigation, pageSize]);
}
/**
 * This helper encapsulates the grid navigation behaviors which are:
 * 1. Responding to keyboard commands and moving the focus accordingly;
 * 2. Muting table interactive elements for only one to be user-focusable at a time;
 * 3. Suppressing the above behaviors when focusing an element inside a dialog or when instructed by the isSuppressed callback.
 *
 * All behaviors are attached upon initialization and are re-evaluated with every focusin, focusout, and keydown events,
 * and also when a node removal inside the table is observed to ensure consistency at any given moment.
 *
 * When the navigation is suppressed the keyboard commands are no longer intercepted and all table interactive elements are made
 * user-focusable to unblock the Tab navigation. The suppression should only be used for interactive elements inside the table that would
 * otherwise conflict with the navigation. Once the interactive element is deactivated or lose focus the table navigation becomes active again.
 */
class GridNavigationHelper {
    constructor() {
        // Props
        this._pageSize = 0;
        this._table = null;
        this._isSuppressed = () => false;
        // State
        this.prevFocusedCell = null;
        this.focusedCell = null;
        this.onFocusin = (event) => {
            var _a;
            const cell = findFocusinCell(event);
            if (!cell) {
                return;
            }
            this.prevFocusedCell = cell;
            this.focusedCell = cell;
            muteElementFocusables(this.table, this.isSuppressed(cell.element));
            ensureSingleFocusable(this.table, cell);
            // Focusing on cell is not eligible when it contains focusable elements in the content.
            // If content focusables are available - move the focus to the first one.
            if (cell.element === cell.cellElement) {
                (_a = getFirstFocusable(cell.cellElement)) === null || _a === void 0 ? void 0 : _a.focus();
            }
        };
        this.onFocusout = () => {
            this.focusedCell = null;
        };
        this.onKeydown = (event) => {
            if (!this.focusedCell) {
                return;
            }
            const ctrlKey = event.ctrlKey ? 1 : 0;
            const altKey = event.altKey ? 1 : 0;
            const shiftKey = event.shiftKey ? 1 : 0;
            const metaKey = event.metaKey ? 1 : 0;
            const numModifiersPressed = ctrlKey + altKey + shiftKey + metaKey;
            let key = event.keyCode;
            if (numModifiersPressed === 1 && event.ctrlKey) {
                key = -key;
            }
            else if (numModifiersPressed) {
                return;
            }
            const from = this.focusedCell;
            const minExtreme = Number.NEGATIVE_INFINITY;
            const maxExtreme = Number.POSITIVE_INFINITY;
            // Do not intercept any keys when the navigation is suppressed.
            if (this.isSuppressed(from.element)) {
                return;
            }
            switch (key) {
                case KeyCode.up:
                    event.preventDefault();
                    return moveFocusBy(this.table, from, { y: -1, x: 0 });
                case KeyCode.down:
                    event.preventDefault();
                    return moveFocusBy(this.table, from, { y: 1, x: 0 });
                case KeyCode.left:
                    event.preventDefault();
                    return moveFocusBy(this.table, from, { y: 0, x: -1 });
                case KeyCode.right:
                    event.preventDefault();
                    return moveFocusBy(this.table, from, { y: 0, x: 1 });
                case KeyCode.pageUp:
                    event.preventDefault();
                    return moveFocusBy(this.table, from, { y: -this.pageSize, x: 0 });
                case KeyCode.pageDown:
                    event.preventDefault();
                    return moveFocusBy(this.table, from, { y: this.pageSize, x: 0 });
                case KeyCode.home:
                    event.preventDefault();
                    return moveFocusBy(this.table, from, { y: 0, x: minExtreme });
                case KeyCode.end:
                    event.preventDefault();
                    return moveFocusBy(this.table, from, { y: 0, x: maxExtreme });
                case -KeyCode.home:
                    event.preventDefault();
                    return moveFocusBy(this.table, from, { y: minExtreme, x: minExtreme });
                case -KeyCode.end:
                    event.preventDefault();
                    return moveFocusBy(this.table, from, { y: maxExtreme, x: maxExtreme });
                default:
                    return;
            }
        };
        this.onTableNodeMutation = (mutationRecords) => {
            var _a;
            // When focused cell is un-mounted the focusout event handler removes this.cell,
            // while this.prevFocusedCell is retained until the next focusin event.
            const cell = (_a = this.focusedCell) !== null && _a !== void 0 ? _a : this.prevFocusedCell;
            const cellSuppressed = cell ? this.isSuppressed(cell.element) : false;
            // Update table elements focus if new nodes were added.
            if (mutationRecords.some(record => record.addedNodes.length > 0)) {
                muteElementFocusables(this.table, cellSuppressed);
                ensureSingleFocusable(this.table, cell);
            }
            if (cell) {
                for (const record of mutationRecords) {
                    if (record.type === 'childList') {
                        // The lost focus in an unmount event is reapplied to the table using the previous cell position.
                        // The moveFocusBy takes care of finding the closest position if the previous one no longer exists.
                        for (const removedNode of Array.from(record.removedNodes)) {
                            if (removedNode === cell.element || nodeContains(removedNode, cell.element)) {
                                ensureSingleFocusable(this.table, cell);
                                moveFocusBy(this.table, cell, { y: 0, x: 0 });
                            }
                        }
                    }
                }
            }
        };
    }
    init(table, isSuppressed) {
        this._table = table;
        this._isSuppressed = isSuppressed;
        this.table.addEventListener('focusin', this.onFocusin);
        this.table.addEventListener('focusout', this.onFocusout);
        this.table.addEventListener('keydown', this.onKeydown);
        const tableNodesObserver = new MutationObserver(this.onTableNodeMutation);
        tableNodesObserver.observe(table, { childList: true, subtree: true });
        muteElementFocusables(this.table, false);
        ensureSingleFocusable(this.table, null);
        this.cleanup = () => {
            this.table.removeEventListener('focusin', this.onFocusin);
            this.table.removeEventListener('focusout', this.onFocusout);
            this.table.removeEventListener('keydown', this.onKeydown);
            tableNodesObserver.disconnect();
            restoreElementFocusables(this.table);
        };
    }
    cleanup() {
        // Do nothing before initialized.
    }
    update({ pageSize }) {
        this._pageSize = pageSize;
    }
    get pageSize() {
        return this._pageSize;
    }
    get table() {
        if (!this._table) {
            throw new Error('Invariant violation: GridNavigationHelper is used before initialization.');
        }
        return this._table;
    }
    isSuppressed(focusedElement) {
        return defaultIsSuppressed(focusedElement) || this._isSuppressed(focusedElement);
    }
}
//# sourceMappingURL=use-grid-navigation.js.map