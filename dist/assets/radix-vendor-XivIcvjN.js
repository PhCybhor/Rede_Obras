import{r as m}from"./react-vendor-BRnhmgIC.js";var i={exports:{}},t={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f;function y(){if(f)return t;f=1;var R=m(),x=Symbol.for("react.element"),c=Symbol.for("react.fragment"),l=Object.prototype.hasOwnProperty,d=R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,v={key:!0,ref:!0,__self:!0,__source:!0};function s(n,r,p){var e,o={},u=null,_=null;p!==void 0&&(u=""+p),r.key!==void 0&&(u=""+r.key),r.ref!==void 0&&(_=r.ref);for(e in r)l.call(r,e)&&!v.hasOwnProperty(e)&&(o[e]=r[e]);if(n&&n.defaultProps)for(e in r=n.defaultProps,r)o[e]===void 0&&(o[e]=r[e]);return{$$typeof:x,type:n,key:u,ref:_,props:o,_owner:d.current}}return t.Fragment=c,t.jsx=s,t.jsxs=s,t}var a;function E(){return a||(a=1,i.exports=y()),i.exports}var j=E(),q=m();export{j,q as r};
