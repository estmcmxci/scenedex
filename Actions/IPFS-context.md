### IPFS Command-Line Quick Start

Source: https://docs.ipfs.tech/concepts/faq

For users who prefer the command line, a quick start guide is available for installing and initializing IPFS. This guide covers the necessary terminal commands to get an IPFS node running.

```N/A
command-line quick start guide
```

--------------------------------

### Pin Files with IPFS Quickstart

Source: https://docs.ipfs.tech/install

A guide on how to use third-party pinning services to easily pin and provide files to the IPFS network without complex tooling.

--------------------------------

### Install IPFS Cluster

Source: https://docs.ipfs.tech/install

Guidance on installing IPFS Cluster for orchestrating data across multiple Kubo nodes, managing replication, and tracking pinsets.

--------------------------------

### Install IPFS Companion Browser Extension

Source: https://docs.ipfs.tech/install

Information on installing the IPFS Companion browser extension, enabling users to view decentralized web content directly in their browser.

--------------------------------

### Install Kubo Daemon & CLI

Source: https://docs.ipfs.tech/install

Instructions for installing Kubo, the command-line interface for IPFS, essential for building decentralized applications and storing data on IPFS.

--------------------------------

### Deploy Static Sites to IPFS with GitHub Actions

Source: https://docs.ipfs.tech/install

A guide on automating the deployment of static websites to the IPFS network using GitHub Actions.

--------------------------------

### Install IPFS Desktop

Source: https://docs.ipfs.tech/concepts/faq

The easiest way to start using IPFS is by installing IPFS Desktop, a user-friendly application that runs an IPFS node on your computer without requiring command-line interaction.

```N/A
Install IPFS Desktop
```

--------------------------------

### Install IPFS Desktop App

Source: https://docs.ipfs.tech/install

Instructions for installing the IPFS Desktop application, which provides a user-friendly interface and includes a built-in Kubo node for interacting with the IPFS network.

--------------------------------

### Boxo SDK for Go

Source: https://docs.ipfs.tech/install

Overview of Boxo, a set of Go reference libraries for building IPFS applications and implementations. Mentions examples and its use in other IPFS projects.

```Go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/ipfs/boxo/core"
	"github.com/ipfs/boxo/gateway"
	"github.com/ipfs/boxo/ipns"
	"github.com/ipfs/boxo/routing"
	"github.com/ipfs/boxo/store"
	"github.com/ipfs/boxo/urlfetch"
	"github.com/ipfs/go-cid"
	"github.com/ipfs/go-ipfs-util"
	"github.com/ipfs/go-ipfs-util/testutils"
)

func main() {
	ctx := context.Background()

	// Example: Setting up a basic IPFS node using Boxo (conceptual)
	// This is a simplified representation; actual setup involves more configuration.

	// Create a blockstore
	bs, err := store.NewBlockstore(ctx, "/tmp/ipfs_blockstore")
	if err != nil {
		log.Fatalf("failed to create blockstore: %v", err)
	}

	// Create a routing system
	r := routing.NewIpfsRouting(ctx, bs)

	// Create a core IPFS instance
	ipfs, err := core.NewCore(ctx, core.Options{
		Blockstore: bs,
		Routing:    r,
		// Add other options like datastore, identity, etc.
	})
	if err != nil {
		log.Fatalf("failed to create IPFS core: %v", err)
	}

	fmt.Printf("IPFS node created successfully. Peer ID: %s\n", ipfs.Identity.String())

	// Example: Resolving an IPNS name (conceptual)
	// ipnsKey := "Qm..."; // Replace with a valid IPNS key
	// resolvedCid, err := ipns.Resolve(ctx, ipfs.IpnsResolver, ipnsKey)
	// if err != nil {
	// 	log.Printf("failed to resolve IPNS name %s: %v\n", ipnsKey, err)
	// } else {
	// 	fmt.Printf("Resolved IPNS name %s to CID: %s\n", ipnsKey, resolvedCid.String())
	// }
}

```

--------------------------------

### Fetch and Display IPFS Quick Start Guide

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Fetches and displays the 'quick-start' file from a specific IPFS content identifier (CID). This command demonstrates how to access other files within the IPFS network and provides usage examples.

```bash
ipfs cat /ipfs/bafybeie5nqv6kd3qnfjupgvz34woh3oksc3iau6abmyajn7qvtf6d2ho34/quick-start
```

--------------------------------

### Run Someguy Delegated Router

Source: https://docs.ipfs.tech/install

Instructions for running Someguy, a delegated routing endpoint that connects to Amino DHT and IPNI.

--------------------------------

### Run Rainbow Gateway

Source: https://docs.ipfs.tech/install

Information on running Rainbow, a production-grade HTTP Gateway service powered by the same software used for public gateways.

--------------------------------

### Helia SDK for JavaScript/TypeScript

Source: https://docs.ipfs.tech/install

Details on Helia, a modular and lightweight JavaScript implementation of IPFS, designed as a successor to js-ipfs. Includes information on Helia 101 and @helia/verified-fetch.

```JavaScript
import { create } from '@helia/core'
import { dagCbor } from '@helia/dag-cbor'
import { unixfs } from '@helia/unixfs'

// Create a new Helia instance
const helia = await create()

// Use the unixfs module for file operations
const fs = unixfs.add(helia)

// Example of adding a file (conceptual)
// const fileContent = new TextEncoder().encode('Hello IPFS!')
// const cid = await fs.addBytes(fileContent)
// console.log('Added file with CID:', cid.toString())

// Example of using verified-fetch (conceptual)
// import { verifiedFetch } from '@helia/verified-fetch'
// const response = await verifiedFetch(helia, 'ipfs://<CID>')
// const data = await response.text()
// console.log('Fetched data:', data)
```

--------------------------------

### Install IPFS Desktop on Windows

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/single-page-website

Steps to install IPFS Desktop on Windows. This involves downloading the .exe file, running it, selecting installation options, and completing the setup.

```bash
1. Download the latest available `.exe` file from the IPFS desktop downloads page(opens new window):
2. Run the `.exe` file to start the installation.
3. Select whether you want to install the application for just yourself or all users on the computer. Click **Next** :
4. Select the install location for the application. The default location is usually fine. Click **Next** :
5. Wait for the installation to finish and click **Finish** :
6. You can now find an IPFS icon in the status bar:
```

--------------------------------

### Install IPFS Desktop on Linux

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/single-page-website

Guide for installing IPFS Desktop on Linux. This involves downloading the .deb package and installing it using the Software Installer.

```bash
1. Download the latest available `.deb` file from the IPFS desktop downloads page(opens new window):
2. Open the `.deb` package in **Software Installer** :
3. Click **Install** and wait for the installation to finish:
4. Click **Applications** or press the Windows key on your keyboard.
5. Search for `IPFS` and select **IPFS Desktop** :
6. You can now find an IPFS icon in the status bar:
```

--------------------------------

### Host Websites on IPFS

Source: https://docs.ipfs.tech/how-to

Learn the fundamentals of hosting a website on IPFS. This guide provides a starting point for deploying simple single-page sites to the distributed web.

```bash
# Example: Adding a website directory to IPFS
ipfs add -r /path/to/your/website
```

--------------------------------

### Ping IPFS.io Command Line Example

Source: https://docs.ipfs.tech/community/contribute/grammar-formatting-and-style

Demonstrates how to ping the IPFS domain using the command line. It shows the expected output, including packet statistics. The example also illustrates how to truncate long command-line outputs.

```bash
ping ipfs.io

> PING ipfs.io (209.94.90.1): 56 data bytes
> 64 bytes from 209.94.90.1: icmp_seq=0 ttl=53 time=15.830 ms
> 64 bytes from 209.94.90.1: icmp_seq=1 ttl=53 time=19.779 ms
> 64 bytes from 209.94.90.1: icmp_seq=2 ttl=53 time=20.778 ms
> 64 bytes from 209.94.90.1: icmp_seq=3 ttl=53 time=20.578 ms
> --- ipfs.io ping statistics ---
> 4 packets transmitted, 4 packets received, 0.0% packet loss
```

```bash
ping ipfs.io

> PING ipfs.io (209.94.90.1): 56 data bytes
> 64 bytes from 209.94.90.1: icmp_seq=0 ttl=53 time=15.830 ms
> ...
> 4 packets transmitted, 4 packets received, 0.0% packet loss
```

--------------------------------

### Build Apps on IPFS with libp2p

Source: https://docs.ipfs.tech/how-to

Explore building applications on IPFS, starting with understanding the IPFS API and creating a basic libp2p application. This guide is for developers looking to leverage IPFS for decentralized applications.

```javascript
// Example: Using IPFS API (conceptual)
// const ipfs = require('ipfs-http-client')
// const client = ipfs.create({ url: '/ip4/127.0.0.1/tcp/5001' })
```

```go
// Example: Basic libp2p app (conceptual)
// Requires libp2p Go implementation.
```

--------------------------------

### Check Go Version

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Verifies the installed Go version to ensure it meets the IPFS requirement of Go 1.24.0 or later. It shows the command to run and an example output.

```Shell
go version

> go version go1.24.0 linux/amd64
```

--------------------------------

### Install IPFS Desktop on Windows

Source: https://docs.ipfs.tech/install/ipfs-desktop

Steps to download and install the IPFS Desktop application on Windows using the provided .exe file. This includes running the installer, selecting installation options, and completing the setup.

```shell
1. Go to the IPFS Desktop downloads page(opens new window)
2. Find the link ending in `.exe` for the latest version of IPFS Desktop:
3. Run the `.exe` file to start the installation.
4. Select whether you want to install the application for just yourself or all users on the computer. Click **Next** :
5. Select the install location for the application. The default location is usually fine. Click **Next** :
6. Wait for the installation to finish and click **Finish** :
7. You can now find an IPFS icon in the status bar:
```

--------------------------------

### Existing IPFS Implementations

Source: https://docs.ipfs.tech/concepts/faq

Several IPFS implementations are available, including Kubo and Helia. Users also have the option to develop and create their own IPFS implementations.

```N/A
Kubo
Helia
```

--------------------------------

### IPFS Desktop Image Upload Alt Text Example

Source: https://docs.ipfs.tech/community/contribute/grammar-formatting-and-style

Provides an example of alt text for an image, specifically for a screenshot of the IPFS desktop application showing an image upload process. This is crucial for accessibility.

```markdown
![Screenshot of an image being uploaded through the IPFS desktop application.](images/ipfs-desktop-image-upload-screen.png)
```

--------------------------------

### IPFS Deploy Action Workflow Example

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

This YAML snippet demonstrates a GitHub Actions workflow that utilizes the IPFS Deploy Action to build and deploy a static site. It includes steps for checking out code, setting up Node.js, installing dependencies, building the static site, and then deploying it to IPFS using the IPFS Deploy Action.

```YAML
name: Deploy to IPFS

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Dependencies
        run: npm install
      - name: Build Static Site
        run: npm run build
      - name: Deploy to IPFS
        uses: ipfs/github-actions/deploy-to-ipfs@v0.1.0
        with:
          path: ./build
          pinata_jwt: ${{ secrets.PINATA_JWT }}
          pinata_api_key: ${{ secrets.PINATA_API_KEY }}
          pinata_secret_api_key: ${{ secrets.PINATA_SECRET_API_KEY }}
```

--------------------------------

### Start IPFS Daemon

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Starts the IPFS daemon, making your node online and ready to interact with the IPFS network. It displays API and Gateway server listening ports.

```bash
ipfs daemon
```

--------------------------------

### Customize IPFS Node Installation

Source: https://docs.ipfs.tech/how-to

Learn to customize your IPFS installation by configuring the node, modifying the bootstrap list, and other advanced settings. This guide helps tailor the IPFS experience to your specific needs.

```bash
# Example: Modifying bootstrap list
ipfs config Bootstrap --json '[/dns4/node1.ipfs.io/tcp/4001/p2p/Qm...', '/dns4/node2.ipfs.io/tcp/4001/p2p/Qm...']'
```

```bash
# Example: Configuring a node (conceptual)
# Refer to IPFS documentation for specific configuration options.
```

--------------------------------

### Run Caddy Manually

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

Starts the Caddy server manually from the directory containing the Caddyfile. This is an alternative to managing Caddy as a systemd service.

```shell
caddy run
```

--------------------------------

### IPFS Cluster Go Client Example

Source: https://docs.ipfs.tech/install/server-infrastructure

This example demonstrates how to programmatically control IPFS Cluster peers using the Go client library. It shows how to initialize the client and perform basic operations.

```go
package main

import (
	"context"
	"fmt"
	"github.com/ipfs/ipfs-cluster/api"
	"github.com/ipfs/ipfs-cluster/rpc"
)

func main() {
	// Connect to the cluster API
	client, err := rpc.NewClient(context.Background(), "/ip4/127.0.0.1/tcp/9094")
	if err != nil {
		fmt.Printf("Error connecting to cluster: %v\n", err)
		return
	}

	// Get cluster peers
	peers, err := client.Peers(context.Background())
	if err != nil {
		fmt.Printf("Error getting peers: %v\n", err)
		return
	}

	fmt.Printf("Cluster peers: %v\n", peers)

	// Add a pin (example CID)
	cid := "QmY7YwxU25Z4j4434434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343
```

--------------------------------

### IPFS Documentation Front-Matter Example

Source: https://docs.ipfs.tech/community/contribute/grammar-formatting-and-style

Shows the required front-matter structure for IPFS documentation articles, including a 'title' and 'description' field for metadata and link teasers.

```YAML/Markdown
---
title: Example article
description: This is a brief description that shows up in link teasers in services like Twitter and Slack.
---

```

--------------------------------

### Download and Install Kubo on FreeBSD

Source: https://docs.ipfs.tech/install/command-line

This snippet shows the process of downloading the FreeBSD binary for Kubo, extracting the archive, running the install script with root privileges, and verifying the installation.

```shell
wget https://dist.ipfs.tech/kubo/v0.37.0/kubo_v0.37.0_freebsd-amd64.tar.gz
tar -xvzf kubo_v0.37.0_freebsd-amd64.tar.gz
cd kubo
doas bash install.sh
ipfs --version
```

--------------------------------

### IPFS Standards and Specifications

Source: https://docs.ipfs.tech/concepts/faq

Learn about the design standards and architectural specifications for IPFS at specs.ipfs.tech. This resource aims to promote interoperability among different IPFS implementations through standardized specifications and test suites.

```N/A
specs.ipfs.tech
```

--------------------------------

### Install w3cli Tool

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

Installs the `w3cli` command-line interface tool globally using npm. This tool is essential for interacting with Storacha services.

```bash
npm install -g @web3-storage/w3cli
```

--------------------------------

### Download and Install Kubo on Windows

Source: https://docs.ipfs.tech/install/command-line

This snippet demonstrates how to download the Windows binary for Kubo, unzip it, add it to the system's PATH environment variable, and verify the installation.

```powershell
wget https://dist.ipfs.tech/kubo/v0.37.0/kubo_v0.37.0_windows-amd64.zip -Outfile kubo_v0.37.0.zip
Expand-Archive -Path kubo_v0.37.0.zip -DestinationPath ~Appskubo_v0.37.0
cd ~Appskubo_v0.37.0\kubo
.ipfs.exe --version
$GO_IPFS_LOCATION = pwd
if (!(Test-Path -Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
notepad $PROFILE
Add-Content $PROFILE "`n[System.Environment]::SetEnvironmentVariable('PATH',`$Env:PATH+';;$GO_IPFS_LOCATION')"
& $profile
cd ~
ipfs --version
```

--------------------------------

### Install IPFS Desktop on macOS

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/single-page-website

Instructions for installing IPFS Desktop on macOS. This includes downloading the .dmg file, moving the application to the Applications folder, and handling security prompts.

```bash
1. Download the latest available `.dmg` file from the IPFS desktop downloads page(opens new window):
2. Open the `ipfs-desktop.dmg` file.
3. Drag the IPFS icon into the **Applications** folder:
4. Open your **Applications** folder and open the IPFS desktop application.
5. You may get a warning saying _IPFS Desktop.app can't be opened_. Click **Show in Finder** :
6. Find **IPFS Desktop.app** in your **Applications** folder.
7. Hold down the `control` key, click **IPFS Desktop.app** , and click **Open** :
8. Click **Open** in the new window:
9. You can now find an IPFS icon in the status bar:
```

--------------------------------

### Install IPFS Desktop using Scoop

Source: https://docs.ipfs.tech/install/ipfs-desktop

Installs IPFS Desktop using the Scoop package manager. This involves adding the 'extras' bucket and then installing 'ipfs-desktop'.

```shell
scoop bucket add extras && scoop install ipfs-desktop
```

--------------------------------

### Download and Install Kubo on OpenBSD

Source: https://docs.ipfs.tech/install/command-line

This snippet outlines the steps to download the OpenBSD binary for Kubo, extract the archive, execute the install script with root privileges, and confirm the installation.

```shell
wget https://dist.ipfs.tech/kubo/v0.37.0/kubo_v0.37.0_openbsd-amd64.tar.gz
tar -xvzf kubo_v0.37.0_openbsd-amd64.tar.gz
cd kubo
doas bash install.sh
ipfs --version
```

--------------------------------

### JavaScript Console Log Example

Source: https://docs.ipfs.tech/community/contribute/grammar-formatting-and-style

A simple JavaScript code snippet demonstrating how to log an error message to the console.

```javascript
console.log(error);
```

--------------------------------

### CIDv0 to CIDv1 Conversion Example

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This shows a real-world example of a redirect from a CIDv0 path to a CIDv1 subdomain for accessing content.

```URL
https://dweb.link/ipfs/QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX/wiki/Mars.html
```

--------------------------------

### Subdomain Gateway Resolution (Bash Example)

Source: https://docs.ipfs.tech/how-to/gateway-best-practices

Provides a bash example demonstrating the subdomain gateway format for accessing IPFS content, emphasizing how it avoids violating the same-origin policy by presenting distinct origins.

```Bash
https://{CID A}.ipfs.{gatewayURL}/{webpage A}
https://{CID B}.ipfs.{gatewayURL}/{webpage B}
```

--------------------------------

### Address IPFS on the Web

Source: https://docs.ipfs.tech/how-to

Understand how IPFS content can be accessed and integrated on the web. This guide covers addressing IPFS resources and using IPFS within browser tools and frameworks.

```javascript
// Example: Accessing IPFS content via a gateway (conceptual)
// const ipfsHash = 'Qm...';
// const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
```

--------------------------------

### Kubo Fetch Output Example

Source: https://docs.ipfs.tech/quickstart/retrieve

This shows the expected output when successfully fetching a CID using the `ipfs get` command with Kubo, indicating the progress and completion of the download.

```plaintext
Saving file(s) to bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4
647.61 KiB / 647.61 KiB [========================================================================================================================] 100.00% 0s

```

--------------------------------

### Example IPNS URL

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This provides a concrete example of an IPFS URL using an IPNS name, demonstrating the structure outlined previously.

```URL
https://ipfs.io/ipns/k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8
```

--------------------------------

### IPFS Files Create Directory (mkdir) cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

Provides a cURL example for creating directories in IPFS MFS using the 'files mkdir' command. It outlines arguments for path, parent directory creation, and CID version.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/files/mkdir?arg=<path>&parents=<value>&cid-version=<value>&hash=<value>"
```

--------------------------------

### Example DNSLink URL

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This example shows a URL path utilizing a DNSLink, demonstrating how a DNS name can resolve to IPFS content.

```URL
https://ipfs.io/ipns/tr.wikipedia-on-ipfs.org/wiki/Anasayfa.html
```

--------------------------------

### Start IPFS Kubo Daemon

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

Starts the IPFS daemon, bringing your node online and connecting it to the IPFS network. This command should remain running while you use IPFS.

```bash
ipfs daemon

```

--------------------------------

### IPFS and IPNS Native URL Examples

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

Provides examples of both IPFS and IPNS native URLs, demonstrating variations with CID versions, paths, query parameters, and fragments. Also shows an example with a DNSLink name for IPNS.

```plaintext
ipfs://{cidv1}
ipfs://{cidv1}/path/to/resource
ipfs://{cidv1}/path/to/resource?query=foo#fragment

ipns://{cidv1-libp2p-key}
ipns://{cidv1-libp2p-key}/path/to/resource
ipns://{dnslink-name}/path/to/resource?query=foo#fragment
```

--------------------------------

### Example Subdomain Gateway URLs

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

These examples demonstrate accessing IPFS content using CIDv1 in subdomain gateways, showcasing different gateway hosts and paths.

```URL
https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link/wiki/
```

```URL
http://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.localhost:8080/wiki/Vincent_van_Gogh.html
```

--------------------------------

### IPFS Implementation Requirements

Source: https://docs.ipfs.tech/concepts/faq

An IPFS implementation is defined as software that facilitates interaction with other IPFS implementations. Key requirements include CID addressability, support for retrieval and provisioning operations, and verification of CID-resource matches.

```N/A
Supports addressability using CIDs.
Exposes operations like retrieval, provisioning and indexing on resources using CIDs. The operations that an implementation may support are open-ended, but this requirement should cover any interaction which the implementation exposes to other IPFS implementations.
Verifies that the CIDs it resolves match the resources they address, at least when it has access to the resources bytes. However, implementations may relax this requirement in controlled environments in which it is possible to ascertain that verification has happened elsewhere in a trusted part of the system.
```

--------------------------------

### Install IPFS Desktop on macOS

Source: https://docs.ipfs.tech/install/ipfs-desktop

Instructions for installing IPFS Desktop on macOS by downloading the .dmg file, opening it, and dragging the application to the Applications folder. It also covers the security prompt for opening unsigned applications.

```shell
1. Download the latest available `.dmg` file from the ipfs/ipfs-desktop releases page(opens new window)
2. Open the `ipfs-desktop.dmg` file.
3. Drag the IPFS icon into the **Applications** folder:
4. Open your **Applications** folder and open the IPFS Desktop application.
5. You may get a warning saying _IPFS Desktop.app can't be opened_. Click **Show in Finder** :
6. Find **IPFS Desktop.app** in your **Applications** folder.
7. Hold down the `control` key, click **IPFS Desktop.app** , and click **Open** :
8. Click **Open** in the new window:
9. You can now find an IPFS icon in the status bar:
```

--------------------------------

### Get IPFS Bandwidth Statistics (cURL)

Source: https://docs.ipfs.tech/reference/kubo/rpc

Example using cURL to get bandwidth statistics, with options to specify peer, protocol, polling, and interval.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/stats/bw?peer=<value>&proto=<value>&poll=<value>&interval=1s"
```

--------------------------------

### IPFS Protocol Implementations

Source: https://docs.ipfs.tech/project/repository-guide

This section lists the primary protocol implementations of IPFS. It highlights Kubo (Go), js-ipfs (JavaScript, being discontinued), and rust-ipfs (Rust). It also provides a link to other implementations.

```Go
Kubo(opens new window): The reference implementation written in Go.
```

```JavaScript
js-ipfs(opens new window): The JavaScript implementation of IPFS.
```

```Rust
rust-ipfs(opens new window): Alpha implementation in Rust.
```

--------------------------------

### Run IPFS Daemon

Source: https://docs.ipfs.tech/reference/kubo/cli

Starts a network-connected IPFS node. This is the primary command to get an IPFS node running and participating in the IPFS network.

```bash
ipfs daemon
```

--------------------------------

### Install IPFS Desktop with .deb on Ubuntu

Source: https://docs.ipfs.tech/install/ipfs-desktop

Installs the IPFS Desktop package using the dpkg command after downloading the .deb installer. Ensure you replace '[version]' with the actual downloaded version number.

```bash
sudo dpkg -i ./ipfs-desktop-[version]-amd64.deb
```

--------------------------------

### Run IPFS Kubo with Custom Profile

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Starts the IPFS Kubo Docker container, specifying an initialization profile (e.g., 'server') using the `IPFS_PROFILE` environment variable.

```bash
docker run -d --name ipfs_host -e IPFS_PROFILE=server -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/kubo:v0.37.0

```

--------------------------------

### Get IPFS Repository Version (cURL)

Source: https://docs.ipfs.tech/reference/kubo/rpc

Example using cURL to call the IPFS repository version endpoint.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/repo/version?quiet=<value>"
```

--------------------------------

### Restore IPFS Installation (Linux/macOS)

Source: https://docs.ipfs.tech/how-to/move-ipfs-installation/move-ipfs-installation

This sequence of commands restores a backed-up IPFS installation. It first moves the current `.ipfs` directory to `ipfs-old` for safety, then moves the `ipfs-backup` directory to become the new `.ipfs` directory, and finally starts the IPFS daemon. The old backup is removed after confirmation.

```Shell
cd ~/
mv .ipfs ~/ipfs-old
mv ipfs-backup ~/.ipfs
ipfs daemon
rm -rf .ipfs-old
```

--------------------------------

### Markdown Image Path Example

Source: https://docs.ipfs.tech/community/contribute/grammar-formatting-and-style

This snippet shows a typical Markdown syntax for referencing an image file stored within a project's directory structure, specifically within an 'images' subfolder.

```Markdown
![Screenshot of an image being uploaded through the IPFS desktop application.](images/upload-a-photo/ipfs-desktop-image-upload-screen.png)
```

--------------------------------

### Install IPFS Kubo

Source: https://docs.ipfs.tech/install/command-line

This command executes the installation script for IPFS Kubo with superuser privileges. The script typically moves the 'ipfs' executable to a system-wide binary directory like /usr/local/bin.

```bash
sudo bash install.sh

> Moved ./ipfs to /usr/local/bin
```

--------------------------------

### Get Bitswap Statistics (cURL)

Source: https://docs.ipfs.tech/reference/kubo/rpc

Example using cURL to fetch bitswap statistics, with options for verbose output and human-readable formatting.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/stats/bitswap?verbose=<value>&human=<value>"
```

--------------------------------

### Install IPFS Desktop using Homebrew

Source: https://docs.ipfs.tech/install/ipfs-desktop

Installs IPFS Desktop using the Homebrew package manager with the command 'brew install ipfs --cask'.

```shell
brew install ipfs --cask
```

--------------------------------

### Run IPFS Desktop AppImage

Source: https://docs.ipfs.tech/install/ipfs-desktop

Executes the IPFS Desktop AppImage file from the command-line. This is how you launch the application after making it executable.

```bash
./ipfs-desktop-linux.AppImage
```

--------------------------------

### IPFS Underlying Components

Source: https://docs.ipfs.tech/project/repository-guide

This snippet details the underlying components of IPFS and their implementations across Go, JavaScript, and Rust. It covers LibP2P, IPLD, IPNS, Multiaddr, Multicodec, Multihash, Multibase, and CID.

```Go
LibP2P(opens new window) | go-libp2p (opens new window)
```

```Go
IPLD(opens new window) | go-ipld (opens new window), go-ipld-prime(opens new window)
```

```Go
IPNS | go-ipns(opens new window)
```

```Go
Multiaddr(opens new window) | go-multiaddr(opens new window)
```

```Go
Multicodec(opens new window) | go-multicodec(opens new window)
```

```Go
Multihash(opens new window) | go-multihash(opens new window)
```

```Go
Multibase(opens new window) | go-multibase(opens new window)
```

```JavaScript
LibP2P(opens new window) | js-libp2p(opens new window)
```

```JavaScript
IPLD(opens new window) | js-ipld(opens new window)
```

```JavaScript
IPNS | js-ipns(opens new window)
```

```JavaScript
Multiaddr(opens new window) | js-multiaddr(opens new window)
```

```JavaScript
Multicodec(opens new window) | js-multiformats(opens new window)
```

```JavaScript
Multihash(opens new window) | js-multiformats(opens new window)
```

```JavaScript
Multibase(opens new window) | js-multiformats(opens new window)
```

```JavaScript
CID | js-multiformats(opens new window)
```

```Rust
LibP2P(opens new window) | rust-libp2p(opens new window)
```

```Rust
IPLD(opens new window) | libipld(opens new window)
```

```Rust
IPNS | rust-ipns(opens new window)
```

```Rust
Multiaddr(opens new window) | rust-multiaddr(opens new window)
```

```Rust
Multicodec(opens new window) | N/A
```

```Rust
Multihash(opens new window) | rust-multihash(opens new window)
```

```Rust
Multibase(opens new window) | rust-multibase(opens new window)
```

```Rust
CID | rust-cid(opens new window)
```

--------------------------------

### IPFS in JS Examples

Source: https://docs.ipfs.tech/reference/kubo/cli

This section provides examples of using IPFS within JavaScript applications, likely utilizing the `ipfs-http-client` or similar libraries to interact with an IPFS node.

```javascript
import { create } from 'ipfs-http-client'

const ipfs = create({ url: '/ip4/127.0.0.1/tcp/5001' })

async function addFile() {
  const file = { content: 'Hello IPFS!' };
  const result = await ipfs.add(file);
  console.log('Added:', result);
}

```

```javascript
import { create } from 'ipfs-http-client'

const ipfs = create({ url: '/ip4/127.0.0.1/tcp/5001' })

async function getFile(cid) {
  const stream = ipfs.get(cid);
  let data = '';
  for await (const chunk of stream) {
    data += chunk.toString();
  }
  console.log('File content:', data);
}

```

--------------------------------

### Get IPFS Wantlist cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

A cURL command to retrieve the list of blocks currently on the IPFS wantlist. It allows specifying a peer to filter the wantlist.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/bitswap/wantlist?peer=<value>"
```

--------------------------------

### Get IPFS Bitswap Statistics cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

A cURL command to fetch diagnostic information about the IPFS bitswap agent. It supports optional 'verbose' and 'human' readable output.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/bitswap/stat?verbose=<value>&human=<value>"
```

--------------------------------

### Verify DNSLink TXT Record

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

Uses `dig` to query the DNS TXT record for a domain, specifically checking the DNSLink configuration. It expects a value starting with 'dnslink=/ipfs/'.

```bash
dig +short TXT _dnslink.yourdomain.com
```

--------------------------------

### Custom IPFS Node Initialization Script

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

A shell script to customize IPFS node behavior before the daemon starts, such as removing all bootstrap peers and adding a specific one.

```shell
#!/bin/sh
set -ex
ipfs bootstrap rm all
ipfs bootstrap add "/ip4/$PRIVATE_PEER_IP_ADDR/tcp/4001/ipfs/$PRIVATE_PEER_ID"

```

--------------------------------

### Run IPFS Kubo Docker Container

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Starts a Docker container for IPFS Kubo, mounting host directories for exports and data, exposing necessary ports (P2P, RPC, Gateway), and setting the image tag.

```bash
docker run -d --name ipfs_host -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/kubo:v0.37.0

```

--------------------------------

### Create and retrieve a custom IPFS block (IPFS CLI)

Source: https://docs.ipfs.tech/how-to/work-with-blocks

Provides an example of creating a custom IPFS block from a string using `ipfs block put` and then retrieving its content using `ipfs block get`. This highlights how to handle raw data blocks.

```bash
echo "This is some data" | ipfs block put
> QmfQ5QAjvg4GtA3wg3adpnDJug8ktA1BxurVqBD8rtgVjM

ipfs block get QmfQ5QAjvg4GtA3wg3adpnDJug8ktA1BxurVqBD8rtgVjM
> This is some data
```

--------------------------------

### Install IPFS Desktop using Chocolatey

Source: https://docs.ipfs.tech/install/ipfs-desktop

Installs IPFS Desktop using the Chocolatey package manager with the command 'choco install ipfs-desktop'.

```shell
choco install ipfs-desktop
```

--------------------------------

### IPFS Files Read (read) cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

Shows a cURL example for reading a file from IPFS MFS using the 'files read' command. It includes arguments for the file path, offset, and count.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/files/read?arg=<path>&offset=<value>&count=<value>"
```

--------------------------------

### Install IPFS Desktop using AUR

Source: https://docs.ipfs.tech/install/ipfs-desktop

Installs IPFS Desktop from the Arch User Repository (AUR) using the package name 'ipfs-desktop'.

```shell
ipfs-desktop
```

--------------------------------

### Install js-kubo-rpc-client using npm

Source: https://docs.ipfs.tech/reference/js/api

This snippet shows how to install the js-kubo-rpc-client library using npm, which is necessary for interacting with the Kubo RPC API from a Node.js environment. Ensure Kubo is running before installation.

```bash
npm install @helia/helia
```

--------------------------------

### Mount Custom Initialization Script in Docker

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Runs the IPFS Kubo Docker container, mounting a custom initialization script into the `/container-init.d/` directory to configure the node before the daemon starts.

```bash
docker run -d --name ipfs \
  -e PRIVATE_PEER_ID=... \
  -e PRIVATE_PEER_IP_ADDR=... \
  -v ./001-test.sh:/container-init.d/001-test.sh \
  -p 4001:4001 \
  -p 127.0.0.1:8080:8080 \
  -p 127.0.0.1:5001:5001 \
  ipfs/kubo

```

--------------------------------

### Get IPFS Block cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

A cURL command to fetch a raw IPFS block using its CID. The endpoint returns the block content as plain text.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/block/get?arg=<cid>"
```

--------------------------------

### IPFS API: cURL Example for Configuration

Source: https://docs.ipfs.tech/reference/kubo/rpc

Shows a cURL command for the IPFS API's /api/v0/config endpoint, demonstrating how to specify configuration keys and values, and use boolean flags for type conversion and expansion.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/config?arg=<key>&arg=<value>&bool=<value>&json=<value>&expand-auto=<value>"
```

--------------------------------

### Initialize IPFS Daemon

Source: https://docs.ipfs.tech/reference/kubo/cli

Initializes the IPFS repository with default settings if it hasn't been initialized yet. This command is often run before starting the daemon for the first time.

```bash
ipfs daemon --init
```

--------------------------------

### Get IPFS Bitswap Ledger cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

A cURL command to retrieve the current ledger for a specific IPFS peer. It requires the PeerID as an argument.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/bitswap/ledger?arg=<peer>"
```

--------------------------------

### Start IPFS Cluster with Docker Compose

Source: https://docs.ipfs.tech/install/server-infrastructure

Starts the IPFS Cluster services defined in the `docker-compose.yml` file. This command may require root privileges depending on system permissions.

```shell
docker-compose up
```

--------------------------------

### Execute cURL Command for Reprovide Stats

Source: https://docs.ipfs.tech/reference/kubo/rpc

An example of how to call the IPFS API to get reprovide statistics using cURL. This command sends a POST request to the /api/v0/stats/reprovide endpoint.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/stats/reprovide"
```

--------------------------------

### Storacha CLI for IPFS Pinning

Source: https://docs.ipfs.tech/quickstart/pin-cli

This snippet demonstrates how to install and use the Storacha CLI to upload files to IPFS. It includes commands for installation, authentication, creating a space, and uploading a file.

```Shell
# Install the CLI (requires Node.js)
npm install -g @storacha/cli

# Authenticate
storacha login your@email.com

# Create a space for your files
storacha space create MySpace

# Upload a file
storacha up welcome-to-IPFS.jpg

```

--------------------------------

### Verify Docker and Docker Compose Installation

Source: https://docs.ipfs.tech/install/server-infrastructure

Checks if Docker and Docker Compose are installed and displays their versions. This is a prerequisite for setting up the IPFS Cluster.

```shell
docker version

docker-compose version
```

--------------------------------

### IPFS API: cURL Example for Listing Commands

Source: https://docs.ipfs.tech/reference/kubo/rpc

Provides a cURL command for the IPFS API's /api/v0/commands endpoint, showing how to use the 'flags' parameter to retrieve detailed command information.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/commands?flags=<value>"
```

--------------------------------

### Create a File for IPFS

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Creates a simple text file named 'meow.txt' with the content 'meow'. This file can then be added to the IPFS node.

```bash
echo "meow" > meow.txt
```

--------------------------------

### IPFS Block Overview

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides an overview of the 'ipfs block' command for manipulating raw IPFS blocks. It lists subcommands for getting, putting, removing, and getting statistics of blocks.

```bash
ipfs block - Interact with raw IPFS blocks.

DESCRIPTION

  'ipfs block' is a plumbing command used to manipulate raw IPFS blocks.
  Reads from stdin or writes to stdout. A block is identified by a Multihash
  passed with a valid CID.

SUBCOMMANDS
  ipfs block get <cid>     - Get a raw IPFS block.
  ipfs block put <data>... - Store input as an IPFS block.
  ipfs block rm <cid>...   - Remove IPFS block(s) from the local datastore.
  ipfs block stat <cid>    - Print information of a raw IPFS block.
```

--------------------------------

### Download Linux Binary with wget

Source: https://docs.ipfs.tech/install/command-line

This command downloads the official Kubo binary for Linux (amd64 architecture) from the dist.ipfs.tech website. It is the first step in manually installing Kubo on a Linux system.

```bash
wget https://dist.ipfs.tech/kubo/v0.37.0/kubo_v0.37.0_linux-amd64.tar.gz
```

--------------------------------

### IPFS CLI Basic Commands

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists the basic commands for interacting with IPFS, such as initializing the repository, adding files, retrieving content, listing links, and showing object data.

```bash
ipfs init
ipfs add <path>
ipfs cat <ref>
ipfs get <ref>
ipfs ls <ref>
ipfs refs <ref>
```

--------------------------------

### Initialize IPFS Kubo Node with Server Profile

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Initializes an IPFS Kubo node repository with the 'server' profile, recommended for nodes in data centers to prevent unnecessary local network traffic. This command should be run as a regular user, not with sudo.

```bash
ipfs init --profile server
```

--------------------------------

### Work with IPFS Peers

Source: https://docs.ipfs.tech/how-to

Discover methods for interacting with other peers in the IPFS network. This section covers customizing libp2p bundles and utilizing circuit relay for enhanced connectivity.

```go
// Example: Customizing libp2p bundles (conceptual)
// Requires knowledge of libp2p configuration.
```

```bash
# Example: Using circuit relay (conceptual)
# Configuration depends on your specific setup.
```

--------------------------------

### Navigate to Kubo Directory

Source: https://docs.ipfs.tech/install/command-line

This command changes the current directory to the 'kubo' folder, which is created after extracting the binary archive. This is necessary to access the installation script and the IPFS executable.

```bash
cd kubo
```

--------------------------------

### Navigate to Project Directory

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/multipage-website

This command changes the current directory to your project's location, which is necessary before running IPFS commands to add or publish your website files.

```bash
cd ~/Code/multi-page-first-step
```

--------------------------------

### SHA-1 Hashing Example

Source: https://docs.ipfs.tech/concepts/hashing

Demonstrates the SHA-1 hash output for the input 'Hello world'. SHA-1 produces a 160-bit hash.

```text
Hello world

```

```text
0x7B502C3A1F48C8609AE212CDFB639DEE39673F5E

```

--------------------------------

### Configure IPFS API Connection

Source: https://docs.ipfs.tech/install/command-line

Demonstrates how to configure the IPFS API connection in the command line. This includes specifying a custom port if IPFS Desktop is not running and creating a persistent API configuration file.

```bash
ipfs --api /ip4/127.0.0.1/tcp/<port> id
mkdir -p ~/.ipfs && echo "/ip4/<ip>/tcp/<rpc-port>" > ~/.ipfs/api
```

--------------------------------

### Manual CID Conversion using ipfs cli

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This command-line example demonstrates how to manually convert a CID to its Base32 representation, which is suitable for case-insensitive contexts like subdomains.

```bash
ipfs cid base32 QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR
```

--------------------------------

### Access IPFS Content via Public Gateway

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Accesses IPFS content using a public gateway (e.g., ipfs.io) by providing the file's CID. This demonstrates how external users can access your content.

```bash
curl "https://ipfs.io/ipfs/<CID>"
```

--------------------------------

### Example Delegated Routing Response (Null Providers)

Source: https://docs.ipfs.tech/how-to/troubleshooting

This shows an example of a response from the Delegated Routing Endpoint when no providers are found for a given CID. This typically indicates a 404 error with a JSON body indicating null providers.

```json
{"Providers": null}
```

--------------------------------

### IPFS Redirects: Catch-all Placeholder Example

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/redirects-and-custom-404s

Demonstrates the use of the catch-all `:splat` placeholder to redirect all paths under a specific directory to a new location, preserving the matched segments.

```text
/blog/*  /new-blog/:splat  302

```

--------------------------------

### Verify IPFS Kubo Installation

Source: https://docs.ipfs.tech/install/command-line

This command checks if the IPFS Kubo installation was successful by displaying the installed version of the IPFS command-line interface. A successful output indicates that the 'ipfs' command is recognized and executable.

```bash
ipfs --version

> ipfs version 0.37.0
```

--------------------------------

### IPFS API: cURL Example for Applying Config Profile

Source: https://docs.ipfs.tech/reference/kubo/rpc

Provides a cURL command for the IPFS API's /api/v0/config/profile/apply endpoint, showing how to specify a profile and use the 'dry-run' option.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/config/profile/apply?arg=<profile>&dry-run=<value>"
```

--------------------------------

### Get help for IPFS remote pinning commands

Source: https://docs.ipfs.tech/how-to/work-with-pinning-services

This command displays comprehensive help information for all IPFS remote pinning operations, including available subcommands and their usage.

```bash
$ ipfs pin remote --help
```

--------------------------------

### Install Kubo on macOS using Homebrew

Source: https://docs.ipfs.tech/install/command-line

This command uses the Homebrew package manager to install Kubo on macOS. It's a straightforward method for users who have Homebrew installed.

```shell
brew install ipfs
ipfs --version
```

--------------------------------

### Access IPFS Content via Local Gateway

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Accesses IPFS content through your local IPFS gateway using its CID. This shows how your node serves content locally.

```bash
curl "http://127.0.0.1:8080/ipfs/<CID>"
```

--------------------------------

### Verify DNS A Record

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

Uses `dig` to query the DNS A record for a domain, verifying that it points to the correct server IP address.

```bash
dig +short A yourdomain.com
```

--------------------------------

### Find IPFS Providers (cURL)

Source: https://docs.ipfs.tech/reference/kubo/rpc

Example using cURL to find providers for a given key, with options for verbosity and the number of providers.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/routing/findprovs?arg=<key>&verbose=<value>&num-providers=20"
```

--------------------------------

### Start IPFS Daemon

Source: https://docs.ipfs.tech/how-to/publish-ipns

Starts the IPFS daemon, which is necessary for performing IPFS operations like adding files and publishing IPNS names.

```shell
ipfs daemon

```

--------------------------------

### GitHub Actions Workflow for IPFS Deployment

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

A GitHub Actions workflow that automates the deployment of a project to IPFS. It checks out code, sets up Node.js, installs dependencies, builds the project, and deploys it using the `ipfs-deploy-action` with Storacha credentials.

```yaml
name: Deploy to IPFS

permissions:
  contents: read
  pull-requests: write
  statuses: write

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Deploy to IPFS
        uses: ipfs/ipfs-deploy-action@v1
        id: deploy
        with:
          path-to-deploy: dist # Change this to your build output directory
          storacha-key: ${{ secrets.STORACHA_KEY }}
          storacha-proof: ${{ secrets.STORACHA_PROOF }}
          github-token: ${{ github.token }}
```

--------------------------------

### Import IPFS Objects from CAR Files

Source: https://docs.ipfs.tech/how-to/move-ipfs-installation/move-ipfs-installation

This command imports IPFS objects from a collection of CAR files into an IPFS repository. It's typically used after exporting objects to CAR files, for example, when consolidating repositories.

```Shell
cd car_export
ipfs dag import *.car
```

--------------------------------

### Extract Kubo Binary Archive

Source: https://docs.ipfs.tech/install/command-line

This command extracts the contents of the downloaded Kubo binary archive. The archive typically contains the IPFS executable, an installation script, and license files.

```bash
tar -xvzf kubo_v0.37.0_linux-amd64.tar.gz

> x kubo/install.sh
> x kubo/ipfs
> x kubo/LICENSE
> x kubo/LICENSE-APACHE
> x kubo/LICENSE-MIT
> x kubo/README.md
```

--------------------------------

### Verify Kubo Gateway Listening Address

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

Checks the IPFS Kubo configuration file to verify the address the gateway is listening on. It uses `jq` to parse the JSON configuration.

```bash
cat /data/kubo/config | jq .Addresses.Gateway
```

--------------------------------

### Example Delegated Routing Endpoint

Source: https://docs.ipfs.tech/concepts/public-utilities

An example URL for a public delegated routing endpoint provided by the IPFS Foundation. This endpoint helps in discovering providers for a given CID.

```http
https://delegated-ipfs.dev/routing/v1/providers/bafybeicklkqcnlvtiscr2hzkubjwnwjinvskffn4xorqeduft3wq7vm5u4
```

--------------------------------

### IPFS API: cURL Example for CID Formatting

Source: https://docs.ipfs.tech/reference/kubo/rpc

Provides a cURL example for the IPFS API's /api/v0/cid/format endpoint, demonstrating how to specify the CID ('arg') and various formatting options like 'f', 'v', 'mc', and 'b'.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/cid/format?arg=<cid>&f=%s&v=<value>&mc=<value>&b=<value>"
```

--------------------------------

### IPFS API: cURL Example for Listing Multihashes

Source: https://docs.ipfs.tech/reference/kubo/rpc

Shows a cURL command for the IPFS API's /api/v0/cid/hashes endpoint, demonstrating the use of 'numeric' and 'supported' query parameters.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/cid/hashes?numeric=<value>&supported=<value>"
```

--------------------------------

### Initialize IPFS Kubo Node Repository

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Initializes the IPFS Kubo node repository, which stores all settings and internal data. This is a necessary step before using Kubo for the first time. The output includes the node's PeerID.

```bash
ipfs init
```

--------------------------------

### Enable Automatic Garbage Collection in IPFS Kubo Daemon

Source: https://docs.ipfs.tech/how-to/kubo-garbage-collection

This command starts the IPFS Kubo daemon with automatic garbage collection enabled. When enabled, the daemon will periodically run garbage collection based on configured thresholds, such as StorageGCWatermark.

```bash
ipfs daemon --enable-gc

> Initializing daemon...
> Kubo version: 0.9.0
> Repo version: 10
> ...


```

--------------------------------

### Restart IPFS Kubo Daemon

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

Restarts the IPFS Kubo daemon to apply configuration changes. This command is typically used on systems managed by systemd.

```bash
systemctl restart ipfs
```

--------------------------------

### Get IPFS Build Dependencies

Source: https://docs.ipfs.tech/reference/kubo/rpc

Displays information about the dependencies used to build the IPFS software. This endpoint does not require any arguments.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/version/deps"
```

--------------------------------

### Build VuePress Site for IPFS

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/static-site-generators

Command to build a VuePress site. After building, use `all-relative` to convert URLs to be relative for better IPFS compatibility.

```bash
vuepress build
```

```bash
cd .vuepress/dist/
npx all-relative
```

--------------------------------

### IPFS API: cURL Example for Listing Multibase Encodings

Source: https://docs.ipfs.tech/reference/kubo/rpc

Demonstrates how to use cURL to call the IPFS API endpoint /api/v0/cid/bases, showing how to pass optional 'prefix' and 'numeric' parameters to customize the output.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/cid/bases?prefix=<value>&numeric=<value>"
```

--------------------------------

### Backup IPFS Installation (Linux/macOS)

Source: https://docs.ipfs.tech/how-to/move-ipfs-installation/move-ipfs-installation

This command backs up the IPFS installation directory (`.ipfs`) to a new folder named `ipfs-backup`. It uses `cp --recursive --verbose` for copying and conditionally includes `--reflink=auto` if supported by the system, optimizing the copy process on compatible Linux distributions.

```Shell
cd ~/
cp --recursive --verbose $([[ -z $(cp --help | grep "--reflink" | head -n1) ]] || echo -n "--reflink=auto") .ipfs ipfs-backup
```

--------------------------------

### Fetch Content from IPFS

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Fetches a file (e.g., an image) from the IPFS network using its Content Identifier (CID) and saves it locally. It demonstrates how Kubo retrieves data from the network.

```bash
ipfs cat /ipfs/QmSgvgwxZGaBLqkGyWemEDqikCqU52XxsYLKtdy3vGZ8uq > ~/Desktop/spaceship-launch.jpg
```

--------------------------------

### IPFS Files Stat (stat) cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

Provides a cURL example for retrieving file status information in IPFS MFS using the 'files stat' command. It shows arguments for path, format, and specific stat options.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/files/stat?arg=<path>&format=<hash> Size: <size> CumulativeSize: <cumulsize> ChildBlocks: <childs> Type: <type> Mode: <mode> (<mode-octal>) Mtime: <mtime>&hash=<value>&size=<value>&with-local=<value>"
```

--------------------------------

### IPFS Redirects: Example Redirect

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/redirects-and-custom-404s

An example of a redirect rule in the _redirects file, demonstrating how to redirect traffic from an old HTML file to a new one with a temporary status code.

```text
/home.html /index.html 302

```

--------------------------------

### Fetch and Display IPFS README File

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Fetches and displays the 'readme' file from a specific IPFS content identifier (CID). This command verifies that the node is connected to the IPFS network and can retrieve content.

```bash
ipfs cat /ipfs/bafybeie5nqv6kd3qnfjupgvz34woh3oksc3iau6abmyajn7qvtf6d2ho34/readme
```

--------------------------------

### LikeCoin IPFS Integration Example

Source: https://docs.ipfs.tech/case-studies/likecoin

This snippet illustrates how LikeCoin integrates IPFS for storing and serving content linked to ISCNs. It highlights the use of a custom IPLD plugin to manage this integration seamlessly within their Liker Land application.

```text
LikeCoin relies on IPFS for storing and serving ISCN-linked content within its Liker Land app, and tightly integrates ISCN data with IPFS using the Interplanetary Linked Data (IPLD) data model. By using IPFS and a custom IPLD plugin to store and deliver copies of ISCN-allocated content, LikeCoin bolsters end-user access to this content with all the additional availability and anti-tampering benefits afforded by the distributed web.
```

--------------------------------

### Make IPFS Desktop AppImage Executable

Source: https://docs.ipfs.tech/install/ipfs-desktop

Makes the downloaded IPFS Desktop AppImage file executable using the chmod command. This is a necessary step before running the AppImage.

```bash
cd Downloads
chmod a+x ./ipfs-desktop-linux.AppImage
```

--------------------------------

### IPFS API: cURL Example for CID Base32 Conversion

Source: https://docs.ipfs.tech/reference/kubo/rpc

Provides a cURL command to interact with the IPFS API for CID operations, specifically demonstrating the use of the base32 encoding. This example targets the /api/v0/cid/base32 endpoint.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/cid/base32?arg=<cid>"
```

--------------------------------

### IPFS Files List (ls) cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

Demonstrates how to list the contents of a directory in IPFS MFS using the 'files ls' command. It shows the available arguments for path, long listing format, and directory order.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/files/ls?arg=<path>&long=<value>&U=<value>"
```

--------------------------------

### IPFS CID Example

Source: https://docs.ipfs.tech/quickstart/pin

An example of a Content Identifier (CID) used in IPFS to uniquely address files and directories on the network.

```plaintext
bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4
```

--------------------------------

### Retrieve Image with Verified Fetch

Source: https://docs.ipfs.tech/how-to/ipfs-in-web-apps

This example shows how to fetch an image from IPFS using the Verified Fetch library. Verified Fetch abstracts content routing and transport, returning Response objects similar to the Fetch API.

```JavaScript
See the Pen <a href="https://codepen.io/2color/pen/QWXKZGx"> Fetch an image on IPFS Mainnet @helia/verified-fetch</a> by Daniel Norman
```

--------------------------------

### Resolving DNSLink Name (dig command example)

Source: https://docs.ipfs.tech/concepts/dnslink

Provides an example using the 'dig' command to retrieve the DNSLink TXT record for a specific domain, showing the 'dnslink=' value.

```bash
$ dig +noall +answer TXT _dnslink.docs.ipfs.tech
_dnslink.docs.ipfs.tech.  34  IN  TXT "dnslink=/ipfs/bafybeifld3uybj6azujisdnxu6cm7mombldpbt3au4g33nwnqx7dsgjrta"
```

--------------------------------

### Explore IPFS Applications

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Discover applications, solutions, and tools built with IPFS by exploring the 'ipfs/awesome-ipfs' repository. This curated list provides an overview of the IPFS ecosystem.

```Git
ipfs/awesome-ipfs
```

--------------------------------

### Example DNSLink TXT Record

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains

An example of a DNS TXT record used for DNSLink, mapping a domain to an IPFS CID. The CID will vary depending on the actual deployment.

```DNS
TXT _dnslink.docs.ipfs.tech "dnslink=/ipfs/bafybeicv5tbyeahgm4pyskd2nverwsqxpiqloikqrufvof7vausglw6avm"
```

--------------------------------

### IPFS Desktop and Companion (JavaScript)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

IPFS Desktop is a no-code application for accessing the Public IPFS Mainnet Network, bundling a Kubo node with file and peer management. IPFS Companion is a browser extension that enables support for `ipfs://` addresses by fetching content from the public network via a local Kubo node.

```javascript
IPFS Desktop: Desktop application bundling a Kubo node with file manager, peer manager and content explorer
```

```javascript
IPFS Companion: Browser extension adding support for `ipfs://` addresses which are fetched from the public network by a local Kubo node
```

--------------------------------

### HTML for About Page

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/multipage-website

This HTML code provides the basic structure for an 'About' page. It includes a title, meta description, author information, and basic CSS styling for the body, similar to the main page.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>About | Random Planet Facts</title>
    <meta
      name="description"
      content="Get a random fact about a planet in our solar system."
    />
    <meta name="author" content="The IPFS Docs team." />
    <style>
      body {
        margin: 15px auto;
        max-width: 650px;
        line-height: 1.2;
        font-family: sans-serif;
        font-size: 2em;

```

--------------------------------

### IPFS API: cURL Example for Listing CID Codecs

Source: https://docs.ipfs.tech/reference/kubo/rpc

Shows a cURL command for the IPFS API's /api/v0/cid/codecs endpoint, illustrating the usage of 'numeric' and 'supported' query parameters.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/cid/codecs?numeric=<value>&supported=<value>"
```

--------------------------------

### IPFS Recommended Principles for Implementations

Source: https://docs.ipfs.tech/concepts/implementations

Outlines recommended, though not strictly required, principles for IPFS implementations. These focus on comprehensive naming of resources, exposing logical data units, supporting incremental verifiability for large content, and not depending on a single transport layer.

```English
Name all the important resources exposed using CIDs. Consider anything that another agent might legitimately wish to access as being in scope, and err on the side of inclusion.
Expose the logical units of data that structure a resource (e.g. a CBOR document, a file or directory, a branch of a B-tree search index) using CIDs.
Support incremental verifiability, notably so that it may process content of arbitrary sizes.
Should not rely on any one transport layer. The transport layer cannot dictate or constrain the way in which CIDs map to content.
```

--------------------------------

### Reload Caddy Service

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

Reloads the Caddy service to apply changes made to the Caddyfile. This is typically done using systemctl on systems with Caddy managed as a service.

```bash
sudo systemctl reload caddy
```

--------------------------------

### Multibase Representation Example

Source: https://docs.ipfs.tech/concepts/hashing

Shows the base32 representation of the SHA-256 hash for 'Hello world', as used in IPFS content identifiers via the Multibase protocol.

```text
mtwirsqawjuoloq2gvtyug2tc3jbf5htm2zeo4rsknfiv3fdp46a

```

--------------------------------

### IPFS Gateway Path Resolution URL Example

Source: https://docs.ipfs.tech/concepts/ipfs-gateway

Demonstrates the URL structure for accessing IPFS content using the path resolution style on a gateway. This style is not recommended for hosting web apps due to security concerns.

```URL
https://{gateway URL}/ipfs/{content ID}/{optional path to resource}
```

--------------------------------

### Get Repository Version

Source: https://docs.ipfs.tech/reference/kubo/rpc

Shows the current version of the IPFS repository. It offers a quiet option for minimal output.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/repo/version?quiet=<value>"
```

--------------------------------

### Build IPFS-native apps with Helia (JavaScript)

Source: https://docs.ipfs.tech/index

This guide explains how to use Helia and related libraries to build IPFS-native applications using JavaScript. It covers the necessary steps and considerations for integrating IPFS functionality into web applications.

```JavaScript
import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'

async function main() {
  const helia = await createHelia()
  const fs = unixfs(helia)

  // Add a file
  const file = await fs.addBytes(new TextEncoder().encode('Hello IPFS!'))
  console.log('Added:', file.cid.toString())

  // Read a file
  const data = await fs.cat(file.cid)
  for await (const chunk of data) {
    console.log(new TextDecoder().decode(chunk))
  }
}
```

--------------------------------

### IPFS Config - Get and Set Config Values

Source: https://docs.ipfs.tech/reference/kubo/cli

Manages IPFS configuration values, similar to git config. Allows getting and setting values for keys, with options for boolean and JSON types, and expanding auto placeholders.

```shell
# Get a config value
ipfs config Routing.Type
# Set a config value
ipfs config Routing.Type auto
# Set a boolean value
ipfs config --bool Some.Boolean.Key true
# Set a JSON value
ipfs config Addresses.AppendAnnounce --json '["/dns4/a.example.com/tcp/4001", "/dns4/b.example.com/tcp/4002"]'
```

--------------------------------

### IPFS Gateway Subdomain Resolution URL Example

Source: https://docs.ipfs.tech/concepts/ipfs-gateway

Illustrates the URL format for subdomain resolution, which ensures origin isolation per CID and is suitable for hosting web applications.

```URL
https://{CID}.ipfs.{gatewayURL}/{optional path to resource}
```

--------------------------------

### CIDv1 Representation Example

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This shows the CIDv1 representation that a redirect would point to, facilitating access via a subdomain gateway.

```URL
https://bafybeicgmdpvw4duutrmdxl4a7gc52sxyuk7nz5gby77afwdteh3jc5bqa.ipfs.dweb.link/wiki/Mars.html
```

--------------------------------

### IPFS Redirects: Placeholder Usage Example

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/redirects-and-custom-404s

Illustrates the use of named placeholders in redirect rules to dynamically map paths, allowing for flexible routing based on date and title components.

```text
/posts/:month/:day/:year/:title  /articles/:year/:month/:day/:title  301

```

--------------------------------

### Resolve IPFS Name (cURL)

Source: https://docs.ipfs.tech/reference/kubo/rpc

Example using cURL to resolve an IPFS name, with options for recursion and DHT settings.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/resolve?arg=<name>&recursive=true&dht-record-count=<value>&dht-timeout=<value>"
```

--------------------------------

### Build Jekyll Site for IPFS

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/static-site-generators

Command to build a Jekyll static site. After building, use `all-relative` to convert URLs to be relative for better IPFS compatibility.

```bash
jekyll build
```

```bash
cd _site/
npx all-relative
```

--------------------------------

### IPFS CLI Advanced Commands

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists advanced commands for managing IPFS, including starting and shutting down the daemon, resolving content paths, managing IPNS names, keys, pins, repository settings, and network statistics.

```bash
ipfs daemon
ipfs shutdown
ipfs resolve
ipfs name
ipfs key
ipfs pin
ipfs repo
ipfs stats
ipfs p2p
ipfs filestore
ipfs mount
ipfs provide
```

--------------------------------

### View IPFS Network Peers

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Displays the IPFS addresses of connected peers on the network. This helps in understanding network connectivity and peer discovery.

```bash
ipfs swarm peers
```

--------------------------------

### Removed DHT Get Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/dht/get command has been removed. Users should now use 'ipfs routing' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/dht/get"
```

--------------------------------

### Find 'Help Wanted' Issues on GitHub

Source: https://docs.ipfs.tech/community/contribute/contribution-tutorial

This snippet demonstrates how to locate documentation-related issues tagged with 'help wanted' on the IPFS GitHub repository. It guides users to the correct repository, issues tab, and label filter.

```bash
1. Go to the IPFS repository at github.com/ipfs/ipfs-docs
2. Select the **Issues** tab.
3. Click the **Label** dropdown and select the **help wanted** tag.
4. Select an issue that interests you.
```

--------------------------------

### Pinning a Website with Pinata

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/single-page-website

This guide demonstrates how to upload and pin an 'index.html' file to Pinata, a pinning service for IPFS. It covers the steps from signing up to accessing the website through the Pinata gateway.

```text
1. Go to Pinata.cloud(opens new window) and sign up or log in.
2. Select **Upload** and click **Browse**.
3. Navigate to your `index.html` file and click **Open**.
4. Click **Upload**.
5. You should be able to see your `index.html` file pinned:
6. Click your `index.html` file to open your website through the Pinata gateway.
```

--------------------------------

### Uploading and Pinning with Storacha

Source: https://docs.ipfs.tech/quickstart/pin

Details on using Storacha for pinning files, noting that it may require some technical skills. The guide mentions their browser upload guide and the console for web-based uploads, suitable for web application development.

```javascript
// Conceptual JavaScript for Storacha browser upload (not directly in text)
// Assuming Storacha provides a JS SDK or API endpoint for uploads
// fetch('https://console.storacha.network/upload', { method: 'POST', body: formData }).then(response => console.log(response));
```

--------------------------------

### Get IPFS Swarm Resource Summary

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves a summary of resources managed by the libp2p Resource Manager. This command does not take arguments and returns an object string.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/swarm/resources"
```

--------------------------------

### Detect IPFS Paths with IPFS Companion

Source: https://docs.ipfs.tech/install/ipfs-companion

IPFS Companion automatically detects and redirects IPFS-like paths (e.g., /ipfs/{cid} or /ipns/{peerid_or_host-with-dnslink}) to a local IPFS gateway. This redirection enables content to be loaded from the gateway, facilitating protocol conversion and providing a unique origin for websites, which is crucial for same-origin content operations.

```HTTP
https://ipfs.io/ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR → http://localhost:8080/ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR → http://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi.ipfs.localhost:8080
```

--------------------------------

### Create a File

Source: https://docs.ipfs.tech/how-to/publish-ipns

Creates a simple text file named 'hello.txt' with the content 'Hello IPFS'. This file will be used for the IPNS publishing tutorial.

```shell
echo "Hello IPFS" > hello.txt

```

--------------------------------

### Get block data (IPFS CLI)

Source: https://docs.ipfs.tech/how-to/work-with-blocks

Illustrates how to retrieve the raw binary data of a specific IPFS block using `ipfs block get`. This command is useful for inspecting the content of individual blocks, but be cautious as it outputs raw data.

```bash
ipfs block get <block-hash>
```

--------------------------------

### Add File to IPFS (MFS)

Source: https://docs.ipfs.tech/concepts/file-systems

Illustrates how to add a file to IPFS using the MFS `write` method. It shows the method signature and an example of adding a file object with the `create: true` option to ensure the file is created if it doesn't exist.

```javascript
await ipfs.files.write(path, content, [options])
```

```javascript
await ipfs.files.write('/example.jpg', examplePic, { create: true })
```

--------------------------------

### Go CLI Tool for Pinning Service and Bitswap

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A command-line interface (CLI) tool written in Go for interacting with the pinning service API and uploading files through bitswap. It simplifies IPFS file management.

```go
package main

import (
	"fmt"
	"github.com/2color/auspinner/cmd"
)

func main() {
	// Example usage (conceptual - CLI commands)
	// cmd.Execute()
	fmt.Println("Auspinner CLI tool executed.")
}
```

--------------------------------

### Initialize IPFS Repository

Source: https://docs.ipfs.tech/reference/kubo/cli

Initializes a new IPFS configuration file and generates a cryptographic keypair for the node. Supports specifying the key generation algorithm, RSA key bits, and applying profile settings for different environments.

```bash
ipfs init [<default-config>]
ipfs init [--algorithm=<algorithm> | -a] [--bits=<bits> | -b] [--empty-repo=false] [--profile=<profile> | -p] [--] [<default-config>]
```

--------------------------------

### Contribute to IPFS Core Repositories (Go)

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the core IPFS project by working on the 'ipfs/helia' repository, which is written in Go. This repository is a good starting point for contributing code to IPFS.

```Go
ipfs/helia
```

--------------------------------

### Find IPFS Peer (cURL)

Source: https://docs.ipfs.tech/reference/kubo/rpc

Example using cURL to find a peer by its ID, with an option for verbose output.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/routing/findpeer?arg=<peerID>&verbose=<value>"
```

--------------------------------

### Build Middleman Site for IPFS

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/static-site-generators

Command to build a Middleman static site. The output is usually in the `./build` folder, which can then be uploaded to IPFS.

```bash
middleman build
```

--------------------------------

### Specifying Filenames During IPFS Downloads (DNSLink Style)

Source: https://docs.ipfs.tech/how-to/gateway-best-practices

Illustrates how to specify a filename for downloaded IPFS content using DNSLink resolution, including examples for both direct domain access and gateway-based access with the `?filename={filename.ext}` parameter.

```URL
https://{example.com}/{optional path to resource}
https://{gatewayURL}/ipns/{example.com}/{optional path to resource}?filename={filename.ext}
```

--------------------------------

### Address File by CID with Helia and UnixFS

Source: https://docs.ipfs.tech/how-to/ipfs-in-web-apps

This example demonstrates how to address a file using its Content Identifier (CID) with the Helia library and UnixFS. It's a fundamental operation for retrieving data on the IPFS network.

```JavaScript
See the Pen <a href="https://codepen.io/2color/pen/zxONqPj"> Addressing an image by CID with Helia and UnixFS</a> by Daniel Norman (<a href="https://codepen.io/2color">@2color</a>)
```

--------------------------------

### IPFS Gateway DNSLink Resolution URL Example (Direct Domain)

Source: https://docs.ipfs.tech/concepts/ipfs-gateway

Explains how a gateway handles requests for a domain directly configured with IPFS content via DNSLink, by checking the Host header and DNS TXT records.

```URL
https://{example.com}/{optional path}
```

--------------------------------

### Monitor IPFS Docker Container Logs

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Follows the logs of the running IPFS Kubo Docker container to monitor its startup process and ensure the daemon is ready.

```bash
docker logs -f ipfs_host

```

--------------------------------

### Prepare Git Repository for IPFS

Source: https://docs.ipfs.tech/how-to/host-git-repo

These commands prepare a cloned Git repository for IPFS by navigating into the repository directory and updating server information. This step ensures the repository is correctly formatted for distribution.

```bash
cd myrepo
git update-server-info
```

--------------------------------

### Base36 Encoded PeerID Example

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This shows the resulting Base36 encoded CIDv1 for a PeerID, which can be used in subdomain gateways.

```text
k2k4r8jl0yz8qjgqbmc2cdu5hkqek5rj6flgnlkyywynci20j0iuyfuj
```

--------------------------------

### Get IPFS System Diagnostics

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves system diagnostic information for IPFS. This endpoint takes no arguments and returns a plain text response.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/diag/sys"

```

--------------------------------

### IPFS Files Command Usage

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides the general usage, synopsis, options, and a detailed description of the IPFS files command. It explains the interaction with MFS, the role of the root CID, and the implications of the --flush flag.

```bash
ipfs files - Interact with unixfs files.

SYNOPSIS
  ipfs files [--flush=false]

OPTIONS

  -f, --flush  bool - Flush target and ancestors after write. Default: true.

DESCRIPTION

  Files is an API for manipulating IPFS objects as if they were a Unix
  filesystem.
  
  The files facility interacts with MFS (Mutable File System). MFS acts as a
  single, dynamic filesystem mount. MFS has a root CID that is transparently
  updated when a change happens (and can be checked with "ipfs files stat /").
  
  All files and folders within MFS are respected and will not be deleted
  during garbage collections. However, a DAG may be referenced in MFS without
  being fully available locally (MFS content is lazy loaded when accessed).
  MFS is independent from the list of pinned items ("ipfs pin ls"). Calls to
  "ipfs pin add" and "ipfs pin rm" will add and remove pins independently of
  MFS. If MFS content that was additionally pinned is removed by calling
  "ipfs files rm", it will still remain pinned.
  
  Content added with "ipfs add" (which by default also becomes pinned), is not
  added to MFS. Any content can be lazily referenced from MFS with the command
  "ipfs files cp /ipfs/<cid> /some/path/" (see ipfs files cp --help).
  
  NOTE: Most of the subcommands of 'ipfs files' accept the '--flush' flag. It
  defaults to true and ensures two things: 1) that the changes are reflected in
  the full MFS structure (updated CIDs) 2) that the parent-folder's cache is
  cleared. Use caution when setting this flag to false. It will improve
  performance for large numbers of file operations, but it does so at the cost
  of consistency guarantees and unbound growth of the directories' in-memory
  caches.  If the daemon is unexpectedly killed before running 'ipfs files
  flush' on the files in question, then data may be lost. This also applies to
  run 'ipfs repo gc' concurrently with '--flush=false' operations. We recommend
  flushing paths regularly with 'ipfs files flush', specially the folders on
  which many write operations are happening, as a way to clear the directory
  cache, free memory and speed up read operations.

SUBCOMMANDS
  ipfs files chcid [<path>]      - Change the CID version or hash function of
                                   the root node of a given path.
  ipfs files cp <source> <dest>  - Add references to IPFS files and directories
                                   in MFS (or copy within MFS).
  ipfs files flush [<path>]      - Flush a given path's data to disk.
  ipfs files ls [<path>]         - List directories in the local mutable
                                   namespace.
  ipfs files mkdir <path>        - Make directories.
  ipfs files mv <source> <dest>  - Move files.
  ipfs files read <path>         - Read a file from MFS.
  ipfs files rm <path>...        - Remove a file from MFS.
  ipfs files stat <path>         - Display file status.
  ipfs files write <path> <data> - Append to (modify) a file in MFS.

  For more information about each command, use:
  'ipfs files <subcmd> --help'

EXPERIMENTAL SUBCOMMANDS
  ipfs files chmod <mode> <path> - Change optional POSIX mode permissions
  ipfs files touch <path>        - Set or change optional POSIX modification
                                   times.

```

--------------------------------

### Add Folder to IPFS using IPFS Desktop

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/multipage-website

This section describes the process of adding a local folder containing website files to the IPFS network using the IPFS Desktop application. It involves selecting the folder and confirming its addition.

```bash
ipfs add -r .

> added QmP4KNjSaVCR3jTxi8nsMq3DDqGyVUXyc5vfij31J3B3vr multi-page-first-step/about.html
> added QmYp2jy5t7knzwhkqPJ68amuAqLYJ3DG5vvxgJW6bFdQwN multi-page-first-step/index.html
> added QmW8U3NEHx3p73Nj9645sGnGa8XzR43rQh3Kd52UKncWMo multi-page-first-step/moon-logo.png
> added QmchJPQNLE5EUSYTzfzUsNFyPozXyANiZHFDSFKWdLNdRR multi-page-first-step
> 12.65 KiB / 12.65 KiB [=====================================================] 100.00%
```

--------------------------------

### Fetch CID with Kubo CLI

Source: https://docs.ipfs.tech/quickstart/retrieve

This snippet demonstrates how to fetch a CID using the Kubo command-line interface. It requires the Kubo daemon to be running and uses the `ipfs get` command followed by the CID.

```bash
ipfs daemon

```

```bash
ipfs get bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4

```

--------------------------------

### Removed Object Get Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/object/get command has been removed. Users should now use 'ipfs dag' or 'ipfs files' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/object/get"
```

--------------------------------

### Create IPFS Mount Points

Source: https://docs.ipfs.tech/how-to/take-snapshot

These commands create directories for mounting IPFS and assign ownership to the current user. This is a prerequisite for accessing IPFS content through the FUSE interface.

```bash
sudo mkdir /ipfs /ipns
```

```bash
sudo chown `whoami` /ipfs /ipns
```

--------------------------------

### IPFS Block Get

Source: https://docs.ipfs.tech/reference/kubo/cli

Retrieves a raw IPFS block using its CID and outputs the block content to standard output.

```bash
ipfs block get <cid> - Get a raw IPFS block.

ARGUMENTS

  <cid> - The CID of an existing block to get.

DESCRIPTION

  'ipfs block get' is a plumbing command for retrieving raw IPFS blocks.
  It takes a <cid>, and outputs the block to stdout.
```

--------------------------------

### Caddyfile Configuration for IPFS Gateway

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

Configures Caddy to act as a reverse proxy for the IPFS Kubo gateway. It handles HTTPS for the specified domain and forwards requests to localhost:8080.

```caddyfile
yourdomain.com {
  # Caddy automatically handles HTTPS provisioning for your domain

  # Proxy all requests to the local Kubo gateway
  reverse_proxy localhost:8080

  # Optional: Configure logging
  log {
    output stdout
    format json
    level INFO
  }
}
```

--------------------------------

### View IPFS Snapshots via Mount

Source: https://docs.ipfs.tech/how-to/take-snapshot

This command mounts IPFS directories, allowing access to snapshots. You can then list the contents of a specific snapshot using its hash.

```bash
ipfs mount
```

```bash
ls /ipfs/$hash/
```

--------------------------------

### Get block statistics (IPFS CLI)

Source: https://docs.ipfs.tech/how-to/work-with-blocks

Demonstrates how to use `ipfs block stat` to get the exact size of a given IPFS block, excluding the size of its children. This command is helpful for analyzing block sizes.

```bash
ipfs block stat <block-hash>
```

--------------------------------

### IPFS Files Move (mv) cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

Illustrates how to move files or directories within IPFS MFS using the 'files mv' command. It specifies the source and destination paths as arguments.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/files/mv?arg=<source>&arg=<dest>"
```

--------------------------------

### IPFS CLI Usage and Options

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides an overview of the IPFS command-line interface, including global options for configuration, debugging, API settings, and CID encoding. It also lists available subcommands categorized by functionality.

```bash
ipfs [--config=<config> | -c] [--debug | -D] [--help] [-h] [--api=<api>] [--offline] [--cid-base=<base>] [--upgrade-cidv0-in-output] [--encoding=<encoding> | --enc] [--timeout=<timeout>] <command> ...
```

--------------------------------

### IPFS Kubo RPC API: Get

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/get` endpoint of the IPFS Kubo RPC API, used to retrieve IPFS objects. This is a high-level command for fetching content by CID.

```HTTP
GET /api/v0/get
```

--------------------------------

### SHA-256 Hashing Example

Source: https://docs.ipfs.tech/concepts/hashing

Illustrates the SHA-256 hash output for the input 'Hello world'. SHA-256 generates a 256-bit hash, which is longer than SHA-1.

```text
Hello world

```

```text
0x64EC88CA00B268E5BA1A35678A1B5316D212F4F366B2477232534A8AECA37F3C

```

--------------------------------

### Kubo Retrieved Folder Structure

Source: https://docs.ipfs.tech/quickstart/retrieve

This example illustrates the file structure created after successfully fetching a CID with Kubo, showing the CID-named directory containing the retrieved file.

```plaintext
bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4/
welcome-to-IPFS.jpg

```

--------------------------------

### List Remote IPFS Pins with Status

Source: https://docs.ipfs.tech/reference/kubo/rpc

Shows how to list remote IPFS pins, filtering by status. This example demonstrates passing multiple values for the 'status' flag in the API request.

```shell
> curl -X POST "http://127.0.0.1:5001/api/v0/pin/remote/service/ls?name=myservice&status=pinned&status=pinning"
```

--------------------------------

### Fleek Hosting: CI/CD for IPFS

Source: https://docs.ipfs.tech/case-studies/fleek

Fleek Hosting offers tools for deploying websites and applications on IPFS, including continuous integration and deployment (CI/CD) capabilities through GitHub integration.

```yaml
# Example GitHub Actions workflow for Fleek Hosting
# This is a conceptual example and may require specific Fleek configurations.
name: Deploy to Fleek

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Project
      run: |
        # Replace with your project's build command (e.g., npm run build, yarn build)
        npm install
        npm run build

    - name: Deploy to Fleek
      # This step assumes you have a Fleek CLI or a similar deployment mechanism.
      # You would typically authenticate with Fleek and trigger a deployment.
      # Refer to Fleek's documentation for the exact command and authentication method.
      run: |
        echo "Deploying to Fleek..."
        # Example: fleek deploy --dir ./build --message "Deploy from GitHub Actions"
        # You'll need to set up Fleek API keys or tokens as GitHub secrets.
        # fleek login --api-key $FLEEK_API_KEY --api-secret $FLEEK_API_SECRET
        # fleek deploy --dir ./build --site-name "your-fleek-site-name"
        echo "Deployment command placeholder."

```

--------------------------------

### IPFS Node Information Output

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Example JSON output from the 'ipfs id' command, showing the node's unique identifier, public key, network addresses, agent version, and supported protocols.

```json
{
	"ID": "12D3KooWMkNK8zgTQvtinDY8nuKmMAPBi3fBmvZj6W5huokJxekm",
	"PublicKey": "CAESILFGFWHUCrCI/5gZbFejCt7X+ORxckMvKyMY6klvwPwm",
	"Addresses": [
		"/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWMkNK8zgTQvtinDY8nuKmMAPBi3fBmvZj6W5huokJxekm",
		"/ip4/127.0.0.1/udp/4001/quic-v1/p2p/12D3KooWMkNK8zgTQvtinDY8nuKmMAPBi3fBmvZj6W5huokJxekm",
		"/ip4/127.0.0.1/udp/4001/quic-v1/webtransport/certhash/uEiADD1J9gKOoRM-XvC9EYkbDCe97dwwjVNaheeQ4C1X8Iw/certhash/uEiA6LFi0_EAMHJUX9F9D8BmBiblrH0qrZNAWJqRmpa0rPw/p2p/12D3KooWMkNK8zgTQvtinDY8nuKmMAPBi3fBmvZj6W5huokJxekm",
		"/ip4/127.0.0.1/udp/4001/webrtc-direct/certhash/uEiAFVMBmTvM0f0DWr_kmRgi_QKrWQfRoI8rel0JxOugIkg/p2p/12D3KooWMkNK8zgTQvtinDY8nuKmMAPBi3fBmvZj6W5huokJxekm",
		"/ip4/79.193.32.60/tcp/51684/p2p/12D3KooWMkNK8zgTQvtinDY8nuKmMAPBi3fBmvZj6W5huokJxekm",
		"/ip4/79.193.32.60/udp/51684/quic-v1/p2p/12D3KooWMkNK8zgTQvtinDY8nuKmMAPBi3fBmvZj6W5huokJxekm",
		"/ip4/79.193.32.60/udp/51684/quic-v1/webtransport/certhash/uEiADD1J9gKOoRM-XvC9EYkbDCe97dwwjVNaheeQ4C1X8Iw/certhash/uEiA6LFi0_EAMHJUX9F9D8BmBiblrH0qrZNAWJqRmpa0rPw/p2p/12D3KooWMkNK8zgTQvtinDY8nuKmMAPBi3fBmvZj6W5huokJxekm",
		"/ip4/79.193.32.60/udp/51684/webrtc-direct/certhash/uEiAFVMBmTvM0f0DWr_kmRgi_QKrWQfRoI8rel0JxOugIkg/p2p/12D3KooWMkNK8zgTQvtinDY8nuKmMAPBi3fBmvZj6W5huokJxekm"
	],
	"AgentVersion": "kubo/0.35.0/Homebrew",
	"Protocols": [
		"/ipfs/bitswap",
		"/ipfs/bitswap/1.0.0",
		"/ipfs/bitswap/1.1.0",
		"/ipfs/bitswap/1.2.0",
		"/ipfs/id/1.0.0",
		"/ipfs/id/push/1.0.0",
		"/ipfs/kad/1.0.0",
		"/ipfs/lan/kad/1.0.0",
		"/ipfs/ping/1.0.0",
		"/libp2p/autonat/1.0.0",
		"/libp2p/autonat/2/dial-back",
		"/libp2p/autonat/2/dial-request",
		"/libp2p/circuit/relay/0.2.0/hop",
		"/libp2p/circuit/relay/0.2.0/stop",
		"/libp2p/dcutr",
		"/x/"
	]
}
```

--------------------------------

### IPFS Config Profile: BadgerDS Measure (Legacy)

Source: https://docs.ipfs.tech/reference/kubo/cli

Configures the node to use the legacy badgerv1 datastore with a metrics wrapper, exposing additional datastore metrics on /debug/metrics/prometheus. This profile is for initial node setup.

```bash
ipfs init --profile badgerds-measure
```

--------------------------------

### CAR Export with Helia and dag-cbor

Source: https://docs.ipfs.tech/how-to/ipfs-in-web-apps

This example illustrates how to export data into a Content Archive (CAR) file using Helia and dag-cbor. CAR files are useful for packaging content-addressed data for efficient storage and transfer, aiding CID determinism.

```JavaScript
See the Pen <a href="https://codepen.io/2color/pen/EaYoegX"> CAR export with Helia and dag-cbor</a> by Daniel Norman (<a href="https://codepen.io/2color">@2color</a>)
```

--------------------------------

### Retrieve Content via Public IPFS Gateways

Source: https://docs.ipfs.tech/quickstart/pin

Examples of accessing IPFS content using public IPFS gateways. Replace '[CID]' with the Content Identifier.

```HTTP
https://ipfs.io/ipfs/[CID]
```

```HTTP
https://dweb.link/ipfs/[CID]
```

--------------------------------

### Get IPFS Repository Version

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves the version of the IPFS repository. This endpoint returns a JSON object containing the version string.

```json
{
  "Version": "<string>"
}
```

--------------------------------

### Get IPFS Version Information

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves IPFS version details, including version number, commit hash, repository version, and system information. Supports flags to show specific details.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/version?number=<value>&commit=<value>&repo=<value>&all=<value>"
```

--------------------------------

### IPFS add Endpoint cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

A comprehensive cURL command for the IPFS 'add' endpoint, showcasing various optional parameters for controlling the upload process, such as quiet mode, progress display, pinning, and CID versioning.

```bash
curl -X POST -F file=@myfile "http://127.0.0.1:5001/api/v0/add?quiet=<value>&quieter=<value>&silent=<value>&progress=<value>&only-hash=<value>&wrap-with-directory=<value>&pin=true&pin-name=<value>&to-files=<value>&cid-version=<value>&hash=<value>&raw-leaves=<value>&chunker=<value>&trickle=<value>&max-file-links=<value>&max-directory-links=<value>&max-hamt-fanout=<value>&inline=<value>&inline-limit=32&nocopy=<value>&fscache=<value>&preserve-mode=<value>&preserve-mtime=<value>&mode=<value>&mtime=<value>&mtime-nsecs=<value>"
```

--------------------------------

### IPFS Routing Commands

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides access to IPFS routing functionalities, including subcommands to find peers, find providers for a key, get values from the routing system, announce provisioned values, and write key/value pairs.

```bash
ipfs routing findpeer <peerID>
```

```bash
ipfs routing findprovs <key>
```

```bash
ipfs routing get <key>
```

```bash
ipfs routing provide <key>
```

```bash
ipfs routing put <key> <value-file>
```

```bash
ipfs routing reprovide
```

--------------------------------

### Contribute to IPFS Core Repositories (JavaScript)

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the IPFS project by working on the 'libp2p/js-libp2p' repository, which is written in JavaScript. This repository is a good starting point for contributing code to IPFS.

```JavaScript
libp2p/js-libp2p
```

--------------------------------

### Get IPNS Pubsub State

Source: https://docs.ipfs.tech/reference/kubo/rpc

Queries the current state of the IPNS pubsub system, indicating whether it is enabled or not.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/name/pubsub/state"
```

--------------------------------

### Get Bitswap Statistics

Source: https://docs.ipfs.tech/reference/kubo/rpc

Displays diagnostic information about the IPFS bitswap agent. Supports verbose output and human-readable sizes.

```json
{
  "BlocksReceived": "<uint64>",
  "BlocksSent": "<uint64>",
  "DataReceived": "<uint64>",
  "DataSent": "<uint64>",
  "DupBlksReceived": "<uint64>",
  "DupDataReceived": "<uint64>",
  "MessagesReceived": "<uint64>",
  "Peers": [
    "<string>"
  ],
  "Wantlist": [
    {
      "/": "<cid-string>"
    }
  ]
}
```

--------------------------------

### Stop IPFS Kubo Docker Container

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Stops the running IPFS Kubo Docker container.

```bash
docker stop ipfs_host

```

--------------------------------

### Create Symlink on Windows

Source: https://docs.ipfs.tech/how-to/move-ipfs-installation/move-ipfs-installation

Creates a symbolic link on Windows using the `mklink` command. This command can be executed in Command Prompt or PowerShell to redirect the IPFS repository location.

```Shell
mklink "C:\New IPFS Repo" "C:\Windows\Users\YOUR_USERNAME\.ipfs\"
```

--------------------------------

### IPFS Repository Statistics

Source: https://docs.ipfs.tech/reference/kubo/cli

Gets statistics for the local IPFS repository, including size, number of objects, and path. Options allow reporting only size or using human-readable formats.

```bash
ipfs stats repo
ipfs stats repo --size-only
ipfs stats repo --human
```

--------------------------------

### Build Next.js Site for IPFS

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/static-site-generators

Command to build a Next.js site after configuring it for static exports. The output will be in the `./out` directory, ready for IPFS deployment.

```bash
npx next build
```

--------------------------------

### Configure Helia Node

Source: https://docs.ipfs.tech/how-to/configure-node

Details the configuration process for an IPFS Helia node. Unlike previous implementations, Helia requires direct node configuration, as shown in the provided example.

```Markdown
For Helia, see the HeliaInit(opens new window) document. Note that, unlike the deprecated js-ipfs implementation, you must configure your node directly - see the Helia example(opens new window).
```

--------------------------------

### Manage Files in IPFS

Source: https://docs.ipfs.tech/how-to

Understand how to manage files within the IPFS network. This includes concepts like pinning files to ensure availability, troubleshooting file transfers, and working with large datasets.

```bash
# Example: Pinning a file
ipfs pin add <CID>
```

```bash
# Example: Adding a large dataset (conceptual)
# Use 'ipfs add -r' for directories or large files.
```

--------------------------------

### IPFS Video Overview: Whiteboard Explanation

Source: https://docs.ipfs.tech/concepts

This snippet links to a video offering a whiteboard overview of IPFS. It serves as a concise, visual explanation of the core concepts and functionality of IPFS.

```URL
https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7entrsjr32lvxc3clh4rshvye6fyluczh44oee/wiki-ipfs-camp-2019/ipfs-camp-2019-talks/ipfs-a-whiteboard-overview.webm
```

--------------------------------

### IPFS Core Principles for Implementations

Source: https://docs.ipfs.tech/concepts/implementations

Details the mandatory requirements for software to be recognized as an IPFS implementation. These include supporting Content Identifiers (CIDs) for resource addressing and verification, and exposing operations like retrieval and provisioning.

```English
Support addressability using Content IDentifiers (CIDs).
Expose operations such as retrieval, provisioning, and indexing, on resources using CIDs. The operations that an implementation may support are an open-ended, but this requirement covers any operation which the implementation exposes to other IPFS implementations.
Verify that the CIDs it resolves match the resources addressed, at least when the resources' bytes are accessible. Implementations may relax this requirement in controlled environments in which it is possible to ascertain that verification has happened elsewhere in a trusted part of the system.
```

--------------------------------

### IPFS Config Profile: Default Datastore (FlatFS)

Source: https://docs.ipfs.tech/reference/kubo/cli

Configures the node to use the default flatfs datastore. This profile is applied during initial node setup and is recommended for its reliability and efficient space reclamation.

```bash
ipfs init --profile default-datastore
```

--------------------------------

### Get Repository Statistics

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves statistics for the currently used IPFS repository, including the number of objects and storage usage. Supports human-readable output.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/repo/stat?size-only=<value>&human=<value>"
```

--------------------------------

### IPFS Default Addresses

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains

Examples of default IPFS addresses using CIDs, which are long and difficult to remember. These demonstrate the need for user-friendly domain linking.

```plaintext
https://bafybeifhgtpm6kmbyqszbardceszvkv5rsi3dodtuufpcfskzggekcfl2y.ipfs.inbrowser.link/
https://bafybeifhgtpm6kmbyqszbardceszvkv5rsi3dodtuufpcfskzggekcfl2y.ipfs.dweb.link/
ipfs://bafybeifhgtpm6kmbyqszbardceszvkv5rsi3dodtuufpcfskzggekcfl2y
```

--------------------------------

### Create Symlink on Linux/MacOS

Source: https://docs.ipfs.tech/how-to/move-ipfs-installation/move-ipfs-installation

Creates a symbolic link on Unix-based systems to point the original IPFS repository location to a new directory. This allows applications to access the repository without configuration changes.

```Shell
ln -s ~/.ipfs ~/new-ipfs-repo
```

--------------------------------

### IPFS Config Profile: FlatFS Measure

Source: https://docs.ipfs.tech/reference/kubo/cli

Configures the node to use the flatfs datastore with a metrics tracking wrapper, exposing datastore metrics on /debug/metrics/prometheus. This profile is intended for initial node setup.

```bash
ipfs init --profile flatfs-measure
```

--------------------------------

### Publish Project to IPNS

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/multipage-website

This command publishes the IPFS CID of your project to IPNS, creating a persistent and updatable link to your website. You will receive a unique key that can be used to access the latest version of your content.

```bash
ipfs name publish /ipfs/QmchJPQNLE5EUSYTzfzUsNFyPozXyANiZHFDSFKWdLNdRR

> Published to k51qzi5uqu5dh9gnl66grpnpuhj245ha1xq9ajtmuf7swe847zovdg1t9a0xiz: /ipfs/QmchJPQNLE5EUSYTzfzUsNFyPozXyANiZHFDSFKWdLNdRR
```

--------------------------------

### Create IPFS Directory (MFS)

Source: https://docs.ipfs.tech/concepts/file-systems

Demonstrates how to create a new directory in IPFS using the Mutable File System (MFS) API. It shows the basic command and how to create nested directories by setting the 'parents' option to true.

```javascript
await ipfs.files.mkdir('/example')
```

```javascript
await ipfs.files.mkdir('/my/directory/example', { parents: true })
```

--------------------------------

### Construct IPNS URL Path

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This snippet shows how to construct a URL path for IPFS content using an IPNS name and a gateway host. It's a straightforward string formatting example.

```URL
https://<gateway-host>.tld/ipns/<ipns-name>/path/to/resource
```

--------------------------------

### Query IPFS Providers via /routing/v1 API

Source: https://docs.ipfs.tech/concepts/ipni

This example demonstrates how to query for IPFS providers using the `/routing/v1/providers/` endpoint with a specific CID. It shows the basic curl command to interact with the IPNI service.

```bash
$ curl https://cid.contact/routing/v1/providers/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

```

--------------------------------

### Get DAG Statistics

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves statistics for a DAG, including block counts and sizes. Supports returning progressive data.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/dag/stat?arg=<root>&progress=true"
```

--------------------------------

### Copy File to IPFS MFS

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Copies a file from the IPFS network (identified by CID) into the Mutable File System (MFS) of your local IPFS node. This makes the file accessible via the web console.

```bash
ipfs files cp /ipfs/<CID> /meow.txt
```

--------------------------------

### IPFS Provider Record Example

Source: https://docs.ipfs.tech/concepts/ipni

This JSON snippet demonstrates a typical IPFS provider record, detailing the ContextID, Metadata, and Provider information including Peer ID and network addresses.

```JSON
{
            "ContextID": "YmFndXFlZXJha3ppdzRwaWxuZmV5ZGFtNTdlZ2RxZTRxZjR4bzVuZmxqZG56emwzanV0YXJtbWltdHNqcQ==",
            "Metadata": "gBI=",
            "Provider": {
                "ID": "QmQzqxhK82kAmKvARFZSkUVS6fo9sySaiogAnx5EnZ6ZmC",
                "Addrs": [
                "/dns4/elastic.dag.house/tcp/443/wss"
                ]
            }
            }
```

```JSON
{
"ContextID": "AXESIAqACNwDTPpjRLuNw0rCwP4z5ge8p2p+mceS0hjDQdBl",
"Metadata": "kBKjaFBpZWNlQ0lE2CpYKAABgeIDkiAgjdNAYM8PDCDyhgEIJKlEGElVgqkxlecqZA+2aJrX8CdsVmVyaWZpZWREZWFs9W1GYXN0UmV0cmlldmFs9Q==",
"Provider": {
    "ID": "12D3KooWHbYfcXCUzxCCCkfppiJgvD7eAqhbZTXEMu66EYdqTwCQ",
    "Addrs": [
    "/ip4/195.26.70.31/tcp/24001"
    ]
}

}
```

--------------------------------

### Build Hugo Site for IPFS

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/static-site-generators

Command to build a Hugo site with static pages. The output is typically in the `./public/` directory, which can then be uploaded to IPFS.

```bash
hugo -D
```

--------------------------------

### Generate CIDv1

Source: https://docs.ipfs.tech/concepts/content-addressing

Provides an example of how to explicitly generate a CID version 1 (CIDv1) when adding a file to IPFS. This is recommended for new projects due to its future-proofing and flexibility.

```Shell
ipfs add --cid-version 1
```

--------------------------------

### Export IPFS Staging and Data Directories

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Define environment variables to specify the absolute paths for staging IPFS files and for persistent IPFS data storage within the Docker container.

```bash
export ipfs_staging=</absolute/path/to/somewhere/>
export ipfs_data=</absolute/path/to/somewhere_else/>

```

--------------------------------

### Initialize IPFS Kubo Node

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

Initializes a new IPFS node configuration and generates an RSA keypair. This command sets up the necessary files for your IPFS node to operate.

```bash
ipfs init

```

--------------------------------

### Retrieve IPFS Block

Source: https://docs.ipfs.tech/how-to/troubleshooting

Fetch a specific block from the IPFS network using its CID with the `ipfs block get` command. This is a fundamental step in retrieving content.

```bash
ipfs block get <CID>
```

--------------------------------

### Get DHT Statistics

Source: https://docs.ipfs.tech/reference/kubo/rpc

Returns statistics about the node's Distributed Hash Tables (DHTs). Allows specifying which DHT tables to query.

```bash
# No specific cURL example provided in the source text for this endpoint.
```

--------------------------------

### Get IPFS Bandwidth Statistics

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves IPFS bandwidth statistics. Can filter by peer or protocol, and poll for updates at a specified interval.

```json
{
  "RateIn": "<float64>",
  "RateOut": "<float64>",
  "TotalIn": "<int64>",
  "TotalOut": "<int64>"
}
```

--------------------------------

### IPFS Gateway Example

Source: https://docs.ipfs.tech/concepts/glossary

An IPFS Gateway acts as a bridge between web browsers and IPFS, allowing users to access IPFS content via HTTP. This typically involves an IPFS node exposing an HTTP endpoint.

```text
An IPFS Gateway is an IPFS node that also exposes an HTTP IPFS Gateway endpoint.
```

--------------------------------

### IPFS Native URL with Specific CID

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

Shows a concrete example of an IPFS native URL using a specific CID (CIDv1) and a path to a file, demonstrating how a CID is used as the authority component.

```plaintext
ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/Vincent_van_Gogh.html
```

--------------------------------

### Execute IPFS Commands in Docker Container

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Demonstrates how to execute IPFS commands (e.g., 'swarm peers', 'add') within the running IPFS Kubo Docker container using `docker exec`.

```bash
docker exec ipfs_host ipfs swarm peers

```

```bash
cp -r <something> $ipfs_staging
docker exec ipfs_host ipfs add -r /export/<something>

```

--------------------------------

### HTML for Random Planet Facts

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/multipage-website

This HTML code sets up the structure for a 'Random Planet Facts' website. It includes a title, meta descriptions, basic styling, and a JavaScript function to display a random fact when the page loads. It also links to an 'about.html' page.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Random Planet Facts</title>
    <meta
      name="description"
      content="Get a random fact about a planet in our solar system."
    />
    <meta name="author" content="The IPFS Docs team." />
    <style>
      body {
        margin: 15px auto;
        max-width: 650px;
        line-height: 1.2;
        font-family: sans-serif;
        font-size: 2em;
        color: #fff;
        background: #444;
      }
      a {
        color: yellowgreen;
      }
    </style>
  </head>
  <body onload="main()">
    <h1>Random Planet Facts</h1>
    <img src="moon-logo.png" />
    <p id="output_p"></p>
    <h2><a href="about.html">About this website</a></h2>
    <script>
      function main() {
        const facts = [
          'Mars is home to the tallest mountain in our solar system.',
          'Only 18 out of 40 missions to Mars have been successful.',
          'Pieces of Mars have fallen to Earth.',
          'One year on Mars is 687 Earth days.',
          'The temperature on Mars ranges from -153 to 20 °C.',
          'One year on Mercury is about 88 Earth days.',
          'The surface temperature of Mercury ranges from -173 to 427°C.',
          'Mercury was first discovered in 14th century by Assyrian astronomers.',
          'Your weight on Mercury would be 38% of your weight on Earth.',
          'A day on the surface of Mercury lasts 176 Earth days.',
          'The surface temperature of Venus is about 462 °C.',
          'It takes Venus 225 days to orbit the sun.',
          'Venus was first discovered by 17th century Babylonian astronomers.',
          'Venus is nearly as big as the Earth with a diameter of 12,104 km.',
          'The Earth\'s rotation is gradually slowing.',
          'There is only one natural satellite of the planet Earth, the moon.',
          'Earth is the only planet in our solar system not named after a god.',
          'The Earth is the densest planet in the solar system.',
          'A year on Jupiter lasts around 4333 earth days.',
          'The surface temperature of Jupiter is around -108°C.',
          'Jupiter was first discovered by 7th or 8th century Babylonian astronomers.',
          'Jupiter has 4 ring.',
          'A day on Jupiter lasts 9 hours and 55 minutes.',
          'Saturn was first discovered by 8th century Assyrians.',
          'Saturn takes 10756 days to orbit the Sun.',
          'Saturn can be seen with the naked eye.',
          'Saturn is the flattest planet.',
          'Saturn is made mostly of hydrogen.',
          'Four spacecraft have visited Saturn.',
          'Uranus was discovered by William Herschel in 1781.',
          'A year on Uranus takes 30687 earth days.',
          'Uranus turns on its axis once every 17 hours, 14 minutes.',
          'With minimum atmospheric temperature of -224°C Uranus is nearly coldest planet in the solar system.',
          'Only one spacecraft has flown by Uranus, the Voyager 2.',
          'Neptune was discovered in 1846 by Urbain Le Verrier and Johann Galle.',
          'Neptune has 14 moons.',
          'The average temperature of Neptune is about -201 °C.',
          'There is a 1:20 million scale model of the solar system in Sweden.',
          'The gap between the Earth and our moon is bigger than the diameters of all the planets combined.',
          'The first accurate calculation of the speed of light was using Jupiter\'s moons',
          'Jupiter\'s magnetic field is believed to be a result of rapidly spinning metallic hydrogen at the core, and is ~10x stronger than the Earth\'s.',
          'Venus spins backwards.',
          'Uranus spins sideways, relative to the ecliptic plane of the solar system.',
          'It is easier to reach Pluto or escape the solar system from Earth than being able to <i>land</i> on the Sun.'
        ]
        document.querySelector('#output_p').innerHTML =
          facts[Math.floor(Math.random() * facts.length)]
      }
    </script>
  </body>
</html>
```

--------------------------------

### IPFS Documentation Title Formatting

Source: https://docs.ipfs.tech/community/contribute/grammar-formatting-and-style

Demonstrates the sentence structure capitalization rule for titles in IPFS documentation, where only the first letter and proper nouns/places are capitalized.

```Markdown
## This is a title

### Only capitalize names and places

#### The capital city of France is Paris
```

--------------------------------

### Go IPLD Testing Tools

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Tools to generate and inspect IPLD data, assisting in testing IPLD implementations. This library helps create reproducible test cases for IPLD-related projects.

```go
package main

import (
	"fmt"
	"github.com/ipld/go-fixtureplate"
)

func main() {
	// Example of generating a fixture (conceptual)
	fixture := fixtureplate.NewFixture()
	fmt.Printf("Generated fixture: %v\n", fixture)
}
```

--------------------------------

### Restore IPFS Repository on Linux/MacOS

Source: https://docs.ipfs.tech/how-to/move-ipfs-installation/move-ipfs-installation

This command sequence is used for troubleshooting when the IPFS daemon fails to run after a repository move. It renames the broken repository and restores the previous backup.

```Shell
mv .ipfs ipfs-backup-broken
mv .ipfs-old .ipfs
```

--------------------------------

### Get IPFS Diagnostic Commands

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves a list of active and completed commands from the IPFS diagnostic log. The response includes details such as command status, arguments, and timestamps.

```json
[
  {
    "Active": "<bool>",
    "Args": [
      "<string>"
    ],
    "Command": "<string>",
    "EndTime": "<timestamp>",
    "ID": "<int>",
    "Options": {
      "<string>": "<object>"
    },
    "StartTime": "<timestamp>"
  }
]

```

--------------------------------

### Get DAG Node from IPFS

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves a DAG node from IPFS using its CID. Supports specifying an output codec for the retrieved object.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/dag/get?arg=<ref>&output-codec=dag-json"
```

--------------------------------

### Get IPFS Block Statistics

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves statistics for a raw IPFS block. Requires the CID of an existing block. Returns the Key and Size of the block.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/block/stat?arg=<cid>"
```

--------------------------------

### IPFS Bitswap Want-List Example

Source: https://docs.ipfs.tech/concepts/bitswap

A simplified representation of a Bitswap want-list, which is a list of Content Identifiers (CIDs) that a peer wishes to receive. This structure is crucial for requesting data blocks from other nodes in the IPFS network.

```Go
Want-list {
  QmZtmD2qt6fJot32nabSP3CUjicnypEBz7bHVDhPQt9aAy, WANT,
  QmTudJSaoKxtbEnTddJ9vh8hbN84ZLVvD5pNpUaSbxwGoa, WANT,
  ...
}

```

--------------------------------

### Upload File to IPFS using Filebase S3-Compatible API

Source: https://docs.ipfs.tech/quickstart/pin-cli

This example shows how to upload a file to IPFS using Filebase's S3-compatible API with the AWS CLI. It involves configuring the AWS CLI with Filebase credentials and then using the 's3 cp' command to upload the file to a specified bucket.

```bash
# Configure AWS CLI with Filebase credentials
aws configure --profile filebase

# Upload a file to your IPFS bucket
aws --profile filebase s3 cp welcome-to-IPFS.jpg s3://your-bucket-name/
```

--------------------------------

### Get IPFS Routing Information

Source: https://docs.ipfs.tech/reference/kubo/rpc

Queries the IPFS routing system for the best value associated with a given key. The response includes peer information and network addresses.

```json
{
  "Extra": "<string>",
  "ID": "<peer-id>",
  "Responses": [
    {
      "Addrs": [
        "<multiaddr-string>"
      ],
      "ID": "peer-id"
    }
  ],
  "Type": "<int>"
}
```

--------------------------------

### Get DHT Stats

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves statistics for the IPFS DHT. This endpoint requires a DHT identifier as an argument. The response includes bucket information and peer details.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/stats/dht?arg=<dht>"
```

--------------------------------

### Uploading and Pinning with Filebase

Source: https://docs.ipfs.tech/quickstart/pin

Instructions for using the Filebase web dashboard to upload and pin files. Filebase provides an S3-compatible service, and users can follow their guide to pin their first file through the web interface.

```bash
# Conceptual bash command for uploading to Filebase via CLI (if supported, not explicitly in text)
# aws s3 cp <your-file-path> s3://your-filebase-bucket/
```

--------------------------------

### Publishing Content Path with DNSLink (dig command)

Source: https://docs.ipfs.tech/concepts/dnslink

Demonstrates how to publish a DNSLink mapping by creating a DNS TXT record prefixed with '_dnslink'. This example uses the 'dig' command to show the TXT record for '_dnslink.docs.ipfs.tech'.

```bash
dig +noall +answer TXT _dnslink.docs.ipfs.tech
> _dnslink.docs.ipfs.tech. 30 IN TXT "dnslink=/ipfs/bafybeifld3uybj6azujisdnxu6cm7mombldpbt3au4g33nwnqx7dsgjrta"
```

--------------------------------

### IPFS Repo Command Overview

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides an overview of the 'ipfs repo' command, which is used to manipulate the IPFS repository. It lists various subcommands for managing the repository.

```bash
ipfs repo

Subcommands:
  ipfs repo gc      - Perform a garbage collection sweep on the repo.
  ipfs repo ls      - List all local references.
  ipfs repo migrate - Apply repository migrations to a specific version.
  ipfs repo stat    - Get stats for the currently used repo.
  ipfs repo verify  - Verify all blocks in repo are not corrupted.
  ipfs repo version - Show the repo version.
```

--------------------------------

### Query IPFS Providers with Streaming Responses

Source: https://docs.ipfs.tech/concepts/ipni

This example shows how to enable streaming responses from the IPFS delegated routing endpoint by including the `Accept: application/x-ndjson` header. This is useful for receiving results as they become available.

```bash
$ curl -H 'Accept: application/x-ndjson' https://cid.contact/routing/v1/providers/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

```

--------------------------------

### Address Object with dag-cbor and sha2-256 using Helia

Source: https://docs.ipfs.tech/how-to/ipfs-in-web-apps

This example demonstrates how to address a JavaScript object by CID using the dag-cbor multicodec and the sha2-256 hash function with the Helia library. It's useful for creating linked data structures in web applications.

```JavaScript
import { create } from 'helia'
import { dagCbor } from '@helia/dag-cbor'
import { sha256 } from 'multiformats/hashes/sha2'

async function main () {
  const helia = await create()
  const cid = await helia.add(
    { hello: 'world' },
    { 
      dag: dagCbor,
      hash: sha256
    }
  )
  console.log(cid.toString())
}
```

--------------------------------

### Resolving DNSLink Name (DNSLink format)

Source: https://docs.ipfs.tech/concepts/dnslink

Shows the format of the DNSLink value within a TXT record, which starts with 'dnslink=' followed by an IPFS or IPNS link.

```plaintext
dnslink=/ipfs/<CID for your content here>
```

--------------------------------

### IPFS p2p listen (Experimental)

Source: https://docs.ipfs.tech/reference/kubo/cli

This experimental command 'ipfs p2p listen' creates a libp2p service and forwards connections to a specified target address. It requires a protocol name and target address, with options to allow custom protocols and report the peer ID.

```bash
ipfs p2p listen [--allow-custom-protocol] [--report-peer-id | -r] [--] <protocol> <target-address>
```

--------------------------------

### Get Reprovide Statistics

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves statistics related to the reprovider functionality. This includes average duration, batch size, last run timestamp, reprovide interval, and total reprovides.

```json
{
  "ReproviderStats": {
    "AvgReprovideDuration": "<duration-ns>",
    "LastReprovideBatchSize": "<uint64>",
    "LastReprovideDuration": "<duration-ns>",
    "LastRun": "<timestamp>",
    "ReprovideInterval": "<duration-ns>",
    "TotalReprovides": "<uint64>"
  }
}
```

--------------------------------

### Verify DNSLink Record with dig

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

This command verifies that the DNSLink TXT record has propagated correctly. It queries the DNS for the TXT record associated with the _dnslink subdomain of your domain. The expected output shows the 'dnslink=/ipfs/CID' format.

```bash
dig +short TXT _dnslink.yourdomain.com
```

--------------------------------

### IPFS Provider Record GET

Source: https://docs.ipfs.tech/concepts/dht

Describes how to retrieve provider records for a block with Multihash H by querying peers for closest peers and the specific record.

```text
1. Lookup K closest peers to X=SHA256(H).
2. Ask each peer for K closest peers to X.
3. Ask each peer for the record corresponding to X.
4. Add new providers learned and continue until lookup terminates or a provider limit is reached.
```

--------------------------------

### Toggle IPFS Companion Redirects

Source: https://docs.ipfs.tech/install/ipfs-companion

Users can control IPFS Companion's local gateway redirects globally or on a per-site basis. This can be done through the extension's preferences, by toggling redirects for the current tab, or by appending a specific hash or query parameter to the URL.

```URL
x-ipfs-companion-no-redirect
```

--------------------------------

### IPFS API: Get and Set Configuration Values

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the IPFS API endpoint /api/v0/config for managing configuration. It outlines arguments for accessing or setting config entries ('arg'), and options like 'bool' and 'json' for type handling, and 'expand-auto' for AutoConf expansion.

```json
{
  "Key": "<string>",
  "Value": "<object>"
}
```

--------------------------------

### Query Public Delegated Routing Endpoint for Providers

Source: https://docs.ipfs.tech/how-to/troubleshooting

This example shows how to query a public delegated routing endpoint to find providers for a given Content Identifier (CID). This is a key step in troubleshooting retrieval failures by verifying if providers are registered for the content.

```bash
curl "https://delegated-ipfs.dev/routing/v1/providers/<cid>"
```

--------------------------------

### Customize Kubo Merkleizing Options

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

Allows customization of the Kubo version and `ipfs add` parameters used for merkleizing content within the `ipfs-deploy-action`.

```yaml
- name: Deploy to IPFS
  uses: ipfs/ipfs-deploy-action@v1
  with:
    # ... other inputs ...
    kubo-version: 'v0.37.0' # Default, change if needed
    ipfs-add-options: '--cid-version 1 --chunker size-1048576' # Default options
```

--------------------------------

### Specifying Filenames During IPFS Downloads (Path Style)

Source: https://docs.ipfs.tech/how-to/gateway-best-practices

Demonstrates how to use the `?filename={filename.ext}` query parameter with path-style gateway resolution to specify a human-friendly filename when downloading files from IPFS.

```URL
https://{gatewayURL}/ipfs/{CID}/{optional path to resource}?filename={filename.ext}
```

--------------------------------

### Clone IPFS Docs Repository

Source: https://docs.ipfs.tech/community/contribute/contribution-tutorial

This command clones the ipfs/ipfs-docs repository from GitHub to your local machine, allowing you to make changes.

```bash
git clone https://github.com/YOUR_USERNAME/ipfs-docs.git
```

--------------------------------

### Copy IPFS Repository in WSL

Source: https://docs.ipfs.tech/how-to/move-ipfs-installation/move-ipfs-installation

This command copies the IPFS repository from the Linux environment within WSL to the Windows file system. Ensure IPFS daemons are stopped on both systems before execution.

```Shell
cp --recursive --verbose ~/.ipfs /mnt/c/Users/Your Username/
```

--------------------------------

### Enable DNSLink for a Specific Domain

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

Explicitly enables DNSLink resolution for a specific domain, overriding the global setting. This configuration is applied to the IPFS gateway's configuration.

```bash
ipfs config --json Gateway.PublicGateways '{
    "yourdomain.com": {
      "NoDNSLink": false,
      "Paths": []
    }
  }'
```

--------------------------------

### Initialize IPFS Private Swarm with Swarm Key in Docker

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Initializes an IPFS Kubo container with a private swarm key. The IPFS_SWARM_KEY variable sets the key content directly, while IPFS_SWARM_KEY_FILE copies the key from a specified path. IPFS_SWARM_KEY_FILE takes precedence.

```bash
docker run -d --name ipfs_host -e IPFS_SWARM_KEY=<your swarm key> -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/kubo:v0.37.0
```

--------------------------------

### Go Minimal IPFS Daemon Library

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A minimal library-oriented IPFS daemon built on the same blocks as Kubo but with a minimal glue layer. This Go library offers a lightweight alternative for IPFS nodes.

```go
package main

import (
	"fmt"
	"github.com/hsanjuan/ipfs-lite"
)

func main() {
	// Example usage (conceptual - initializing IPFS lite)
	// ipfs, err := ipfs_lite.New() // Simplified example
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println("IPFS Lite initialized.")
	fmt.Println("ipfs-lite library used.")
}
```

--------------------------------

### Configure Kubo Gateway for DNSLink

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

This section details how to adjust Kubo's gateway configuration to enable it to act as a specific gateway for your domain. It explains how Kubo will use the 'host' header to match requests and resolve DNSLink TXT records to serve content.

```bash
# Example configuration snippet for Kubo's gateway settings
# This would typically be part of Kubo's configuration file (e.g., config.toml)
# Ensure Kubo is configured to listen on a specific address and port that Caddy can proxy to.
# Example: Gateway configuration might involve setting:
# Gateway.PublicGateways = {
#   "yourdomain.com": "/ipns/yourdomain.com"
# }
# Note: The exact configuration details can vary based on Kubo version and setup.
# Refer to official Kubo documentation for precise configuration parameters.
```

--------------------------------

### Get all children of a block (IPFS CLI)

Source: https://docs.ipfs.tech/how-to/work-with-blocks

Shows how to use `ipfs refs` to list all the children (links) of a given IPFS block. This command is particularly useful for scripting operations on child blocks.

```bash
ipfs refs <block-hash>
```

--------------------------------

### Go Import Path with IPFS

Source: https://docs.ipfs.tech/how-to/host-git-repo

This Go code snippet shows how to use an IPFS-hosted Git repository for imports. By referencing the IPFS gateway and hash, it ensures that the imported library code remains consistent and immutable.

```go
import (
	mylib "gateway.ipfs.io/ipfs/QmX679gmfyaRkKMvPA4WGNWXj9PtpvKWGPgtXaF18etC95"
)
```

--------------------------------

### IPFS DAG Get Command

Source: https://docs.ipfs.tech/reference/kubo/cli

This command retrieves a DAG node from IPFS. It takes a reference (CID) to the node and allows specifying an output codec for the data. The default output codec is 'dag-json'.

```bash
ipfs dag get [--output-codec=<output-codec>] [--] <ref>
```

--------------------------------

### Get IPFS Reprovider Stats

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves statistics about the IPFS reprovider, including average duration, batch size, last run time, and interval. The response is a JSON object containing these statistics.

```json
{
  "ReproviderStats": {
    "AvgReprovideDuration": "<duration-ns>",
    "LastReprovideBatchSize": "<uint64>",
    "LastReprovideDuration": "<duration-ns>",
    "LastRun": "<timestamp>",
    "ReprovideInterval": "<duration-ns>",
    "TotalReprovides": "<uint64>"
  }
}
```

--------------------------------

### Get IPFS Swarm Peers via API

Source: https://docs.ipfs.tech/reference/kubo/rpc

Demonstrates how to retrieve the list of connected peers in the IPFS swarm using the Kubo RPC API. It shows the equivalent CLI command and the corresponding HTTP POST request with its JSON response.

```shell
> ipfs swarm peers
/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
/ip4/104.236.151.122/tcp/4001/p2p/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx
/ip4/104.236.176.52/tcp/4001/p2p/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z
```

```http
> curl -X POST http://127.0.0.1:5001/api/v0/swarm/peers
{
  "Strings": [
    "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
    "/ip4/104.236.151.122/tcp/4001/p2p/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx",
    "/ip4/104.236.176.52/tcp/4001/p2p/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z",
  ]
}
```

--------------------------------

### Show IPFS Repo Version

Source: https://docs.ipfs.tech/reference/kubo/cli

Displays the current version of the IPFS repository. It has a quiet option for minimal output.

```bash
ipfs repo version
```

```bash
ipfs repo version -q
```

--------------------------------

### Mitigating Man-in-the-Middle Vulnerability in IPFS

Source: https://docs.ipfs.tech/how-to/gateway-best-practices

Explains a scenario where a compromised writable gateway can inject falsified content into the IPFS network. It details a step-by-step process of how this vulnerability can be exploited, leading to the distribution of incorrect data.

```Example
1. Alice posts a balance of `123.54` to a compromised writable gateway.
2. The gateway is currently storing a balance of `0.00`, so it returns the CID of the falsified content to Alice.
3. Alice gives the falsified content CID to Bob.
4. Bob fetches the content with this CID and cryptographically validates the balance of `0.00`.
```

--------------------------------

### Configure Kubo Node

Source: https://docs.ipfs.tech/how-to/configure-node

Provides instructions for configuring an IPFS Kubo node. Users are directed to a specific markdown file for detailed configuration options.

```Markdown
For Kubo, see config.md(opens new window).
```

--------------------------------

### Add File to IPFS with Options

Source: https://docs.ipfs.tech/reference/kubo/rpc

This snippet demonstrates how to add a file or directory to IPFS using the /api/v0/add command. It outlines various optional arguments to control the addition process, such as output verbosity, hashing, pinning, and file system preservation.

```bash
ipfs add <file_or_directory> [--quiet | --quieter | --silent] [--progress] [--only-hash] [--wrap-with-directory] [--pin] [--pin-name=<name>] [--to-files=<path>] [--cid-version=<0|1>] [--hash=<hash_function>] [--raw-leaves] [--chunker=<chunker_options>] [--trickle] [--max-file-links=<int>] [--max-directory-links=<int>] [--max-hamt-fanout=<int>] [--inline] [--inline-limit=<int>] [--nocopy] [--fscache] [--preserve-mode] [--preserve-mtime] [--mode=<uint>] [--mtime=<int64>] [--mtime-nsecs=<uint>]
```

--------------------------------

### IPFS CLI Network Commands

Source: https://docs.ipfs.tech/reference/kubo/cli

Details commands for interacting with the IPFS peer-to-peer network, including showing peer information, managing bootstrap peers, swarm connections, DHT queries, routing, pinging, and inspecting bitswap and pubsub.

```bash
ipfs id
ipfs bootstrap
ipfs swarm
ipfs dht
ipfs routing
ipfs ping
ipfs bitswap
ipfs pubsub
```

--------------------------------

### Login to Storacha Account

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

Logs the user into their Storacha account using the `w3cli` tool. This command typically prompts for credentials or uses existing configuration.

```bash
w3 login
```

--------------------------------

### Get IPFS Peer Network Addresses

Source: https://docs.ipfs.tech/how-to/troubleshooting

Retrieve the network addresses of an IPFS peer using its Peer ID with the `ipfs id` command. This is useful for understanding how to connect to a specific peer.

```bash
ipfs id -f '<addrs>' <peer-id>
```

--------------------------------

### IPFS Gateway DNSLink Resolution URL Example (IPNS Identifier)

Source: https://docs.ipfs.tech/concepts/ipfs-gateway

Shows the URL pattern for DNSLink resolution using an IPNS identifier, where the gateway resolves the identifier to a CID via DNS TXT records.

```URL
https://{gateway URL}/ipns/{example.com}/{optional path}
```

--------------------------------

### Update Website on IPFS and IPNS

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/multipage-website

After making changes to your website, re-add the updated project folder to IPFS and then re-publish the new CID to IPNS to ensure the IPNS link points to the latest version of your content.

```bash
ipfs add -r .

> ...
> added QmchJPQNLE5EUSYTzfzUsNFyPozXyANiZHFDSFKWdLNdRR multi-page-first-step
12.65 KiB / 12.65 KiB [=====================================================] 100.00%

ipfs name publish QmchJPQNLE5EUSYTzfzUsNFyPozXyANiZHFDSFKWdLNdRR

> Published to k51qzi5uqu5dh9gnl66grpnpuhj245ha1xq9ajtmuf7swe847zovdg1t9a0xiz: /ipfs/QmchJPQNLE5EUSYTzfzUsNFyPozXyANiZHFDSFKWdLNdRR
```

--------------------------------

### Initialize IPFS Private Swarm with Docker Secrets

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Initializes an IPFS Kubo container with a private swarm key using Docker secrets. This method requires Docker Swarm or Docker Compose and mounts the secret to a specified path within the container.

```bash
cat your_swarm.key | docker secret create swarm_key_secret -
docker run -d --name ipfs_host --secret swarm_key_secret -e IPFS_SWARM_KEY_FILE=/run/secrets/swarm_key_secret -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/kubo:v0.37.0
```

--------------------------------

### IPFS API: List All Available Commands

Source: https://docs.ipfs.tech/reference/kubo/rpc

Describes the IPFS API endpoint /api/v0/commands, which lists all available commands. It explains the 'flags' argument for showing command flags and the nested JSON structure of the response detailing command names, options, and subcommands.

```json
{
  "Name": "<string>",
  "Options": [
    {
      "Names": [
        "<string>"
      ]
    }
  ],
  "Subcommands": [
    {
      "Name": "<string>",
      "Options": [
        {
          "Names": [
            "<string>"
          ]
        }
      ],
      "Subcommands": [
        "..."
      ]
    }
  ]
}
```

--------------------------------

### Get Swarm Filters

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves the current list of address filters configured in the IPFS swarm. Filters are used to control which peers the node connects to. The response is an array of strings, each representing a filter.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/swarm/filters"
```

--------------------------------

### IPFS Commands - List All Commands

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists all available IPFS commands and subcommands. It can optionally display command flags.

```shell
ipfs commands
ipfs commands --flags
```

--------------------------------

### Disable Global DNSLink Resolution

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

Globally disables DNSLink resolution for the IPFS gateway. Specific domains can be enabled later. This setting is managed in the IPFS config.

```bash
ipfs config --json Gateway.NoDNSLink true
```

--------------------------------

### Get IPFS Routing System Value

Source: https://docs.ipfs.tech/reference/kubo/cli

Queries the IPFS routing system for the best value associated with a given key. 'Best' is defined by the key type, typically the freshest valid record for IPNS.

```bash
ipfs routing get <key>
```

--------------------------------

### Configure IPFS Kubo Resource Limits in Docker

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Sets GOMAXPROCS and GOMEMLIMIT environment variables for IPFS Kubo to align with Docker container resource constraints. GOMAXPROCS controls concurrent Go threads, and GOMEMLIMIT sets the memory allocation limit.

```bash
docker run # (....)
    --cpus="4.0" -e GOMAXPROCS=4 \
    --memory="8000m" -e GOMEMLIMIT=7500MiB \
    ipfs/kubo:v0.37.0
```

--------------------------------

### IPFS Files Remove (rm) cURL Example

Source: https://docs.ipfs.tech/reference/kubo/rpc

Demonstrates the cURL command for removing files or directories from IPFS MFS using 'files rm'. It details arguments for the file path, recursive removal, and force option.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/files/rm?arg=<path>&recursive=<value>&force=<value>"
```

--------------------------------

### Play Video from IPFS Hash via Command Line

Source: https://docs.ipfs.tech/how-to/store-play-videos

This command retrieves the video content from IPFS using its hash and pipes it to `mplayer` for playback. The `-vo xv -` arguments specify the video output driver and direct output to stdout.

```bash
ipfs cat $video_hash | mplayer -vo xv -
```

--------------------------------

### Add Video to IPFS and Get Hash

Source: https://docs.ipfs.tech/how-to/store-play-videos

This snippet demonstrates how to add a video file to IPFS and retrieve its content hash. The `-q` flag ensures only the hash is outputted, and `tail -n1` extracts the last line, which is the hash.

```bash
ipfs add -q sintel.mp4 | tail -n1
```

--------------------------------

### Accessing IPNS with Custom Domain

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains

Demonstrates how to access an IPNS resource (like a website) using a custom domain through an IPFS gateway. This example shows the redirection to a subdomain gateway for origin isolation.

```plaintext
https://ipfs.io/ipns/docs.ipfs.tech
```

--------------------------------

### Configure Middleman for IPFS Deployment

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/static-site-generators

Configure Middleman by setting `set :relative_links, true` and `set :strip_index_file, false` in `config.rb` to enable relative links and proper index file handling for IPFS.

```ruby
set :relative_links, true
set :strip_index_file, false
```

--------------------------------

### IPFS Version Dependencies

Source: https://docs.ipfs.tech/reference/kubo/cli

Shows information about the build dependencies and their versions used in IPFS. This command lists all external libraries and their respective versions.

```bash
ipfs version deps
```

--------------------------------

### Uploading and Pinning with Pinata

Source: https://docs.ipfs.tech/quickstart/pin

Guide on using the Pinata web interface to upload and pin files to IPFS. Pinata offers a simple drag-and-drop experience for users. This method is suitable for quick uploads and leverages a dedicated pinning service.

```javascript
// Conceptual JavaScript for interacting with Pinata API (not directly in text, but implied by web interface)
// const pinataSDK = require('@pinata/sdk');
// const pinata = pinataSDK('YOUR_API_KEY', 'YOUR_API_SECRET');
// pinata.pinFromFS('path/to/your/file.txt').then(result => console.log(result));
```

--------------------------------

### IPFS Kubo RPC API: Commands

Source: https://docs.ipfs.tech/reference/kubo/rpc

This entry covers the `/api/v0/commands` endpoint for the IPFS Kubo RPC API, which lists all available commands. This is a helpful endpoint for API discovery.

```HTTP
GET /api/v0/commands
```

--------------------------------

### Get IPFS Object Data via API

Source: https://docs.ipfs.tech/reference/kubo/rpc

Demonstrates how to retrieve data and links for an IPFS object using the Kubo RPC API. It shows the use of 'arg' for the object hash and 'encoding=json' as a flag in the HTTP request.

```shell
> curl -X POST "http://127.0.0.1:5001/api/v0/object/get?arg=QmaaqrHyAQm7gALkRW8DcfGX3u8q9rWKnxEMmf7m9z515w&encoding=json"
{
  "Links": [
    {
      "Name": "index.html",
      "Hash": "QmYftndCvcEiuSZRX7njywX2AGSeHY2ASa7VryCq1mKwEw",
      "Size": 1700
    },
    {
      "Name": "static",
      "Hash": "QmdtWFiasJeh2ymW3TD2cLHYxn1ryTuWoNpwieFyJriGTS",
      "Size": 2428803
    }
  ],
  "Data": "CAE="
}
```

--------------------------------

### IPFS Kubo RPC API: Log Level

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section describes the `/api/v0/log/level` endpoint for the IPFS Kubo RPC API, used to set or get the logging level for different subsystems. This is crucial for debugging and monitoring.

```HTTP
GET /api/v0/log/level
```

```HTTP
POST /api/v0/log/level
```

--------------------------------

### Get Repository Stats

Source: https://docs.ipfs.tech/reference/kubo/rpc

Fetches statistics for the IPFS repository, including the number of objects and repository size. Supports options to report size only or format sizes in a human-readable way. The response contains repository path, version, and size statistics.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/stats/repo?size-only=<value>&human=<value>"
```

--------------------------------

### IPFS IPNS Record GET

Source: https://docs.ipfs.tech/concepts/dht

Details the process for retrieving the latest IPNS record for an IPNS key, including querying peers and updating records based on sequence numbers.

```text
1. Lookup K closest peers to X=SHA256(/ipns/H).
2. Ask each peer for K closest peers to X.
3. Ask each peer for the record corresponding to X.
4. If a record with a higher IPNS sequence number is received, update the existing one.
5. Continue until lookup terminates.
6. If any of the K closest peers to X did not have the newest IPNS record, send them the newest record.
```

--------------------------------

### Disable Arbitrary CID Fetching

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/dnslink-gateway

Prevents the IPFS gateway from fetching content for arbitrary CIDs, thus avoiding its use as a public gateway. This is configured via the IPFS config file.

```bash
ipfs config --json Gateway.NoFetch true
```

--------------------------------

### Contribute to libp2p Core Repositories (Go)

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the libp2p project by working on the 'libp2p/go-libp2p' repository, which is written in Go. This repository is a key component of the IPFS ecosystem.

```Go
libp2p/go-libp2p
```

--------------------------------

### Add a file to IPFS using a specific chunker

Source: https://docs.ipfs.tech/reference/kubo/cli

Adds a file to IPFS using a specified chunking strategy. Different chunkers (e.g., size-based, Buzhash, Rabin) result in different CIDs for the same file. The example uses a size-based chunker.

```bash
ipfs add --chunker=size-2048 ipfs-logo.svg
```

--------------------------------

### IPFS Cluster CLI Usage

Source: https://docs.ipfs.tech/install/server-infrastructure

This snippet demonstrates how to interact with IPFS Cluster using its command-line interface (CLI). It covers basic operations for managing pins and interacting with the cluster.

```bash
ipfs-cluster-ctl pin ls
ipfs-cluster-ctl pin add <cid>
ipfs-cluster-ctl pin rm <cid>
ipfs-cluster-ctl peer ls
```

--------------------------------

### Get IPFS Node ID Info

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves information about the IPFS node, including its addresses, agent version, ID, and public key. Supports looking up specific peers and customizing the peer ID encoding.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/id?arg=<peerid>&format=<value>&peerid-base=b58mh"
```

--------------------------------

### IPFS Files Chmod Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Details the experimental IPFS files chmod command, used to change optional POSIX mode permissions for a file or directory in MFS. It specifies the required arguments and provides an example of its usage.

```bash
WARNING:   EXPERIMENTAL, command may change in future releases

USAGE
  ipfs files chmod <mode> <path> - Change optional POSIX mode permissions

SYNOPSIS
  ipfs files chmod [--] <mode> <path>

ARGUMENTS

  <mode> - Mode to apply to node (numeric notation)
  <path> - Path to apply mode

DESCRIPTION

  The mode argument must be specified in Unix numeric notation.
  
      $ ipfs files chmod 0644 /foo
      $ ipfs files stat /foo
      ...
      Type: file
      Mode: -rw-r--r-- (0644)
      ...

```

--------------------------------

### IPFS API: Get CID Response Structure

Source: https://docs.ipfs.tech/reference/kubo/rpc

Describes the JSON response structure for CID-related operations, including CID string, error messages, and formatted output. This is typically returned by endpoints like /api/v0/cid/format.

```json
{
  "CidStr": "<string>",
  "ErrorMsg": "<string>",
  "Formatted": "<string>"
}
```

--------------------------------

### IPFS Files read: Read file content

Source: https://docs.ipfs.tech/reference/kubo/cli

Reads the content of a file from the IPFS MFS. It allows specifying a byte offset to start reading from and a maximum number of bytes to read. By default, it reads the entire file.

```bash
ipfs files read <path>
ipfs files read [--offset=<offset> | -o] [--count=<count> | -n] [--] <path>
```

--------------------------------

### List Directory Contents

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

Lists the files and directories within the current directory. This is useful for verifying that you are in the correct location before adding files.

```bash
ls

```

--------------------------------

### IPFS Kubo RPC API: DAG Get

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section describes the `/api/v0/dag/get` endpoint for the IPFS Kubo RPC API, used to retrieve a DAG object from the IPFS network. It requires a CID and optionally a path within the DAG.

```HTTP
GET /api/v0/dag/get
```

--------------------------------

### IPFS Node PeerID Example

Source: https://docs.ipfs.tech/concepts/privacy-and-encryption

Illustrates the format of a unique public identifier for an IPFS node, known as a PeerID. This identifier is a long string of characters used to uniquely address nodes within the IPFS network.

```plaintext
QmRGgYP1P5bjgapLaShMVhGMSwGN9SfYG3CM2TfhpJ3igE
```

--------------------------------

### Parsec DHT Lookup Performance Tool

Source: https://docs.ipfs.tech/concepts/measuring

Parsec is a tool for measuring DHT lookup performance, focusing on PUT and GET operations for the Amino DHT, and adaptable for other libp2p-kad-dht networks. It consists of a scheduler and a server.

```Go
package main

import (
	"fmt"
	"time"
)

// Simulate the Parsec scheduler component
func runScheduler() {
	fmt.Println("Parsec scheduler started.")
	// In a real scenario, this would configure and manage servers
	// and orchestrate lookup tasks (PUT/GET).
	fmt.Println("Configuring servers and tasks...")
	time.Sleep(2 * time.Second)
	fmt.Println("Scheduler: Initiating PUT operations...")
	// Simulate PUT operations
	time.Sleep(3 * time.Second)
	fmt.Println("Scheduler: Initiating GET operations...")
	// Simulate GET operations
	time.Sleep(3 * time.Second)
	fmt.Println("Scheduler finished tasks.")
}

// Simulate the Parsec server component
func runServer() {
	fmt.Println("Parsec server started.")
	// In a real scenario, this would handle DHT requests (PUT/GET)
	// and report performance metrics.
	fmt.Println("Server: Listening for DHT requests...")
	// Simulate handling requests
	time.Sleep(5 * time.Second)
	fmt.Println("Server: Finished processing requests.")
}

func main() {
	go runServer()      // Run server in a goroutine
	runScheduler()    // Run scheduler in the main goroutine

	// Allow server goroutine to finish
	time.Sleep(1 * time.Second)
	fmt.Println("Parsec simulation complete.")
}

```

--------------------------------

### IPFS CLI Commands Reference

Source: https://docs.ipfs.tech/reference/kubo/cli

This section lists and describes various commands available in the IPFS command-line interface (Kubo CLI). It covers functionalities for managing IPFS nodes, content, network interactions, and more.

```bash
ipfs init

```

```bash
ipfs add <file>

```

```bash
ipfs get <cid>

```

```bash
ipfs dag get <cid>

```

```bash
ipfs name publish <cid>

```

```bash
ipfs pin add <cid>

```

```bash
ipfs refs <cid>

```

```bash
ipfs config show

```

```bash
ipfs daemon

```

```bash
ipfs id

```

```bash
ipfs ls <cid>

```

```bash
ipfs object get <cid>

```

```bash
ipfs pubsub sub <topic>

```

```bash
ipfs repo gc

```

```bash
ipfs stats bw

```

```bash
ipfs swarm peers

```

```bash
ipfs version

```

--------------------------------

### Check CID Retrievability with IPFS Check

Source: https://docs.ipfs.tech/reference/diagnostic-tools

IPFS Check helps determine if a CID is retrievable from IPFS Mainnet, either from a specific peer or multiple providers. It provides error messages that can guide troubleshooting.

```HTML
<a href="https://ipfs.github.io/ipfs-check/">IPFS Check</a>
```

--------------------------------

### Create Storacha UCAN Delegation

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

Creates a UCAN (Universal Content Addressability Network) delegation proof, allowing uploads to a specific Storacha space. The proof is generated in base64 format.

```bash
w3 delegation create did:key:YOUR_KEY_DID -c space/blob/add -c space/index/add -c filecoin/offer -c upload/add --base64
```

--------------------------------

### Add File to Kubo and Transfer

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

This snippet demonstrates how to add a file to Kubo on one node ('A') and retrieve it on another node ('B'). It includes checking node status with `ipfs id` and performing the transfer using `ipfs add` and `ipfs get`.

```bash
# On A
ipfs add myfile.txt
> added bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku myfile.txt

# On B
ipfs get bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku
> Saving file(s) to bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku
> 13 B / 13 B [=====================================================] 100.00% 1s
```

--------------------------------

### JavaScript for Random Planet Facts

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/multipage-website

This JavaScript code is responsible for the interactive functionality of the 'Random Planet Facts' website. It defines an array of planet facts and selects one randomly to display on the page when the 'main' function is called.

```javascript
function main() {
        const facts = [
          'Mars is home to the tallest mountain in our solar system.',
          'Only 18 out of 40 missions to Mars have been successful.',
          'Pieces of Mars have fallen to Earth.',
          'One year on Mars is 687 Earth days.',
          'The temperature on Mars ranges from -153 to 20 °C.',
          'One year on Mercury is about 88 Earth days.',
          'The surface temperature of Mercury ranges from -173 to 427°C.',
          'Mercury was first discovered in 14th century by Assyrian astronomers.',
          'Your weight on Mercury would be 38% of your weight on Earth.',
          'A day on the surface of Mercury lasts 176 Earth days.',
          'The surface temperature of Venus is about 462 °C.',
          'It takes Venus 225 days to orbit the sun.',
          'Venus was first discovered by 17th century Babylonian astronomers.',
          'Venus is nearly as big as the Earth with a diameter of 12,104 km.',
          'The Earth\'s rotation is gradually slowing.',
          'There is only one natural satellite of the planet Earth, the moon.',
          'Earth is the only planet in our solar system not named after a god.',
          'The Earth is the densest planet in the solar system.',
          'A year on Jupiter lasts around 4333 earth days.',
          'The surface temperature of Jupiter is around -108°C.',
          'Jupiter was first discovered by 7th or 8th century Babylonian astronomers.',
          'Jupiter has 4 ring.',
          'A day on Jupiter lasts 9 hours and 55 minutes.',
          'Saturn was first discovered by 8th century Assyrians.',
          'Saturn takes 10756 days to orbit the Sun.',
          'Saturn can be seen with the naked eye.',
          'Saturn is the flattest planet.',
          'Saturn is made mostly of hydrogen.',
          'Four spacecraft have visited Saturn.',
          'Uranus was discovered by William Herschel in 1781.',
          'A year on Uranus takes 30687 earth days.',
          'Uranus turns on its axis once every 17 hours, 14 minutes.',
          'With minimum atmospheric temperature of -224°C Uranus is nearly coldest planet in the solar system.',
          'Only one spacecraft has flown by Uranus, the Voyager 2.',
          'Neptune was discovered in 1846 by Urbain Le Verrier and Johann Galle.',
          'Neptune has 14 moons.',
          'The average temperature of Neptune is about -201 °C.',
          'There is a 1:20 million scale model of the solar system in Sweden.',
          'The gap between the Earth and our moon is bigger than the diameters of all the planets combined.',
          'The first accurate calculation of the speed of light was using Jupiter\'s moons',
          'Jupiter\'s magnetic field is believed to be a result of rapidly spinning metallic hydrogen at the core, and is ~10x stronger than the Earth\'s.',
          'Venus spins backwards.',
          'Uranus spins sideways, relative to the ecliptic plane of the solar system.',
          'It is easier to reach Pluto or escape the solar system from Earth than being able to <i>land</i> on the Sun.'
        ]
        document.querySelector('#output_p').innerHTML =
          facts[Math.floor(Math.random() * facts.length)]
      }
```

--------------------------------

### Specifying Filenames During IPFS Downloads (Subdomain Style)

Source: https://docs.ipfs.tech/how-to/gateway-best-practices

Shows how to specify a filename for downloaded IPFS content when using subdomain gateway resolution by appending the `?filename={filename.ext}` parameter.

```URL
https://{CID}.ipfs.{gatewayURL}/{optional path to resource}?filename={filename.ext}
```

--------------------------------

### IPFS Root Node Structure Example

Source: https://docs.ipfs.tech/concepts/glossary

Illustrates how a root node in an IPLD graph aggregates multiple data chunks. This is how IPFS represents larger files by linking smaller blocks together, with the root node's CID being the identifier for the entire file.

```Diagram
      A
      |
-------------
|     |     |
B     C     D
```

--------------------------------

### IPFS Kubo RPC API: Block Get

Source: https://docs.ipfs.tech/reference/kubo/rpc

Describes the `/api/v0/block/get` endpoint for the IPFS Kubo RPC API, used to retrieve a specific block from the IPFS repository using its CID. This is a fundamental operation for accessing data on IPFS.

```HTTP
GET /api/v0/block/get
```

--------------------------------

### Check IPFS Directory Status (MFS)

Source: https://docs.ipfs.tech/concepts/file-systems

Explains how to check the status of a file or directory in IPFS using the MFS `stat` method. The method returns an object containing details like CID, size, type, and more. An example of the returned object structure is provided.

```javascript
await ipfs.files.stat('/example')
```

--------------------------------

### IPFS CLI Tool Commands

Source: https://docs.ipfs.tech/reference/kubo/cli

Outlines utility commands for managing IPFS configuration, checking version information, generating diagnostic reports, updating the IPFS software, listing commands, and managing logs.

```bash
ipfs config
ipfs version
ipfs diag
ipfs update
ipfs commands
ipfs log
```

--------------------------------

### IPFS Bitswap Overview

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides an overview of the 'ipfs bitswap' command and its available subcommands for interacting with the bitswap agent. It lists subcommands for managing ledgers, statistics, wantlists, and deprecated functions.

```bash
ipfs bitswap - Interact with the bitswap agent.

SUBCOMMANDS
  ipfs bitswap ledger <peer> - Show the current ledger for a peer.
  ipfs bitswap stat          - Show some diagnostic information on the bitswap
                               agent.
  ipfs bitswap wantlist      - Show blocks currently on the wantlist.

DEPRECATED SUBCOMMANDS
  ipfs bitswap reprovide - Deprecated command to announce to bitswap. Use 'ipfs
                           routing reprovide' instead.
```

--------------------------------

### Add File to IPFS and Get CID

Source: https://docs.ipfs.tech/concepts/content-addressing

Shows the process of adding a file to the IPFS network using the `ipfs add` command and the resulting CID (Content Identifier) that is returned. This CID represents the content of the file on IPFS.

```Shell
ipfs add ubuntu-20.04.1-desktop-amd64.iso
```

--------------------------------

### IPFS Config Profile: Announce Off

Source: https://docs.ipfs.tech/reference/kubo/cli

Disables the Provide and Reprovide systems, effectively stopping the announcement of data to the Amino DHT. This is useful for manual peering setups but can hinder DHT-based routing and retrieval if the node is the sole provider of data.

```bash
ipfs config profile apply announce-off
```

--------------------------------

### Check Kubo Daemon Status

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

If common commands like `ipfs get <cid>` return errors such as 'merkledag: not found', it indicates that the Kubo daemon is not running. This can be resolved by executing `ipfs daemon` in a separate terminal.

```bash
ipfs daemon
```

--------------------------------

### Get CID of files within an IPFS directory

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

When 'ipfs cat' fails on a directory CID, this command lists the CIDs of the files contained within that directory. You can then use 'ipfs cat' with the file's CID to view its content.

```bash
ipfs refs bafybeif2ewg3nqa33mjokpxii36jj2ywfqjpy3urdh7v6vqyfjoocvgy3a
```

--------------------------------

### Display IPFS Node PeerID

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Retrieves and displays the libp2p PeerID of the IPFS Kubo node. This PeerID is used by other nodes on the network to find and connect to your node.

```bash
ipfs id
```

--------------------------------

### Detect DNSLink URLs with IPFS Companion

Source: https://docs.ipfs.tech/install/ipfs-companion

IPFS Companion identifies DNSLink information within a website's DNS records and redirects HTTP requests to the local gateway. DNSLink links content and services via DNS, leveraging its distributed architecture. This feature allows for seamless access to DNSLink-enabled sites through the local gateway.

```HTTP
http://docs.ipfs.tech → http://localhost:8080/ipns/docs.ipfs.tech → http://docs.ipfs.tech.ipns.localhost:8080/
```

--------------------------------

### Add File to IPFS to Get CID

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

Adds a file to your IPFS node and outputs its Content Identifier (CID). This command is used here to retrieve the CID of a file if it's not readily known, even if the file is already added.

```bash
cd ~/Documents
ipfs add hello-ipfs.txt
```

--------------------------------

### IPFS Kubo RPC API: DAG Export

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the `/api/v0/dag/export` endpoint for the IPFS Kubo RPC API, which exports a DAG (Directed Acyclic Graph) starting from a given CID. This is useful for backing up or transferring IPFS data structures.

```HTTP
GET /api/v0/dag/export
```

--------------------------------

### WebTransport Connection Steps with Kubo

Source: https://docs.ipfs.tech/how-to/webtransport

This outlines the conceptual steps for establishing a WebTransport connection between a browser and a Kubo node. It involves an HTTP/3 connection upgrade and a specific CONNECT request.

```text
1. The browser establishes a HTTP/3 connection to the Kubo node.
2. It then opens a new stream.
3. An Extended CONNECT request and proposed a WebTransport Session ID are sent.

The server can accept the upgrade by sending a HTTP 200 OK response. Both endpoints can now open QUIC streams associated with this WebTransport session.
```

--------------------------------

### Get raw bytes of a CID v1 using JavaScript

Source: https://docs.ipfs.tech/concepts/content-addressing

This JavaScript code snippet shows how to retrieve the raw byte representation of an IPFS CID v1 using the `.bytes` property from the `multiformats` library.

```javascript
const cidV1Bytes = cidV1.bytes

```

--------------------------------

### Compare CID Hash with File Checksum

Source: https://docs.ipfs.tech/concepts/content-addressing

Illustrates the attempt to verify a file's integrity using the hash extracted from its IPFS CID. This example demonstrates that the CID's hash does not match the file's original SHA-256 checksum, highlighting the difference between IPFS CIDs and file hashes.

```Shell
echo "0E7071C59DF3B9454D1D18A15270AA36D54F89606A576DC621757AFD44AD1D2E *ubuntu-20.04.1-desktop-amd64.iso" | shasum -a 256 --check
```

--------------------------------

### Get IPFS Node ID Information

Source: https://docs.ipfs.tech/reference/kubo/cli

Retrieves and displays information about an IPFS node's identity. It can fetch information for a specified peer ID or the local node. Output formatting options are available to customize the displayed fields.

```bash
ipfs id [<peerid>]
ipfs id [--format=<format> | -f] [--peerid-base=<peerid-base>] [--] [<peerid>]
```

--------------------------------

### Go Minimal IPFS Replacement for P2P IPLD Apps

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A minimal IPFS replacement for P2P IPLD applications, written in Go. This library provides core IPFS functionality for decentralized applications.

```go
package main

import (
	"fmt"
	"github.com/peergos/ipfs-nucleus"
)

func main() {
	// Example usage (conceptual - starting IPFS nucleus)
	// nucleus, err := ipfs_nucleus.New() // Simplified example
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println("IPFS Nucleus started.")
	fmt.Println("ipfs-nucleus library used.")
}
```

--------------------------------

### Add File to IPFS Node

Source: https://docs.ipfs.tech/how-to/command-line-quick-start

Adds a local file (e.g., 'meow.txt') to the IPFS node. It returns a unique Content Identifier (CID) for the added file.

```bash
ipfs add meow.txt
```

--------------------------------

### HTML Structure for Random Planet Facts

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/single-page-website

This HTML code sets up a simple webpage to display random facts about planets. It includes basic styling and a JavaScript function to select and display a fact when the page loads. The script relies on a predefined array of facts.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Random Planet Facts</title>
    <meta
      name="description"
      content="Get a random fact about a planet in our solar system."
    />
    <meta name="author" content="The IPFS Docs team." />
    <style>
      body {
        margin: 15px auto;
        max-width: 650px;
        line-height: 1.2;
        font-family: sans-serif;
        font-size: 2em;
        color: #fff;
        background: #444;
      }
    </style>
  </head>
  <body onload="main()">
    <h1>Random Planet Facts</h1>
    <p id="output_p"></p>
    <script>
      function main() {
        const facts = [
          'Mars is home to the tallest mountain in our solar system.',
          'Only 18 out of 40 missions to Mars have been successful.',
          'Pieces of Mars have fallen to Earth.',
          'One year on Mars is 687 Earth days.',
          'The temperature on Mars ranges from -153 to 20 °C.',
          'One year on Mercury is about 88 Earth days.',
          'The surface temperature of Mercury ranges from -173 to 427°C.',
          'Mercury was first discovered in 14th century by Assyrian astronomers.',
          'Your weight on Mercury would be 38% of your weight on Earth.',
          'A day on the surface of Mercury lasts 176 Earth days.',
          'The surface temperature of Venus is about 462 °C.',
          'It takes Venus 225 days to orbit the sun.',
          'Venus was first discovered by 17th century Babylonian astronomers.',
          'Venus is nearly as big as the Earth with a diameter of 12,104 km.',
          "The Earth's rotation is gradually slowing.",
          'There is only one natural satellite of the planet Earth, the moon.',
          'Earth is the only planet in our solar system not named after a god.',
          'The Earth is the densest planet in the solar system.',
          'A year on Jupiter lasts around 4333 earth days.',
          'The surface temperature of Jupiter is around -108°C.',
          'Jupiter was first discovered by 7th or 8th century Babylonian astronomers.',
          'Jupiter has 4 rings.',
          'A day on Jupiter lasts 9 hours and 55 minutes.',
          'Saturn was first discovered by 8th century Assyrians.',
          'Saturn takes 10756 days to orbit the Sun.',
          'Saturn can be seen with the naked eye.',
          'Saturn is the flattest planet.',
          'Saturn is made mostly of hydrogen.',
          'Four spacecraft have visited Saturn.',
          'Uranus was discovered by William Herschel in 1781.',
          'A year on Uranus takes 30687 earth days.',
          'Uranus turns on its axis once every 17 hours, 14 minutes.',
          'With minimum atmospheric temperature of -224°C Uranus is nearly coldest planet in the solar system.',
          'Only one spacecraft has flown by Uranus, the Voyager 2.',
          'Neptune was discovered in 1846 by Urbain Le Verrier and Johann Galle.',
          'Neptune has 14 moons.',
          'The average temperature of Neptune is about -201 °C.',
          'There is a 1:20 million scale model of the solar system in Sweden.',
          'The gap between the Earth and our moon is bigger than the diameters of all the planets combined.',
          "The first accurate calculation of the speed of light was using Jupiter's moons",
          "Jupiter's magnetic field is believed to be a result of rapidly spinning metallic hydrogen at the core, and is ~10x stronger than the Earth's.",
          'Venus spins backwards.',
          'Uranus spins sideways, relative to the ecliptic plane of the solar system.',
          'It is easier to reach Pluto or escape the solar system from Earth than being able to <i>land</i> on the Sun.'
        ]
        document.querySelector('#output_p').innerHTML =
          facts[Math.floor(Math.random() * facts.length)]
      }
    </script>
  </body>
</html>

```

--------------------------------

### IPFS Log Management

Source: https://docs.ipfs.tech/reference/kubo/cli

Interacts with the daemon's log output, allowing users to change or get logging levels, list logging subsystems, or read log messages. Environment variables GOLOG_LOG_LEVEL and GOLOG_LOG_FMT can control verbosity and formatting.

```bash
ipfs logipfs log level [<subsystem>] [<level>]ipfs log lsipfs log tail
```

--------------------------------

### Commit and Push Changes to IPFS Docs

Source: https://docs.ipfs.tech/community/contribute/contribution-tutorial

These Git commands stage all changes, commit them with a descriptive message including the issue number, and push them to your forked repository on GitHub.

```bash
git add .
git commit -m "Fixed a broken URL, issue #123."
git push
```

--------------------------------

### Lassie (Go)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Lassie is a minimal universal retrieval client library for both IPFS and Filecoin, simplifying data retrieval across both systems.

```go
Lassie: A minimal universal retrieval client library for IPFS and Filecoin.
```

--------------------------------

### IPFS Log Subsystem Listing

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists all available logging subsystems for a running IPFS daemon. This command is a utility for understanding the different components that can be configured for logging.

```bash
ipfs log ls

# Description: Lists the logging subsystems of a running daemon.
```

--------------------------------

### IPFS Glossary: CID v0 Definition

Source: https://docs.ipfs.tech/concepts/glossary

Defines CID v0 as Version 0 of the IPFS content identifier, characterized by its 46-character length starting with 'Qm' and using a base 58-encoded multihash, offering simplicity but less flexibility than newer CIDs.

```English
Version 0 (v0) of the IPFS content identifier. This CID is 46 characters in length, starting with "Qm". Uses a base 58-encoded multihash, very simple but much less flexible than newer CIDs. More about CID v0
```

--------------------------------

### Rotate IPFS Key in Docker

Source: https://docs.ipfs.tech/install/run-ipfs-inside-docker

Performs key rotation for an IPFS Kubo repository mounted via a Docker volume. It involves stopping the existing container, running a temporary container for rotation, and then restarting the original container with the new key.

```bash
# given container named 'ipfs-test' that persists repo at /path/to/persisted/.ipfs
docker run -d --name ipfs-test -v /path/to/persisted/.ipfs:/data/ipfs ipfs/kubo:v0.37.0
docker stop ipfs-test  

# key rotation works like this (old key saved under 'old-self')
docker run --rm -it -v /path/to/persisted/.ipfs:/data/ipfs ipfs/kubo:v0.37.0 key rotate -o old-self -t ed25519
docker start ipfs-test # will start with the new key
```

--------------------------------

### Merkle DAG Example - Linked List

Source: https://docs.ipfs.tech/concepts/merkle-dag

Illustrates a simple linked list structure represented as a Merkle DAG, where each node's identifier (CID) is derived from the hash of its content and its children's CIDs. This demonstrates the self-verified nature of Merkle DAGs.

```plaintext
A=Hash(B)→B=Hash(C)→C=Hash(∅)
```

--------------------------------

### IPFS Swarm Resources Summary

Source: https://docs.ipfs.tech/reference/kubo/cli

Retrieves a summary of resources managed by libp2p, including limits and current usage. This is an experimental command and its output format may change.

```bash
ipfs swarm resources
```

--------------------------------

### Export IPFS Objects to CAR Files

Source: https://docs.ipfs.tech/how-to/move-ipfs-installation/move-ipfs-installation

This bash script exports all local IPFS objects to individual CAR files within a specified directory. It's useful for consolidating data from different repositories or for backup purposes. Ensure the IPFS daemon is running.

```Shell
mkdir -p car_export
cd car_export
cids=$(ipfs refs local)
for cid in $cids; do
  echo "exporting $cid"
  ipfs dag export $cid > $cid.car
done
```

--------------------------------

### Kubo Go Library Reference

Source: https://docs.ipfs.tech/reference

Reference for the Go API of Kubo, including the Go CoreAPI, embedded client, and a client for interacting with Kubo over its HTTP RPC API. This is for Go developers integrating IPFS.

```go
// Example: Using Kubo CoreAPI in Go
package main

import (
	"context"
	"fmt"
	"github.com/ipfs/go-ipfs-api"
)

func main() {
	sh := ipfs.NewShell("localhost:5001")
	cid, err := sh.AddDir("./my-directory")
	if err != nil {
		panic(err)
	}
	fmt.Printf("Added directory with CID: %s\n", cid)
}
```

--------------------------------

### Go CLI Tool for Estuary Deltas

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A Go CLI tool that provides a Git-like workflow for uploading deltas to Estuary. This facilitates efficient data synchronization and versioning.

```go
package main

import (
	"fmt"
	"github.com/application-research/barge/cmd"
)

func main() {
	// Example usage (conceptual - CLI commands)
	// cmd.Execute()
	fmt.Println("Barge CLI tool executed.")
}
```

--------------------------------

### Convert CID v1 to hex using JavaScript

Source: https://docs.ipfs.tech/concepts/content-addressing

This JavaScript code snippet demonstrates how to get the hexadecimal representation of an IPFS CID v1's raw bytes using the `toString(base16)` method from the `multiformats` library.

```javascript
const cidV1StringBase256 = cidV1.toString(base16);

```

--------------------------------

### Clone Git Repository for IPFS Hosting

Source: https://docs.ipfs.tech/how-to/host-git-repo

This command clones a Git repository in a bare format, which is suitable for serving as a distributed resource on IPFS. A bare clone does not have a working tree, making it ideal for server-side operations.

```bash
git clone --mirror git@myhost.io/myrepo
```

--------------------------------

### Manually Trigger IPFS Kubo Garbage Collection

Source: https://docs.ipfs.tech/how-to/kubo-garbage-collection

This command manually initiates the garbage collection process for the IPFS Kubo repository. It removes unreferenced data blocks, freeing up storage space. The output shows which blocks have been removed.

```bash
ipfs repo gc

> removed QmPZhyTu8D7NqR5NvgkgNYsSYD4CNjnyuFejB8i23itJvA
> removed QmSYQFVAZgEnpa6NxiW5agyj3XU9VR4CbERShXiLhuPPPE
> removed QmS6SJXApoi59hqD8Naktgakc6UNHK1XDhqhtMg9sBhY8g


```

--------------------------------

### Importing Content to IPFS with ipfs-http-client

Source: https://docs.ipfs.tech/case-studies/fleek

This snippet demonstrates how Fleek's site builder component uses the `ipfs-http-client` to import user-deployed site content onto the IPFS network. This process is fundamental to how Fleek handles content on the decentralized web.

```javascript
import { create } from 'ipfs-http-client';

// Connect to the IPFS daemon API
const ipfs = create({
  url: '/ip4/127.0.0.1/tcp/5001',
});

async function importContent(content) {
  try {
    // Add content to IPFS
    const result = await ipfs.add(content);
    console.log('Content added to IPFS with CID:', result.cid.toString());
    return result.cid.toString();
  } catch (error) {
    console.error('Error importing content to IPFS:', error);
    throw error;
  }
}
```

--------------------------------

### Go IPFS Download Tool (ipget)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

ipget is a minimal, wget-inspired tool for downloading files from IPFS nodes over bitswap, implemented in Go.

```go
package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func main() {
	if len(os.Args) < 3 {
		fmt.Fprintf(os.Stderr, "Usage: ipget <ipfs-node-address> <cid>\n")
		os.Exit(1)
	}

	ipfsNode := os.Args[1]
	cid := os.Args[2]

	fmt.Printf("ipget: Downloading %s from %s\n", cid, ipfsNode)
	// In a real implementation, you would use bitswap to fetch the content.
	// Example: Fetching content and saving it to a file.
	// content, err := fetchFromIpfs(ipfsNode, cid)
	// if err != nil {
	// 	fmt.Fprintf(os.Stderr, "Error: %v\n", err)
	// 	os.Exit(1)
	// }
	// err = saveToFile(content, filepath.Base(cid))
	// if err != nil {
	// 	fmt.Fprintf(os.Stderr, "Error saving file: %v\n", err)
	// 	os.Exit(1)
	// }
	fmt.Println("Download complete (simulated).")
}
```

--------------------------------

### Announce IPFS Provisioning

Source: https://docs.ipfs.tech/reference/kubo/rpc

Announces to the IPFS network that specific values are being provided. This command can optionally be recursive and verbose.

```json
{
  "Extra": "<string>",
  "ID": "<peer-id>",
  "Responses": [
    {
      "Addrs": [
        "<multiaddr-string>"
      ],
      "ID": "peer-id"
    }
  ],
  "Type": "<int>"
}
```

--------------------------------

### Untitled

Source: https://docs.ipfs.tech/reference/kubo/rpc

No description

--------------------------------

### IPFS Bootstrap List Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Displays the current list of bootstrap peers. It can optionally expand 'auto' placeholders to show resolved peers.

```bash
ipfs bootstrap list [--expand-auto]

Options:
  --expand-auto  bool - Expand 'auto' placeholders from AutoConf service.
```

--------------------------------

### Upload Files and Directories with IPFS add Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

Demonstrates how to upload multiple files and directories to IPFS using the 'add' command with multipart/form-data. It explains the structure of multipart requests for files and directories, including special content types and headers.

```bash
curl -sLk -XPOST -F "file=@file1.txt;filename=path1/file1.txt" -F \file=@file2.txt;filename=path2/file2.txt" "http://127.0.0.1:5001/api/v0/add?recursive=true&wrap-with-directory=true"
```

--------------------------------

### List Repository

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists all local references within the IPFS repository. This endpoint does not require any arguments.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/repo/ls"
```

--------------------------------

### Rust CID Implementation for npm

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Debian packaging of the Rust CID implementation for npm. This provides a Rust-based CID solution accessible through npm.

```rust
use rust_cid_npm::Cid;

fn main() {
    // Example usage (conceptual - requires actual CID creation)
    // let cid = Cid::new_v1(0x010701, ...);
    // println!("{}", cid);
    println!("Rust CID npm package used.");
}
```

--------------------------------

### Manage IPFS Bootstrap Peers

Source: https://docs.ipfs.tech/reference/kubo/rpc

Manages the list of bootstrap peers for IPFS. This includes showing, adding, listing, and removing peers. Adding peers requires a multiaddr/peerID format.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/bootstrap"
```

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/bootstrap/add?arg=<peer>"
```

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/bootstrap/list?expand-auto=<value>"
```

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/bootstrap/rm?arg=<peer>&all=<value>"
```

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/bootstrap/rm/all"
```

--------------------------------

### Configure Next.js for IPFS Deployment

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/static-site-generators

Configure your Next.js project's `next.config.js` for static site generation (SSG) and IPFS gateway compatibility. This involves setting `output: 'export'` and `trailingSlash: true`.

```javascript
module.exports = {
  output: 'export', // Enables static exports
  trailingSlash: true // Required for IPFS gateway compatibility
}
```

--------------------------------

### IPFS Video Overview: Understanding IPFS Data Handling

Source: https://docs.ipfs.tech/concepts

This snippet links to a video explaining how IPFS handles files, presented at IPFS Camp 2019. It's a visual resource for understanding IPFS data management.

```URL
https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7entrsjr32lvxc3clh4rshvye6fyluczh44oee/wiki-ipfs-camp-2019/ipfs-camp-2019-talks/understanding-how-ipfs-deals-with-files.webm
```

--------------------------------

### Configure Kubo Node Deployment

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

Adds configuration to the `ipfs-deploy-action` to deploy content to a Kubo node. Requires `KUBO_API_URL` and `KUBO_API_AUTH` GitHub secrets.

```yaml
- name: Deploy to IPFS
  uses: ipfs/ipfs-deploy-action@v1
  with:
    # ... other inputs ...
    kubo-api-url: ${{ secrets.KUBO_API_URL }}
    kubo-api-auth: ${{ secrets.KUBO_API_AUTH }}
```

--------------------------------

### IPFS Stats Command Overview

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides a set of commands to view statistics for an IPFS node, including bitswap, bandwidth, DHT, and repository statistics.

```bash
ipfs stats

DESCRIPTION

  'ipfs stats' is a set of commands to help look at statistics
  for your IPFS node.

SUBCOMMANDS
  ipfs stats bitswap        - Show some diagnostic information on the bitswap
                              agent.
  ipfs stats bw             - Print IPFS bandwidth information.
  ipfs stats dht [<dht>]... - Returns statistics about the node's DHT(s).
  ipfs stats repo           - Get stats for the currently used repo.

  For more information about each command, use:
  'ipfs stats <subcmd> --help'

DEPRECATED SUBCOMMANDS
  ipfs stats provide   - Deprecated command, use 'ipfs provide stat' instead.
  ipfs stats reprovide - Deprecated command, use 'ipfs provide stat' instead.
```

--------------------------------

### Add file and list blocks (IPFS CLI)

Source: https://docs.ipfs.tech/how-to/work-with-blocks

Demonstrates how to add a file to IPFS, which creates a Merkle DAG, and then list the immediate sub-blocks of the resulting DAG using `ipfs add` and `ipfs ls`. This is useful for understanding how large files are broken down into smaller blocks.

```bash
# Ensure this file is larger than 256k.
ipfs add alargefile
ipfs ls thathash
```

--------------------------------

### Download Docker Compose Configuration

Source: https://docs.ipfs.tech/install/server-infrastructure

Downloads the `docker-compose.yml` file, which defines the services and configuration for running the IPFS Cluster using Docker Compose.

```shell
wget https://raw.githubusercontent.com/ipfs/ipfs-cluster/v1.1.4/docker-compose.yml
```

--------------------------------

### IPFS Kubo Datastore Plugin (go-ds-leveldb)

Source: https://docs.ipfs.tech/case-studies/likecoin

This snippet describes the base datastore plugin used by LikeCoin, which implements the go-datastore interface using a LevelDB backend. It highlights the potential for modification to handle specific data types or protocols.

```Go
package main

import (
	"github.com/ipfs/go-datastore"
	"github.com/ipfs/go-ds-leveldb"
)

func main() {
	// Example of initializing go-ds-leveldb
	// ds, err := leveldb.New("path/to/leveldb", nil)
	// if err != nil {
	// 	panic(err)
	// }
	// defer ds.Close()

	// The description mentions 'get', 'getSize', and 'has' functions
	// which would be implemented in a custom version.
	// var _ datastore.Datastore = ds
}
```

--------------------------------

### IPFS Pub/Sub Overview

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides an overview of the IPFS Pub/Sub system, an experimental publish-subscribe messaging service on IPFS. It outlines the basic functionality of publishing and subscribing to topics. This feature is deprecated and requires specific daemon configuration.

```bash
ipfs pubsub
```

--------------------------------

### Removed DHT Provide Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/dht/provide command has been removed. Users should now use 'ipfs routing' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/dht/provide"
```

--------------------------------

### IPFS API: Apply Profile to Configuration

Source: https://docs.ipfs.tech/reference/kubo/rpc

Explains the IPFS API endpoint /api/v0/config/profile/apply for applying configuration profiles. It details the required 'arg' (profile name) and the optional 'dry-run' argument.

```json
{
  "NewCfg": {
    "<string>": "<object>"
  },
  "OldCfg": {
    "<string>": "<object>"
  }
}
```

--------------------------------

### IPFS API: Listen for P2P Connections

Source: https://docs.ipfs.tech/reference/kubo/rpc

Creates a libp2p service to listen for connections. Requires protocol name and target endpoint. Can optionally allow custom protocols and report peer IDs.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/p2p/listen?arg=<protocol>&arg=<target-address>&allow-custom-protocol=<value>&report-peer-id=<value>"
```

--------------------------------

### Add Git Repository to IPFS

Source: https://docs.ipfs.tech/how-to/host-git-repo

This command adds the prepared Git repository to the IPFS network. The `-r` flag ensures that the entire directory structure and its contents are added recursively, generating a unique IPFS hash for the repository.

```bash
ipfs add -r .
```

--------------------------------

### Download File using IPFS CID

Source: https://docs.ipfs.tech/how-to/desktop-app

This snippet demonstrates how to download a file using its IPFS Content Identifier (CID). It involves pasting the CID into the IPFS Desktop application to retrieve and save the file.

```text
bafkreig6g5k5tu5k6vgwvwstzn6lzppjtoxzdzczb4fthrcfngetoz4klm
```

--------------------------------

### IPFS Swarm Resources (Experimental)

Source: https://docs.ipfs.tech/reference/kubo/cli

Retrieves a summary of all resources managed by the libp2p Resource Manager within the IPFS swarm. This is an experimental feature.

```bash
ipfs swarm resources
```

--------------------------------

### Access Snapshot Directory

Source: https://docs.ipfs.tech/how-to/take-snapshot

This command allows you to navigate into a mounted IPFS snapshot directory using its hash, enabling direct access to the files as they were when snapshotted.

```bash
cd /ipfs/$hash/
```

```bash
ls
```

--------------------------------

### IPFS Kubo RPC API: Config Profile Apply

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/config/profile/apply` endpoint of the IPFS Kubo RPC API, used to apply predefined configuration profiles to the IPFS node. This simplifies setting up different node behaviors.

```HTTP
POST /api/v0/config/profile/apply
```

--------------------------------

### IPFS vs. Hypercore Comparison

Source: https://docs.ipfs.tech/concepts/comparisons

Compares IPFS with Hypercore, a decentralized data-sharing tool. It highlights Hypercore's use of a DHT for storage and its medium similarity to IPFS, focusing on enabling data sharing and collaboration.

```Markdown
technology | storage mechanism | data model | networking stack | identifier | address composition | links | use cases | similarity to IPFS | hashing algorithm  
---|---|---|---|---|---|---|---|---|---
hypercore(opens new window) | decentralized data-sharing | merkle DAG | UDP | dat key | dat key | dat://{key} | decentralized data sharing | medium | SHA-256  
```

--------------------------------

### Kademlia Algorithm Parameters

Source: https://docs.ipfs.tech/concepts/dht

Explains the core system parameters that define the Kademlia algorithm for building a DHT. It details the address space, the metric used for ordering peers, and the projection method for determining record storage locations.

```Markdown
1. An _address space_ as a way that all of the network peers can be uniquely identified. In IPFS, this is all the numbers from `0` to `2^256-1`.
2. A _metric_ to order the peers in the address space and therefore visualize all the peers along a line ordered from smallest to largest. IPFS takes `SHA256(PeerID)` and interprets it as an integer between `0` and `2^256-1`.
3. A _projection_ that will take a `record key` and calculate a position in the address space where the peer or peers most ideally suited to store the record should be near. IPFS uses `SHA256(Record Key)`.
```

--------------------------------

### IPFS Bootstrap Add Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Adds one or more peers to the IPFS bootstrap list. It supports adding default peers using 'default' or 'auto' keywords.

```bash
ipfs bootstrap add [<peer>]...
ipfs bootstrap add [--] [<peer>...]

Arguments:
  [<peer>]... - A peer to add to the bootstrap list (in the format
                '<multiaddr>/<peerID>')

Note:
  The special values 'default' and 'auto' can be used to add the default
  bootstrap peers. Both are equivalent and will add the 'auto' placeholder to
  the bootstrap list, which gets resolved using the AutoConf system.
```

--------------------------------

### IPFS p2p ls (Experimental)

Source: https://docs.ipfs.tech/reference/kubo/cli

The experimental 'ipfs p2p ls' command lists active p2p listeners. It provides an option to display table headers for better readability.

```bash
ipfs p2p ls [--headers | -v]
```

--------------------------------

### IPFS Kademlia Lookup Algorithm

Source: https://docs.ipfs.tech/concepts/dht

Details the steps involved in finding the K closest peers to a target X using the Kademlia algorithm, including queue management and termination conditions.

```text
1. Load K closest peers to X into query-queue.
2. Query closest peer for K closest peers to X (up to 10 concurrent).
3. Add results to queue upon completion.
4. Query next closest peer.
5. Terminate when closest 3 known peers to X are queried successfully.
6. Return K closest peers that did not fail.
```

--------------------------------

### IPFS Kubo RPC API: Bootstrap List

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/bootstrap/list` endpoint of the IPFS Kubo RPC API, which retrieves the current list of bootstrap peers. This helps in understanding the node's network configuration.

```HTTP
GET /api/v0/bootstrap/list
```

--------------------------------

### Go IPFS and IPLD Blockstore for Filecoin

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

An IPFS and IPLD blockstore designed for seamless integration with Filecoin. This Go library provides efficient storage and retrieval of IPFS data within the Filecoin ecosystem.

```go
package main

import (
	"fmt"
	"github.com/lotus-web3/ribs"
)

func main() {
	// Example usage (conceptual - requires setup)
	// bs := ribs.NewBlockstore(...)
	// fmt.Println(bs)
	fmt.Println("RIBS library imported.")
}
```

--------------------------------

### IPFS Filestore Subcommands

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides an interface to interact with IPFS filestore objects. This includes listing objects, verifying their integrity, and identifying blocks that are duplicated in both the filestore and standard block storage.

```bash
ipfs filestore

# Subcommands:
# ipfs filestore dups              - List blocks that are both in the filestore and standard block storage.
# ipfs filestore ls [<obj>]...     - List objects in filestore.
# ipfs filestore verify [<obj>]... - Verify objects in filestore.
```

--------------------------------

### List IPFS DAG sub-blocks (IPFS CLI)

Source: https://docs.ipfs.tech/how-to/work-with-blocks

Shows the output format when listing the immediate sub-blocks of an IPFS DAG using `ipfs ls`. The output includes the hash of each sub-block and its size.

```bash
ipfs@earth ~> ipfs ls qms2hjwx8qejwm4nmwu7ze6ndam2sfums3x6idwz5myzbn
> qmv8ndh7ageh9b24zngaextmuhj7aiuw3scc8hkczvjkww 7866189
> qmuvjja4s4cgyqyppozttssquvgcv2n2v8mae3gnkrxmol 7866189
> qmrgjmlhlddhvxuieveuuwkeci4ygx8z7ujunikzpfzjuk 7866189
> qmrolalcquyo5vu5v8bvqmgjcpzow16wukq3s3vrll2tdk 7866189
> qmwk51jygpchgwr3srdnmhyerheqd22qw3vvyamb3emhuw 5244129
```

--------------------------------

### IPFS Config Profile: BadgerDS (Legacy)

Source: https://docs.ipfs.tech/reference/kubo/cli

Configures the node to use the legacy badgerv1 datastore. This profile is intended for existing users to migrate away from the unsupported version. It has known bugs, memory usage considerations, and potential performance issues with large datasets.

```bash
ipfs init --profile badgerds
```

--------------------------------

### Rust IPVM Core Implementation and Runtime

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

The core implementation and runtime of IPVM (InterPlanetary Virtual Machine) in Rust. This library provides the foundational components for executing IPVM smart contracts.

```rust
use homestar;

fn main() {
    // Example usage (conceptual - running IPVM)
    // let result = homestar::run_wasm(...);
    // println!("{:?}", result);
    println!("Homestar library used.");
}
```

--------------------------------

### IPFS Video Overview: Data Lifecycle in DWeb

Source: https://docs.ipfs.tech/concepts

This snippet links to a video discussing the lifecycle of data within the Decentralized Web (DWeb), as presented at IPFS Camp 2019. It provides insights into data management in a decentralized context.

```URL
https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7entrsjr32lvxc3clh4rshvye6fyluczh44oee/wiki-ipfs-camp-2019/ipfs-camp-2019-talks/the-lifecycle-of-data-in-the-dweb.webm
```

--------------------------------

### Troubleshoot IPFS Retrieval with Kubo CLI

Source: https://docs.ipfs.tech/how-to/troubleshooting

This snippet demonstrates how to use the Kubo CLI for troubleshooting IPFS retrieval from the terminal. It helps diagnose issues related to content routing and network connectivity by interacting directly with the IPFS network.

```bash
ipfs pin ls
ipfs refs <cid>
ipfs block get <cid>
```

--------------------------------

### Unzip IPFS Cluster Control Package

Source: https://docs.ipfs.tech/install/server-infrastructure

Extracts the contents of the downloaded `ipfs-cluster-ctl` tarball. This makes the `ipfs-cluster-ctl` executable available.

```shell
tar xvzf ipfs-cluster-ctl_v1.1.4_linux-amd64.tar.gz
```

--------------------------------

### IPFS Repo Migrate Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Applies repository migrations to bring the IPFS repository to a specific version. Allows specifying a target version and optionally downgrading, with warnings about potential data loss.

```bash
ipfs repo migrate [--to=<to>] [--allow-downgrade]

Options:
  --to int               Target repository version. Default: 17.
  --allow-downgrade bool - Allow downgrading to a lower repo version.
```

--------------------------------

### Save Directory with IPFS

Source: https://docs.ipfs.tech/how-to/take-snapshot

This command adds a directory recursively to IPFS, creating a snapshot. It outputs a hash that can be used to access the files later.

```bash
ipfs add -r ~/code/myproject
```

--------------------------------

### Kubo CLI Reference

Source: https://docs.ipfs.tech/reference

Reference for Kubo's command-line interface (CLI) for users working in the terminal. This provides direct access to IPFS functionalities via commands.

```bash
# Example: Add a file to IPFS using Kubo CLI
ipfs add <file_path>

# Example: Pin a file to IPFS using Kubo CLI
ipfs pin add <ipfs_hash>

# Example: Serve a file via HTTP Gateway using Kubo CLI
ipfs daemon
```

--------------------------------

### Create Storacha Signing Key

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

Generates a new signing key for Storacha, outputting the DID and the key itself in JSON format. This key is used for authentication and authorization.

```bash
$ w3 key create --json
{
  "did": "did:key:YOUR_KEY_DID",
  "key": "STORACHA_KEY"
}
```

--------------------------------

### Go IPFS Implementation (Linux2ipfs)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Linux2ipfs is a small, performance-oriented Go implementation for fast pinning service uploads.

```go
package main

import "fmt"

func main() {
	// Linux2ipfs is designed for fast pinning service uploads.
	fmt.Println("Linux2ipfs: Performance-oriented IPFS implementation for pinning.")
	// This would involve logic for interacting with IPFS pinning services.
}
```

--------------------------------

### Create Storacha Space

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

Creates a new deployment space on Storacha with a specified name. This space will be used to organize and manage uploaded content.

```bash
w3 space create my-app-space
```

--------------------------------

### Fetch IPFS Swarm Peers via CLI

Source: https://docs.ipfs.tech/reference/kubo/cli

This snippet demonstrates how to retrieve a list of connected peers in the IPFS swarm using the Kubo command-line interface. It shows the expected output format.

```bash
> ipfs swarm peers
/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
/ip4/104.236.151.122/tcp/4001/p2p/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx
/ip4/104.236.176.52/tcp/4001/p2p/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z
```

--------------------------------

### Show IPFS Configuration

Source: https://docs.ipfs.tech/reference/kubo/cli

Outputs the current IPFS configuration file contents. For security reasons, sensitive information such as private keys and remote service details are omitted. For a complete backup, the actual config file should be copied directly from the IPFS repository.

```bash
ipfs config show
```

--------------------------------

### IPFS p2p forward (Experimental)

Source: https://docs.ipfs.tech/reference/kubo/cli

The experimental 'ipfs p2p forward' command forwards connections to a libp2p service. It takes a protocol name, a listen address, and a target address as arguments. An option is available to allow custom protocols without the '/x/' prefix.

```bash
ipfs p2p forward [--allow-custom-protocol] [--] <protocol> <listen-address> <target-address>
```

--------------------------------

### Generate IPFS Debug Profile (Go)

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Use the 'ipfs diag profile' command to gather profiling information for IPFS, which can be bundled into a zip file for bug reporting or manual investigation.

```go
ipfs diag profile
```

--------------------------------

### Verify CAR with ipfs-car CLI

Source: https://docs.ipfs.tech/reference/http/gateway

Demonstrates how to verify and unpack a CAR file downloaded from an IPFS gateway using the `ipfs-car` Node.js package. This allows clients to verify content without running a full IPFS node.

```bash
$ npm i -g ipfs-car
$ curl "https://ipfs.io/ipfs/bafybeiakou6e7hnx4ms2yangplzl6viapsoyo6phlee6bwrg4j2xt37m3q?format=car" -L | ipfs-car
$ ls ./bafybeiakou6e7hnx4ms2yangplzl6viapsoyo6phlee6bwrg4j2xt37m3q/

```

--------------------------------

### List IPFS Logging Subsystems

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves a list of all available logging subsystems within the IPFS system. This endpoint does not require any arguments.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/log/ls"
```

--------------------------------

### Download IPFS Objects

Source: https://docs.ipfs.tech/reference/kubo/cli

Downloads IPFS objects to the local filesystem. Supports specifying an output path, archiving the output as a TAR file, and compressing the output with GZIP. Progress streaming is also available.

```bash
ipfs get <ipfs-path> -o=<output>
ipfs get [--output=<output> | -o] [--archive | -a] [--compress | -C] [--compression-level=<compression-level> | -l] [--progress=false] [--] <ipfs-path>
```

--------------------------------

### IPFS Version Information

Source: https://docs.ipfs.tech/reference/kubo/cli

Displays IPFS version details, including the version number, commit hash, and repository version. Options allow for displaying specific information or all available details.

```bash
ipfs version [--number | -n] [--commit] [--repo] [--all]
```

--------------------------------

### IPFS Key List

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists all local keypairs, with an option to display extra information about the keys and specify the IPNS base encoding.

```bash
ipfs key list -l --ipns-base=<ipns-base>
```

--------------------------------

### IPFS CLI Data Structure Commands

Source: https://docs.ipfs.tech/reference/kubo/cli

Details commands for managing IPFS data structures, including interacting with IPLD DAG nodes, the IPFS filesystem, and raw blocks in the datastore.

```bash
ipfs dag
ipfs files
ipfs block
```

--------------------------------

### Kubo, Boost, Boxo, IPFS Cluster, Rainbow, Someguy (Go)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Kubo is a popular, all-in-one IPFS daemon with an extensive HTTP RPC API. Boost is a daemon for transferring IPFS data into and out of a Filecoin storage provider. Boxo is a component library for building IPFS applications in Go. IPFS Cluster provides orchestration for multiple Kubo nodes. Rainbow is a specialized IPFS HTTP gateway. Someguy is a Delegated Routing V1 server and client.

```go
Kubo: Popular, all-in-one IPFS daemon with an extensive HTTP RPC API.
```

```go
Boost: Daemon to get IPFS data in and out of a Filecoin storage provider.
```

```go
Boxo (GO SDK): A component library for building IPFS applications and implementations in Go.
```

```go
IPFS Cluster: Orchestration for multiple Kubo nodes via CRDT / Raft consensus
```

```go
Rainbow: A specialized IPFS HTTP gateway implementation.
```

```go
Someguy: A Delegated Routing V1 server and client for all your HTTP/IPFS routing needs.
```

--------------------------------

### IPFS Kubo RPC API: Key List

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/key/list` endpoint of the IPFS Kubo RPC API, which lists all available key pairs in the IPFS keystore. This helps manage identities associated with the node.

```HTTP
GET /api/v0/key/list
```

--------------------------------

### Kubo RPC API v0 Reference

Source: https://docs.ipfs.tech/reference

Reference for Kubo's HTTP RPC API v0, allowing control of an IPFS node over HTTP using commands similar to the CLI. This enables programmatic interaction with the IPFS node.

```http
# Example: Request to add a file via Kubo RPC API
POST /api/v0/add?stream-channels=true HTTP/1.1
Host: localhost:5001

# Example: Request to pin a file via Kubo RPC API
POST /api/v0/pin/add?arg=<ipfs_hash> HTTP/1.1
Host: localhost:5001
```

--------------------------------

### Configure Hugo for IPFS Deployment

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/static-site-generators

Set `relativeURLs = true` in Hugo's `config.toml` file to ensure links are relative, which is important for IPFS compatibility. Then, build the static pages.

```toml
relativeURLs=true
```

--------------------------------

### Configuring Domain Redirection to IPFS Hash

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/single-page-website

This section outlines the process of setting up a custom domain for an IPFS-hosted website. It involves obtaining the IPFS hash from a pinning service like Pinata and configuring the redirection settings with a domain name provider.

```text
1. Log into your domain name provider.
2. Go to your domain management window and find the domain you want to assign to your website.
3. Find where to change the **Redirection Settings**.
4. In a new tab, open Pinata(opens new window), log in, and copy the **IPFS Hash** for your website.
5. In your domain name providers **Redirection Settings** section, paste in the **IPFS Hash** link you just copied.
6. Save your changes.
```

--------------------------------

### Manually Trigger IPFS Reprovide

Source: https://docs.ipfs.tech/how-to/troubleshooting

This command manually initiates a reprovide run for IPFS content. It's used to test changes or force an update of provider records.

```bash
ipfs routing reprovide
```

--------------------------------

### IPFS vs. BitTorrent Comparison

Source: https://docs.ipfs.tech/concepts/comparisons

Compares IPFS and BitTorrent, noting BitTorrent's focus on peer-to-peer file sharing using a centralized tracker and its low similarity to IPFS's general-purpose distributed file system.

```Markdown
technology | storage mechanism | data model | networking stack | identifier | address composition | links | use cases | similarity to IPFS | hashing algorithm  
---|---|---|---|---|---|---|---|---|---
bittorrent(opens new window) | P2P file-sharing | merkle DAG | TCP/IP | torrent file | filename + sha1 hash | - | file sharing | low | SHA-256  
```

--------------------------------

### Navigate to Directory

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

Changes the current directory in the command-line interface. This is used to navigate to the location of the files you want to add to IPFS.

```bash
cd ~/Documents

```

--------------------------------

### Download IPFS Objects

Source: https://docs.ipfs.tech/reference/kubo/rpc

Downloads IPFS objects specified by an argument. Supports outputting to a file, creating TAR archives, and applying GZIP compression with adjustable levels. Progress streaming is enabled by default.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/get?arg=<ipfs-path>&output=<value>&archive=<value>&compress=<value>&compression-level=<value>&progress=true"
```

--------------------------------

### IPFS Kubo RPC API: Config Show

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the `/api/v0/config/show` endpoint for the IPFS Kubo RPC API, which displays the current configuration of the IPFS node. This allows users to inspect their node's settings.

```HTTP
GET /api/v0/config/show
```

--------------------------------

### IPFS Further Reading: Papers on IPFS and Decentralized Web

Source: https://docs.ipfs.tech/concepts

This snippet provides a link to further reading materials, including papers that offer in-depth understanding of IPFS, its specifications, and the broader context of the decentralized web, protocols, and hashing.

```URL
https://docs.ipfs.tech/concepts/readme/#further-reading
```

--------------------------------

### Go IPFS Daemon (Estuary)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Estuary is a Go-based daemon service for pinning and onboarding IPFS data into Filecoin.

```go
package main

import "fmt"

func main() {
	// Estuary is a daemon service, this is a conceptual representation.
	fmt.Println("Estuary: Daemon for pinning IPFS data to Filecoin.")
	// In a real scenario, this would involve complex logic for interacting with IPFS and Filecoin networks.
}
```

--------------------------------

### Download IPFS Cluster Control Package

Source: https://docs.ipfs.tech/install/server-infrastructure

Downloads the latest `ipfs-cluster-ctl` package for Linux amd64 architecture. This package contains the command-line tool for interacting with the IPFS Cluster.

```shell
wget https://dist.ipfs.tech/ipfs-cluster-ctl/v1.1.4/ipfs-cluster-ctl_v1.1.4_linux-amd64.tar.gz
```

--------------------------------

### IPFS Routing Provide Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Announces to the IPFS network that you are providing specific values. Supports verbose output and recursive provision of data graphs.

```bash
ipfs routing provide <key>...

SYNOPSIS
  ipfs routing provide [--verbose | -v] [--recursive | -r] [--] <key>...

ARGUMENTS

  <key>... - The key[s] to send provide records for.

OPTIONS

  -v, --verbose    bool - Print extra information.
  -r, --recursive  bool - Recursively provide entire graph.
```

--------------------------------

### Go IPFS Daemon (whypfs)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

whypfs is a Go-based daemon built on Kubo building blocks, offering performance-oriented options.

```go
package main

import "fmt"

func main() {
	// whypfs is a daemon based on Kubo building blocks.
	fmt.Println("whypfs: Daemon based on Kubo building blocks with performance options.")
	// This would involve initializing and running the Kubo daemon components.
}
```

--------------------------------

### Import IPFS CAR File

Source: https://docs.ipfs.tech/how-to/troubleshooting

Import content into Kubo from a `.car` file using the `ipfs dag import` command. This is useful if you have the content in a portable archive format.

```bash
ipfs dag import <file>.car
```

--------------------------------

### Clone Git Repository from IPFS

Source: https://docs.ipfs.tech/how-to/host-git-repo

This command demonstrates how to clone a Git repository that has been added to IPFS. It uses an IPFS gateway URL, including the repository's IPFS hash, to retrieve the distributed content.

```bash
git clone http://QmX679gmfyaRkKMvPA4WGNWXj9PtpvKWGPgtXaF18etC95.ipfs.localhost:8080/ myrepo
```

--------------------------------

### Query DNS for Bootstrap Nodes

Source: https://docs.ipfs.tech/concepts/public-utilities

This command queries the DNS TXT record for IPFS bootstrap nodes, which helps an IPFS node discover other peers to join the Amino DHT.

```bash
dig +short TXT _dnsaddr.bootstrap.libp2p.io
```

--------------------------------

### IPFS Files mkdir: Create directories

Source: https://docs.ipfs.tech/reference/kubo/cli

Creates directories within the IPFS MFS. It supports creating parent directories if they do not exist and allows specifying CID version and hash function for the new directories. Paths must be absolute.

```bash
ipfs files mkdir <path>
ipfs files mkdir [--parents | -p] [--cid-version=<cid-version> | --cid-ver] [--hash=<hash>] [--] <path>
```

--------------------------------

### Deploy to IPFS with Filebase

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

This snippet shows how to configure the ipfs/ipfs-deploy-action to deploy to Filebase. It requires setting Filebase bucket name, access key, and secret key as GitHub secrets.

```YAML
- name: Deploy to IPFS
  uses: ipfs/ipfs-deploy-action@v1
  with:
    # ... other inputs ...
    filebase-bucket: 'your-bucket-name'
    filebase-access-key: ${{ secrets.FILEBASE_ACCESS_KEY }}
    filebase-secret-key: ${{ secrets.FILEBASE_SECRET_KEY }}
```

--------------------------------

### Find IPFS Providers for a Key

Source: https://docs.ipfs.tech/reference/kubo/cli

Finds peers that can provide a specific value, given a key. Allows specifying the number of providers to find and supports verbose output.

```bash
ipfs routing findprovs <key>
```

```bash
ipfs routing findprovs -v <key>
```

```bash
ipfs routing findprovs -n <num-providers> <key>
```

--------------------------------

### IPFS p2p (Experimental)

Source: https://docs.ipfs.tech/reference/kubo/cli

The 'ipfs p2p' command is experimental and allows for libp2p stream mounting. It enables the creation and use of tunnels to remote peers over libp2p. Due to its experimental nature, the command and its APIs are subject to change.

```bash
ipfs p2p
```

--------------------------------

### IPFS Kubo RPC API: Bootstrap

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the `/api/v0/bootstrap` endpoint for the IPFS Kubo RPC API, which allows managing the list of bootstrap nodes. This is crucial for node discovery and network connectivity.

```HTTP
GET /api/v0/bootstrap
```

--------------------------------

### IPFS Kubo RPC API: Multibase List

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/multibase/list` endpoint of the IPFS Kubo RPC API, which lists all supported multibase encodings. This provides an overview of available encoding schemes.

```HTTP
GET /api/v0/multibase/list
```

--------------------------------

### Fetch Single Raw Block from Public Gateway

Source: https://docs.ipfs.tech/reference/http/gateway

Illustrates fetching a single raw IPFS block from a public gateway using `curl` with the `Accept: application/vnd.ipld.raw` header and `format=raw` query parameter. The downloaded raw block can then be added to the IPFS local store.

```bash
$ curl -H "Accept: application/vnd.ipld.raw" "https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi?format=raw" -L > raw-block.bin
$ ipfs block put raw-block.bin
bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

```

```bash
https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi?format=raw

```

--------------------------------

### Configure IPFS Cluster Deployment

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

Adds configuration to the `ipfs-deploy-action` to deploy content to an IPFS Cluster. Requires `CLUSTER_URL`, `CLUSTER_USER`, and `CLUSTER_PASSWORD` GitHub secrets.

```yaml
- name: Deploy to IPFS
  uses: ipfs/ipfs-deploy-action@v1
  with:
    # ... other inputs ...
    cluster-url: ${{ secrets.CLUSTER_URL }}
    cluster-user: ${{ secrets.CLUSTER_USER }}
    cluster-password: ${{ secrets.CLUSTER_PASSWORD }}
```

--------------------------------

### ipfs cid codecs: List Available CID Multicodecs

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists available CID multicodecs. Users can opt to include numeric codes or filter the list to show only codecs supported by go-ipfs commands.

```bash
ipfs cid codecs [--numeric | -n] [--supported | -s]
```

--------------------------------

### IPFS Key Verify (Experimental)

Source: https://docs.ipfs.tech/reference/kubo/cli

Verifies that given data and signature match.

```bash
ipfs key verify <data>
```

--------------------------------

### IPFS Repo Stat Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides statistics about the local IPFS repository, including size, maximum storage, number of objects, repository path, and version. Supports options for human-readable output and size-only reporting.

```bash
ipfs repo stat [--size-only | -s] [--human | -H]

Options:
  -s, --size-only bool  Only report RepoSize and StorageMax.
  -H, --human bool      Print sizes in human readable format (e.g., 1K 234M 2G).
```

--------------------------------

### Go Library for Embedding Kubo in Mobile Apps

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A library-oriented IPFS daemon for Go, designed to help embed Kubo into mobile applications. It provides a lightweight IPFS node for mobile environments.

```go
package main

import (
	"fmt"
	"github.com/ipfs/gomobile-ipfs"
)

func main() {
	// Example usage (conceptual - initializing IPFS daemon)
	// err := gomobileipfs.Start()
	// if err != nil {
	// 	panic(err)
	// }
	fmt.Println("gomobile-ipfs library used.")
}
```

--------------------------------

### IPFS Cluster REST API Interaction

Source: https://docs.ipfs.tech/install/server-infrastructure

This snippet shows how to interact with the IPFS Cluster's REST API using `curl`. It demonstrates common operations like listing pins and adding new pins to the cluster.

```bash
curl http://127.0.0.1:9094/pins
curl -X POST -H "Content-Type: application/json" -d '{"cid": "<cid>"}' http://127.0.0.1:9094/pins
```

--------------------------------

### IPFS Filestore List Objects

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists objects within the IPFS filestore. It can list all objects or specific objects by their CID. The output includes the hash, size, path, and offset of each object.

```bash
ipfs filestore ls [<obj>]...
ipfs filestore ls [--file-order] [--] [<obj>...]

# Example output format:
# <hash> <size> <path> <offset>
```

--------------------------------

### Pin File with Remote Service using IPFS Kubo

Source: https://docs.ipfs.tech/how-to/work-with-pinning-services

This command shows how to pin a file or directory to a previously added remote pinning service using IPFS Kubo. It specifies the CID of the content and the name of the remote service to use for storage.

```bash
ipfs pin remote pin <CID> <SERVICE_NAME>
```

--------------------------------

### Pin a file or directory to IPFS

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

This command pins a file or directory using its CID, ensuring that your IPFS node keeps a local copy and does not garbage collect it. Recursive pinning applies to directories and their contents.

```bash
ipfs pin add bafybeif2ewg3nqa33mjokpxii36jj2ywfqjpy3urdh7v6vqyfjoocvgy3a
```

--------------------------------

### Space Daemon: JavaScript Interface for P2P Apps

Source: https://docs.ipfs.tech/case-studies/fleek

Space Daemon is a developer toolset that bundles IPFS, Textile Threads, and Buckets, and Filecoin into a single JavaScript interface, simplifying the creation of peer-to-peer encrypted applications.

```javascript
// Conceptual example of using Space Daemon (Fleek's JavaScript interface)
// This requires the Space Daemon library to be installed and initialized.
// Refer to Fleek's documentation for specific API details and setup.

// Assuming 'SpaceDaemon' is the main class or object provided by the library
// const sd = new SpaceDaemon({
//   // Configuration options, e.g., API keys, IPFS node settings
// });

// Example: Storing data using Textile Threads via Space Daemon
// async function storeData() {
//   try {
//     // Initialize a new thread or connect to an existing one
//     const thread = await sd.threads.createThread('my-app-data');
//     
//     // Define a schema for your data
//     const schema = {
//       "$id": "my-data-schema",
//       "title": "MyData",
//       "type": "object",
//       "properties": {
//         "name": { "type": "string" },
//         "value": { "type": "number" }
//       }
//     };
//     await thread.addSchema(schema);
//
//     // Add a new record to the thread
//     const newRecord = await thread.save('MyData', { name: 'example', value: 123 });
//     console.log('Data stored successfully:', newRecord);
//
//     // Retrieve data
//     const records = await thread.find('MyData', {});
//     console.log('Retrieved records:', records);
//
//   } catch (error) {
//     console.error('Error using Space Daemon:', error);
//   }
// }

// storeData();

console.log('Space Daemon conceptual example. Refer to Fleek documentation for actual implementation.');

```

--------------------------------

### IPFS API: List Active P2P Listeners

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists active p2p listeners. Can optionally display table headers for Protocol, Listen, and Target information.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/p2p/ls?headers=<value>"
```

--------------------------------

### ipfs cid bases: List Available Multibase Encodings

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists all available multibase encodings supported by IPFS. Options allow including single-letter prefixes or numeric codes in the output.

```bash
ipfs cid bases [--prefix] [--numeric]
```

--------------------------------

### Mount IPFS to Filesystem

Source: https://docs.ipfs.tech/reference/kubo/rpc

Mounts IPFS to the filesystem in a read-only manner. This allows accessing IPFS content through standard file paths.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/mount?ipfs-path=<value>&ipns-path=<value>&mfs-path=<value>"
```

--------------------------------

### IPFS Kubo RPC API: Diagnostic Commands

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/diag/cmds` endpoint of the IPFS Kubo RPC API, used for managing diagnostic commands. This includes listing, clearing, and setting timers for commands.

```HTTP
GET /api/v0/diag/cmds
```

```HTTP
POST /api/v0/diag/cmds/clear
```

```HTTP
POST /api/v0/diag/cmds/set-time
```

--------------------------------

### Add Remote Pinning Service via IPFS Kubo

Source: https://docs.ipfs.tech/how-to/work-with-pinning-services

This snippet demonstrates how to add a remote pinning service using the IPFS Kubo command-line interface. It requires the service's URL and an API token for authentication. This allows for programmatic management of remote pins.

```bash
ipfs pin remote service add <SERVICE_NAME> <SERVICE_URL> <API_TOKEN>
```

--------------------------------

### Find IPFS Help Wanted Issues

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Find features or bug fixes that need assistance in IPFS and its sister projects by looking for issues labeled '_Help Wanted_' across various GitHub organizations.

```Git
IPFS
```

```Git
libp2p
```

```Git
IPLD
```

```Git
Multiformats
```

--------------------------------

### View IPFS Connection Multiaddr

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Display the multiaddr used for a specific IPFS connection by piping the output of 'ipfs swarm peers -v' and filtering with 'grep'.

```bash
ipfs swarm peers -v | grep <peerId>
```

--------------------------------

### List IPFS Diagnostic Commands

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists commands that have been run on the IPFS node. An optional verbose flag can be provided for extra information.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/diag/cmds?verbose=<value>"
```

--------------------------------

### Go Embedded Client for IPFS Core API

Source: https://docs.ipfs.tech/reference/go/api

The `coreapi` package in Kubo provides direct access to IPFS core commands for embedding IPFS directly into Go programs. This package serves as the public interface for reading and writing files and controlling IPFS. It is currently experimental and subject to change.

```Go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/ipfs/go-ipfs-core/coreapi"
	"github.com/ipfs/kubo/config"
	"github.com/ipfs/kubo/core"
	"github.com/ipfs/kubo/core/coreapi/test/helpers"
	"github.com/ipfs/kubo/repo/fsrepo"
)

func main() {
	// Example of using the coreapi package (conceptual)
	// In a real application, you would initialize a Kubo node and get the API.

	// This is a placeholder to illustrate the package usage.
	// For actual implementation, refer to Kubo's examples and documentation.

	// Create a temporary IPFS repository for demonstration
	repoPath, err := os.MkdirTemp("", "ipfs-repo-example")
	if err != nil {
		panic(err)
	}
	defer os.RemoveAll(repoPath)

	// Initialize the repository
	err = fsrepo.Init(repoPath, &config.DefaultAPICudaConfig)
	if err != nil {
		panic(err)
	}

	// Open the repository
	repo, err := fsrepo.Open(repoPath)
	if err != nil {
		panic(err)
	}

	// Create a Kubo node
	node, err := core.NewNode(context.Background(), core.WithRepo(repo))
	if err != nil {
		panic(err)
	}

	// Get the core API
	coreApi := coreapi.NewCoreAPI(node)

	// Example: Add a file (conceptual)
	// fileContent := []byte("Hello, IPFS!")
	// reader := bytes.NewReader(fileContent)
	// cid, err := coreApi.Unixfs().Add(context.Background(), reader)
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Printf("Added file with CID: %s\n", cid.String())

	fmt.Println("Kubo node initialized and core API obtained.")
	fmt.Println("Refer to go-ipfs documentation for actual usage.")

	// Close the node (important in real applications)
	// defer node.Close()
}

```

--------------------------------

### Find IPFS Providers

Source: https://docs.ipfs.tech/how-to/troubleshooting

Use the `ipfs routing findprovs` command to determine if any peers are advertising a specific CID. This command returns a list of Peer IDs if providers are found.

```bash
ipfs routing findprovs <CID>
```

--------------------------------

### Helia and Verified Fetch (TypeScript)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Helia is a lean, modular, and modern implementation of IPFS for JavaScript and browser environments. Verified Fetch is a fetch-like retrieval client for IPFS, and inbrowser.link is an IPFS Gateway implemented in Service Worker, built with Helia and Verified Fetch.

```typescript
Helia (JS SDK): A lean, modular, and modern implementation of IPFS for the prolific JS and browser environments
```

```typescript
Verified Fetch: A fetch-like retrieval client for IPFS
```

```typescript
inbrowser.link: IPFS Gateway implemented in Service Worker, built with Helia and Verified Fetch
```

--------------------------------

### Contribute to IPFS Design (Visual)

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the visual design aspects of IPFS projects, such as IPFS Desktop and Companion, by looking for opportunities in the 'ipfs-gui' repository. Filter by 'design-visual' label.

```Git
ipfs-gui
```

--------------------------------

### Contribute to IPLD Specifications

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the development and refinement of IPLD protocols by engaging with the 'ipld/specs' repository on GitHub. This is where protocol design feedback and proposals are shared.

```Git
ipld/specs
```

--------------------------------

### Fetch UnixFS File from Local Gateway

Source: https://docs.ipfs.tech/reference/http/gateway

Demonstrates how to fetch a UnixFS file (like an image) from a local IPFS gateway using `curl`. The retrieved file is saved locally. It also shows how to use the `filename` parameter to set the `Content-Disposition` header.

```bash
$ curl "http://127.0.0.1:8080/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi" > cat.jpg

```

```bash
https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi?filename=cat.jpg

```

--------------------------------

### Contribute to IPFS Core (Kubo)

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the core IPFS project by working on the 'ipfs/kubo' repository. This is one of the biggest and most active repositories for IPFS development.

```Go
ipfs/kubo
```

--------------------------------

### IPFS API: List Available CID Codecs

Source: https://docs.ipfs.tech/reference/kubo/rpc

Explains the IPFS API endpoint /api/v0/cid/codecs used to list available CID multicodecs. It details the optional 'numeric' and 'supported' arguments and the JSON response format containing 'Code' and 'Name'.

```json
[
  {
    "Code": "<int>",
    "Name": "<string>"
  }
]
```

--------------------------------

### Formatting Code in IPFS Forum Posts

Source: https://docs.ipfs.tech/community

When asking for help with IPFS libraries or encountering issues, it's recommended to format code snippets using markdown. This makes the code easier to read and understand for community members providing support. Ensure you include the package name and version when discussing library-specific problems.

```Markdown
When sharing bits of code, use markdown to format code blocks so that they are easier to read.
```

--------------------------------

### Add a file to IPFS using Rabin fingerprint chunking

Source: https://docs.ipfs.tech/reference/kubo/cli

Adds a file to IPFS using the Rabin fingerprint chunking algorithm with specified minimum, average, and maximum chunk sizes. This demonstrates content-defined chunking.

```bash
ipfs add --chunker=rabin-512-1024-2048 ipfs-logo.svg
```

--------------------------------

### List successful pins in IPFS Kubo

Source: https://docs.ipfs.tech/how-to/work-with-pinning-services

This command lists all successfully pinned content on a specified remote pinning service. You need to provide the nickname of the service you want to query.

```bash
$ ipfs pin remote ls --service=nickname
```

--------------------------------

### Find Content Providers in DHT

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Query the Distributed Hash Table (DHT) to find nodes providing a specific content identifier (CID). This is crucial for ensuring content discoverability.

```bash
ipfs routing findprovs <cid>
```

--------------------------------

### Check IPFS Node Status with 'ipfs id'

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Use the 'ipfs id' command on each node to verify they are running and online. Successful output includes the node's ID, public key, and network addresses.

```bash
ipfs id
```

--------------------------------

### List Pinned Files with IPFS

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

Lists all the content (files and folders) currently pinned by your IPFS node. This helps in identifying the CID of the file you wish to unpin.

```bash
ipfs pin ls
```

--------------------------------

### List Local References

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists all local references within the IPFS repository. This endpoint does not require any arguments.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/refs/local"
```

--------------------------------

### IPFS vs. Git Comparison

Source: https://docs.ipfs.tech/concepts/comparisons

Compares IPFS with Git, a version control system. It notes Git's use of commit history as its data model and its medium similarity to IPFS, primarily used for version control.

```Markdown
technology | storage mechanism | data model | networking stack | identifier | address composition | links | use cases | similarity to IPFS | hashing algorithm  
---|---|---|---|---|---|---|---|---|---
git(opens new window) | version control | commit history | TCP/IP | commit hash | commit hash | - | version control | medium | SHA-1, SHA-256  
```

--------------------------------

### Connect to Peer

Source: https://docs.ipfs.tech/reference/kubo/rpc

Opens a connection to a specified peer address. This is essential for establishing communication within the IPFS network. The response includes an array of strings representing the connection status or confirmation.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/swarm/connect?arg=<address>"
```

--------------------------------

### Removed DHT Findprovs Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/dht/findprovs command has been removed. Users should now use 'ipfs routing' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/dht/findprovs"
```

--------------------------------

### Fleek Storage: File Management via API/CLI

Source: https://docs.ipfs.tech/case-studies/fleek

Fleek Storage provides a service for importing, storing, pinning, and retrieving files using IPFS. It offers user-friendly UI, API, and CLI interfaces for managing data.

```bash
# Example Fleek CLI commands for Fleek Storage
# Ensure you have the Fleek CLI installed and authenticated.

# Import and upload a file to IPFS via Fleek Storage
fleek storage import --path ./my-document.txt

# List stored files
fleek storage list

# Get information about a specific file (replace CID with actual CID)
fleek storage info --cid QmYourFileCID

# Download a file from IPFS via Fleek Storage
fleek storage download --cid QmYourFileCID --output ./downloaded-file.txt

# Pin a file to ensure it remains available
fleek storage pin --cid QmYourFileCID

```

--------------------------------

### Open Video from IPFS in Browser

Source: https://docs.ipfs.tech/how-to/store-play-videos

This command opens a video stored on IPFS in a web browser. It uses the local gateway URL combined with the video's IPFS hash to access the content, which can then be played by the browser.

```bash
chromium http://localhost:8080/ipfs/$video_hash
```

--------------------------------

### IPFS API: Forward P2P Connections

Source: https://docs.ipfs.tech/reference/kubo/rpc

Forwards connections to a libp2p service. Requires protocol name, listening endpoint, and target endpoint. Optionally allows custom protocols.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/p2p/forward?arg=<protocol>&arg=<listen-address>&arg=<target-address>&allow-custom-protocol=<value>"
```

--------------------------------

### Pinning Files with IPFS Desktop

Source: https://docs.ipfs.tech/quickstart/pin

Instructions for pinning files locally using the IPFS Desktop application. This involves importing files and using the context menu to pin them, ensuring they remain available on your node. It also mentions configuring remote pinning services within IPFS Desktop.

```bash
# Example command to add and pin a file using IPFS CLI (conceptual, as the text focuses on GUI)
# ipfs add <your-file-path>
# ipfs pin add <your-file-cid>
```

--------------------------------

### Convert Native Address to Canonical Content Path

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

Demonstrates the conversion process from IPFS and IPNS native URLs to their corresponding canonical content path formats, which prepend the protocol scheme to the full address.

```plaintext
ipfs://{immutable-root}/path/to/resourceA converts to /ipfs/{immutable-root}/path/to/resourceA
ipns://{mutable-root}/path/to/resourceB converts to /ipns/{mutable-root}/path/to/resourceB
```

--------------------------------

### Save Directory and Record Top Folder Hash

Source: https://docs.ipfs.tech/how-to/take-snapshot

This command adds a directory recursively to IPFS and captures only the hash of the top-level folder, then records it with a timestamp. The '-q' flag ensures only hashes are output, and 'tail -n1' selects the last hash.

```bash
echo `ipfs add -q -r ~/code/myproject | tail -n1` `date` >> snapshots
```

--------------------------------

### Record IPFS Hash and Timestamp

Source: https://docs.ipfs.tech/how-to/take-snapshot

This command records the hash of a saved directory and the current timestamp into a file named 'snapshots'. It's a way to keep track of saved states.

```bash
echo $hash `date` >> snapshots
```

--------------------------------

### IPFS Key Verify

Source: https://docs.ipfs.tech/reference/kubo/cli

Verifies if given data and signature match. This experimental command requires the data, key, and signature, and supports specifying the IPNS base encoding.

```bash
ipfs key verify <data>ipfs key verify [--key=<key> | -k] [--signature=<signature> | -s]
                  [--ipns-base=<ipns-base>] [--] <data>
```

--------------------------------

### Show IPFS Configuration

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves the current IPFS configuration file contents. This endpoint takes no arguments and returns the configuration as a JSON object.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/config/show"
```

--------------------------------

### List Objects in Filestore

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists objects stored in the IPFS filestore. Optionally, results can be sorted by the path of the backing file.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/filestore/ls?arg=<obj>&file-order=<value>"
```

--------------------------------

### IPFS CID Hashes - List Multihashes

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists available multihashes supported by IPFS. It can optionally include numeric codes or list only codecs supported by go-ipfs commands.

```shell
ipfs cid hashes
ipfs cid hashes --numeric
ipfs cid hashes --supported
```

--------------------------------

### IPVM Workflow Specification

Source: https://docs.ipfs.tech/concepts/cod

This specification outlines the workflow for the InterPlanetary Virtual Machine (IPVM), detailing how decentralized compute jobs are executed on IPFS. It covers the processes and interactions within the IPVM ecosystem.

```Text
IPVM Workflow Spec
https://ipfs.tech/docs/compute-over-data/#ipvm-workflow-spec
```

--------------------------------

### libp2p PubSub with GossipSub

Source: https://docs.ipfs.tech/concepts/libp2p

Demonstrates the Publish/Subscribe (PubSub) messaging model using libp2p's GossipSub protocol. This system allows peers to join topics and exchange messages efficiently in real-time, forming a scalable and fault-tolerant P2P communication solution.

```Go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/libp2p/go-libp2p/core/peer"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
)

func main() {
	ctx := context.Background()

	h, err := libp2p.New(libp2p.ListenAddrStrings("/ip4/0.0.0.0/tcp/0"))
	if err != nil {
		log.Fatal(err)
	}

	// Start a libp2p-pubsub service using the GossipSub router
	gossipSub, err := pubsub.NewGossipSub(ctx, h)
	if err != nil {
		log.Fatal(err)
	}

	// Subscribe to a topic
	sub, err := gossipSub.Subscribe("my-topic")
	if err != nil {
		log.Fatal(err)
	}

	// Publish a message
	go func() {
		for {
			err := gossipSub.Publish("my-topic", []byte("Hello, world!"))
			if err != nil {
				log.Printf("Error publishing: %v\n", err)
			}
			// time.Sleep(1 * time.Second)
		}
	}()

	// Receive messages
	go func() {
		for {
			msg, err := sub.Next(ctx)
			if err != nil {
				log.Printf("Error receiving: %v\n", err)
				continue
			}
			fmt.Printf("Received message from %s: %s\n", msg.GetFrom(), string(msg.Data))
		}
	}()

	// Keep the node running
	select {}
}

// Helper function to connect to another peer (example)
func connectToPeer(h host.Host, peerID peer.ID) {
	conn, err := h.NewStream(context.Background(), peerID, network.ID("/ipfs/id/1.0.0"))
	if err != nil {
		log.Printf("Error creating stream: %v\n", err)
		return
	}
	defer conn.Close()
	fmt.Printf("Connected to peer %s\n", peerID.Pretty())
}

```

--------------------------------

### IPFS Config Profile: Announce On

Source: https://docs.ipfs.tech/reference/kubo/cli

Re-enables the Provide and Reprovide systems, reverting the effects of the 'announce-off' profile. This ensures that data is announced to the Amino DHT.

```bash
ipfs config profile apply announce-on
```

--------------------------------

### Configure Pinata Pinning

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

Adds configuration to the `ipfs-deploy-action` to pin content to Pinata using a JWT token. Requires the `PINATA_JWT` GitHub secret.

```yaml
- name: Deploy to IPFS
  uses: ipfs/ipfs-deploy-action@v1
  with:
    # ... other inputs ...
    pinata-jwt-token: ${{ secrets.PINATA_JWT_TOKEN }}
    pinata-pinning-url: 'https://api.pinata.cloud/psa' # Default URL
```

--------------------------------

### Convert PeerID to CIDv1 with Base36

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This command converts a PeerID to a CIDv1 using Base36 encoding and the 'libp2p-key' codec, suitable for use in subdomains.

```bash
ipfs cid format -v 1 -b base36 --codec libp2p-key QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
```

--------------------------------

### Run WebAssembly (Wasm) Images with Bacalhau

Source: https://docs.ipfs.tech/concepts/cod

Bacalhau supports running WebAssembly (Wasm) images as compute tasks, facilitating decentralized computation on IPFS data. This allows for flexible execution across various environments.

```Bash
bacalhau docker run \
  --save-output \
  --engine=wasm \
  ghcr.io/bacalhau-dev/examples/wasm/hello_world:v0.1.0 \
  "Hello from Wasm!"
```

--------------------------------

### Gateway Redirect for CIDv0 to CIDv1

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This illustrates the automatic conversion process where a request to a CIDv0 path gateway results in an HTTP 301 redirect to a CIDv1 subdomain gateway.

```URL
https://<gateway-host>.tld/ipfs/<cid> -> https://<cidv1>.ipfs.<gateway-host>.tld/
```

--------------------------------

### Check IPFS Reprovide Statistics

Source: https://docs.ipfs.tech/how-to/troubleshooting

This command displays statistics related to the reprovide process, including the total number of reprovides, average duration, and the duration of the last reprovide. This information is crucial for diagnosing performance issues.

```bash
ipfs stats reprovide
```

--------------------------------

### Verify File Integrity with SHA-256 Checksum

Source: https://docs.ipfs.tech/concepts/content-addressing

Demonstrates how to verify the integrity of a downloaded file using its SHA-256 checksum. It shows the command to generate a checksum and then use `shasum` to compare it against the downloaded file.

```Shell
echo "b45165ed3cd437b9ffad02a2aad22a4ddc69162470e2622982889ce5826f6e3d *ubuntu-20.04.1-desktop-amd64.iso" | shasum -a 256 --check
```

--------------------------------

### Trigger IPFS Reprovider

Source: https://docs.ipfs.tech/reference/kubo/rpc

Initiates the IPFS reprovider process. This command does not require any arguments and returns a plain text response.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/routing/reprovide"
```

--------------------------------

### IPFS Kubo RPC API: Log List

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/log/ls` endpoint of the IPFS Kubo RPC API, which lists the available logging subsystems. This helps in configuring the desired log levels.

```HTTP
GET /api/v0/log/ls
```

--------------------------------

### IPFS API: List Available Multibase Encodings

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the IPFS API endpoint /api/v0/cid/bases for listing available multibase encodings. It explains the optional 'prefix' and 'numeric' boolean arguments and the structure of the response, which includes Code and Name for each encoding.

```json
[
  {
    "Code": "<int>",
    "Name": "<string>"
  }
]
```

--------------------------------

### Contribute to IPFS Notes

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the ongoing discussions and proposals for IPFS by engaging with the 'ipfs/notes' repository on GitHub. This is a space for sharing ideas and feedback on protocol design.

```Git
ipfs/notes
```

--------------------------------

### IPFS Kubo RPC API: Add Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section details the `/api/v0/add` endpoint of the IPFS Kubo RPC API. It is used for adding files or directories to your IPFS repository. No specific client-side language is mentioned, implying it's an API endpoint.

```HTTP
POST /api/v0/add
```

--------------------------------

### Custom IPFS Datastore Plugin for LikeCoin (ipfs-cosmosds)

Source: https://docs.ipfs.tech/case-studies/likecoin

This custom datastore plugin, based on go-ds-leveldb, modifies the behavior to identify and delegate queries for LikeCoin blockchain data via HTTP requests. It specifically handles CIDs that point to IPLD objects on the LikeCoin chain.

```Go
package ipfs_cosmosds

import (
	"net/http"
	"github.com/ipfs/go-datastore"
	"github.com/ipfs/go-ds-leveldb"
)

// Assume CustomDatastore embeds or wraps go-ds-leveldb.DataStore
type CustomDatastore struct {
	*dsleveldb.LevelDB
}

// Custom implementation of Get, getSize, and has
func (cds *CustomDatastore) Get(key datastore.Key) ([]byte, error) {
	// Check if the CID references data on the LikeCoin blockchain
	// This would involve parsing the key/CID and potentially making an HTTP request
	// if isLikeCoinData(key) {
	// 	resp, err := http.Get("http://likecoin-chain-rpc/data/" + key.String())
	// 	if err != nil {
	// 		return nil, err
	// 	}
	// 	defer resp.Body.Close()
	// 	// Read data from response body
	// 	// return ioutil.ReadAll(resp.Body), nil
	// }

	// Fallback to the original LevelDB Get
	return cds.LevelDB.Get(key)
}

// Placeholder for isLikeCoinData function
// func isLikeCoinData(key datastore.Key) bool {
// 	// Logic to determine if the key/CID is related to LikeCoin blockchain data
// 	return false
// }
```

--------------------------------

### IPFS Routing Reprovide Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Triggers the reprovider process to announce your data to the IPFS network.

```bash
ipfs routing reprovide

SYNOPSIS
  ipfs routing reprovide

DESCRIPTION

  Trigger reprovider to announce our data to network.
```

--------------------------------

### Connect to IPFS Node using Multiaddr

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Manually connect to an IPFS node using its multiaddr with the 'ipfs swarm connect' command. This can help test connectivity and identify supported NAT traversal methods.

```bash
ipfs swarm connect <multiaddr>
```

--------------------------------

### Unpack Git Objects for Deduplication

Source: https://docs.ipfs.tech/how-to/host-git-repo

This optional step unpacks Git's packed objects into individual files. This allows IPFS to deduplicate objects if multiple versions of the same repository are added, optimizing storage.

```bash
mv objects/pack/*.pack .
git unpack-objects < *.pack
rm -f *.pack objects/pack/*
```

--------------------------------

### IPFS: Add File Command (Kubo)

Source: https://docs.ipfs.tech/concepts/lifecycle

The `ipfs add` command in Kubo is used to both merkleize data into a UnixFS DAG and pin it locally. This process generates a CID for the data and makes it available for retrieval.

```bash
ipfs add <file_or_directory>
```

--------------------------------

### Rust Small Embeddable IPFS Implementation

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A small, embeddable IPFS implementation written in Rust. This library is suitable for scenarios where a lightweight IPFS node is required.

```rust
use ipfs_embed::Config;

fn main() {
    // Example usage (conceptual - starting IPFS node)
    // let config = Config::default();
    // let ipfs = ipfs_embed::new(config).await.unwrap();
    // println!("IPFS node started: {:?}", ipfs.identity());
    println!("ipfs-embed library used.");
}
```

--------------------------------

### List Remote Pins using IPFS Kubo

Source: https://docs.ipfs.tech/how-to/work-with-pinning-services

This command retrieves a list of all content that has been pinned to any configured remote pinning services. It helps in managing and verifying pinned data across different services.

```bash
ipfs pin remote ls
```

--------------------------------

### Create a file with echo command

Source: https://docs.ipfs.tech/how-to/pin-files

This command creates a file named 'foo' and writes the text 'ipfs rocks' into it. The output redirection `>` prevents the text from being displayed on the console.

```bash
echo "ipfs rocks" > foo    
```

--------------------------------

### IPFS Object Listing

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists the contents of IPFS or IPNS objects. Displays links with their base58 hash, size in bytes, and name. Supports options for showing headers, resolving types and sizes, and streaming entries.

```bash
ipfs ls <ipfs-path>...
ipfs ls [--headers | -v] [--resolve-type=false] [--size=false] [--stream | -s] [--] <ipfs-path>...

# Options:
#   -v, --headers   Print table headers (Hash, Size, Name).
#   --resolve-type  Resolve linked objects to find out their types. Default: true.
#   --size          Resolve linked objects to find out their file size. Default: true.
#   -s, --stream    Enable experimental streaming of directory entries.

# Description: Displays the contents of an IPFS or IPNS object(s).
```

--------------------------------

### Run Arbitrary Docker Containers with Bacalhau

Source: https://docs.ipfs.tech/concepts/cod

Bacalhau allows users to run arbitrary Docker containers as compute tasks, enabling Compute Over Data (CoD) by executing jobs where the data is generated and stored. This simplifies workflows without extensive refactoring.

```Bash
bacalhau docker run \
  --save-output \
  ubuntu:latest \
  ls /data
```

--------------------------------

### Fetch DAG as CAR Stream from Public Gateway

Source: https://docs.ipfs.tech/reference/http/gateway

Shows how to retrieve an entire DAG (Directed Acyclic Graph) as a CAR (Content Addressable Archive) stream from a public IPFS gateway using `curl`. The downloaded CAR file can then be imported using the `ipfs dag import` command or verified with `ipfs-car`. It also highlights the use of the `Accept` and `format` headers for optimal interoperability.

```bash
$ curl -H "Accept: application/vnd.ipld.car" "https://ipfs.io/ipfs/bafybeiakou6e7hnx4ms2yangplzl6viapsoyo6phlee6bwrg4j2xt37m3q?format=car" -L > dag.car
$ ipfs dag import dag.car

```

```bash
https://ipfs.io/ipfs/bafybeiakou6e7hnx4ms2yangplzl6viapsoyo6phlee6bwrg4j2xt37m3q?format=car

```

--------------------------------

### Expose Gateway Locally

Source: https://docs.ipfs.tech/reference/kubo/cli

Configures the IPFS gateway to be accessible from other computers on the network by binding to all available network interfaces.

```bash
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
```

--------------------------------

### List all pinned objects

Source: https://docs.ipfs.tech/how-to/pin-files

This command lists all objects currently pinned to your local IPFS node. The `--type=all` flag ensures that all types of pins, including recursive and indirect, are displayed.

```bash
ipfs pin ls --type=all     
```

--------------------------------

### IPFS Kubo RPC API: Bootstrap Add

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section describes the `/api/v0/bootstrap/add` endpoint for the IPFS Kubo RPC API, used to add a peer to the bootstrap list. It requires the peer's multiaddress.

```HTTP
POST /api/v0/bootstrap/add
```

--------------------------------

### Removed DHT Findpeer Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/dht/findpeer command has been removed. Users should now use 'ipfs routing' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/dht/findpeer"
```

--------------------------------

### IPFS Kubo RPC API: Bitswap Wantlist

Source: https://docs.ipfs.tech/reference/kubo/rpc

This documentation covers the `/api/v0/bitswap/wantlist` endpoint of the IPFS Kubo RPC API, which allows users to view the current wantlist of the bitswap agent. This is useful for understanding what data blocks the node is requesting.

```HTTP
GET /api/v0/bitswap/wantlist
```

--------------------------------

### Removed DHT Put Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/dht/put command has been removed. Users should now use 'ipfs routing' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/dht/put"
```

--------------------------------

### Rust IPFS RPC Clients

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Lists multiple Rust client libraries for the Kubo IPFS RPC API: 'ferristseng/rust-ipfs-api', 'gkbrk/rust-ipfs-api', 'rmnoff/rust-ipfs-api', and 'rschulman/rust-ipfs-api'. All are marked as Inactive.

```Rust
ferristseng/rust-ipfs-api
```

```Rust
gkbrk/rust-ipfs-api
```

```Rust
rmnoff/rust-ipfs-api
```

```Rust
rschulman/rust-ipfs-api
```

--------------------------------

### IPFS Kubo RPC API: Key Import

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section describes the `/api/v0/key/import` endpoint for the IPFS Kubo RPC API, used to import existing private keys into the IPFS keystore. This allows using pre-existing identities.

```HTTP
POST /api/v0/key/import
```

--------------------------------

### Helia JavaScript Implementation

Source: https://docs.ipfs.tech/reference

Information about Helia, the next-generation IPFS JavaScript implementation. It's designed to be modern, modular, and efficient, replacing the discontinued js-ipfs project.

```javascript
// Example: Basic usage of Helia to create a node (conceptual)
import { createHelia } from 'helia'

async function main () {
  const helia = await createHelia()
  console.log('Helia node created')
  // Further operations like adding/getting data would follow
  // await helia.stop()
}

main()
```

--------------------------------

### List IPNS Keys with Base36 Encoding

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This command lists IPNS keys and specifies Base36 encoding, which is recommended for longer keys like ED25519 libp2p keys.

```bash
ipfs key list -l --ipns-base base36
```

--------------------------------

### List Configured Remote Pinning Services

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists all configured remote pinning services. Optionally, it can fetch and display the current pin count (queued, pinning, pinned, failed) for each service.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/pin/remote/service/ls?stat=false"
```

--------------------------------

### Retrieve a folder from IPFS using CID

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

This command retrieves a folder specified by its Content Identifier (CID) from the IPFS network and saves it to the current directory. Ensure your IPFS daemon is running.

```bash
ipfs get bafybeif2ewg3nqa33mjokpxii36jj2ywfqjpy3urdh7v6vqyfjoocvgy3a
```

--------------------------------

### Removed Object New Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/object/new command has been removed. Users should now use 'ipfs dag' or 'ipfs files' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/object/new"
```

--------------------------------

### IPFS CLI Text Encoding Commands

Source: https://docs.ipfs.tech/reference/kubo/cli

Covers commands related to text encoding, specifically for converting and discovering properties of CIDs and encoding/decoding data using Multibase.

```bash
ipfs cid
ipfs multibase
```

--------------------------------

### Go IPFS Daemon (Agregore)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Agregore is a mobile-friendly IPFS daemon implemented in Go.

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	// Example: Serve a file from IPFS (requires IPFS daemon running)
	http.HandleFunc("/ipfs/", func(w http.ResponseWriter, r *http.Request) {
		// In a real implementation, you would interact with the IPFS daemon here
		fmt.Fprintf(w, "Serving file from IPFS...")
	})

	fmt.Println("Agregore IPFS daemon starting...")
	http.ListenAndServe(":8080", nil)
}
```

--------------------------------

### Retrieve Content from IPFS Gateway

Source: https://docs.ipfs.tech/quickstart/pin-cli

These snippets demonstrate how to retrieve content from IPFS using various gateways. You can use service-specific gateways provided by Storacha, Pinata, or Filebase, or public gateways like ipfs.io or dweb.link. Replace [CID] with the actual Content Identifier of your file.

```curl
curl https://[CID].ipfs.w3s.link/
# or
curl https://w3s.link/ipfs/[CID]
```

```curl
curl https://gateway.pinata.cloud/ipfs/[CID]
```

```curl
curl https://[BUCKET_NAME].ipfs.filebase.io/ipfs/[CID]
```

```curl
curl https://ipfs.io/ipfs/[CID]
# or
curl https://dweb.link/ipfs/[CID]
```

--------------------------------

### IPFS Gateway Supported Features

Source: https://docs.ipfs.tech/concepts/public-utilities

Details the specific features supported by different IPFS gateways, including general gateway specifications and trustless gateway subsets. Mentions limitations on file sizes for HTTP Range requests.

```Text
ipfs.io and dweb.link support the full set of IPFS Gateway specifications, including deserialized responses to enable website hosting.
HTTP Range requests support files up to a maximum size of 5GiB due to limitations of the Cloudflare CDN. Requests for larger files will result in a standard HTTP 200 response instead.
trustless-gateway.link supports only the Trustless Gateway subset of the specification.
Supported content types: application/vnd.ipld.raw, application/vnd.ipld.car and application/vnd.ipfs.ipns-record
```

--------------------------------

### CIDv0 to Base32 Conversion Output

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This is the output of the manual CID conversion command, showing the Base32 encoded CIDv1.

```text
bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
```

--------------------------------

### IPFS Kubo RPC API: Files Make Directory

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section describes the `/api/v0/files/mkdir` endpoint for the IPFS Kubo RPC API, used to create a new directory in the IPFS filesystem. It requires the path for the new directory.

```HTTP
POST /api/v0/files/mkdir
```

--------------------------------

### IPFS Glossary: Amino Definition

Source: https://docs.ipfs.tech/concepts/glossary

Describes Amino, formerly the public DHT, as the public Kademlia-based DHT that Kubo and other implementations use for bootstrapping into the libp2p protocol `/ipfs/kad/1.0.0`.

```English
Formerly referred to as the "public DHT", Amino is the public Kademlia-based DHT that Kubo and other implementations default to bootstrapping into with the libp2p protocol `/ipfs/kad/1.0.0`. See the blog post(opens new window) for more info.
```

--------------------------------

### Custom 404 Page - Netlify

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/redirects-and-custom-404s

Sets a custom HTML page to be displayed when a requested path does not exist on the website. The '/*' pattern acts as a catch-all for any non-matching routes.

```netlify
/* /custom-404.html 404
```

--------------------------------

### Contribute to libp2p Specifications

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the development and refinement of libp2p protocols by engaging with the 'libp2p/specs' repository on GitHub. This is where protocol design feedback and proposals are shared.

```Git
libp2p/specs
```

--------------------------------

### Play Video from IPFS via Local Gateway

Source: https://docs.ipfs.tech/how-to/store-play-videos

This command plays a video stored on IPFS by accessing it through the local IPFS gateway. The video is streamed to `mplayer` using the gateway's URL and the video's IPFS hash.

```bash
mplayer http://localhost:8080/ipfs/$video_hash
```

--------------------------------

### IPFS Repository Path Configuration

Source: https://docs.ipfs.tech/reference/kubo/cli

Explains how IPFS uses a local repository and how to change its default location (`~/.ipfs`) by setting the `$IPFS_PATH` environment variable.

```bash
export IPFS_PATH=/path/to/ipfsrepo
```

--------------------------------

### Add File to IPFS

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

Adds a specified file to the IPFS network. This command returns a unique Content Identifier (CID) for the added file.

```bash
ipfs add hello-ipfs.txt

```

--------------------------------

### IPFS Multibase List

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists the available multibase encodings supported by IPFS. Options are available to include single-letter prefixes or numeric codes along with the encoding names.

```bash
ipfs multibase list
ipfs multibase list --prefix
ipfs multibase list --numeric
```

--------------------------------

### IPFS Refs Local Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Displays the hashes of all local objects. This command treats all local objects as "raw blocks" and returns CIDv1-Raw CIDs.

```bash
ipfs refs local
```

--------------------------------

### List IPFS Mutable Namespace

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists directories within the local mutable namespace of IPFS. This endpoint does not take arguments.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/files/ls"

```

--------------------------------

### Go IPLD Data Library

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A popular library for working with IPLD (InterPlanetary Linked Data) data in Golang. It provides robust tools for navigating and manipulating IPLD structures.

```go
package main

import (
	"fmt"
	"github.com/ipld/go-ipld-prime/linking"
	"github.com/ipld/go-ipld-prime/node/basicnode"
)

func main() {
	// Example of creating a simple IPLD node
	node := basicnode.NewString("hello")
	link := linking.Link{Hash: []byte("fakehash"), Size: 5}
	fmt.Printf("Node: %v, Link: %v\n", node, link)
}
```

--------------------------------

### IPFS Refs Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists the hashes of all the links an IPFS or IPNS object(s) contains. Supports recursive listing and custom output formats. It can fetch blocks if not found locally.

```bash
ipfs refs <ipfs-path>...
ipfs refs [--format=<format>] [--edges | -e] [--unique | -u] [--recursive | -r] [--max-depth=<max-depth>] [--] <ipfs-path>...

Options:
  --format string  Emit edges with given format. Available tokens: <src> <dst> <linkname>. Default: <dst>.
  -e, --edges bool   Emit edge format: `<from> -> <to>`.
  -u, --unique bool  Omit duplicate refs from output.
  -r, --recursive bool Recursively list links of child nodes.
  --max-depth int    Only for recursive refs, limits fetch and listing to the given depth. Default: -1.
```

--------------------------------

### List pins with specific statuses in IPFS Kubo

Source: https://docs.ipfs.tech/how-to/work-with-pinning-services

This command lists pins on a remote service that are in a specific status, such as 'queued', 'pinning', or 'failed'. Replace `<nickname>` with the service's name and specify the desired statuses.

```bash
$ ipfs pin remote ls --service=nickname --status=queued,pinning,failed
```

--------------------------------

### IPFS p2p stream List

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists all active peer-to-peer streams. Optionally, it can display table headers including ID, Protocol, Local, and Remote information.

```bash
ipfs p2p stream ls [--headers | -v]
```

--------------------------------

### IPFS Commands Completion - Generate Shell Completions

Source: https://docs.ipfs.tech/reference/kubo/cli

Generates shell completion scripts for IPFS commands. Supports bash, fish, and zsh shells.

```shell
ipfs commands completion bash
ipfs commands completion fish
ipfs commands completion zsh
```

--------------------------------

### Configure IPFS Cluster Options

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/deploy-github-action

Allows customization of IPFS Cluster retry attempts, timeout, `ipfs-cluster-ctl` version, and pin expiration time within the `ipfs-deploy-action`.

```yaml
- name: Deploy to IPFS
  uses: ipfs/ipfs-deploy-action@v1
  with:
    # ... other inputs ...
    cluster-retry-attempts: '5' # Override number of retry attempts
    cluster-timeout-minutes: '15' # Override timeout in minutes per attempt
    ipfs-cluster-ctl-version: 'v1.1.4' # Default version
    cluster-pin-expire-in: '720h' # Optional: Set pin to expire after time period (e.g., 30 days)
```

--------------------------------

### C++ IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Includes the 'vasild/cpp-ipfs-api' library for C++ applications to interact with the Kubo IPFS RPC API. This client is Active.

```C++
vasild/cpp-ipfs-api
```

--------------------------------

### C# IPFS RPC Clients

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Lists multiple C# client libraries for the Kubo IPFS RPC API: 'ipfs-shipyard/net-ipfs-http-client', 'jeremy-ellis-tech/net-ipfs-http-client', and 'richardschneider/net-ipfs-http-client'. The first is Active, the others are Inactive.

```C#
ipfs-shipyard/net-ipfs-http-client
```

```C#
jeremy-ellis-tech/net-ipfs-http-client
```

```C#
richardschneider/net-ipfs-http-client
```

--------------------------------

### IPFS Bitswap Wantlist

Source: https://docs.ipfs.tech/reference/kubo/cli

Shows blocks currently on the wantlist for the local peer or a specified peer. Allows filtering by peer.

```bash
ipfs bitswap wantlist - Show blocks currently on the wantlist.

OPTIONS

  -p, --peer  string - Specify which peer to show wantlist for. Default: self.

DESCRIPTION

  Print out all blocks currently on the bitswap wantlist for the local peer.
```

--------------------------------

### IPFS Multibase Subcommands

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides subcommands for encoding and decoding data using multibase formats. It includes commands to decode, encode, list available encodings, and transcode data between different multibase formats.

```bash
ipfs multibase decode <encoded_file>
ipfs multibase encode <file>
ipfs multibase list
ipfs multibase transcode <encoded_file>
```

--------------------------------

### IPFS Stats Reprovider

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves statistics for the reprovider. This is a deprecated command, use 'ipfs provide stat' instead. This endpoint takes no arguments.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/stats/reprovide"
```

--------------------------------

### Expose Kubo Delegated Routing Server

Source: https://docs.ipfs.tech/concepts/nodes

This explains how Kubo can expose its own delegated routing endpoint, acting as a server for other nodes, particularly in gateway scenarios.

```bash
# Example configuration for Kubo as a delegated routing server
# This involves setting up the gateway to serve the delegated routing endpoint
# Refer to Kubo documentation for specific commands/settings.
```

--------------------------------

### Nabu (Java)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Nabu is a minimalistic, fast, and embeddable IPFS implementation written in Java, designed for ease of integration.

```java
Nabu: A minimalistic, fast and embeddable IPFS implementation.
```

--------------------------------

### Add File using IPFS CLI

Source: https://docs.ipfs.tech/concepts/persistence

This describes the basic command to add a file to IPFS using the command-line interface. When a file is added using `ipfs add`, the IPFS node automatically pins that file, protecting it from garbage collection.

```bash
ipfs add <file_path>
```

--------------------------------

### IPFS Swarm Peers List

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists all peers currently connected to the IPFS node. Supports options for verbose output, showing streams, latency, connection direction, and peer identification.

```bash
ipfs swarm peers [--verbose | -v] [--streams] [--latency] [--direction]
                   [--identify]
```

--------------------------------

### IPFS API: List Available Multihashes

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the IPFS API endpoint /api/v0/cid/hashes for listing available multihashes. It includes optional 'numeric' and 'supported' arguments and specifies the response format, which mirrors that of CID codecs.

```json
[
  {
    "Code": "<int>",
    "Name": "<string>"
  }
]
```

--------------------------------

### Add a file to IPFS and integrate with MFS

Source: https://docs.ipfs.tech/reference/kubo/cli

Adds a file to IPFS and creates a reference to it within the IPFS File System (MFS). This makes the file easier to locate and manage within IPFS.

```bash
ipfs files mkdir -p /myfs/dir
ipfs add example.jpg --to-files /myfs/dir/
```

--------------------------------

### Uploading to IPFS with pineapple.js

Source: https://docs.ipfs.tech/case-studies/snapshot

The pineapple.js library provides a 'pin' method to upload JSON data to multiple IPFS pinning services. This method abstracts the complexities of interacting with various pinning services, ensuring data persistence and availability. The service also uploads data to AWS S3.

```JavaScript
import pineapple from "pineapple.js";

// Example usage:
const jsonData = { "key": "value" };
pineapple.pin(jsonData)
  .then(response => {
    console.log("Successfully pinned data:", response);
  })
  .catch(error => {
    console.error("Error pinning data:", error);
  });

```

--------------------------------

### IPFS Swarm: List Listening Addresses

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists all interface addresses that the IPFS node is currently listening on. This helps in understanding the network interfaces the node is exposed to.

```bash
ipfs swarm addrs listen
```

--------------------------------

### Configure Caddyfile for CORS Preflight

Source: https://docs.ipfs.tech/how-to/kubo-rpc-tls-auth

Updates the Caddyfile to handle OPTIONS requests from 'webui.ipfs.io' by setting appropriate CORS headers and responding with 204.

```caddy
YOUR_DOMAIN {
  # Handle CORS preflight requests
  @options {
    method OPTIONS
  }
  handle @options {
    header {
      Access-Control-Allow-Origin "https://webui.ipfs.io"
      Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
      Access-Control-Allow-Headers "*"
      Access-Control-Allow-Credentials "true"
    }
    respond 204
  }

 # Handle all other requests
 handle {
   reverse_proxy localhost:5001
 }

 log {
   output stdout
   format json
   level INFO
 }
}
```

--------------------------------

### Go CID Implementation

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A Go implementation of CIDs (Content IDentifiers) with encoding and decoding support. This library is fundamental for working with content-addressed data in Go projects.

```go
package main

import (
	"fmt"
	"github.com/ipfs/go-cid"
)

func main() {
	cidStr := "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55qciq"
	cid, err := cid.Decode(cidStr)
	if err != nil {
		panic(err)
	}
	fmt.Println(cid.String())
}
```

--------------------------------

### List Available Multibase Encodings (IPFS API)

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists available multibase encodings. Supports options to include single-letter prefixes and numeric codes in the output. The response is a JSON array of objects, each containing the encoding's Code and Name.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/multibase/list?prefix=<value>&numeric=<value>"

```

--------------------------------

### CID Creation Process in IPFS

Source: https://docs.ipfs.tech/concepts/content-addressing

Explains the steps involved in generating a CID for a data block in IPFS. It highlights the use of cryptographic hashing and multiformats for encoding and interpreting data.

```General
1. Computing a cryptographic hash of the block's data.
2. Combining that hash with codec information about the block using multiformats:
   * Multihash for information on the algorithm used to hash the data.
   * Multicodec for information on how to interpret the hashed data after it has been fetched.
   * Multibase for information on how the hashed data is encoded. Multibase is only used in the string representation of the CID.
```

--------------------------------

### Contribute to IPFS Specifications

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the development and refinement of IPFS protocols by engaging with the 'ipfs/specs' repository on GitHub. This is where protocol design feedback and proposals are shared.

```Git
ipfs/specs
```

--------------------------------

### Publish Data via IPFS Pub/Sub

Source: https://docs.ipfs.tech/reference/kubo/cli

Publishes data to a specified topic using IPFS Pub/Sub. The data can be provided via standard input or a file. This command is part of the deprecated Pub/Sub experimental feature and requires the daemon to be configured appropriately.

```bash
ipfs pubsub pub <topic> <data>
```

--------------------------------

### IPFS Commands Completion Fish - Generate Fish Completions

Source: https://docs.ipfs.tech/reference/kubo/cli

Generates command completions for the fish shell. The completions can be saved to a file and sourced.

```fish
# Generate fish completions
ipfs commands completion fish > ipfs-completion.fish
# Source the completions
source ./ipfs-completion.fish
```

--------------------------------

### IPFS Stats Bitswap Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Displays diagnostic information about the IPFS bitswap agent. Supports verbose output and human-readable size formatting.

```bash
ipfs stats bitswap

SYNOPSIS
  ipfs stats bitswap [--verbose | -v] [--human]

OPTIONS

  -v, --verbose  bool - Print extra information.
  --human        bool - Print sizes in human readable format (e.g., 1K 234M 2G).
```

--------------------------------

### Configure Kubo Delegated Routing Client

Source: https://docs.ipfs.tech/concepts/nodes

This section describes how Kubo can be configured to use multiple delegated routing endpoints as a client, enabling offloaded routing tasks.

```bash
# Example configuration for Kubo as a delegated routing client
# This would typically be done via configuration files or CLI flags
# Refer to Kubo documentation for specific commands/settings.
```

--------------------------------

### ISCN IPLD Plugin for IPFS

Source: https://docs.ipfs.tech/case-studies/likecoin

This plugin is designed to parse IPLD data related to ISCN (InterPlanetary Standard Content Notation) to associate ISCN metadata with IPFS artifacts. It enables the LikeCoin ecosystem to link blockchain metadata with content stored on IPFS.

```Go
package iscn_ipld

import (
	"github.com/ipfs/go-cid"
	"github.com/ipfs/go-ipld-format"
	// Other necessary imports for IPLD parsing and ISCN structure
)

// Assume this is a plugin that registers itself with IPFS or is used during data resolution

// Function to parse ISCN-related IPLD data
func ParseISCNData(node ipld.Node) (interface{}, error) {
	// Logic to inspect the IPLD node, identify ISCN structure, and extract metadata
	// This might involve checking Kind, Links, and Data fields of the ipld.Node
	// For example:
	// if node.Kind() == ipld.MapKind {
	// 	// Check for specific ISCN keys like 'type', 'contentId', 'metadata'
	// }
	return nil, nil // Placeholder
}

// Function to associate ISCN metadata with an IPFS artifact (CID)
func AssociateISCNMetadata(cid cid.Cid, metadata interface{}) error {
	// Logic to store or link the extracted ISCN metadata with the given CID
	// This might involve updating a separate index or embedding metadata if the IPLD format allows
	return nil // Placeholder
}
```

--------------------------------

### List Peers in IPFS Cluster

Source: https://docs.ipfs.tech/install/server-infrastructure

Lists all the peers currently connected to the IPFS Cluster. It displays their IDs, names, and the number of other peers they can see, along with their network addresses.

```shell
./ipfs-cluster-ctl peers ls
```

--------------------------------

### Go IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Provides the 'ipfs/kubo/client/rpc' library for interacting with the Kubo IPFS node's RPC API in Go. This client is marked as Active.

```Go
ipfs/kubo/client/rpc
```

--------------------------------

### IPFS Kubo RPC API: Files Copy

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/files/cp` endpoint of the IPFS Kubo RPC API, used to copy files or directories within the IPFS filesystem. It requires source and destination paths.

```HTTP
POST /api/v0/files/cp
```

--------------------------------

### Manually Connect to an IPFS Peer

Source: https://docs.ipfs.tech/how-to/observe-peers

This command allows you to establish a direct connection to a specific IPFS peer using its multiaddress. You can find peer addresses from the output of 'ipfs swarm peers' or other network discovery methods.

```bash
> ipfs swarm connect /dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
```

--------------------------------

### Subscribe to IPFS Pub/Sub Topic

Source: https://docs.ipfs.tech/reference/kubo/cli

Subscribes to messages on a given topic using IPFS Pub/Sub. This command is part of the deprecated Pub/Sub experimental feature and requires specific daemon configuration.

```bash
ipfs pubsub sub <topic>
```

--------------------------------

### View file contents from IPFS using CID

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

This command displays the content of a file identified by its CID. It's important to note that 'ipfs cat' only works with plaintext files; attempting to 'cat' a directory or non-plaintext file will result in an error or unreadable output.

```bash
ipfs cat bafybeif2ewg3nqa33mjokpxii36jj2ywfqjpy3urdh7v6vqyfjoocvgy3a
```

--------------------------------

### Verify Data and Signature with IPFS Key

Source: https://docs.ipfs.tech/reference/kubo/rpc

Verifies that the provided data and signature match using a specified IPFS key. The data and signature are expected in the request body as multipart/form-data.

```bash
curl -X POST -F file=@myfile "http://127.0.0.1:5001/api/v0/key/verify?key=<value>&signature=<value>&ipns-base=base36"
```

--------------------------------

### Configure Kubo as Recursive Gateway

Source: https://docs.ipfs.tech/concepts/ipfs-gateway

This snippet demonstrates how to configure the Kubo IPFS implementation to act as a recursive gateway. Recursive gateways can retrieve content from other peers on the network if it's not available locally, offering a more comprehensive content retrieval experience but requiring more resources.

```Go
Gateway.NoFetch=false
```

--------------------------------

### TypeScript CID and Multiformats Library

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A modern implementation of CID and multiformats for JavaScript/TypeScript. This library provides SDK support for multicodec, multihash, multibase, and CIDs with encoding/decoding capabilities.

```typescript
import { CID } from 'multiformats/cid';

// Example usage:
const cid = CID.parse('bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55qciq');
console.log(cid.toString());
```

--------------------------------

### List files in an MFS directory

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists the contents of a directory within the IPFS File System (MFS), showing files that have been added using the '--to-files' option.

```bash
ipfs files ls /myfs/dir/
```

--------------------------------

### Rust IPLD Core Traits and Types

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

The core traits and types for IPLD implementations in Rust. This library serves as the foundation for building IPLD-compatible systems in Rust.

```rust
use ipld_core::cid::Cid;

fn main() {
    // Example usage (conceptual - requires CID creation)
    // let cid = Cid::default();
    // println!("{}", cid);
    println!("Rust ipld_core library used.");
}
```

--------------------------------

### IPFS Redirects: SPA/PWA Catch-all Support

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/redirects-and-custom-404s

Shows how to configure a redirect with a '200' status code to enable Single Page Application (SPA) or Progressive Web App (PWA) support by rewriting requests to an index.html file.

```text
/app/* /app/index.html 200

```

--------------------------------

### List Directory Contents (IPFS API)

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists directory contents for Unix filesystem objects on IPFS. Supports options for headers, resolving types, file sizes, and streaming. The response includes object hashes, links, modification times, modes, names, sizes, targets, and types.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/log/ls"

```

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/ls?arg=<ipfs-path>&headers=<value>&resolve-type=true&size=true&stream=<value>"

```

--------------------------------

### Contribute to Multiformats Specifications

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the development and refinement of Multiformats protocols by engaging with the 'multiformats/specs' repository on GitHub. This is where protocol design feedback and proposals are shared.

```Git
multiformats/specs
```

--------------------------------

### IPFS Subsystems by Purpose

Source: https://docs.ipfs.tech/concepts/how-ipfs-works

This table outlines the core IPFS subsystems categorized by their primary purpose: data representation, content routing, data transfer, addressing, HTTP bridging, peer-to-peer connectivity, and mutability/naming.

```Markdown
Purpose | Subsystem  
---|---  
Representing and organizing the data |  CIDs, IPLD, UnixFS, MFS, DAG-CBOR, DAG-JSON, CAR files  
Content routing, linking between CID and IP addresses |  Kademlia DHT, Delegated routing over HTTP, Bitswap, mDNS  
Transferring data |  Bitswap, HTTP Gateways, Sneakernet, Graphsync, more in development  
Addressing for data and peers | Multiformats  
Bridging between IPFS and HTTP |  IPFS Gateways, Pinning API Spec  
Peer-to-peer connectivity | libp2p (TCP, QUIC, WebRTC, WebTransport)  
Mutability and dynamic naming | IPNS (Interplanetary Naming System), DNSLink  
```

--------------------------------

### IPFS Provide Stat

Source: https://docs.ipfs.tech/reference/kubo/cli

Returns statistics about the IPFS node's provider system, indicating which content is being reprovided. This interface is experimental and subject to change.

```bash
ipfs provide stat
```

--------------------------------

### IPFS API: Replace Configuration with File

Source: https://docs.ipfs.tech/reference/kubo/rpc

Describes the IPFS API endpoint /api/v0/config/replace, which allows replacing the entire IPFS configuration with a provided file. It notes that the file should be sent as 'multipart/form-data'.

```text
This endpoint returns a `text/plain` response body.
```

--------------------------------

### Check IPFS Version Compatibility

Source: https://docs.ipfs.tech/reference/kubo/rpc

Checks the IPFS node's version against connected peers. Allows setting a minimum percentage of peers with a newer version to trigger a warning.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/version/check?min-percent=5"
```

--------------------------------

### Add a new pinning service to IPFS Kubo

Source: https://docs.ipfs.tech/how-to/work-with-pinning-services

This command adds a new remote pinning service to IPFS Kubo. You need to provide a nickname for the service, its API endpoint URL, and a secret access token. This simplifies remote pinning operations by allowing Kubo to interact with the service directly.

```bash
ipfs pin remote service add <nickname> <endpoint> <accessToken>
```

--------------------------------

### Access IPFS Content via Gateway

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This snippet shows the standard format for accessing IPFS content through an HTTP gateway. It requires the gateway address and the content identifier (CID). This method allows non-IPFS aware clients to fetch resources.

```HTTP
https://<gateway>/ipfs/<CID>
```

```HTTP
https://ipfs.io/ipfs/bafybeihkoviema7g3gxyt6la7vd5ho32ictqbilu3wnlo3rs7ewhnp7lly
```

--------------------------------

### IPFS Swarm: List Local Addresses

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists all local listening addresses that the IPFS node announces to the network. Optionally displays the peer ID along with the addresses.

```bash
ipfs swarm addrs local
```

```bash
ipfs swarm addrs local --id
```

--------------------------------

### IPFS Kubo RPC API: Files Move

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/files/mv` endpoint of the IPFS Kubo RPC API, used to move or rename files and directories within the IPFS filesystem. It requires source and destination paths.

```HTTP
POST /api/v0/files/mv
```

--------------------------------

### Import IPFS Key

Source: https://docs.ipfs.tech/reference/kubo/rpc

Imports a private key into the IPFS keychain. Allows specifying a name for the key, IPNS base encoding, key format (protobuf or pem), and whether to allow any key type. The key is imported via multipart/form-data.

```bash
curl -X POST -F file=@myfile "http://127.0.0.1:5001/api/v0/key/import?arg=<name>&ipns-base=base36&format=libp2p-protobuf-cleartext&allow-any-key-type=false"
```

--------------------------------

### Contribute to IPFS Design (UX)

Source: https://docs.ipfs.tech/community/contribute/ways-to-contribute

Contribute to the user experience (UX) design aspects of IPFS projects, such as IPFS Desktop and Companion, by looking for opportunities in the 'ipfs-gui' repository. Filter by 'design-ux' label.

```Git
ipfs-gui
```

--------------------------------

### Python IPLD, DAG-CBOR, CID, CAR Library

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A fast Python library for working with DAG-CBOR, CID, CAR, and multibase. It offers comprehensive functionality for handling various aspects of IPLD data.

```python
from python_libipld.car import CarReader

# Example usage (conceptual - requires a CAR file)
# with open('my.car', 'rb') as f:
#     reader = CarReader(f)
#     for block in reader.blocks():
#         print(block.cid)
print("Python libipld library imported.")
```

--------------------------------

### View IPFS Swarm Peers

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Check the list of connected peers in the IPFS swarm. This helps confirm if two nodes are directly connected to each other.

```bash
ipfs swarm peers
```

--------------------------------

### Integrate with IPFS using ipfs-http-client

Source: https://docs.ipfs.tech/case-studies/morpheus

This snippet demonstrates how to integrate with the InterPlanetary File System (IPFS) using the ipfs-http-client library. This is crucial for applications like Morpheus.Network's Digital Footprint web app to interact with IPFS nodes for data retrieval and management.

```javascript
import { create } from 'ipfs-http-client';

// Connect to the IPFS daemon API
const ipfs = create({
  url: '/ip4/127.0.0.1/tcp/5001',
});

// Example: Add a file to IPFS
async function addFile(fileContent) {
  const result = await ipfs.add(fileContent);
  console.log('Added file:', result);
  return result;
}

// Example: Get a file from IPFS
async function getFile(cid) {
  const stream = ipfs.cat(cid);
  let data = '';
  for await (const chunk of stream) {
    data += chunk;
  }
  console.log('Retrieved file:', data);
  return data;
}
```

--------------------------------

### IPFS Kubo RPC API: Files Write

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/files/write` endpoint of the IPFS Kubo RPC API, used to write data to a file in the IPFS filesystem. It requires the file path and the data to write.

```HTTP
POST /api/v0/files/write
```

--------------------------------

### IPFS vs. Secure Scuttlebutt (SSB) Comparison

Source: https://docs.ipfs.tech/concepts/comparisons

Compares IPFS with Secure Scuttlebutt (SSB), a decentralized social network. It highlights SSB's append-only log data model and its high similarity to IPFS, focusing on decentralized social networking.

```Markdown
technology | storage mechanism | data model | networking stack | identifier | address composition | links | use cases | similarity to IPFS | hashing algorithm  
---|---|---|---|---|---|---|---|---|---
Secure Scuttlebutt (SSB)(opens new window) | decentralized social network | append-only log | Scuttlebutt Protocol | feed id | feed id | ssb://{feed id} | decentralized social networking | high | SHA-256  
```

--------------------------------

### Add IPFS Block

Source: https://docs.ipfs.tech/reference/kubo/rpc

Adds IPFS blocks to the local datastore. Supports specifying CID codec, multihash type and length, and options for recursive pinning and block size checks. Expects multipart/form-data for file uploads.

```bash
curl -X POST -F file=@myfile "http://127.0.0.1:5001/api/v0/block/put?cid-codec=raw&mhtype=<value>&mhlen=-1&pin=false&allow-big-block=false&format=<value>"
```

--------------------------------

### UnixFS Importer - Chunking Strategies

Source: https://docs.ipfs.tech/concepts/file-systems

When adding files to IPFS, UnixFS employs chunking to break data into smaller, hashable parts. This involves choosing a leaf format (UnixFS or raw) and a chunking strategy (fixed size or Rabin) to manage data segmentation and deduplication.

```Go
package main

import (
	"fmt"
	"io"
	"os"

	"github.com/ipfs/go-ipfs-files"
	"github.com/ipfs/go-ipfs-files/importer/chunker"
	"github.com/ipfs/go-ipfs-files/importer/helpers"
	"github.com/ipfs/go-ipfs-files/importer/trickle"
)

func main() {
	// Example: Using fixed size chunking
	file, err := os.Open("my-large-file.txt")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	// Create a context with chunking options
	// Leaf format: UnixFS leaves (default for CIDv0)
	// Chunking strategy: Fixed size (e.g., 1024 bytes)
	// Layout strategy: Balanced (default)
	// Max width: 174 (default)

	// For demonstration, we'll simulate the process
	// In a real scenario, you'd use ipfs.DagBuilder.Build(...) 

	fmt.Println("Simulating file import with fixed size chunking...")

	// This is a conceptual representation. Actual implementation involves IPFS internals.
	// For actual code, refer to go-ipfs-files package.

	// Example of creating a chunker (conceptual)
	// chunker, err := chunker.NewSize(file, 1024)
	// if err != nil {
	// 	panic(err)
	// }

	// Example of creating a layout builder (conceptual)
	// layoutBuilder := trickle.NewLayout(chunker, 174)

	// The actual process involves building a DAG and returning a root CID.

	fmt.Println("File chunking and layout simulation complete.")
}

```

--------------------------------

### IPFS Kubo RPC API: CID Codecs

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the `/api/v0/cid/codecs` endpoint for the IPFS Kubo RPC API, which lists the supported codecs used in CID structures. Codecs define how data is represented and interpreted.

```HTTP
GET /api/v0/cid/codecs
```

--------------------------------

### IPFS Native URL Format

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

Illustrates the basic structure of an IPFS native URL, which uses the 'ipfs://' scheme followed by a Content Identifier (CID) and an optional path.

```plaintext
ipfs://{cid}/path/to/subresource/cat.jpg
```

--------------------------------

### Rust IPFS Implementation (rust-ipfs)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

rust-ipfs is an IPFS implementation written in Rust.

```rust
fn main() {
    // Placeholder for rust-ipfs functionality
    println!("rust-ipfs: IPFS implementation in Rust");
    // In a real implementation, you would use the rust-ipfs library to interact with IPFS.
    // Example:
    // use rust_ipfs::IpfsOptions;
    // let ipfs_options = IpfsOptions::new();
    // let ipfs_node = rust_ipfs::Ipfs::new(ipfs_options).await.unwrap();
    // println!("Rust IPFS node started.");
}
```

--------------------------------

### Apply IPFS Config Profile

Source: https://docs.ipfs.tech/reference/kubo/cli

Applies a specified configuration profile to the IPFS node. The `--dry-run` option allows previewing changes without applying them. This command is crucial for setting up specific node behaviors like performance-optimized datastores or network configurations.

```bash
ipfs config profile apply <profile>
```

```bash
ipfs config profile apply --dry-run <profile>
```

--------------------------------

### IPFS Path Gateway Addressing

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

Demonstrates how to address IPFS resources using a path gateway. This format includes the gateway host, the '/ipfs/' path, the CID, and optionally a path to a specific resource. It's a common method for browsers to interpret IPFS content paths.

```HTTP
https://<gateway-host>/ipfs/<cid>/<path>
```

```HTTP
https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/Vincent_van_Gogh.html
```

```HTTP
https://ipfs.io/ipfs/QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX/wiki/Mars.html
```

--------------------------------

### Copy IPFS Files

Source: https://docs.ipfs.tech/reference/kubo/rpc

Copies IPFS files and directories within the MFS or adds references. Supports source and destination paths, with options for overwriting and creating parent directories.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/files/cp?arg=<source>&arg=<dest>&force=<value>&parents=<value>"

```

--------------------------------

### IPFS Key Export

Source: https://docs.ipfs.tech/reference/kubo/cli

Exports a named libp2p key to disk, with options to specify the output path and the format of the exported private key (libp2p-protobuf-cleartext or pem-pkcs8-cleartext).

```bash
ipfs key export <name> -o <output> -f <format>
```

--------------------------------

### Hashing Data with IPFS Recursive Add

Source: https://docs.ipfs.tech/case-studies/arbol

This snippet demonstrates the use of the stock IPFS recursive add operation for hashing data. It also highlights the experimental 'no-copy' feature, which reduces disk space usage on the hashing node by avoiding full dataset copies into the local IPFS datastore.

```bash
ipfs add -r
```

--------------------------------

### IPFS Kubo RPC API Usage

Source: https://docs.ipfs.tech/reference/kubo/cli

This section details the IPFS Kubo RPC API, which allows programmatic interaction with an IPFS node. It covers various endpoints for managing content, network status, and node configuration.

```json
{
  "jsonrpc": "2.0",
  "method": "/api/v0/id",
  "params": {},
  "id": "test"
}

```

```json
{
  "jsonrpc": "2.0",
  "method": "/api/v0/add",
  "params": {
    "file": "<file_content>"
  },
  "id": "test"
}

```

```json
{
  "jsonrpc": "2.0",
  "method": "/api/v0/get",
  "params": {
    "arg": "<cid>"
  },
  "id": "test"
}

```

```json
{
  "jsonrpc": "2.0",
  "method": "/api/v0/pin/add",
  "params": {
    "arg": "<cid>"
  },
  "id": "test"
}

```

```json
{
  "jsonrpc": "2.0",
  "method": "/api/v0/name/publish",
  "params": {
    "arg": "<cid>"
  },
  "id": "test"
}

```

--------------------------------

### Monitor Bitswap Statistics

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

To diagnose slow performance or issues with data retrieval, use `ipfs bitswap stat` to check the Bitswap status. If data remains in the 'wantlist', it suggests potential network reachability problems or issues with data announcement.

```bash
ipfs bitswap stat
```

--------------------------------

### IPFS Design and Evaluation for Decentralized Web

Source: https://docs.ipfs.tech/concepts/further-reading/academic-papers

This paper from the Association for Computing Machinery (2022) evaluates the InterPlanetary File System (IPFS), the most widely used Decentralized Web platform. It details IPFS's design and implementation as an open-source, content-addressable peer-to-peer network for distributed data storage and delivery. The paper introduces methodologies to measure IPFS network characteristics, revealing its presence across numerous Autonomous Systems and countries, and assesses its performance for publication and retrieval delays.

```text
Design and Evaluation of IPFS: A Storage Layer for the Decentralized Web
Association for Computing Machinery, 2022
Trautwein, Dennis and Raman, Aravindh and Tyson, Gareth and Castro, Ignacio and Scott, Will and Schubotz, Moritz and Gipp, Bela and Psaras, Yiannis : Recent years have witnessed growing consolidation of web operations. For example, the majority of web traffic now originates from a few organizations, and even micro-websites often choose to host on large pre-existing cloud infrastructures. In response to this, the “Decentralized Web” attempts to distribute ownership and operation of web services more evenly. This paper describes the design and implementation of the largest and most widely used Decentralized Web platform — the InterPlanetary File System (IPFS) — an open-source, content-addressable peer-to-peer network that provides distributed data storage and delivery. IPFS has millions of daily content retrievals and already underpins dozens of third-party applications. This paper evaluates the performance of IPFS by introducing a set of measurement methodologies that allow us to uncover the characteristics of peers in the IPFS network. We reveal presence in more than 2700 Autonomous Systems and 152 countries, the majority of which operate outside large central cloud providers like Amazon or Azure. We further evaluate IPFS performance, showing that both publication and retrieval delays are acceptable for a wide range of use cases. Finally, we share our datasets, experiences and lessons learned.
```

--------------------------------

### IPFS Key Import

Source: https://docs.ipfs.tech/reference/kubo/cli

Imports a key and associates it with a name in the keychain. Supports specifying the IPNS base encoding and the format of the private key to import (libp2p-protobuf-cleartext or pem-pkcs8-cleartext).

```bash
ipfs key import --ipns-base=<ipns-base> --format=<format> <name> <key>
```

--------------------------------

### IPFS API: List Active P2P Streams

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists active p2p streams. Can optionally display table headers for ID, Protocol, Local, and Remote addresses.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/p2p/stream/ls?headers=<value>"
```

--------------------------------

### Subdomain Gateway Resolution for Origin Isolation

Source: https://docs.ipfs.tech/how-to/gateway-best-practices

Illustrates how to use subdomain gateways to ensure the same-origin policy is enforced, preventing one website from accessing another's session data. This is achieved by assigning unique subdomains based on CIDs.

```URL
https://{CID A}.ipfs.{gatewayURL}/{website A}
https://{CID B}.ipfs.{gatewayURL}/{website B}
```

--------------------------------

### IPFS Files Stat Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Displays file status information for a given path in IPFS MFS. Allows custom formatting of output including hash, size, type, and more.

```bash
ipfs files stat <path>
ipfs files stat [--format=<format>] [--hash] [--size] [--with-local] [--] <path>

# Example format tokens:
# <hash> <size> <cumulsize> <type> <childs> <mode> <mode-octal> <mtime> <mtime-secs> <mtime-nsecs>
```

--------------------------------

### IPFS Config Profile: Legacy CIDv0

Source: https://docs.ipfs.tech/reference/kubo/cli

Configures UnixFS imports to produce legacy CIDv0 with no raw leaves, sha2-256, and 256 KiB chunks. This profile is least optimal and should only be used if legacy behavior is strictly required.

```bash
ipfs config profile apply legacy-cid-v0
```

--------------------------------

### Create IPFS CAR Files with CAR Builder

Source: https://docs.ipfs.tech/reference/diagnostic-tools

CAR Builder enables users to upload a data file and export it as an IPFS CAR file. The tool automatically chunks and hashes files to create IPFS-compatible content-addressed archives.

```HTML
<a href="https://car.ipfs.tech/">CAR Builder</a>
```

--------------------------------

### Pharo IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Provides the 'khinsen/ipfs-pharo' library for Pharo Smalltalk environments to interact with the Kubo IPFS RPC API. This client is Inactive.

```Pharo
khinsen/ipfs-pharo
```

--------------------------------

### Check IPFS Node Multiaddrs

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Use the 'ipfs routing findpeer' command to retrieve a list of multiaddresses for a specific IPFS node. This helps diagnose NAT-related connection issues.

```bash
ipfs routing findpeer <node a peerID>
```

--------------------------------

### Restart Caddy Service

Source: https://docs.ipfs.tech/how-to/kubo-rpc-tls-auth

Restarts the Caddy service to apply the updated Caddyfile configuration.

```bash
sudo systemctl restart caddy
```

--------------------------------

### IPFS Repo LS Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Displays the hashes of all local objects within the IPFS repository. Similar to 'ipfs refs local', it treats objects as raw blocks and returns CIDv1-Raw CIDs.

```bash
ipfs repo ls
```

--------------------------------

### IPFS Kubo RPC API: Filestore List

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the `/api/v0/filestore/ls` endpoint for the IPFS Kubo RPC API, which lists all files currently stored in the filestore. This provides an overview of stored data.

```HTTP
GET /api/v0/filestore/ls
```

--------------------------------

### Display IPFS file contents

Source: https://docs.ipfs.tech/how-to/pin-files

Retrieves and displays the content of a file from IPFS using its hash. This command requires the file's CID (Content Identifier) as an argument.

```bash
ipfs cat <foo hash>    

> ipfs rocks
```

--------------------------------

### Query Delegated Routing Endpoint for Providers

Source: https://docs.ipfs.tech/how-to/troubleshooting

This snippet demonstrates how to query the Delegated Routing Endpoint using curl to retrieve a list of providers for a specific IPFS CID. It highlights the use of the 'Accept: application/x-ndjson' header for streamed responses.

```bash
curl -H "Accept: application/x-ndjson" "https://delegated-ipfs.dev/routing/v1/providers/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
```

--------------------------------

### IPFS Swarm Interaction

Source: https://docs.ipfs.tech/reference/kubo/cli

Interacts with the IPFS swarm, which manages network connections. Subcommands allow listing addresses, connecting/disconnecting peers, managing filters, and viewing peers.

```bash
ipfs swarm
ipfs swarm addrs
ipfs swarm connect <address>
ipfs swarm disconnect <address>
ipfs swarm filters
ipfs swarm peering
ipfs swarm peers
```

--------------------------------

### List Duplicate Blocks in Filestore

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists blocks that are present in both the IPFS filestore and standard block storage. This endpoint does not take any arguments.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/filestore/dups"
```

--------------------------------

### IPFS Redirects: Basic Redirect Format

Source: https://docs.ipfs.tech/how-to/websites-on-ipfs/redirects-and-custom-404s

Defines the basic structure for a redirect rule in the _redirects file. It specifies the source path, the destination path, and an optional HTTP status code.

```text
from  to  [status]

```

--------------------------------

### Removed Object Patch Set-Data Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/object/patch/set-data command has been removed. Users should now use 'ipfs dag' or 'ipfs files' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/object/patch/set-data"
```

--------------------------------

### IPFS Routing Put Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Writes a key/value pair to the IPFS routing system. It takes a key and a file path for the value, with an option to allow offline storage.

```bash
ipfs routing put <key> <value-file>

SYNOPSIS
  ipfs routing put [--allow-offline] [--] <key> <value-file>

ARGUMENTS

  <key>        - The key to store the value at.
  <value-file> - A path to a file containing the value to store.

OPTIONS

  --allow-offline  bool - When offline, save the IPNS record to the local
                          datastore without broadcasting to the network instead
                          of simply failing.

DESCRIPTION

  Given a key of the form /foo/bar and a valid value for that key, this will write
  that value to the routing system with that key.
  
  Keys have two parts: a keytype (foo) and the key name (bar). IPNS uses the
  /ipns keytype, and expects the key name to be a Peer ID. IPNS entries are
  specifically formatted (protocol buffer).
  
  You may only use keytypes that are supported in your ipfs binary: currently
  this is only /ipns. Unless you have a relatively deep understanding of the
  go-ipfs routing internals, you likely want to be using 'ipfs name publish' instead
  of this.
  
  The value must be a valid value for the given key type. For example, if the key
  is /ipns/QmFoo, the value must be IPNS record (protobuf) signed with the key
  identified by QmFoo.
```

--------------------------------

### IPFS Key Sign (Experimental)

Source: https://docs.ipfs.tech/reference/kubo/cli

Generates a signature for given data using a specified key, useful for proving key ownership.

```bash
ipfs key sign <data>
```

--------------------------------

### IPFS Block Statistics Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Retrieves and prints information about a specific raw IPFS block, including its key (CID) and size in bytes.

```bash
ipfs block stat <cid>
ipfs block stat [--] <cid>

Arguments:
  <cid> - The CID of an existing block to stat.
```

--------------------------------

### IPFS Filestore Duplicates

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists blocks that are present in both the IPFS filestore and the standard block storage. This command helps in identifying redundant storage.

```bash
ipfs filestore dups
```

--------------------------------

### Lua IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Offers the 'siiky/ipfs.lua' library for Lua developers to access the Kubo IPFS RPC API. This client is Active.

```Lua
siiky/ipfs.lua
```

--------------------------------

### Fetch Image using Helia Verified Fetch

Source: https://docs.ipfs.tech/quickstart/retrieve

This code snippet demonstrates how to fetch an image from IPFS using the `verifiedFetch` library. It takes a CID as input and returns a Response object, similar to the standard Fetch API.

```javascript
import { verifiedFetch } from '@helia/verified-fetch';

const cid = 'ipfs://bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4/welcome-to-IPFS.jpg';

const response = await verifiedFetch(cid);
const blob = await response.blob();
const img = document.createElement('img');
img.src = URL.createObjectURL(blob);
document.body.appendChild(img);
```

--------------------------------

### List pinned objects after unpinning

Source: https://docs.ipfs.tech/how-to/pin-files

This command lists all pinned objects again after an object has been unpinned. The output will show that the previously unpinned object is no longer present in the list.

```bash
ipfs pin ls --type=all    
```

--------------------------------

### IPFS Bitswap Reprovide (Deprecated)

Source: https://docs.ipfs.tech/reference/kubo/cli

A deprecated command used for announcing to the DHT. Users are advised to use 'ipfs routing reprovide' instead.

```bash
ipfs bitswap reprovide - Deprecated command to announce to bitswap. Use 'ipfs
                           routing reprovide' instead.

DESCRIPTION

  'ipfs bitswap reprovide' is a legacy plumbing command used to announce to DHT.
  Deprecated, use modern 'ipfs routing reprovide' instead.
```

--------------------------------

### C++ IPFS Implementation (ipfs tiny)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

ipfs tiny is a tiny, embeddable, OS-independent IPFS implementation in C++.

```c++
#include <iostream>

int main() {
    // Placeholder for ipfs-tiny functionality
    std::cout << "ipfs-tiny: Tiny embeddable IPFS implementation in C++\n";
    return 0;
}
```

--------------------------------

### Go Kubo RPC Client for IPFS Daemon

Source: https://docs.ipfs.tech/reference/go/api

This approach involves using the Kubo RPC Client to communicate with a running Kubo IPFS daemon via its HTTP RPC API. This is the standard method when Kubo operates as a separate process, allowing your Go application to interact with it remotely.

```Go
package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/ipfs/go-ipfs-http-client"
	"github.com/ipfs/kubo/config"
	"github.com/ipfs/kubo/core"
	"github.com/ipfs/kubo/repo/fsrepo"
)

func main() {
	// This example demonstrates how to create an IPFS HTTP client.
	// It assumes a Kubo daemon is running and accessible at the default address.

	// In a real scenario, you would ensure the Kubo daemon is running.
	// For demonstration, we'll simulate client creation.

	// Example: Create an IPFS client pointing to the default API address
	ipfsClient, err := ipfshttp.NewClient(nil) // nil uses default API address
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating IPFS client: %v\n", err)
		// In a real app, you might want to start a daemon or handle this error.
		// For this example, we'll just print and exit.
		return
	}

	fmt.Println("Successfully created IPFS HTTP client.")

	// Example: Get node ID (conceptual)
	// nodeID, err := ipfsClient.ID(context.Background())
	// if err != nil {
	// 	fmt.Fprintf(os.Stderr, "Error getting Node ID: %v\n", err)
	// 	return
	// }
	// fmt.Printf("Node ID: %s\n", nodeID.ID)

	fmt.Println("Use the ipfsClient to interact with the Kubo daemon.")
	fmt.Println("Refer to go-ipfs-http-client documentation for specific API calls.")
}

```

--------------------------------

### IPFS Bitswap Stat

Source: https://docs.ipfs.tech/reference/kubo/cli

Displays diagnostic information about the bitswap agent. Supports verbose output and human-readable size formatting.

```bash
ipfs bitswap stat - Show some diagnostic information on the bitswap agent.

OPTIONS

  -v, --verbose  bool - Print extra information.
  --human        bool - Print sizes in human readable format (e.g., 1K 234M 2G).
```

--------------------------------

### Manually Announce Content Provider

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Manually announce that a node is providing a specific CID to the IPFS network. This is useful if provider records are not automatically updated.

```bash
ipfs routing provide <cid>
```

--------------------------------

### Pinata API with Curl for IPFS Pinning

Source: https://docs.ipfs.tech/quickstart/pin-cli

This snippet shows how to use curl with the Pinata REST API to pin files to IPFS. It includes setting environment variables for API credentials.

```Shell
# Set your API credentials
export PINATA_API_KEY="your_api_key"
export PINATA_SECRET_API_KEY="your_secret_api_key"

```

--------------------------------

### Fetch IPFS Swarm Peers via RPC API

Source: https://docs.ipfs.tech/reference/kubo/cli

This snippet shows how to fetch a list of connected peers in the IPFS swarm using the Kubo RPC API v0 via a curl command. It includes the expected JSON response.

```bash
> curl -X POST http://127.0.0.1:5001/api/v0/swarm/peers
{
  "Strings": [
    "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
    "/ip4/104.236.151.122/tcp/4001/p2p/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx",
    "/ip4/104.236.176.52/tcp/4001/p2p/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z",
  ]
}
```

--------------------------------

### Haskell IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Provides the 'davidar/hs-ipfs-api' library for Haskell developers to communicate with the Kubo IPFS RPC API. This client is Inactive.

```Haskell
davidar/hs-ipfs-api
```

--------------------------------

### Configure Caddy Reverse Proxy

Source: https://docs.ipfs.tech/how-to/kubo-rpc-tls-auth

This Caddyfile configuration sets up a reverse proxy for the Kubo API running on localhost:5001. It also configures JSON logging for requests to the Kubo API, directing output to stdout.

```plaintext
YOUR_DOMAIN {
  reverse_proxy localhost:5001

  log {
      output stdout
      format json
      level INFO
  }
}
```

--------------------------------

### IPFS Kubo RPC API: Diagnostic System

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the `/api/v0/diag/sys` endpoint for the IPFS Kubo RPC API, which returns system-level diagnostic information about the IPFS node. This includes details about the operating system and network.

```HTTP
GET /api/v0/diag/sys
```

--------------------------------

### Configure Kubo as Non-Recursive Gateway

Source: https://docs.ipfs.tech/concepts/ipfs-gateway

This snippet shows how to configure the Kubo IPFS implementation to act as a non-recursive gateway. Non-recursive gateways only serve content they possess locally, making them less resource-intensive and potentially more secure than recursive gateways.

```Go
Gateway.NoFetch=true
```

--------------------------------

### IPFS Mount Response Structure

Source: https://docs.ipfs.tech/reference/kubo/rpc

The response structure for the /api/v0/mount endpoint, showing the paths where IPFS, IPNS, and MFS have been mounted.

```json
{
  "FuseAllowOther": "<bool>",
  "IPFS": "<string>",
  "IPNS": "<string>",
  "MFS": "<string>"
}
```

--------------------------------

### IPFS API: Format and Convert CID

Source: https://docs.ipfs.tech/reference/kubo/rpc

Describes the IPFS API endpoint /api/v0/cid/format for converting CIDs to different formats. It lists arguments like 'arg' (required), 'f' (format string), 'v' (CID version), 'mc' (multicodec), and 'b' (multibase).

```json
{
  "CidStr": "<string>",
  "ErrorMsg": "<string>",
  "Formatted": "<string>"
}
```

--------------------------------

### Common Lisp IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Includes the 'WeMeetAgain/cl-ipfs-api' library for Common Lisp projects to access the Kubo IPFS RPC API. This client is Inactive.

```Common Lisp
WeMeetAgain/cl-ipfs-api
```

--------------------------------

### Check Kubo Node Online Status

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Before transferring files, verify that Kubo is running on both machines by executing `ipfs id` on each. If the 'Addresses' field shows 'null', the node is offline and requires `ipfs daemon` to be run.

```bash
ipfs id
```

--------------------------------

### Add File/Directory to IPFS

Source: https://docs.ipfs.tech/reference/kubo/cli

The 'ipfs add' command is used to add files or directories to the IPFS network. It supports recursive addition for directories and offers various options to control the process, such as ignoring files, setting CID versions, and managing pinning.

```bash
ipfs add <path>...

# Example: Add a single file
ipfs add my-file.txt

# Example: Add a directory recursively
ipfs add -r my-directory

# Example: Add recursively, ignore hidden files, and show progress
ipfs add -r -H -p my-directory
```

--------------------------------

### Scheme IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Provides the 'siiky/ipfs.scm' library for Scheme programming language users to interact with the Kubo IPFS RPC API. This client is Active.

```Scheme
siiky/ipfs.scm
```

--------------------------------

### IPFS Stats Provide

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves statistics for the 'provide' command. This is a deprecated command, use 'ipfs provide stat' instead. Returns a JSON object with reprovider statistics.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/stats/provide"
```

--------------------------------

### Add a file to IPFS

Source: https://docs.ipfs.tech/how-to/pin-files

This command adds the 'foo' file to the IPFS network. It returns a unique Content Identifier (CID) for the file and confirms its addition.

```bash
ipfs add foo               
```

--------------------------------

### IPFS Repo Verify Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Verifies all blocks in the IPFS repository to ensure they are not corrupted. This command checks the integrity of the stored data.

```bash
ipfs repo verify
```

--------------------------------

### Restart Kubo Service

Source: https://docs.ipfs.tech/how-to/kubo-rpc-tls-auth

Restarts the Kubo service to apply the updated configuration changes.

```bash
sudo systemctl restart kubo
```

--------------------------------

### Construct DNSLink URL Path

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This snippet illustrates how to create a URL path for IPFS content when using a DNS name with a DNSLink record. It follows a similar pattern to IPNS URLs.

```URL
https://<gateway-host>.tld/ipns/<dnslink>/path/to/resource
```

--------------------------------

### List IPFS Pub/Sub Subscribed Topics

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists the names of topics that the IPFS client is currently subscribed to. This command is part of the deprecated Pub/Sub experimental feature.

```bash
ipfs pubsub ls
```

--------------------------------

### IPFS Kubo RPC API: CID Bases

Source: https://docs.ipfs.tech/reference/kubo/rpc

This entry covers the `/api/v0/cid/bases` endpoint for the IPFS Kubo RPC API, which lists the supported base encodings for CIDs. Understanding these bases is key to working with IPFS identifiers.

```HTTP
GET /api/v0/cid/bases
```

--------------------------------

### Replace IPFS Configuration

Source: https://docs.ipfs.tech/reference/kubo/cli

Replaces the entire IPFS configuration with the contents of a specified file. It is recommended to back up the existing configuration before performing this operation as it cannot be undone. This is useful for migrating or restoring configurations.

```bash
ipfs config replace <file>
```

--------------------------------

### IPFS Kubo RPC API: DAG Import

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/dag/import` endpoint of the IPFS Kubo RPC API, which imports DAG data from a specified format. This is the inverse of exporting DAGs.

```HTTP
POST /api/v0/dag/import
```

--------------------------------

### Show IPNS Subscriptions

Source: https://docs.ipfs.tech/reference/kubo/cli

Displays the current name subscriptions for IPNS pubsub. It allows for optional configuration of the IPNS base encoding for keys.

```bash
ipfs name pubsub subs [--ipns-base=<ipns-base>]
```

--------------------------------

### Python DAG-PB Implementation

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

An implementation of DAG-PB (DAG Protocol Buffer) for Python. This library allows for the serialization and deserialization of DAG structures using Protocol Buffers.

```python
from py_ipld_dag_pb import DAGPB

# Example usage (conceptual - requires data)
# node = {'data': 'example'}
# serialized_node = DAGPB.encode(node)
# deserialized_node = DAGPB.decode(serialized_node)
# print(deserialized_node)
print("Python py-ipld-dag-pb library imported.")
```

--------------------------------

### IPFS Kubo RPC API: Pin Add

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/pin/add` endpoint of the IPFS Kubo RPC API, used to pin an IPFS object, ensuring it is stored locally and not garbage collected. This is fundamental for keeping data available.

```HTTP
POST /api/v0/pin/add
```

--------------------------------

### Retrieve Content via Filebase Gateway

Source: https://docs.ipfs.tech/quickstart/pin

How to access IPFS content using the Filebase gateway. Replace '[BUCKET_NAME]' and '[CID]' with your specific bucket name and Content Identifier.

```HTTP
https://[BUCKET_NAME].ipfs.filebase.io/ipfs/[CID]
```

--------------------------------

### IPFS Swarm: List Known Addresses

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists all addresses known to the IPFS node. This command is useful for debugging network connectivity. It has subcommands to list listening and local addresses.

```bash
ipfs swarm addrs
```

--------------------------------

### IPFS Swarm: Manage Address Filters

Source: https://docs.ipfs.tech/reference/kubo/cli

Manages address filters for the IPFS swarm. This command lists current filters and allows adding or removing them using the multiaddr-filter format.

```bash
ipfs swarm filters
```

--------------------------------

### C IPFS Implementation (c-ipfs)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

c-ipfs is an IPFS implementation written in C.

```C
#include <stdio.h>

int main() {
    // Placeholder for c-ipfs functionality
    printf("c-ipfs: IPFS implementation in C\n");
    return 0;
}
```

--------------------------------

### Check IPFS Node Connectivity with Identify Protocol

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

Verify if your IPFS node can connect to another node using the 'ipfs id' command. This command resolves the PeerID, connects to the node, and runs the identify protocol.

```bash
ipfs id <peerId>
```

--------------------------------

### JavaScript IPFS Client Usage

Source: https://docs.ipfs.tech/case-studies/arbol

Demonstrates how Arbol's custom client libraries in JavaScript interact with IPFS, likely for querying and retrieving data. It involves converting human-readable queries into IPFS hashes.

```JavaScript
import { create } from 'ipfs-http-client';

const ipfs = create({ url: '/ip4/127.0.0.1/tcp/5001' });

async function queryData(datasetId, query) {
  // Logic to convert query to hash and fetch data from IPFS
  const metadataHash = await getMetadataHash(datasetId);
  const headHash = await getHeadHash(metadataHash);
  const data = await ipfs.cat(headHash);
  // Process and return data in appropriate structure
  return data;
}
```

--------------------------------

### IPFS Kubo RPC API: List Directory

Source: https://docs.ipfs.tech/reference/kubo/rpc

This entry covers the `/api/v0/ls` endpoint for the IPFS Kubo RPC API, used to list the contents of an IPFS directory or retrieve information about an IPFS object. It requires a CID.

```HTTP
GET /api/v0/ls
```

--------------------------------

### ipfs cid: Convert and Discover CID Properties

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides subcommands for converting and discovering properties of Content Identifiers (CIDs). It allows listing available multibase encodings and multicodecs, converting CIDs to Base32, and formatting CIDs in various ways.

```bash
ipfs cid
```

--------------------------------

### IPFS Kubo RPC API: Config Replace

Source: https://docs.ipfs.tech/reference/kubo/rpc

This entry covers the `/api/v0/config/replace` endpoint for the IPFS Kubo RPC API, which replaces the entire node configuration with a provided JSON object. Use with caution as it overwrites existing settings.

```HTTP
POST /api/v0/config/replace
```

--------------------------------

### IPFS Mount Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Mounts IPFS to the filesystem in a read-only manner. It allows access to IPFS objects through a specified mount point, which can be configured for IPFS, IPNS, and MFS. The command requires the IPFS daemon to be running.

```bash
ipfs mount

```

```bash
# setup
mkdir foo
 echo "baz" > foo/bar
 ipfs add -r foo
ipfs ls QmSh5e7S6fdcu75LAbXNZAFY2nGyZUJXyLCJDvn2zRkWyC
ipfs cat QmWLdkp93sNxGRjnFHPaYg8tCQ35NBY3XPn6KiETd3Z4WR

# mount
ipfs daemon &
ipfs mount
cd /ipfs/QmSh5e7S6fdcu75LAbXNZAFY2nGyZUJXyLCJDvn2zRkWyC
l s
cat bar
cat /ipfs/QmSh5e7S6fdcu75LAbXNZAFY2nGyZUJXyLCJDvn2zRkWyC/bar
cat /ipfs/QmWLdkp93sNxGRjnFHPaYg8tCQ35NBY3XPn6KiETd3Z4WR
```

```bash
sudo mkdir /ipfs /ipns /mfs
sudo chown $(whoami) /ipfs /ipns /mfs
ipfs daemon &
ipfs mount
```

--------------------------------

### Write to IPFS Files

Source: https://docs.ipfs.tech/reference/kubo/rpc

Writes data to IPFS files, with options to create directories, truncate files, and control block creation. It accepts file data in the request body as multipart/form-data.

```bash
curl -X POST -F file=@myfile "http://127.0.0.1:5001/api/v0/files/write?arg=<path>&offset=<value>&create=<value>&parents=<value>&truncate=<value>&count=<value>&raw-leaves=<value>&cid-version=<value>&hash=<value>"
```

--------------------------------

### IPFS Config Profile: Autoconf On

Source: https://docs.ipfs.tech/reference/kubo/cli

Configures the node to use implicit defaults from a remote autoconf service. Bootstrap peers, DNS resolvers, delegated routers, and IPNS delegated publishers are set to 'auto'. Requires AutoConf to be enabled and configured.

```bash
ipfs config profile apply autoconf-on
```

--------------------------------

### Add File to IPFS

Source: https://docs.ipfs.tech/how-to/publish-ipns

Adds the 'hello.txt' file to IPFS and generates a Content Identifier (CID) for it. The --cid-version 1 flag ensures the use of CID v1.

```shell
ipfs add --cid-version 1 hello.txt

```

--------------------------------

### Find IPFS Providers

Source: https://docs.ipfs.tech/reference/kubo/rpc

Finds peers that can provide a specific value, identified by a key. Allows specifying the number of providers to find.

```json
{
  "Extra": "<string>",
  "ID": "<peer-id>",
  "Responses": [
    {
      "Addrs": [
        "<multiaddr-string>"
      ],
      "ID": "peer-id"
    }
  ],
  "Type": "<int>"
}
```

--------------------------------

### IPFS Print System Diagnostics

Source: https://docs.ipfs.tech/reference/kubo/cli

Prints system diagnostic information to aid in debugging. This command provides details about the user's computer.

```bash
ipfs diag sys
```

--------------------------------

### Python IPFS Client Usage

Source: https://docs.ipfs.tech/case-studies/arbol

Illustrates the use of Arbol's custom client libraries in Python for interacting with IPFS. This includes querying data by converting human-readable requests into IPFS hashes.

```Python
from jsipfsapi import IPFSClient

client = IPFSClient('http://127.0.0.1:5001')

def query_data(dataset_id, query):
  # Logic to convert query to hash and fetch data from IPFS
  metadata_hash = get_metadata_hash(dataset_id)
  head_hash = get_head_hash(metadata_hash)
  data = client.cat(head_hash)
  # Process and return data in appropriate structure
  return data
```

--------------------------------

### IPFS Swarm: Connect to Peer

Source: https://docs.ipfs.tech/reference/kubo/cli

Attempts to establish or ensure a connection to a specified peer using its multiaddress. The provided addresses are advisory, and the node may already be connected or aware of other addresses for the peer.

```bash
ipfs swarm connect <address>...
```

--------------------------------

### Lotus (Go)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Lotus is a Filecoin node implementation responsible for handling consensus, storage providing, making storage deals, and importing data.

```go
Lotus: Filecoin node handling consensus, storage providing, making storage deals, importing data.
```

--------------------------------

### IPFS API: Show Name Subscriptions

Source: https://docs.ipfs.tech/reference/kubo/rpc

Displays current name subscriptions. It accepts an optional 'ipns-base' argument to specify the encoding for keys.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/name/pubsub/subs?ipns-base=base36"
```

--------------------------------

### IPFS Kubo RPC API: Multibase Transcode

Source: https://docs.ipfs.tech/reference/kubo/rpc

This entry covers the `/api/v0/multibase/transcode` endpoint for the IPFS Kubo RPC API, which transcodes a multibase-encoded string from one base to another. This is useful for format conversion.

```HTTP
GET /api/v0/multibase/transcode
```

--------------------------------

### IPFS Block Put Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Stores input data as an IPFS block. It allows customization of CID codec, multihash type, and hash length. Optionally, blocks can be pinned and larger blocks are supported with a warning.

```bash
ipfs block put <data>...
ipfs block put [--cid-codec=<cid-codec>] [--mhtype=<mhtype>] [--mhlen=<mhlen>]
               [--pin] [--allow-big-block] [--format=<format> | -f] [--] <data>...

Arguments:
  <data>... - The data to be stored as an IPFS block.

Options:
  --cid-codec        string - Multicodec to use in returned CID. Default: raw.
  --mhtype           string - Multihash hash function.
  --mhlen            int    - Multihash hash length. Default: -1.
  --pin              bool   - Pin added blocks recursively. Default: false.
  --allow-big-block  bool   - Disable block size check and allow creation of
                              blocks bigger than 1MiB. WARNING: such blocks
                              won't be transferable over the standard bitswap.
                              Default: false.
  -f, --format       string - Use legacy format for returned CID (DEPRECATED).
```

--------------------------------

### IPFS Files Touch Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Sets or changes the modification times for files in IPFS MFS. This is an experimental command.

```bash
ipfs files touch <path>
ipfs files touch [--mtime=<mtime>] [--mtime-nsecs=<mtime-nsecs>] [--] <path>

# Examples:
# set modification time to now.
$ ipfs files touch /foo
# set a custom modification time.
$ ipfs files touch --mtime=1630937926 /foo
```

--------------------------------

### Removed Object Links Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/object/links command has been removed. Users should now use 'ipfs dag' or 'ipfs files' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/object/links"
```

--------------------------------

### Python IPFS RPC Clients

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Lists two Python client libraries for the Kubo IPFS RPC API: 'ipfs-shipyard/py-ipfs-http-client' and 'aioipfs'. Both are marked as Active.

```Python
ipfs-shipyard/py-ipfs-http-client
```

```Python
aioipfs
```

--------------------------------

### IPFS DAG Import Command

Source: https://docs.ipfs.tech/reference/kubo/cli

This command imports blocks from .car files into IPFS. It supports options to control pinning of roots, silence output, display statistics, and allow larger blocks. The command can process multiple .car files.

```bash
ipfs dag import [--pin-roots=false] [--silent] [--stats] [--allow-big-block] [--] <path>...
```

--------------------------------

### IPFS Config Edit - Open Config File

Source: https://docs.ipfs.tech/reference/kubo/cli

Opens the IPFS configuration file in the default text editor specified by the $EDITOR environment variable.

```shell
ipfs config edit
```

--------------------------------

### Backup Bootstrap List

Source: https://docs.ipfs.tech/how-to/modify-bootstrap-list

Saves the current IPFS bootstrap list to a file by redirecting the output of the 'ipfs bootstrap list' command.

```bash
ipfs bootstrap list >save
```

--------------------------------

### Relay Node Implementations

Source: https://docs.ipfs.tech/concepts/nodes

This snippet lists standalone implementations for relay nodes, which are crucial for enabling communication between IPFS nodes that might otherwise be unreachable. These implementations are typically found in JavaScript and Go.

```go
go-libp2p-relay-daemon
```

--------------------------------

### List Swarm Peers

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists peers with open connections to the IPFS node. Supports filtering by verbosity, streams, latency, direction, and identify information.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/swarm/peering/ls"
```

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/swarm/peers?verbose=<value>&streams=<value>&latency=<value>&direction=<value>&identify=<value>"
```

--------------------------------

### IPFS Provide Control

Source: https://docs.ipfs.tech/reference/kubo/cli

Controls content providing operations within the IPFS node. This is an experimental command with subcommands for managing the provide queue and statistics.

```bash
ipfs provide
```

--------------------------------

### IPVM Specification: High-Level Overview

Source: https://docs.ipfs.tech/concepts/cod

The InterPlanetary Virtual Machine (IPVM) specification defines a method for running decentralized compute jobs on IPFS using WebAssembly (Wasm), content addressing, and simple public key infrastructure (SPKI). It aims to be an open, decentralized alternative to services like AWS Lambda.

```Text
IPVM: The Long-Fabled Execution Layer
https://ipfs.tech/docs/compute-over-data/#ipvm-the-long-fabled-execution-layer
```

--------------------------------

### IPFS Version Check

Source: https://docs.ipfs.tech/reference/kubo/cli

Checks the Kubo version against connected peers using the libp2p identify protocol. It can warn if the current version is outdated based on a configurable percentage of peers.

```bash
ipfs version check [--min-percent=<min-percent> | -t]
```

--------------------------------

### Provide IPFS Values (cURL)

Source: https://docs.ipfs.tech/reference/kubo/rpc

This cURL command announces provided values to the IPFS network. It targets the '/api/v0/routing/provide' endpoint and accepts optional verbose and recursive flags.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/routing/provide?arg=<key>&verbose=<value>&recursive=<value>"
```

--------------------------------

### IPFS Glossary: Announcing Definition

Source: https://docs.ipfs.tech/concepts/glossary

Defines Announcing as a function of the IPFS networking layer in libp2p, enabling a peer to inform other peers about available data blocks.

```English
Announcing is a function of the IPFS networking layer in libp2p, wherein a peer can tell other peers that it has data blocks available.
```

--------------------------------

### IPFS Gateway URLs

Source: https://docs.ipfs.tech/concepts/public-utilities

Provides the URLs for public IPFS gateways hosted by the IPFS Foundation. These gateways allow retrieval of data from the IPFS network.

```URL
https://ipfs.io
```

```URL
https://dweb.link
```

```URL
https://trustless-gateway.link
```

--------------------------------

### JavaScript/TypeScript IPFS Implementation (Elastic IPFS)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Elastic IPFS is a scalable, cloud-native IPFS implementation using JavaScript and TypeScript.

```javascript
import { create } from '@elastic-ipfs/core';

async function run() {
  const ipfs = await create();
  console.log('Elastic IPFS node is running.');
  // Example: Add a file
  const result = await ipfs.add('Hello, Elastic IPFS!');
  console.log('Added:', result.cid.toString());
}

run();
```

```typescript
import { create } from '@elastic-ipfs/core';

async function run(): Promise<void> {
  const ipfs = await create();
  console.log('Elastic IPFS node is running.');
  // Example: Add a file
  const result = await ipfs.add('Hello, Elastic IPFS!');
  console.log('Added:', result.cid.toString());
}

run();
```

--------------------------------

### List Swarm Addresses

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists all known addresses in the IPFS swarm. This is useful for debugging network connectivity. The response contains a map of peer IDs to their addresses.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/swarm/addrs"
```

--------------------------------

### IPFS Commands Completion Bash - Generate Bash Completions

Source: https://docs.ipfs.tech/reference/kubo/cli

Generates command completions specifically for the bash shell. The completions can be saved to a file and sourced.

```bash
# Generate bash completions
ipfs commands completion bash > ipfs-completion.bash
# Source the completions
source ./ipfs-completion.bash
```

--------------------------------

### Relay Node Implementations

Source: https://docs.ipfs.tech/concepts/nodes

This snippet lists standalone implementations for relay nodes, which are crucial for enabling communication between IPFS nodes that might otherwise be unreachable. These implementations are typically found in JavaScript and Go.

```javascript
js-libp2p/circuit-relay
```

--------------------------------

### Add Remote Pinning Service Configuration

Source: https://docs.ipfs.tech/reference/kubo/rpc

Adds a new remote pinning service to the configuration, requiring the service name, API endpoint, and an authentication key.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/pin/remote/service/add?arg=<service>&arg=<endpoint>&arg=<key>"
```

--------------------------------

### Add a file to IPFS, wrapping it in a directory

Source: https://docs.ipfs.tech/reference/kubo/cli

Adds a file to IPFS and wraps it in a directory. This preserves the original filename. The output shows the CID of the file and the CID of the wrapping directory.

```bash
ipfs add example.jpg -w
```

--------------------------------

### Execute IPFS Reprovider Stats Query (cURL)

Source: https://docs.ipfs.tech/reference/kubo/rpc

This cURL command sends a POST request to the IPFS API to retrieve reprovider statistics. It targets the '/api/v0/provide/stat' endpoint.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/provide/stat"
```

--------------------------------

### Retrieve IPFS Object Data

Source: https://docs.ipfs.tech/reference/kubo/rpc

Fetches and displays the data of an IPFS object. Requires the path to the IPFS object. Supports reading from a specific offset and length, and streaming progress data.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/cat?arg=<ipfs-path>&offset=<value>&length=<value>&progress=true"
```

--------------------------------

### Scala IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Includes the 'ipfs-shipyard/scala-ipfs-api' library for Scala users to connect to the Kubo IPFS RPC API. This client is currently Inactive.

```Scala
ipfs-shipyard/scala-ipfs-api
```

--------------------------------

### Manage IPFS Remote Pins

Source: https://docs.ipfs.tech/reference/kubo/cli

Provides subcommands for managing pins on remote pinning services. This includes adding, listing, removing pins, and configuring the remote pinning services themselves.

```bash
ipfs pin remote
ipfs pin remote add <ipfs-path>
ipfs pin remote ls
ipfs pin remote rm
ipfs pin remote service
```

--------------------------------

### Restart Caddy Service

Source: https://docs.ipfs.tech/how-to/kubo-rpc-tls-auth

This command restarts the Caddy service to apply the changes made to the Caddyfile, ensuring the reverse proxy and logging configurations are active.

```bash
sudo systemctl restart caddy
```

--------------------------------

### Query IPFS Routing (cURL)

Source: https://docs.ipfs.tech/reference/kubo/rpc

This cURL command queries the IPFS routing system for a specific key. It sends a POST request to the '/api/v0/routing/get' endpoint with the key as a parameter.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/routing/get?arg=<key>"
```

--------------------------------

### IPFS Kubo RPC API: CID Hashes

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/cid/hashes` endpoint of the IPFS Kubo RPC API, which lists the supported hash functions used in CID generation. Hash functions are critical for data integrity.

```HTTP
GET /api/v0/cid/hashes
```

--------------------------------

### Pin a CID with a name in IPFS Kubo

Source: https://docs.ipfs.tech/how-to/work-with-pinning-services

This command pins a Content Identifier (CID) to a specified remote pinning service using a human-readable name. Replace `<nickname>` with the name you assigned when adding the service and provide the CID you wish to pin.

```bash
$ ipfs pin remote add --service=<nickname> --name=war-and-peace.txt bafybeib32tuqzs2wrc52rdt56cz73sqe3qu2deqdudssspnu4gbezmhig4
```

--------------------------------

### Helia: IPFS Implementation for JS/Browser

Source: https://docs.ipfs.tech/concepts/glossary

Helia is a modern, modular IPFS implementation for JavaScript and browser environments, superseding js-ipfs. It provides a lean and flexible way to interact with IPFS.

```javascript
import { createHelia } from '@helia/helia'

async function main () {
  const helia = await createHelia()
  console.log('Helia node created')
  // ... use helia for IPFS operations
}

main()
```

--------------------------------

### IPFS Kubo RPC API: Files List

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the `/api/v0/files/ls` endpoint for the IPFS Kubo RPC API, which lists the contents of a directory in the IPFS filesystem. It returns a list of files and their metadata.

```HTTP
GET /api/v0/files/ls
```

--------------------------------

### Interact with IPFS Kubo via HTTP RPC API

Source: https://docs.ipfs.tech/index

This section details how to control an IPFS Kubo node using its HTTP RPC API. This API allows for interoperability across multiple clients and languages, providing a standardized way to interact with IPFS nodes.

```HTTP
POST /api/v0/add HTTP/1.1
Host: localhost:5001
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="example.txt"
Content-Type: text/plain

Hello IPFS RPC!
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

--------------------------------

### IPFS Files ls: List directory contents

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists the contents of a directory within the IPFS MFS. It supports a long listing format for more detailed output and an option to disable sorting, listing entries in their directory order.

```bash
ipfs files ls [<path>]
ipfs files ls [--long | -l] [-U] [--] [<path>]
```

--------------------------------

### List Listening Addresses

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves a list of interface addresses that the IPFS node is listening on. The response is a JSON object containing an array of strings, where each string is a listening address.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/swarm/addrs/listen"
```

--------------------------------

### Configure Kubo API with CORS and Auth

Source: https://docs.ipfs.tech/how-to/kubo-rpc-tls-auth

This snippet shows how to configure the Kubo API settings in the `~/.ipfs/config` file. It includes setting CORS headers to allow specific origins and configuring basic HTTP authentication for API access, restricting it to `/api/v0` endpoints.

```json
{
  "API": {
    "HTTPHeaders": {
      "Access-Control-Allow-Origin": ["https://YOUR_DOMAIN"],
      "Access-Control-Allow-Credentials": ["true"]
    },
    "Authorizations": {
      "api": {
        "AuthSecret": "basic:hello:world123",
        "AllowedPaths": [
          "/api/v0"
        ]
      }
    }
  }
}
```

--------------------------------

### IPFS Object Data (Removed)

Source: https://docs.ipfs.tech/reference/kubo/cli

This command has been removed and is no longer available. Use 'ipfs dag' or 'ipfs files' for interacting with IPFS objects.

```bash
ipfs object data
```

--------------------------------

### Explore IPLD DAGs with IPLD Explorer

Source: https://docs.ipfs.tech/reference/diagnostic-tools

IPLD Explorer allows visualization and exploration of the IPLD DAG for a given CID or CAR file. It helps understand the structure of content-addressed data.

```HTML
<a href="https://explore.ipld.waterproof.network/">IPLD Explorer</a>
```

--------------------------------

### Verify IPFS Filestore

Source: https://docs.ipfs.tech/reference/kubo/cli

Verifies objects within the IPFS filestore. It can verify specific objects or all objects, with options to order by file and remove corrupted blocks. The output indicates the status of each block.

```bash
ipfs filestore verify [<obj>]...
ipfs filestore verify [--file-order] [--remove-bad-blocks] [--] [<obj>...]
```

--------------------------------

### Update File and IPNS Record

Source: https://docs.ipfs.tech/how-to/publish-ipns

Modifies the 'hello.txt' file, adds the updated version to IPFS, and then publishes the new CID to IPNS, updating the mutable link.

```shell
echo "Hello again IPFS" > hello.txt
ipfs add hello.txt
ipfs name publish bafkreidbbor7mvra2xzzl4kmr2sxrtkzaxlzs6rsr5ktgmbtousuzrhlxq

```

--------------------------------

### Iroh (Rust)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

Iroh is an IPFS implementation focused on extreme efficiency, suitable for various applications requiring high performance.

```rust
Iroh: Extreme-efficiency oriented IPFS implementation.
```

--------------------------------

### Retrieve Content via Storacha Gateway (w3s.link)

Source: https://docs.ipfs.tech/quickstart/pin

Two common formats for accessing IPFS content through the Storacha gateway (w3s.link). Replace '[CID]' with the Content Identifier.

```HTTP
https://[CID].ipfs.w3s.link
```

```HTTP
https://w3s.link/ipfs/[CID]
```

--------------------------------

### IPFS Files cp: Copy files and directories

Source: https://docs.ipfs.tech/reference/kubo/cli

Copies files or directories into the IPFS Mutable File System (MFS) or between MFS paths. It supports lazy copying, where only the root node is fetched, and can overwrite existing files or create parent directories as needed. It can also be used to add content from IPFS CIDs into MFS.

```bash
ipfs files cp <source> <dest>
ipfs files cp [--force] [--parents | -p] [--] <source> <dest>
```

--------------------------------

### Garbage Collect IPFS Repository

Source: https://docs.ipfs.tech/how-to/kubo-basic-cli

Removes all unpinned data from your IPFS node's repository. This is a crucial step to reclaim disk space after unpinning files, as it physically deletes the data that is no longer referenced.

```bash
ipfs repo gc
```

--------------------------------

### IPFS Object Diff

Source: https://docs.ipfs.tech/reference/kubo/rpc

Compares two IPFS objects. It accepts arguments for the objects to diff and an optional verbose flag for extra information. Returns a JSON object detailing the changes.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/object/diff?arg=<obj_a>&arg=<obj_b>&verbose=<value>"
```

--------------------------------

### IPFS Pubsub List Topics

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists subscribed topics by name. This is a deprecated command. It returns a JSON object containing a list of topic strings.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/pubsub/ls"
```

--------------------------------

### IPFS Kubo RPC API: Bootstrap Remove All

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the `/api/v0/bootstrap/rm/all` endpoint for the IPFS Kubo RPC API, which removes all peers from the bootstrap list. This is a drastic measure to reset network connections.

```HTTP
POST /api/v0/bootstrap/rm/all
```

--------------------------------

### Restart Kubo Service

Source: https://docs.ipfs.tech/how-to/kubo-rpc-tls-auth

This command restarts the Kubo service, typically managed by systemd. This is necessary after updating the Kubo configuration file to apply the changes.

```bash
sudo systemctl restart kubo
```

--------------------------------

### Subdomain Gateway URL Structure

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

This shows the structure for accessing IPFS content via a subdomain gateway, using a CIDv1 in a case-insensitive encoding. This method is recommended for origin-based security.

```URL
https://<cidv1b32>.ipfs.<gateway-host>.tld/path/to/resource
```

--------------------------------

### Sign Data with IPFS Key

Source: https://docs.ipfs.tech/reference/kubo/rpc

Generates a signature for given data using a specified IPFS key. This is useful for proving key ownership. It requires the key name and accepts data via multipart/form-data.

```bash
curl -X POST -F file=@myfile "http://127.0.0.1:5001/api/v0/key/sign?key=<value>&ipns-base=base36"
```

--------------------------------

### Secure Key-Based Routing Protocol for Decentralized Systems

Source: https://docs.ipfs.tech/concepts/further-reading/academic-papers

This paper from the Institute of Electrical and Electronics Engineers (2007) proposes a practicable approach to secure key-based routing in decentralized peer-to-peer systems. It introduces extensions to the Kademlia protocol, enhancing security against common attacks through parallel lookups over multiple disjoint paths, limiting free nodeId generation with crypto puzzles, and implementing a reliable sibling broadcast for safe, replicated data storage. The paper includes analytical security evaluations and simulation results.

```text
A practicable approach towards secure key-based routing
Institute of Electrical and Electronics Engineers, 2007
Baumgart, Ingmar and Mies, Sebastian : Security is a common problem in completely decentralized peer-to-peer systems. Although several suggestions exist on how to create a secure key-based routing protocol, a practicable approach is still unattended. In this paper, we introduce a secure key-based routing protocol based on Kademlia that has a high resilience against common attacks by using parallel lookups over multiple disjoint paths, limiting free nodeId generation with crypto puzzles, and introducing a reliable sibling broadcast. The latter is needed to store data in a safe, replicated way. We evaluate the security of our proposed extensions to the Kademlia protocol analytically and simulate the effects of multiple disjoint paths on lookup success under the influence of adversarial nodes
```

--------------------------------

### IPFS Gateway Access Canonical Forms

Source: https://docs.ipfs.tech/how-to/gateway-best-practices

This table outlines the canonical forms of access for different IPFS gateway types, including IPNS subdomain, IPFS DNSLink, and IPFS subdomain, detailing their features and considerations for accessing mutable and immutable content.

```Markdown
Target | Preferred gateway type | Canonical form of access   
features & considerations  
---|---|---
Current version of   
potentially mutable root | IPNS subdomain |  `https://{IPNS identifier}.ipns.{gatewayURL}/{optional path to resource}`   
+ supports cross-origin security   
+ supports cross-origin resource sharing   
+ suitable for both domain IPNS names (`{domain.tld}`) and hash IPNS names  
| IPFS DNSLink |  `https://{example.com}/{optional path to resource}`   
+ supports cross-origin security   
+ supports cross-origin resource sharing   
– requires DNS update to propagate change to root content   
• DNSLink, not user/app, specifies the gateway to use, opening up potential gateway trust and congestion issues  
Immutable root or   
content | IPFS subdomain |  `https://{CID}.ipfs.{gatewayURL}/{optional path to resource}`   
+ supports cross-origin security   
+ supports cross-origin resource sharing  
```

--------------------------------

### IPFS Kubo RPC API: Config

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section describes the `/api/v0/config` endpoint for the IPFS Kubo RPC API, which allows viewing and modifying the IPFS node's configuration. It's a central point for managing node settings.

```HTTP
GET /api/v0/config
```

```HTTP
POST /api/v0/config
```

--------------------------------

### Removed Object Data Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/object/data command has been removed. Users should now use 'ipfs dag' or 'ipfs files' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/object/data"
```

--------------------------------

### Adjust Kubo Logging Level

Source: https://docs.ipfs.tech/how-to/troubleshooting-kubo

For deeper inspection of Kubo's subsystems, you can adjust the logging level using `ipfs log level`. This command helps in understanding the behavior of different components.

```bash
ipfs log level
```

--------------------------------

### IPFS Kubo RPC API: Files Flush

Source: https://docs.ipfs.tech/reference/kubo/rpc

This entry covers the `/api/v0/files/flush` endpoint for the IPFS Kubo RPC API, which ensures that all data for a given path is written to the IPFS blockstore. This is crucial for making data available.

```HTTP
POST /api/v0/files/flush
```

--------------------------------

### IPFS Key Sign

Source: https://docs.ipfs.tech/reference/kubo/cli

Generates a signature for given data using a specified key, useful for proving key ownership. It's an experimental command and supports specifying the key and IPNS base encoding.

```bash
ipfs key sign <data>ipfs key sign [--key=<key> | -k] [--ipns-base=<ipns-base>] [--] <data>
```

--------------------------------

### Add Content to Remote Pinning Service

Source: https://docs.ipfs.tech/reference/kubo/rpc

Adds a CID or path to a specified remote pinning service. Optionally allows naming the pin and queuing the operation without waiting for completion.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/pin/remote/add?arg=<ipfs-path>&service=<value>&name=<value>&background=false"
```

--------------------------------

### Nebula libp2p DHT Crawler

Source: https://docs.ipfs.tech/concepts/measuring

Nebula is a libp2p DHT crawler used to calculate DHT server availability by tracking connection success and failure sessions with DHT Server peers.

```Go
package main

import (
	"fmt"
	"net"
	"time"
)

// Simulate a DHT crawler
func main() {
	fmt.Println("Starting Nebula DHT crawler...")
	// In a real scenario, this would involve libp2p
	// For demonstration, we simulate peer interactions
	peerID := "QmPeerIDExample"
	startTime := time.Now()

	// Simulate connection attempts
	for i := 0; i < 5; i++ {
		// Simulate successful connection
		fmt.Printf("Attempt %d: Connecting to peer %s... Success\n", i+1, peerID)
		// In a real crawler, session would be extended here
		time.Sleep(2 * time.Second)
	}

	// Simulate a failed connection ending a session
	fmt.Printf("Simulating a failed connection to peer %s... Session ended.\n", peerID)
	// In a real crawler, session would be marked as ended
	time.Sleep(1 * time.Second)

	// Simulate another successful connection starting a new session
	fmt.Printf("Simulating a new connection attempt to peer %s... New session started.\n", peerID)
	// In a real crawler, a new session would be initiated
	time.Sleep(2 * time.Second)

	duration := time.Since(startTime)
	fmt.Printf("Nebula crawler finished. Total runtime: %s\n", duration)
}

```

--------------------------------

### List blocks of an IPFS object

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists the blocks that constitute an IPFS object, identified by its CID. This is useful for inspecting the structure of added content.

```bash
ipfs ls QmafrLBfzRLV4XSH1XcaMMeaXEUhDJjmtDfsYU95TrWG87
```

--------------------------------

### Configure IPFS Kubo Peering

Source: https://docs.ipfs.tech/how-to/peering-with-content-providers

This configuration snippet shows how to add specific peers, like Cloudflare's IPFS nodes, to your IPFS Kubo configuration file. This allows your node to maintain long-lived connections with these providers, potentially speeding up data retrieval.

```json
{
  "Peering": {
    "Peers": [
      {
        "ID": "QmcfgsJsMtx6qJb74akCw1M24X1zFwgGo11h1cuhwQjtJP",
        "Addrs": ["/dnsaddr/node-8.ingress.cloudflare-ipfs.com"]
      }
    ]
  }
}
```

--------------------------------

### Configure Helia Peer Discovery

Source: https://docs.ipfs.tech/concepts/nodes

This snippet explains how to configure the peer discovery options for a Helia node to control the list of bootstrap nodes it connects to for DHT interaction.

```javascript
heliaNode.libp2p.peerDiscovery.configure({
  // Configuration for peer discovery, including bootstrap nodes
});
```

--------------------------------

### IPFS Collect Performance Profile

Source: https://docs.ipfs.tech/reference/kubo/cli

Collects a performance profile for debugging a running go-ipfs daemon. It can save the output to a zip file and customize which data collectors are used and for how long profiling occurs.

```bash
ipfs diag profile [--output=<output> | -o] [--collectors=<collectors>]... [--profile-time=<profile-time>] [--mutex-profile-fraction=<mutex-profile-fraction>] [--block-profile-rate=<block-profile-rate>]
```

--------------------------------

### Check IPFS Node Reachability

Source: https://docs.ipfs.tech/how-to/gateway-best-practices

This command checks if an IPFS node is publicly reachable by examining its advertised protocols, specifically looking for the `/ipfs/kad/1.0.0` value which indicates participation in the Kademlia DHT.

```Shell
ipfs id | grep ipfs\/kad
```

--------------------------------

### Profile IPFS Performance

Source: https://docs.ipfs.tech/reference/kubo/rpc

Collects a performance profile for IPFS debugging. Allows specifying output path, collectors, profiling time, and mutex/block profile rates.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/diag/profile?output=<value>&collectors=[goroutines-stack goroutines-pprof version heap allocs bin cpu mutex block trace]&profile-time=30s&mutex-profile-fraction=4&block-profile-rate=1ms"

```

--------------------------------

### List IPFS Keys

Source: https://docs.ipfs.tech/reference/kubo/rpc

Retrieves a list of all local keypairs stored in the IPFS keychain. Optionally, it can display extra information about each key. Keys can be filtered by IPNS base encoding.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/key/list?l=<value>&ipns-base=base36"
```

--------------------------------

### Convert CID v1 to v0 using JavaScript

Source: https://docs.ipfs.tech/concepts/content-addressing

This JavaScript code snippet demonstrates converting an IPFS CID from version 1 back to version 0 using the `toV0()` method from the `multiformats` library. It shows parsing a v1 CID and retrieving its v0 string representation.

```javascript
const v1 = CID.parse('bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku')
v1.toString()
//> 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku'
v1.toV0().toString()
//> 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n'

```

--------------------------------

### Find IPFS Peer Multiaddresses

Source: https://docs.ipfs.tech/reference/kubo/cli

Finds and outputs the multiaddresses associated with a given Peer ID. Supports a verbose option for extra output.

```bash
ipfs routing findpeer <peerID>
```

```bash
ipfs routing findpeer -v <peerID>
```

--------------------------------

### IPFS Subdomain Gateway Addressing

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

Illustrates the subdomain gateway format for IPFS addressing, which is used for website hosting with origin isolation. This method places the CID as a subdomain before the gateway host, followed by the path.

```HTTP
https://<cid>.ipfs.<gateway-host>/<path>
```

--------------------------------

### Ruby IPFS RPC Clients

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Features two Ruby client libraries for the Kubo IPFS RPC API: 'Fryie/ipfs-ruby' and 'tbenett/ruby-ipfs-http-client'. Both are marked as Inactive.

```Ruby
Fryie/ipfs-ruby
```

```Ruby
tbenett/ruby-ipfs-http-client
```

--------------------------------

### Updating File Bucket Root Hash with ipfs-http-client

Source: https://docs.ipfs.tech/case-studies/fleek

This code illustrates how Fleek uses `ipfs-http-client` to update the mutable hash of a file bucket to its root hash. This is crucial for ensuring that changes to stored files are correctly reflected and accessible through IPFS.

```javascript
import { create } from 'ipfs-http-client';

const ipfs = create({
  url: '/ip4/127.0.0.1/tcp/5001',
});

async function updateFileBucketRoot(bucketPath, newRootCid) {
  try {
    // Assuming bucketPath is a mutable path or a reference that can be updated
    // In a real scenario, this might involve updating a specific record or pointer.
    // For demonstration, we'll simulate updating a reference.
    console.log(`Updating root CID for bucket ${bucketPath} to ${newRootCid}`);
    // A more concrete implementation would involve specific IPFS operations
    // or a higher-level abstraction provided by Fleek/Textile.
    // Example: If using IPNS or a similar mutable system:
    // await ipfs.name.publish({ path: newRootCid, name: bucketPath });
    console.log('Root hash update process initiated.');
    return true;
  } catch (error) {
    console.error('Error updating file bucket root hash:', error);
    throw error;
  }
}
```

--------------------------------

### IPFS Pin Remote Service Add

Source: https://docs.ipfs.tech/reference/kubo/cli

Adds a remote pinning service configuration. Requires the service name, endpoint URL, and API key. This command stores the credentials in the IPFS configuration.

```bash
ipfs pin remote service add <service> <endpoint> <key>
```

--------------------------------

### Display Dynamic Headers with JavaScript

Source: https://docs.ipfs.tech/concepts/immutability

This snippet shows an HTML structure with two header elements and a JavaScript code block that dynamically sets their text content from variables. It illustrates how to manipulate the DOM to display changing data.

```html
<body>
  <h1 id="header_1"></h1>
  <h1 id="header_2"></h1>
</body>
```

```javascript
let string_1 = 'hello'
let string_2 = 'world'
document.getElementById('header_1').textContent = string_1
document.getElementById('header_2').textContent = string_2
```

--------------------------------

### Deprecated: Trigger Bitswap Reprovider

Source: https://docs.ipfs.tech/reference/kubo/rpc

This is a deprecated command to announce to bitswap. It is recommended to use 'ipfs routing reprovide' instead. It returns a plain text response.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/bitswap/reprovide"
```

--------------------------------

### IPFS: Pin CID Command (Kubo)

Source: https://docs.ipfs.tech/concepts/lifecycle

The `ipfs pin add` command in Kubo is used to pin a specific CID. This instructs the node to retrieve and store the data associated with the CID, making it available to the network.

```bash
ipfs pin add <CID>
```

--------------------------------

### Configure IPFS CORS Headers

Source: https://docs.ipfs.tech/reference/kubo/cli

This snippet demonstrates how to configure Cross-Origin Resource Sharing (CORS) headers for the IPFS API. It sets the allowed origin, methods, and credentials using the 'ipfs config' command.

```bash
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"example.com\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"GET\", \"POST\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
```

--------------------------------

### IPFS Repo GC Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Performs a garbage collection sweep on the IPFS repository to remove unpinned objects and reclaim disk space. Supports options for streaming errors and controlling output verbosity.

```bash
ipfs repo gc [--stream-errors] [--quiet | -q] [--silent]

Options:
  --stream-errors bool  Stream errors.
  -q, --quiet bool      Write minimal output.
  --silent bool         Write no output.
```

--------------------------------

### Removed Object Patch Append-Data Command

Source: https://docs.ipfs.tech/reference/kubo/rpc

The /api/v0/object/patch/append-data command has been removed. Users should now use 'ipfs dag' or 'ipfs files' instead.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/object/patch/append-data"
```

--------------------------------

### IPFS Pubsub Publish

Source: https://docs.ipfs.tech/reference/kubo/rpc

Publishes data to a given pubsub topic. This is a deprecated command. It requires the topic name and expects the data to be sent as multipart/form-data. The response is plain text.

```bash
curl -X POST -F file=@myfile "http://127.0.0.1:5001/api/v0/pubsub/pub?arg=<topic>"
```

--------------------------------

### Verify Pin

Source: https://docs.ipfs.tech/reference/kubo/rpc

Verifies that recursive pins are complete. It can optionally provide verbose output or only report broken pins.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/pin/verify?verbose=<value>&quiet=<value>"
```

--------------------------------

### IPFS Content Routing with Kademlia DHT

Source: https://docs.ipfs.tech/concepts/how-ipfs-works

Kademlia DHT is a decentralized hash table used by IPFS to find peers storing requested data. It efficiently maps CIDs to peer IP addresses and ports, forming a self-organizing system that leverages libp2p for connectivity.

```Conceptual
Kademlia DHT: Distributed Hash Table for peer discovery in IPFS.
- Stores information about which peers (IPs) have which data (CIDs).
- Uses libp2p for connectivity.
- Efficient and self-organizing.
```

--------------------------------

### IPFS Kubo RPC API: Bitswap Ledger

Source: https://docs.ipfs.tech/reference/kubo/rpc

This entry describes the `/api/v0/bitswap/ledger` endpoint for the IPFS Kubo RPC API. It provides information about the bitswap ledger, which manages data exchange between peers. The documentation implies interaction via HTTP requests.

```HTTP
GET /api/v0/bitswap/ledger
```

--------------------------------

### Retrieve Content via Pinata Gateway

Source: https://docs.ipfs.tech/quickstart/pin

How to access IPFS content using the Pinata gateway. Replace '[CID]' with the actual Content Identifier.

```HTTP
https://gateway.pinata.cloud/ipfs/[CID]
```

--------------------------------

### List IPFS Pub/Sub Peers

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists the peers that the IPFS client is currently connected to for Pub/Sub. If a topic is specified, it lists peers subscribed to that specific topic. This command is part of the deprecated Pub/Sub experimental feature.

```bash
ipfs pubsub peers [<topic>]
```

--------------------------------

### IPFS Config Profile: FlatFS

Source: https://docs.ipfs.tech/reference/kubo/cli

Configures the node to use the flatfs datastore, which stores each block as a separate file. This is a reliable datastore suitable for users prioritizing filesystem integrity, efficient garbage collection, and low memory usage.

```bash
ipfs init --profile flatfs
```

--------------------------------

### Publish IPFS Path with Custom Key

Source: https://docs.ipfs.tech/reference/kubo/cli

Publishes an IPFS path using a specific IPNS key generated via 'ipfs key'. This allows for managing multiple named identities.

```bash
ipfs key gen --type=rsa --size=2048 mykey
ipfs name publish --key=mykey /ipfs/QmatmE9msSfkKxoffpHwNLNKgwZG8eT9Bud6YoPab52vpy
```

--------------------------------

### IPFS Commands Completion Zsh - Generate Zsh Completions

Source: https://docs.ipfs.tech/reference/kubo/cli

Generates command completions for the zsh shell. The completions can be saved to a file and sourced.

```zsh
# Generate zsh completions
ipfs commands completion zsh > ipfs-completion.zsh
# Source the completions
source ./ipfs-completion.zsh
```

--------------------------------

### Python IPFS Implementation (py-ipfs)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

py-ipfs is an IPFS implementation written in Python.

```python
import ipfshttpclient

def main():
    # Connect to the IPFS daemon
    try:
        client = ipfshttpclient.connect()
        print("py-ipfs: Connected to IPFS daemon.")
        # Example: Get IPFS version
        version = client.version()
        print(f"IPFS Version: {version['version']}")
        client.close()
    except Exception as e:
        print(f"Error connecting to IPFS daemon: {e}")

if __name__ == "__main__":
    main()

```

--------------------------------

### Convert CID v0 to v1 using IPFS CLI

Source: https://docs.ipfs.tech/concepts/content-addressing

This command-line snippet demonstrates how to convert an IPFS CID from version 0 to version 1, specifying the 'base32' encoding. It utilizes the built-in `ipfs cid format` command.

```bash
$ ipfs cid format -v 1 -b base32 QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR
bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

```

--------------------------------

### IPFS Kubo RPC API: DAG Put

Source: https://docs.ipfs.tech/reference/kubo/rpc

This entry covers the `/api/v0/dag/put` endpoint for the IPFS Kubo RPC API, used to put DAG nodes into the IPFS repository. It requires the DAG data and optionally a format.

```HTTP
POST /api/v0/dag/put
```

--------------------------------

### IPFS Files mv: Move files

Source: https://docs.ipfs.tech/reference/kubo/cli

Moves files within the IPFS MFS, similar to the traditional Unix 'mv' command. It takes a source path and a destination path as arguments.

```bash
ipfs files mv <source> <dest>
ipfs files mv [--] <source> <dest>
```

--------------------------------

### List Directory Contents - IPFS

Source: https://docs.ipfs.tech/concepts/file-systems

Lists the contents of a directory in the IPFS Mutable File System (MFS). It can default to the root directory or accept a specific path. The output is an array of objects, each containing details like name, type, size, CID, and mode.

```javascript
await ipfs.files.ls([path], [options])
```

```javascript
await ipfs.files.ls('/example')
```

--------------------------------

### Pinning Data Recursively with IPFS

Source: https://docs.ipfs.tech/case-studies/arbol

This command is used by storage nodes in the Arbol network to pin new hashes added to the heads file. The recursive pinning ensures that all associated data blocks are stored and available.

```bash
ipfs pin -r
```

--------------------------------

### IPFS DHT Record Types

Source: https://docs.ipfs.tech/concepts/dht

Describes the different types of key-value pairings managed by the IPFS DHT, including provider records, IPNS records, and peer records. It outlines the purpose of each record type and which IPFS components utilize them for content discovery and routing.

```Markdown
Type | Purpose | Used by  
---|---|---  
Provider records | Map a data identifier (i.e., a multihash) to a peer that has advertised that they have that content and are willing to provide it to you. | - IPFS to find content  
- IPNS over PubSub to find other members of the pubsub _topic_.  
IPNS records | Map an IPNS key (i.e., the hash of a public key) to an IPNS record (i.e., a signed and versioned pointer to a path like `/ipfs/bafyxyz...`) | - IPNS  
Peer records | Map a peerID to a set of multiaddresses at which the peer may be reached | - IPFS when we know of a peer with content, but do not know its address.  
- Manual connections (e.g., `ipfs swarm connect /p2p/Qmxyz...`)  
```

--------------------------------

### IPFS Glossary: BitTorrent Definition

Source: https://docs.ipfs.tech/concepts/glossary

Defines BitTorrent as a peer-to-peer file sharing protocol used for distributing data and electronic files over the internet, and also refers to the first application that used this protocol.

```English
BitTorrent is a communication protocol for peer-to-peer file sharing, which is used to distribute data and electronic files over the Internet. Also, the first file-sharing application to use the protocol. More about BitTorrent protocol(opens new window) and BitTorrent app(opens new window)
```

--------------------------------

### IPFS DHT Statistics

Source: https://docs.ipfs.tech/reference/kubo/cli

Returns statistics about the node's Distributed Hash Tables (DHTs). This command is experimental and its interface may change.

```bash
ipfs stats dht [<dht>]...
```

--------------------------------

### IPFS Kubo RPC API: Filestore Verify

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section describes the `/api/v0/filestore/verify` endpoint for the IPFS Kubo RPC API, which verifies the integrity of files in the filestore. This is important for ensuring data correctness.

```HTTP
GET /api/v0/filestore/verify
```

--------------------------------

### List Object References

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists all links (references) from a given IPFS object. Supports recursive listing and filtering of duplicate references.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/refs?arg=<ipfs-path>&format=<dst>&edges=<value>&unique=<value>&recursive=<value>&max-depth=-1"
```

--------------------------------

### IPFS Kubo RPC API: Files Stat

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section describes the `/api/v0/files/stat` endpoint for the IPFS Kubo RPC API, which returns statistics about a file or directory in the IPFS filesystem, such as its size and CID.

```HTTP
GET /api/v0/files/stat
```

--------------------------------

### PHP IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Features the 'EdouardCourty/ipfs-php' library for PHP developers to connect to the Kubo IPFS RPC API. This client is Active.

```PHP
EdouardCourty/ipfs-php
```

--------------------------------

### IPFS Pin Management

Source: https://docs.ipfs.tech/reference/kubo/cli

Manages the pinning of objects to local IPFS storage. This includes adding, listing, removing, and updating pinned content, as well as managing remote pinning services.

```bash
ipfs pin add <ipfs-path>...
ipfs pin ls [<ipfs-path>]...
ipfs pin remote
ipfs pin rm <ipfs-path>...
ipfs pin update <from-path> <to-path>
ipfs pin verify
```

--------------------------------

### Import DAG from CAR Files

Source: https://docs.ipfs.tech/reference/kubo/rpc

Imports the contents of .car files into IPFS. Supports options for pinning roots, silent operation, statistics output, and allowing large blocks.

```bash
curl -X POST -F file=@myfile "http://127.0.0.1:5001/api/v0/dag/import?pin-roots=true&silent=<value>&stats=<value>&allow-big-block=false"
```

--------------------------------

### IPFS DAG Put Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Adds a Directed Acyclic Graph (DAG) node to IPFS. It accepts object data as input, which can be encoded using specified codecs. Options include setting the store and input codecs, pinning the object, specifying a hash function, and allowing large blocks.

```bash
ipfs dag put [--store-codec=<store-codec>] [--input-codec=<input-codec>] [--pin] [--hash=<hash>] [--allow-big-block] [--] <object data>...
```

--------------------------------

### Mac Automator IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Lists the 'NeoTeo/ipfs-osx-service' for Mac Automator integration with the Kubo IPFS RPC API. This client is Inactive.

```Mac Automator
NeoTeo/ipfs-osx-service
```

--------------------------------

### IPFS Files Write Command

Source: https://docs.ipfs.tech/reference/kubo/cli

Appends data to a file in IPFS MFS, with options to create, truncate, specify offsets, and manage parent directories. It allows for low-level manipulation of files within the IPFS filesystem, optimized for append operations.

```bash
ipfs files write <path> <data>
ipfs files write [--offset=<offset> | -o] [--create | -e] [--parents | -p] [--truncate | -t] [--count=<count> | -n] [--raw-leaves] [--cid-version=<cid-version> | --cid-ver] [--hash=<hash>] [--] <path> <data>

# Example:
# echo "hello world" | ipfs files write --create --parents /myfs/a/b/file
# echo "hello world" | ipfs files write --truncate /myfs/a/b/file
```

--------------------------------

### IPFS Peer Record PUT

Source: https://docs.ipfs.tech/concepts/dht

Describes how peer records are automatically exchanged and stored when libp2p peers connect and interact within the DHT.

```text
Peer information is exchanged automatically upon connection.
Frequent contact with K closest peers inherently shares peer records.
```

--------------------------------

### Add a file to IPFS

Source: https://docs.ipfs.tech/how-to/pin-files

Adds a file named 'foo' to the IPFS network. This command returns the hash of the added file and its size. The file is then pinned by default.

```bash
ipfs add foo           

> added QmRTV3h1jLcACW4FRfdisokkQAk4E4qDhUzGpgdrd4JAFy foo
> 11 B / 11 B [===================] 100.00%
```

--------------------------------

### Upload File to IPFS using Pinata API

Source: https://docs.ipfs.tech/quickstart/pin-cli

This snippet demonstrates how to upload a file to IPFS using the Pinata API via a cURL command. It requires your Pinata API key and secret key for authentication and specifies the file to be uploaded.

```curl
curl -X POST https://api.pinata.cloud/pinning/pinFileToIPFS \
  -H "pinata_api_key: $PINATA_API_KEY" \
  -H "pinata_secret_api_key: $PINATA_SECRET_API_KEY" \
  -F "file=@welcome-to-IPFS.jpg"
```

--------------------------------

### IPFS Pin Add

Source: https://docs.ipfs.tech/reference/kubo/cli

Adds objects to local IPFS storage, protecting them from garbage collection. Supports recursive pinning, naming pins, and displaying progress. Missing blocks are retrieved from the network if the daemon is running.

```bash
ipfs pin add [--recursive=false] [--name=<name> | -n] [--progress] [--] <ipfs-path>...
```

--------------------------------

### Publishing IPNS Names with Kubo

Source: https://docs.ipfs.tech/concepts/ipns

This snippet provides guidance on publishing IPNS names using the Kubo command-line tool. It references the `--ttl` option for adjusting the Time-to-Live setting, which affects caching behavior for IPNS records.

```bash
ipfs name publish --help
```

--------------------------------

### IPFS Provider Record PUT

Source: https://docs.ipfs.tech/concepts/dht

Outlines the process for adding a provider record for a block with Multihash H, involving a lookup for closest peers and storing the record locally and with those peers.

```text
1. Perform standard lookup for K closest peers to SHA256(H).
2. Put provider record at those K peers and store locally.
3. Only allowed to put provider record for self.
```

--------------------------------

### IPFS Kubo RPC API: CID Base32

Source: https://docs.ipfs.tech/reference/kubo/rpc

Documentation for the `/api/v0/cid/base32` endpoint of the IPFS Kubo RPC API, used for encoding and decoding CIDs using the base32 encoding scheme. This is important for interoperability and human readability.

```HTTP
GET /api/v0/cid/base32
```

--------------------------------

### List Peering Peers

Source: https://docs.ipfs.tech/reference/kubo/rpc

Lists all peers that are currently registered in the IPFS peering subsystem. This provides visibility into the manually configured peer connections. The response contains a list of peers, each with their addresses and ID.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/swarm/peering/ls"
```

--------------------------------

### IPFS Kubo RPC API: Filestore Duplicates

Source: https://docs.ipfs.tech/reference/kubo/rpc

This entry covers the `/api/v0/filestore/dups` endpoint for the IPFS Kubo RPC API, which lists duplicate files found in the filestore. This can help in managing storage efficiently.

```HTTP
GET /api/v0/filestore/dups
```

--------------------------------

### Swift IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Features the 'ipfs-shipyard/swift-ipfs-http-client' library for Swift applications to interact with the Kubo IPFS RPC API. This client is Inactive.

```Swift
ipfs-shipyard/swift-ipfs-http-client
```

--------------------------------

### Replace IPFS Configuration

Source: https://docs.ipfs.tech/reference/kubo/rpc

Replaces the IPFS configuration file with a new one provided via a file upload. This operation requires a POST request with the file data.

```bash
curl -X POST -F file=@myfile "http://127.0.0.1:5001/api/v0/config/replace"
```

--------------------------------

### IPFS Kubo RPC API: Block Put

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section details the `/api/v0/block/put` endpoint for the IPFS Kubo RPC API, which is used to add a raw block to the IPFS blockstore. It requires the block data and optionally a codec and hasher.

```HTTP
POST /api/v0/block/put
```

--------------------------------

### Check IPFS Peer Dialability with Helia Identify Tool

Source: https://docs.ipfs.tech/how-to/troubleshooting

This browser-based tool utilizes libp2p's identify protocol to test if a given IPFS peer is dialable. It's useful for diagnosing network connectivity issues, especially when interacting with peers from a browser environment.

```javascript
import { createHelia } from 'helia'
import { identify } from 'helia-identitify'

async function checkPeer(peerId) {
  const helia = await createHelia()
  const result = await identify(helia, peerId)
  console.log(result)
  await helia.stop()
}
```

--------------------------------

### Visualize DAGs from CAR Files with DAG Builder Visualiser

Source: https://docs.ipfs.tech/reference/diagnostic-tools

DAG Builder Visualiser allows users to upload a CAR file and visualize it as a DAG. Users can toggle parameters like DAG type (Balanced, Trickle, Flat) and the maximum number of children for visualization.

```HTML
<a href="https://dag.ipfs.tech/">DAG builder visualiser</a>
```

--------------------------------

### IPFS Config Profile: Low Power

Source: https://docs.ipfs.tech/reference/kubo/cli

Reduces daemon overhead on the system, potentially affecting content discovery and data fetching performance. This profile is suitable for environments where minimizing system resource usage is a priority.

```bash
ipfs config profile apply lowpower
```

--------------------------------

### Python CBOR-based DAG Encoding/Decoding

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

A fast CBOR-based DAG encoding and decoding implementation in Python. This library is useful for efficient handling of DAG-CBOR data structures.

```python
from dag_cbrrr import DAGCBOR

# Example usage:
data = {'key': 'value'}
cbor_data = DAGCBOR.encode(data)
decoded_data = DAGCBOR.decode(cbor_data)
print(decoded_data)
```

--------------------------------

### JavaScript IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Offers the 'ipfs/js-kubo-rpc-client' library for controlling the Kubo IPFS node via its RPC API using JavaScript. This client is Active.

```JavaScript
ipfs/js-kubo-rpc-client
```

--------------------------------

### JavaScript IPFS Implementation (js-ipfs - deprecated)

Source: https://docs.ipfs.tech/concepts/ipfs-implementations

js-ipfs is a JavaScript implementation targeting Node.js and browsers. It is now deprecated and replaced by Helia.

```javascript
import { create } from 'ipfs-core';

async function run() {
  // Note: js-ipfs is deprecated. Consider using Helia.
  const ipfs = await create();
  console.log('js-ipfs node is running (deprecated).');
  const status = await ipfs.version();
  console.log('Version:', status.version);
}

run();
```

```typescript
import { create } from 'ipfs-core';

async function run(): Promise<void> {
  // Note: js-ipfs is deprecated. Consider using Helia.
  const ipfs = await create();
  console.log('js-ipfs node is running (deprecated).');
  const status = await ipfs.version();
  console.log('Version:', status.version);
}

run();
```

--------------------------------

### Add a file to IPFS

Source: https://docs.ipfs.tech/reference/kubo/cli

Adds a single file to IPFS. The command returns the CID of the added file and its name. Files added are implicitly pinned.

```bash
ipfs add example.jpg
```

--------------------------------

### IPFS Kubo RPC API: Pin List

Source: https://docs.ipfs.tech/reference/kubo/rpc

This entry covers the `/api/v0/pin/ls` endpoint for the IPFS Kubo RPC API, which lists all pinned objects on the local IPFS node. This helps in managing stored data.

```HTTP
GET /api/v0/pin/ls
```

--------------------------------

### IPFS Filestore Verify Objects

Source: https://docs.ipfs.tech/reference/kubo/cli

Verifies the integrity of objects stored in the IPFS filestore. This command checks if the stored data matches its expected hash.

```bash
ipfs filestore verify [<obj>]...
```

--------------------------------

### IPFS Kubo RPC API: CID Format

Source: https://docs.ipfs.tech/reference/kubo/rpc

This section describes the `/api/v0/cid/format` endpoint for the IPFS Kubo RPC API, used to format a CID into different representations. This is useful for displaying or processing CIDs.

```HTTP
GET /api/v0/cid/format
```

--------------------------------

### IPFS Key Verify Response Structure

Source: https://docs.ipfs.tech/reference/kubo/rpc

The response structure for the /api/v0/key/verify endpoint, indicating the key details and whether the signature is valid.

```json
{
  "Key": {
    "Id": "<string>",
    "Name": "<string>"
  },
  "SignatureValid": "<bool>"
}
```

--------------------------------

### IPFS Kubo RPC API: Key Generation

Source: https://docs.ipfs.tech/reference/kubo/rpc

Details the `/api/v0/key/gen` endpoint for the IPFS Kubo RPC API, used to generate new cryptographic key pairs for use with IPFS. This is essential for creating new identities.

```HTTP
POST /api/v0/key/gen
```

--------------------------------

### ClojureScript IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Lists the 'district0x/cljs-ipfs-http-client' library for ClojureScript projects to access the Kubo IPFS RPC API. This client is Inactive.

```ClojureScript
district0x/cljs-ipfs-http-client
```

--------------------------------

### IPFS Immutability: Basic DAG Structure

Source: https://docs.ipfs.tech/concepts/immutability

Illustrates a basic Directed Acyclic Graph (DAG) structure in IPFS, showing two leaf nodes (A and B) containing 'hello' and 'world' respectively. These nodes are joined to form a root node C, with a 'Pointer' referencing C. This represents immutable data blocks.

```text
   +-----------+
|  Pointer  |
+-----------+         ↓
      +-----+
   +--|  C  |-+
   |  +-----+ |
   |          |
+-----+    +-----+
|  A  |    |  B  |
+-----+    +-----+
"hello"    "world"
```

--------------------------------

### IPFS Native Protocol Addressing

Source: https://docs.ipfs.tech/how-to/address-ipfs-on-web

Shows how to address IPFS content using native protocol handlers, avoiding hard-coded HTTP gateways. This format uses 'ipfs://' or 'ipns://' followed by the CID or IPNS name and the path.

```IPFS
ipfs://<cid>/<path>
```

```IPNS
ipns://<ipns-name>/<path>
```

--------------------------------

### Find an IPFS Peer on the Network

Source: https://docs.ipfs.tech/how-to/observe-peers

This command searches the IPFS network for a specific peer identified by its Peer ID. It helps locate peers even if you don't have a direct connection or multiaddress.

```bash
> ipfs routing findpeer QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
```

--------------------------------

### Kademlia Routing Table Structure

Source: https://docs.ipfs.tech/concepts/dht

Details how the Kademlia algorithm manages its routing table to cope with network instability. It explains the concept of keeping multiple links for each distance increment (e.g., 1, 2, 4, 8) up to a parameter K, which in IPFS is set to 20.

```Markdown
Instead of a peer keeping a single link 128 away, it would keep 20 links that are between 65 and 128 away. In IPFS `K = 20`.
```

--------------------------------

### Transcode Multibase String (IPFS API)

Source: https://docs.ipfs.tech/reference/kubo/rpc

Transcodes a multibase string between different bases. Allows specifying the target multibase encoding, defaulting to 'base64url'. The input string should be provided in the request body as 'multipart/form-data'. The response is a plain text body.

```bash
curl -X POST -F file=@myfile "http://127.0.0.1:5001/api/v0/multibase/transcode?b=base64url"

```

--------------------------------

### JS-IPFS: Legacy JavaScript IPFS Implementation

Source: https://docs.ipfs.tech/concepts/glossary

JS-IPFS is a legacy implementation of IPFS written in JavaScript. It is now deprecated and has been superseded by Helia.

```javascript
// This is a legacy implementation and is deprecated.
// Use Helia instead.
// import { create } from 'ipfs-core'
// const ipfs = await create()
// console.log('IPFS node created (legacy)')
```

--------------------------------

### IPFS Key Sign Response Structure

Source: https://docs.ipfs.tech/reference/kubo/rpc

The response structure for the /api/v0/key/sign endpoint, detailing the key information and the generated signature.

```json
{
  "Key": {
    "Id": "<string>",
    "Name": "<string>"
  },
  "Signature": "<string>"
}
```

--------------------------------

### Convert CID v0 to v1 using JavaScript

Source: https://docs.ipfs.tech/concepts/content-addressing

This JavaScript code snippet shows how to convert an IPFS CID from version 0 to version 1 using the `toV1()` method from the `multiformats` library. It includes parsing a v0 CID and converting it to its v1 string representation.

```javascript
const v0 = CID.parse('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
v0.toString()
//> 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n'
v0.toV1().toString()
//> 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku'

```

--------------------------------

### Elixir IPFS RPC Client

Source: https://docs.ipfs.tech/reference/kubo-rpc-cli

Features the 'bahner/ex-ipfs' library for Elixir applications to connect with the Kubo IPFS RPC API. This client is Active.

```Elixir
bahner/ex-ipfs
```

--------------------------------

### Configure API via Unix Socket

Source: https://docs.ipfs.tech/reference/kubo/cli

Sets the IPFS RPC API to be exposed over a Unix socket, which can be more secure than exposing it over TCP/IP, especially when only using the CLI client.

```bash
ipfs config Addresses.API /unix/var/run/kubo.socket
```

--------------------------------

### IPFS: Content-Addressed, Versioned, P2P File System White Paper

Source: https://docs.ipfs.tech/concepts/further-reading/academic-papers

The original white paper for IPFS, authored by Juan Benet. It describes IPFS as a peer-to-peer distributed file system connecting computing devices, functioning like a single BitTorrent swarm exchanging objects within a Git repository. It highlights IPFS's high-throughput content-addressed block storage model with content-addressed hyperlinks, forming a generalized Merkle DAG.

```text
IPFS - Content Addressed, Versioned, P2P File System
Original IPFS white paper
Benet, Juan : The InterPlanetary File System (IPFS) is a peer-to-peer distributed ﬁle system that seeks to connect all computing devices with the same system of files. In some ways, IPFS is similar to the Web, but IPFS could be seen as a single BitTorrent swarm, exchanging objects within one Git repository. In other words, IPFS provides a high throughput content-addressed block storage model, with content-addressed hyperlinks. This forms a generalized Merkle DAG, a data structure upon which one can build versioned ﬁle systems, blockchains, and even a Permanent Web. IPFS combines a distributed hashtable, an incentivized block exchange, and a self-certifying namespace. IPFS has no single point of failure, and nodes do not need to trust each other.
```

--------------------------------

### Verify Objects in Filestore

Source: https://docs.ipfs.tech/reference/kubo/rpc

Verifies the integrity of objects within the IPFS filestore. It allows for optional verification based on file order and removal of corrupted blocks, with a warning about potential data loss.

```bash
curl -X POST "http://127.0.0.1:5001/api/v0/filestore/verify?arg=<obj>&file-order=<value>&remove-bad-blocks=<value>"
```

--------------------------------

### IPFS Pin Remote Service List

Source: https://docs.ipfs.tech/reference/kubo/cli

Lists configured remote pinning services. Optionally, it can fetch and display the current pin count statistics (queued, pinning, pinned, failed) for each service by using the '--stat' flag.

```bash
ipfs pin remote service ls
ipfs pin remote service ls --stat
```

--------------------------------

### IPFS Name PubSub Management

Source: https://docs.ipfs.tech/reference/kubo/cli

Manages and inspects the state of the IPNS pubsub resolver. This command is experimental and subject to change. It allows for managing name subscriptions within IPNS.

```bash
ipfs name pubsub
```

--------------------------------

### IPFS Config Profile: Local Discovery

Source: https://docs.ipfs.tech/reference/kubo/cli

Sets default values for server-affected fields and enables discovery in local networks. This profile is useful for optimizing IPFS node behavior within a local network environment.

```bash
ipfs config profile apply local-discovery
```