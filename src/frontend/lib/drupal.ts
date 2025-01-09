import { DrupalClient } from "next-drupal";

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    auth: {
      clientId: process.env.DRUPAL_CLIENT_ID,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET,
    },
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Basic ${btoa(process.env.BASIC_AUTH_USER + ':' + process.env.BASIC_AUTH_PASSWORD)}`
    },
  },
);
