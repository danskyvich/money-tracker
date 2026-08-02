
# Money Tracker

A basic web application that tracks your monthly finances by recording your day-to-day transactions using three categories: Income, Transfer, and Expenses.


## Authors

- [@danskyvich](https://github.com/danskyvich)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Variables exposed to not just the Node.js environment but to the browser as well, are prefixed with `-NEXT_PUBLIC_`.

It is **imperative** to include the `.env.local` or any file containing these environment variables on the project's `gitignore` file.

`NEXT_PUBLIC_SITE_URL`

For Supabase & GCP:

`NEXT_PUBLIC_SUPABASE_URL`

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

`SUPABASE_SERVICE_ROLE_KEY`

`SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET`

`SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID`

For reCAPTCHA v3:

`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

`RECAPTCHA_SECRET_KEY`



## Features

- Users can add a transaction (*income*, *expense*, or *transfer*)
- Real-time changes; changes are reflected immediately after the time of modification.
- Email, Google, and Facebook authentication
- Two-factor authentication
- Data backup (exporting through JSON, Excel) and data import (importing through JSON and Excel files)
- Deletion of accounts (a group of transactions), transaction/s, and category/s
- Easy account deletion
- Responsiveness for smaller screens
- A basic visual analysis of monthly inflows and outflows, and most recent transactions.


## Tech Stack

**Client:** React, HTML, Javascript, Typescript, TailwindCSS, Zod, and lucide-react, and recharts

**Server:** NextJS, Google Cloud Project, Meta for developers, Supabase (Supabase Auth, Supabase) and PostgreSQL


## License

[MIT](https://choosealicense.com/licenses/mit/)

