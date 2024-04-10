# eBay Marketplace Account Closure Notifier

A simple web server solution for eBay's Account Deletion/Closure Notifications Workflow. It is designed to handle account deletion and closure notifications from eBay, ensuring compliance with eBay's rules on deleting customer data.

## Installation & Setup

Follow these steps to set up your web server and start receiving eBay Marketplace account deletion and closure notifications:

### Prerequisites

- Node.js and npm installed
- A domain name from any trusted domain provider
- Access to modify DNS records for your domain
- Sudo access (required to read SSL certification files)

### Step-by-Step Guide

1. **Clone and Set Up the Repository**

   Clone the repository to your local machine or server:

   ```
   git clone https://github.com/ChaddBrenner/webserver.git
   ```

   Navigate to the cloned directory and install the necessary dependencies:

   ```
   cd webserver
   npm install
   ```

2. **Configure Your Domain**

   Register and set up a domain name through a provider like [Google Domains](https://domains.google/). Update the DNS settings to point your domain to your server's IP address. [Learn how to set up DNS records](https://faq.active24.com/eng/791310-Settings-of-DNS-records-A-AAAA-CNAME-MX-TXT?l=en-US). Also, complete requirements to allow port 443 to be exposed to the internet and open necessary firewalls. This depends highly on your own networking and system 

3. **Obtain and Install SSL Certificates**

   Secure your server with SSL certificates from [Let's Encrypt](https://letsencrypt.org/) using [Certbot](https://certbot.eff.org/). This is required as eBay needs HTTPS.

4. **Configure the Web Server**

   Edit the `.env` file to include your verification token and endpoint as specified in eBay's Event Notification Delivery Method page. Ensure the protocol (`https://`) and the path (`/ebay`) are correctly set, alongside your domain name.

   ```
   VERIFICATION_TOKEN=FusRoDah
   ENDPOINT=https://www.yourwebsite.com/ebay
   DOMAIN=www.yourwebsite.com
   ```

5. **Set Appropriate Permissions**

   The webserver needs the correct permissions to access SSL certification files. [Here's how to set the necessary permissions](https://stackoverflow.com/a/54903098).

6. **Customize the Endpoint Handler**

   Modify the `app.post` route at the bottom of the script to process incoming data from eBay according to your individual business requirements or compliance needs.
