[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)

> Including an `aria-live` attribute or a specialized live region `role` (such as `role="alert"`) on the element you want to announce changes to works as long as you add the attribute before the changes occur — either in the original markup, or dynamically using JavaScript.

The `aria-live=POLITENESS_SETTING` is used to set the priority with which screen reader should treat updates to live regions - the possible settings are: `off`, `polite` or `assertive`. The default setting is `off`. This attribute is by far the most important.

`polite` will speak changes whenever the reader is idle. This is the one for this use case, I think.