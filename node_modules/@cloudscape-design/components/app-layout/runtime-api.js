import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { RuntimeContentWrapper } from '../internal/plugins/helpers';
import { sortByPriority } from '../internal/plugins/helpers/utils';
export function convertRuntimeDrawers(drawers) {
    const converted = drawers.map((_a) => {
        var { mountContent, unmountContent, trigger } = _a, runtimeDrawer = __rest(_a, ["mountContent", "unmountContent", "trigger"]);
        return (Object.assign(Object.assign({}, runtimeDrawer), { trigger: {
                iconSvg: (
                // eslint-disable-next-line react/no-danger
                React.createElement("span", { dangerouslySetInnerHTML: { __html: trigger.iconSvg } })),
            }, content: (React.createElement(RuntimeContentWrapper, { key: runtimeDrawer.id, mountContent: mountContent, unmountContent: unmountContent })) }));
    });
    const sorted = sortByPriority(converted);
    return {
        before: sorted.filter(item => { var _a; return ((_a = item.orderPriority) !== null && _a !== void 0 ? _a : 0) > 0; }),
        after: sorted.filter(item => { var _a; return ((_a = item.orderPriority) !== null && _a !== void 0 ? _a : 0) <= 0; }),
    };
}
//# sourceMappingURL=runtime-api.js.map