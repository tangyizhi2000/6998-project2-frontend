import React from 'react';
import { SortingStatus } from './utils';
import { StickyColumnsModel } from '../sticky-columns';
import { TableRole } from '../table-role';
interface TableThElementProps {
    className?: string;
    style?: React.CSSProperties;
    sortingStatus?: SortingStatus;
    sortingDisabled?: boolean;
    hidden?: boolean;
    colIndex: number;
    resizableColumns?: boolean;
    columnId: PropertyKey;
    stickyState: StickyColumnsModel;
    cellRef?: React.RefCallback<HTMLElement>;
    tableRole: TableRole;
    children: React.ReactNode;
}
export declare function TableThElement({ className, style, sortingStatus, sortingDisabled, hidden, colIndex, resizableColumns, columnId, stickyState, cellRef, tableRole, children, }: TableThElementProps): JSX.Element;
export {};
//# sourceMappingURL=th-element.d.ts.map