# gs-grid [![gs-grid-ci](https://github.com/ganesh-vellanki/gs-grid/actions/workflows/gs-grid-ci.yml/badge.svg)](https://github.com/ganesh-vellanki/gs-grid/actions/workflows/gs-grid-ci.yml) [![gs-grid-cid](https://github.com/ganesh-vellanki/gs-grid/actions/workflows/gs-grid-cid.yml/badge.svg)](https://github.com/ganesh-vellanki/gs-grid/actions/workflows/gs-grid-cid.yml) 

### __A new grid for evolving web.__
#### _Built with web components & it's framework agnostic._

### [Demo & Docs](https://ganesh-vellanki.github.io/gs-grid/)

### [Package](https://www.npmjs.com/package/@gs-grid/gs-grid)

## Current Features

1. Framework-agnostic Web Component usage
2. Configurable columns with nested field access
3. Built-in column sorting
4. Global search across configured fields
5. CSV and Excel export helpers
6. Virtualized row rendering
7. Smart custom scrollbar behavior
8. Optional row selection with runtime APIs

## Install

```bash
yarn add @gs-grid/gs-grid
```

## Basic Usage

```ts
import '@gs-grid/gs-grid';
import { GridConfig, GridEvents } from '@gs-grid/gs-grid';

const gridConfig = new GridConfig();
gridConfig.rowHeight = 32;
gridConfig.enableRowSelection = true;
gridConfig.columnDefs = [
	{ field: 'name', headerName: 'Name', enableSort: true, width: 180 },
	{ field: 'email', headerName: 'Email', enableSort: true, width: '30%' },
	{ field: 'company.name', headerName: 'Company', enableSort: true, width: 180 }
];
gridConfig.data = data;

const gridEl = document.querySelector('gs-grid');
const instanceId = gridEl?.getAttribute('instance-id');

if (gridEl && instanceId) {
	GridEvents.setupGridConfig(instanceId, gridConfig);
}
```

```html
<gs-grid></gs-grid>
```

## Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| ![Chrome](https://img.shields.io/badge/Chrome-67+-4285F4?logo=google-chrome&logoColor=white) | 67+ |
| ![Edge](https://img.shields.io/badge/Edge-79+-0078D4?logo=microsoft-edge&logoColor=white) | 79+ |
| ![Firefox](https://img.shields.io/badge/Firefox-63+-FF7139?logo=firefox-browser&logoColor=white) | 63+ |
| ![Safari](https://img.shields.io/badge/Safari-10.1+-006CFF?logo=safari&logoColor=white) | 10.1+ |
| ![Opera](https://img.shields.io/badge/Opera-54+-FF1B2D?logo=opera&logoColor=white) | 54+ |

> Requires native [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) support (Custom Elements v1 + Shadow DOM v1).

## Upcoming Features

1. Pinning
2. Grouping
3. Column resizing
4. Column dynamic re-order

#### Steps to run locally: 

* Install packages locally with: `yarn install`

* Run demo & docs locally with: `yarn start`

* If necessary, clean locally generated dist & docs with: `yarn clean`

