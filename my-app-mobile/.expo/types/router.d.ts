/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/firebase/firebase`; params?: Router.UnknownInputParams; } | { pathname: `/screen/HomeScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screen/LoginScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screen/RegisterScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screen/ResetpasswordScreen`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/firebase/firebase`; params?: Router.UnknownOutputParams; } | { pathname: `/screen/HomeScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/screen/LoginScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/screen/RegisterScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/screen/ResetpasswordScreen`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/firebase/firebase${`?${string}` | `#${string}` | ''}` | `/screen/HomeScreen${`?${string}` | `#${string}` | ''}` | `/screen/LoginScreen${`?${string}` | `#${string}` | ''}` | `/screen/RegisterScreen${`?${string}` | `#${string}` | ''}` | `/screen/ResetpasswordScreen${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/firebase/firebase`; params?: Router.UnknownInputParams; } | { pathname: `/screen/HomeScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screen/LoginScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screen/RegisterScreen`; params?: Router.UnknownInputParams; } | { pathname: `/screen/ResetpasswordScreen`; params?: Router.UnknownInputParams; };
    }
  }
}
