# backend-service-1-node
An Express JS server to handle Android image & Firestore requests

Before running the backend service locally, ensure you have the necessary tools and configurations in place.

## Running Locally

### 1. Install Google Cloud SDK (gcloud CLI)

Make sure you have the gcloud CLI installed on your machine. Follow the [Download & Install gcloud CLI](https://cloud.google.com/sdk/gcloud).

### 2. Authenticate with Google ADC and Configure with GCP Account

Authenticate your local machine with Google Application Default Credentials (ADC) and configure it with your Google Cloud Platform (GCP) account. Refer to the [ADC documentation](https://cloud.google.com/docs/authentication/provide-credentials-adc).

### 3. Run the Backend Service

To run the backend service, follow these steps:

1. Open a terminal in the `backend-service-1-node` directory.

2. Install the required dependencies using npm:

    ```bash
    npm install
    ```

3. Start the Express JS server in development mode:

    ```bash
    npm run devStart
    ```
## Running on AppEngine
1. Add start script in the `package.json`

    ```bash
    "start": "node server.js"
    ```
2. Open file `server.js` and change the port to:

    ```bash
    const port = process.env.PORT || 3000;
    ```
3. Create new file `app.yaml`

    ```bash
    runtime: nodejs16
    service: [your service name]
    ```
4. Open Google Cloud CLI & deploy the service with:
    ```bash
    gcloud app deploy
    ```
