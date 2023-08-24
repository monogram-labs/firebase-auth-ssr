# Firebase Auth Next.js 13 App Router P-O-C

### getFirebaseAppSSR

Download a JSON private key file for your `firebase-adminsdk` service account (under the respective firebase project) from [cloud console](https://console.cloud.google.com/iam-admin/serviceaccounts)

Use the JSON pk file to populate env variables [that are being used here](/src/utils.ts#L17)

`getFirebaseAppSSR` function can be found in [src/utils.ts](/src/utils.ts#L37)

Usage can be seen in [src/app/page.tsx](/src/app/page.tsx#L10)
