import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../../base-component';
import InternalStatusIndicator from '../../../status-indicator/internal';
import styles from './styles.css.js';
import LiveRegion from '../../components/live-region';
import { useInternalI18n } from '../../../i18n/context';
export default function Drawer(_a) {
    var { header, children, loading, i18nStrings } = _a, restProps = __rest(_a, ["header", "children", "loading", "i18nStrings"]);
    const baseProps = getBaseProps(restProps);
    const i18n = useInternalI18n('drawer');
    const containerProps = Object.assign(Object.assign({}, baseProps), { className: clsx(baseProps.className, styles.drawer) });
    return loading ? (React.createElement("div", Object.assign({}, containerProps),
        React.createElement(InternalStatusIndicator, { type: "loading" },
            React.createElement(LiveRegion, { visible: true }, i18n('i18nStrings.loadingText', i18nStrings === null || i18nStrings === void 0 ? void 0 : i18nStrings.loadingText))))) : (React.createElement("div", Object.assign({}, containerProps),
        header && React.createElement("div", { className: clsx(styles.header) }, header),
        React.createElement("div", { className: clsx(styles['test-utils-drawer-content']) }, children)));
}
//# sourceMappingURL=index.js.map