# credit-card-form



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute  | Description | Type                                                                                                                                                                          | Default     |
| -------------------------- | ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `adyenConfig` _(required)_ | --         |             | `CoreConfiguration`                                                                                                                                                           | `undefined` |
| `cardStyles`               | --         |             | `StylesObject \| undefined`                                                                                                                                                   | `undefined` |
| `disabled`                 | `disabled` |             | `boolean`                                                                                                                                                                     | `false`     |
| `placeholder`              | --         |             | `"cardNumber" \| "expiryDate" \| "expiryMonth" \| "expiryYear" \| "holderName" \| "password" \| "securityCodeFourDigits" \| "securityCodeThreeDigits" \| string \| undefined` | `undefined` |


## Events

| Event        | Description | Type                                                |
| ------------ | ----------- | --------------------------------------------------- |
| `formChange` |             | `CustomEvent<CreditCardFormData>`                   |
| `formError`  |             | `CustomEvent<{ message: string; error: unknown; }>` |
| `formReady`  |             | `CustomEvent<void>`                                 |
| `formSubmit` |             | `CustomEvent<CreditCardFormData>`                   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
