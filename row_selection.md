# Row Selection Design

## Goal

Add row selection support to `gs-grid` with a minimal change footprint in the component class and with selection logic isolated for unit testing.

## Requirements

1. Add row selection.
2. Grid API must accept an async callback that is invoked with:
   - all selected rows as the first parameter
   - the current selected row as the second parameter
3. Add one more function to get all selected rows.
4. If the async callback is not registered, do not call it.
5. Add a header checkbox that:
   - selects all rows
   - unselects all rows
   - shows indeterminate state when partially selected

## Design Direction

The row selection feature should not be implemented directly inside `gs-grid.ts` beyond orchestration.

`gs-grid.ts` is already large and should remain responsible only for:

- wiring events
- binding instance APIs
- passing current dataset into the selection manager
- asking renderers to reflect selection state
- syncing header checkbox state after changes

The actual selection state and logic should live in a dedicated utility or manager under `src/core`.

## Proposed File Layout

### New file

- `src/core/row-selection.utilities.ts`

### Existing files to update later

- `src/gs-grid.ts`
- `src/core/index.ts`
- `src/interface/grid-config.ts`
- `src/model/grid-config.ts`
- `src/interface/grid-instance.ts`
- `src/model/grid-instance.ts`
- `src/renderers/header.renderer.ts`
- `src/renderers/data-row.renderer.ts`
- `src/styles/gs-grid.scss`

## Why a Utility or Manager

This feature is stateful, but it still belongs outside the component because:

- the logic should be unit testable without DOM setup
- `gs-grid.ts` should not absorb more business logic
- virtualization re-renders row DOM, so selection state must survive independently of markup
- the same selection behavior is easier to validate in isolation

## Important Constraint: Multiple Grid Instances

Selection state must not be stored in shared module-level globals without instance isolation.

Reason:

- multiple `gs-grid` instances can exist on the same page
- shared state would leak selected rows across grids

Because of that, the selection utility should be implemented as an instance-scoped manager class, created per grid instance.

## Proposed Manager Responsibilities

The selection manager should own:

- selected row state
- row toggle behavior
- select-all and unselect-all behavior
- selected rows retrieval
- selected row membership checks
- header checkbox state calculation
- async callback invocation
- selection reset when the source dataset is replaced

## Proposed Manager Shape

Example high-level API:

```ts
export interface RowSelectionState {
    isAllSelected: boolean;
    isPartiallySelected: boolean;
    selectedCount: number;
}

export class RowSelectionUtilities {
    constructor(
        onSelectionChangeAsync?: (selectedRows: any[], currentSelectedRow: any | null) => Promise<void>
    ) {}

    setSelectionChangeHandler(
        handler?: (selectedRows: any[], currentSelectedRow: any | null) => Promise<void>
    ): void {}

    isSelected(row: any): boolean {}

    getSelectedRows(): any[] {}

    clearSelection(): void {}

    resetForData(data: any[]): void {}

    async toggleRow(row: any): Promise<void> {}

    async selectAll(rows: any[]): Promise<void> {}

    async unselectAll(rows: any[]): Promise<void> {}

    getHeaderState(rows: any[]): RowSelectionState {}
}
```

The exact method names can be adjusted during implementation, but the responsibilities should remain the same.

## Data Model

Selection should be tracked against row object references.

Reason:

- the existing grid already passes row objects through sort, search, and virtualization flows
- sorting and filtering preserve object references in the current code path
- this avoids inventing a new required row id API right now

This means:

- sorting should preserve selection
- filtering should preserve selection for matching rows
- selection can be restored on re-render because the row references remain stable

## Behavior Rules

### Row selection

- checking a row checkbox selects the row
- unchecking a row checkbox unselects the row
- the selected row list is updated immediately

### Callback behavior

- if `onRowSelectionChangeAsync` is registered, invoke it after selection changes
- pass `selectedRows` as the first parameter
- pass the row that triggered the current change as the second parameter
- for bulk header actions, pass `null` as the current row unless implementation later decides to expose a special sentinel value
- if the callback is not registered, skip invocation silently

### Header checkbox behavior

The header checkbox state should be based on the current active dataset being shown by the grid.

That means the rows considered by the header checkbox are the rows in `gridConfig.data` after search and sort are applied.

Rules:

- if zero current rows are selected, header checkbox is unchecked
- if all current rows are selected, header checkbox is checked
- if some but not all current rows are selected, header checkbox is indeterminate
- clicking the checked header checkbox unselects all current rows
- clicking the unchecked or indeterminate header checkbox selects all current rows

## Public API Additions

### Grid config callback

Add an optional async callback to grid config:

```ts
onRowSelectionChangeAsync?: (selectedRows: any[], currentSelectedRow: any | null) => Promise<void>;
```

This satisfies the requirement that the API accepts a function and that the name ends with `async`.

### Grid instance getter

Add a selected rows getter to grid instance:

```ts
getSelectedRows(): any[];
```

This provides a direct read API in addition to the async callback.

### Grid instance toggle

Add a runtime toggle for row selection on the grid instance:

```ts
setRowSelectionEnabled(enabled: boolean): Promise<boolean>;
```

This allows the feature to be enabled or disabled dynamically after the grid is already rendered.

## Renderer Changes

### Header renderer

Add a dedicated selection column at the start of the header row with a checkbox input.

The renderer should only render markup. It should not own selection logic.

Suggested markup shape:

```html
<div class="header-column selection-column">
  <input type="checkbox" class="header-select-checkbox" />
</div>
```

### Data row renderer

Add a dedicated selection column at the start of each row with a checkbox input.

Each row should also expose enough metadata for `gs-grid.ts` to map the event back to the source row.

Possible approaches during implementation:

- render using row index from the current rendered set
- attach a generated row token
- re-render with data mapping held by the component

The implementation should prefer the smallest change that works with virtualization.

Suggested markup shape:

```html
<div class="cell-column selection-column">
  <input type="checkbox" class="row-select-checkbox" />
</div>
```

## Virtualization Impact

Virtualization is the main reason selection state must be external to the row DOM.

Rows are re-rendered by the virtualization flow, so:

- checkbox checked state must be recomputed from selection state on every render
- selected row styling must also be recomputed on every render
- selection manager must remain the source of truth

## Styling Changes

Add styles for:

- header selection column width
- row selection column width
- checkbox alignment
- selected row visual state
- compatibility with existing row height and borders

The styling should preserve the current table-like appearance.

## Reset Rules

When `updateData()` replaces the dataset, selection should be cleared.

Reason:

- the grid receives a new source dataset
- previous row references may no longer be valid
- carrying old selection state across replaced data is ambiguous

## Testing Strategy

The new utility should be designed so it can be unit tested independently from the custom element.

Useful test cases later:

1. selecting a single row updates selected rows
2. unselecting a selected row removes it
3. select-all selects only the provided active rows
4. unselect-all clears only the provided active rows
5. header state returns unchecked, checked, and indeterminate correctly
6. callback is not invoked when not registered
7. callback is invoked with selected rows first and current row second
8. reset clears stale selection after data replacement
9. sorting and filtering preserve selection when row references are retained

## Summary

The implementation should follow this architecture:

- keep `gs-grid.ts` as a coordinator
- add a dedicated row selection manager under `src/core`
- expose one async callback on grid config
- expose one selected rows getter on grid instance
- add a header checkbox with checked and indeterminate behavior
- make selection survive re-rendering and virtualization

This keeps the feature testable, avoids overgrowing the main component, and satisfies the requested API contract.

## Implementation Status

The first implementation pass is complete.

Implemented files:

- `src/core/row-selection.utilities.ts`
- `src/core/index.ts`
- `src/interface/grid-config.ts`
- `src/model/grid-config.ts`
- `src/interface/grid-instance.ts`
- `src/model/grid-instance.ts`
- `src/renderers/header.renderer.ts`
- `src/renderers/data-row.renderer.ts`
- `src/gs-grid.ts`
- `src/styles/gs-grid.scss`

Implemented behavior:

- row selection manager extracted into `src/core/row-selection.utilities.ts`
- async callback support added through `onRowSelectionChangeAsync`
- selected rows getter added through `getSelectedRows()` on the grid instance
- runtime row-selection toggle added through `setRowSelectionEnabled()` on the grid instance
- header checkbox added for select-all and unselect-all
- indeterminate header state added for partial selection
- selected state survives row re-rendering and virtualization
- selection is cleared when `updateData()` replaces the dataset
- selection is cleared when the feature is disabled at runtime

Validation completed:

- `yarn tsc`
- `yarn build`

Both passed after implementation.

## Working Notes

- Selection is currently tracked by row object reference.
- Header checkbox operates on the current active dataset in `gridConfig.data`.
- The grid component coordinates DOM events and rendering, while the selection utility owns state.
- The current implementation re-renders the visible viewport after selection changes.
- Row selection UI is rendered only when `enableRowSelection` is true.
- The example demo includes a button that toggles row selection dynamically.

## Follow-up Todos

- add unit tests for `src/core/row-selection.utilities.ts`
- verify behavior with search plus selection edge cases in the example app
- verify behavior with sort plus selection edge cases in the example app
- decide whether filtered-out selected rows should remain selected or be pruned automatically
- consider whether row click should also toggle selection in addition to checkbox interaction