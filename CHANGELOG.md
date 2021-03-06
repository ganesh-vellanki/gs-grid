# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.1-alpha.2](https://github.com/ganesh-vellanki/gs-grid/compare/v0.0.1-alpha.1...v0.0.1-alpha.2) (2020-10-31)

### [0.0.1-alpha.1](https://github.com/ganesh-vellanki/gs-grid/compare/v0.0.1-alpha.0...v0.0.1-alpha.1) (2020-10-31)

#### 0.0.1-alpha.0 (2020-10-31)

##### Chores

* **packages:**  Add standard-version pkg. (f960c670)
* **imports:**
  *  Update import references. (b24ccb0d)
  *  Update imports & organized them. (cb22baa4)
* **docs:**
  *  Add missing docs for methods. (c30daa89)
  *  Add class docs for cell utilities. (2b759670)
  *  Add missing comments. (7fa6a86a)
  *  Update comments for grid-instance & other areas. (f0e9435d)
  *  Refactor docs generation. (864131ea)
  *  Fix failing bundle.js load (7ba6552f)
  *  Add updated doc files. (2af3befe)
* **main:**  Default branch is now main. (cb3a8b01)
* **readme:**
  *  Update run locally command. (eedd2954)
  *  Update readme file. (373a8dcb)
  *  Update readme.md file. (38d095c4)
  *  Update readme.md file. (26216fc2)
  *  Update CI status badge. (91fc6250)
  *  Update with status badge. (4e222fb3)
* **app:**
  *  Fix live reload with webpack-dev-server (78496f41)
  *  Update git ignore. (1805eb89)
  *  Remove package-lock & add git ignore (594da511)
* **package:**
  *  Update prestart cmd. (2b0bdcfb)
  *  Update tsconfig to compile as es2015 instead of commonJS. (28c92755)
  *  Update dev command (a7e51e41)
  *  Add new dev command & updated dependencies to lates. (a5691f9f)
  *  Update docs generation command (97fa3e16)
  *  Update typedoc generator command (d6513221)
  *  Update docs generate options (da9f73ac)
  *  Update docs generate path. (efd3ad71)
  *  Add rxjs package. (e9bfb75e)
* **pipeline:**
  *  Remove copy:app in previous task. (b01de6ae)
  *  Add copy app command. (d44a9bc3)
  *  Update pipelien to support new example deploy (eeebad7e)
  *  Add ci & cid Pipelines (63d4f430)
  *  Add docs generate step (d99df64f)
  *  Update target branch for docs generation. (3b2642dd)
  *  Remove docs generation cmd to check deploy folder (e1d5d456)
  *  Update pipeline & docs generate command. (f851ab8d)
  *  Update docs folder for gh-pages. (0a1c51ca)
  *  Update docs folder. (38c98989)
  *  Update docs folder path. (85947623)
  *  Update build params (1b8c58f2)
  *  create new branch for gh-pages (c966ba84)
  *  Remove redundant commands (b385c1b8)
  *  Refactor pipeline & organized commands (5db6eb34)
  *  Fix gh-pages publish cmd. (6b793343)
  *  Add publish cmd for github pages. (4c6b2175)
  *  Update pipeline name & readme. (c155df7d)
  *  Update OS to ubuntu only. (33bcd6df)
  *  Add scripts for tsc & webpack (ae30672c)
  *  Update deno file (20192191)
* **pipelines:**
  *  Update github pages publish plugin. (098a69d1)
  *  Update gh-pages publish path (675c68da)
  *  Update pipeline commands. (e3159917)
* **build:**
  *  create deno file. (a57ca4ad)
  *  Add husy for commit hooks. (2c4daafe)
* **webpack:**  Update content base in webpack. (1551def1)
* **lib:**  Fixed project serve & ready to add features. (2a1ab351)

##### New Features

* **virtual-scroll:**
  *  Add smooth scroll transition for clicks. (1f92d6ca)
  *  Add scroll events for wheel, click and touch support. (e16b39ae)
  *  Update scroll drag event callbacks. (95db6906)
  *  Add scroll registration with timeout. (ff5ca1fa)
  *  Add scroll utilities. (85b66044)
  *  Add scroll utilities. (87204f7b)
* **gs-grid:**
  *  Add styles for smooth scroll transition. (32dabd53)
  *  Add class to consume while scrolling. (eec77538)
  *  Add scroll renderer initialize. (7b485d67)
  *  Add support to shrink grid when combined column width is shrunk. (47290072)
  *  Remove flex auto width calculation. (c494f8ae)
  *  Add cell utils in renderers & cell width setup. (d1d0ef00)
  *  Add get cell utils by field name. (a5fb9ccd)
  *  Removed cell width set from header cell width fetching. (5015940d)
  *  Add cell utils. (e76e91bb)
  *  Add cell utils into header renderer. (ff7491ba)
  *  Update grid-column class to reflect cellWidth enum (270b8759)
  *  Add cell utilities to calculate grid width. (14a200f1)
  *  Update grid column with CellWidth enum (80a6480a)
  *  Add cell conifg & cell width enum. (38854667)
  *  Update header template. (4b5ab36e)
  *  Add styles for gs-grid & first render success. (caa93455)
  *  Add stable renderers for grid. (99e1bf61)
  *  Add header render & scss styles loading with webpack require inside gs-grid #shadowRoot. (689d5f9a)
  *  Add minimal functionality to header renderer. (67f0fc4d)
  *  Add flex grid column & header renderers. (b85d794e)
  *  Fix grid selection while grid event dispatch. (bee5bc89)
  *  Update grid-config interface. (2fc2491b)
  *  Add events to bind data to grid & improved comments. (b04cf742)
  *  Add data binding with attributes. (7fedf2e6)
* **scroll-renderer:**
  *  Add scroll bar styles. (7c6139a4)
  *  Add scroll renderer. (9762402f)
* **demo:**
  *  Add custom widths to demo. (21250131)
  *  Remove demo.ts (24de88f1)
  *  Add demo.ts & include js in git ignore. (9ddae8f6)
  *  Remove boostrap styles from webpack bundle. (00930074)
  *  Update demo site title (5e32a879)
  *  Update demo files. (48ab8da1)
* **example:**
  *  Update engage page cards items to 100% height. (d1a34c7b)
  *  Add example folder & new tsconfig.json (5a31186e)
* **grid-demo:**  Add grid setup for demo (3b4ac1d5)
* **app:**
  *  Update features link & title. (91879f7d)
  *  Update top nav docs link. (f20c462a)
* **example-app:**
  *  Update docs path. (35ab0f56)
  *  Add app files copy to demo folder (89e082b2)
  *  Add get-started & what-why pages. (2fbdce4c)
  *  Add home page & # based routing. (8ce568bc)
  *  Add component registry for ko components. (aadaf0f1)
  *  Add dev-engage component. (9e537224)
  *  Add grid-intro component. (9b68c1b6)
  *  Add top nav component (7e023ddc)
  *  Add new example app & update webpack config. (e503742a)
* **grid:**
  *  Update model barrel file with new exports. (27432811)
  *  Add basic webcomponent & finish setup module loading. (5ca1b238)
* **package:**  Refactor commands & add clean command (e183bdc3)
* **packages:**  Refactor to include missing budles.js into docs folder (e816e6a2)
* **grid-column:**  Add pin column enum (38c0e129)
* **grid-core:**  Update grid-config with new options (a870948e)

##### Other Changes

* //github.com/ganesh-vellanki/gs-grid (8191c145)
* //github.com/ganesh-vellanki/gs-grid (d9a2a074)
* //github.com/ganesh-vellanki/gs-grid (b6171295)

