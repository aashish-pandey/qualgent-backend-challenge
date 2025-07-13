# qgjob CLI

A lightweight command-line interface (CLI) tool to interact with the Qualgent backend test scheduling service.

## Features

- Submit new test jobs by org and app version
- Check the status of submitted jobs
- Simple and fast interface for internal QA workflows

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/qualgent-cli.git
cd cli
npm install
```

Make the CLI executable
```bash
chmod +x index.js
sudo npm link
```

After testing uninstall the global link
```bash
npm unlink -g
```

## Configuration

Create a .env file at the root with backend URL:
```bash
BACKEND_URL=http://localhost:3000
```

## Usage

1. Submit a job

    ```bash
    qgjob submit \
    --org-id=qualgent \
    --app-version-id=xyz123 \
    --test=tests/onboarding.spec.js
    ```

2. Check Job Staus

    ```bash
    qgjob status --id=<job_id>
    ```

## Tech Stack
 - Node.js
 - Commander.js
 - Axios
 - Dotenv


## Notes
    - Ensure that backend server is running before using the CLI
    - This tool uses an in-memory backend, so job data resets when the backend restarts.


## Contact
For questions, reach out to {pandeyaashish100@gmail.com}
