---
layout: post
title: How the Internet Works (And Why HTTPS is Better)
date: 2022-02-14 00.00.00 -0400
categories: group-b
tags: [web development, web security, cryptography]
current_page: lessons
code_editor: false
---

This is the first article of a series. The second article, "Introduction to Cryptography", can be found [here](https://woodlands.codes/group-b/2022/02/14/group-b-lesson-10.html){:target="_blank"}.

## Web Protocols

Websites. You probably use them every day. You're on a website right now!

Your web browser uses various *protocols* to load webpages. It uses the Domain Name System (DNS) protocol to convert the webpage's domain name, [`https://woodlands.codes/`](https://woodlands.codes/){:target="_blank"}, into an IP address (`192.0.2.1`).

### TCP/IP

An Internet Protocol address, or **IP address**, is a label assigned to any computer using the Internet Protocol. IP is used in conjunction with **Transmission Control Protocol (TCP)** to form the *Internet protocol suite*, which specifies how data is communicated. This determines how packets of data should be transmitted, routed, and checked for errors.

<img src="/assets/img/group-b/lesson-9/packet.png" alt="" class="img-transparency">

{: style="text-align: center" }
*An example of a packet sent over TCP/IP.*

IPv4 is a 32-bit address, which is typically represented in dot-decimal notation. The format is:

`[0-255].[0-255].[0-255].[0-255]`

Which of the following IP addresses are valid?
1. `153.416.139.227`
2. `253.123.31.14`
3. `192.135.244`
4. `67.162.12.51`

### Domain Name System (DNS)

As previously mentioned, the **domain name system (DNS)** assigns domain names. Domain names are designed to be easy to remember. Instead of having to type in a 32-bit number, you can type in a domain name. The format is:

```subdomain.second-level-domain.top-level-domain```

There is a restricted list of possible top level domains (TLDs). These are short, for example ".com", ".net", ".org". A list of TLDs can be found [here](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains){:target="_blank"}. The top level domain of this website is ".codes".

The second level domain is unique to whoever registered it. For example, the second level domain of this website is "woodlands". The second level domain of Wikipedia is "wikipedia".

The subdomain, also known as the third level domain, is an additional part of the website. It is often used for unrelated content or alternate versions of a site, such as different languages or mobile versions. For example, the English language Wikipedia uses the subdomain "en", the French language Wikipedia uses the subdomain "fr", and the mobile version of Wikipedia uses the subdomain 'm'. Almost every website on the internet also uses the "www" subdomain.

To convert the domain name to an IP address, first your browser's local cache is checked. This stores recently or commonly used websites. Then your ISP's cache is checked. Lastly, a domain name server is checked.

### Uniform Resource Locator (URL)

A URL, also known as a web address, references a specific web resource on a page. In the following URL:

`http://www.example.com/index.html`

There is a protocol `HTTP`, a domain name `www.example.com`, and a file name or path `index.html`. This website's URL is:

`https://woodlands.codes/group-b/2022/02/14/group-b-lesson-9.html`

The protocol used is `HTTPS`, the domain name is `woodlands.codes`, and the path is `group-b/2022/02/14/group-b-lesson-9.html`.

### Hypertext Transfer Protocol (HTTP)

HTTP is used by your web browser to fetch the resources of a web page. It determines how data is communicated across the **World Wide Web**, a system accessible over the Internet. The internet uses TCP/IP, but not necessarily HTTP, as it can be used for non-web resources such as electronic mail or file sharing.

Every time you load a page, your web browser sends **HTTP requests** to the website. The host computer sends back content and metadata. This uses the internet, and therefore these HTTP requests are sent in IP packets. HTTP is built *on top* of the TCP/IP protocols.

## Web Security

You are constantly sending personal information over the internet. This can be anything from your real name to your password to your banking information. Websites may also make requests for your geolocation, microphone, and webcam. Since these are all personally identifiable, browsers typically ask the user if they will allow the request. But what happens if security breaches occur? Highly valuable information can be stolen.

<img src="/assets/img/group-b/lesson-9/celltower.png" alt="" class="post-img-large img-transparency">

{: style="text-align: center" }
*Cell towers are used to triangulate your location.*

It is important that commonly used protocols are secure and resist attackers who try to intercept data. Cybersecurity company Mimecast states: "The web and the use of DNS services specifically are part of 91% of all malware attacks, and email and web together are a key part for 99% of successful breaches." Funnily enough, [Mimecast themselves were hacked](https://threatpost.com/mimecast-certificate-microsoft-supply-chain-attack/162965/){:target="_blank"}, allowing cyberattackers to take over their incoming and outcoming email. Not so easy, is it?

### Vulnerability Examples

#### Phishing

The weak link of data vulnerability is often **the user**. For example:

<img src="/assets/img/group-b/lesson-9/phishing.png" alt="" class="post-img-large img-transparency">

{: style="text-align: center" }
*Example from Khan Academy.*

Is it safe to log in? *No!* This is an example of a *phishing* attack, an attack in which an attacker sends a fraudulent message that looks real. Users may be tricked into entering their information into a website that is completely different from the one they intended to visit.

Similarly, users may have their information stolen through malware such as *keyloggers* that record keyboard input to steal passwords.

#### Data Breaches

On the other hand, companies with poor web security run the risk of leaking the data of all their users. For example, data breaches may occur due to application vulerabilities and backdoors. Attacks such as SQL injection can be used by cybercriminals to access confidential data and leak passwords.

Furthermore, storing data unsecurely is a large risk. For example, if a large company stores all of their users' passwords as plain text, then a data breach could leak every single password! This is extremely dangerous, as if your password is leaked, it can be used to log in to your other accounts.

For this reason, passwords should be *hashed*, transforming the password into another string. It is impossible to reverse the hash, and if the hashed password is leaked, the user's original password is not revealed. Hash functions are *cryptographic* functions, meaning they allow secure communication.

<img src="/assets/img/group-b/lesson-9/hashfunction.png" alt="" class="post-img-large img-transparency">

{: style="text-align: center" }
*Notice how a small change to the input produces a completely different output.*

Websites like [have i been pwned](https://haveibeenpwned.com/){:target="_blank"} can show you which data breaches you've been involved in. Chances are, your email address and password have been involved in at least one data breach! This is why you shouldn't reuse the same password for multiple services. If you can't remember multiple passwords, a password manager is a secure solution.

### Why HTTPS is Better (TLS)

To prevent eavesdropping, most websites use a cryptographic protocol called **Transport Layer Security (TLS)**. TLS is built on top of TCP/IP. The client performs a "three-way handshake" to establish the TCP connection.

<img src="/assets/img/group-b/lesson-9/TCP handshake.svg" alt="" class="post-img-large img-transparency">

The server then sends the client a *public key*, which the client can use to encrypt data. The server can then decrypt this data using a *private key*. The public key is known to both the server and client. The private key is known to only the server and no one else.

HTTP Secure, also known as **HTTPS** or **HTTP over TLS**, encrypts HTTP requests and responses using the TLS protocol. This provides three main security benefits:

1. **Authentication.** Due to the TLS handshake, each party knows that the other party is who they claim to be.
2. **Encryption.** If data is somehow intercepted, the attacker will only have access to the encrypted data.
3. **Integrity.** Due to the encryption, transmission, and decryption process, the user will be sure that the data was not tampered with, modified, or lost.

<img src="/assets/img/group-b/lesson-9/https.png" alt="" class="post-img-large img-transparency">

## What is Cryptography?

So now we know all about how the internet works and what good web security looks like! But what's actually happening when data is encrypted? How is it possible that data can be delivered in a format inaccessible to attackers, but accessible to the end user?

These are the central questions of a field called *cryptography*, the study of secure communication techniques. Cryptography is a rich and complex field. Read about cryptography in our [next post!](https://woodlands.codes/group-b/2022/02/14/group-b-lesson-10.html){:target="_blank"}