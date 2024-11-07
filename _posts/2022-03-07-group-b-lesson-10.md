---
layout: post
title: Introduction to Cryptography
date: 2022-02-14 00.00.00 -0400
categories: group-b
tags: [web security, cryptography, rsa]
current_page: lessons
code_editor: false
---

This is the second article of a series. The first article, "How the Internet Works (And Why HTTPS is Better)", can be found [here](https://woodlands.codes/group-b/2022/02/14/group-b-lesson-9.html){:target="_blank"}.

## What is Encryption?

Encryption is the process of encoding information with some algorithm. The resulting *ciphertext* can only be decoded, or *decrypted* into *plaintext* by authorized parties. If you don't know how to reverse the algorithm, it should be almost impossible to attack using just the ciphertext. For example:

`V ORG LBH UNIR AB JNL GB ERNQ GUVF. GUVF VF NJRFBZR!`

This text is impossible to understand unless you *know* how to decrypt it. This algorithm was used by Julius Caesar, and is called a *Caesar cipher*. A Caesar cipher shifts each letter with a letter some fixed number of positions down the alphabet. For example, a Caesar cipher right 2 would replace `A` with `C` and `F` with `H`.

{% highlight py %}
def func_name(parameters):
def caesar_cipher(plain_text, key):
    encrypted = ""
    for c in plain_text:
        # This cipher only works on uppercase letters!
        if c.isupper():
            # Get unicode of letter, e.g. 'A' = 65, 'B' = 66
            c_index = ord(c) - ord('A')
            # Shift the current character by key positions
            c_shifted = (c_index + key) % 26 + ord('A')
            c_new = chr(c_shifted)
            encrypted += c_new
        else:
            encrypted += c
    return encrypted

# Test with plaintext and key
text = "V ORG LBH UNIR AB JNL GB ERNQ GUVF. GUVF VF NJRFBZR"
key = 13
print(caesar_cipher(text, key))
{% endhighlight %}

This particular text is encrypted using ROT13, which is a shift of 13. Try looking it up online and decoding it! To reverse the cipher, it can be applied again with (26 - key). Luckily for us, (26 - 13) = 13, therefore ROT13 decrypts itself.

The [Vigenère cipher](https://www.boxentriq.com/code-breaking/vigenere-cipher){:target="_blank"} is a more complex cipher, using a series of Caesar Ciphers. Given a key like `BCD`, the cipher would shift every first letter by one, every second letter by two, and every third letter by three!

For a fun cryptography exercise, try coding it and sending messages to your friends!

<img src="/assets/img/group-b/lesson-10/enigma.png" alt="" class="post-img-large img-transparency">

Alan Turing potentially saved millions of lives due to his knowledge of encryption. Pictured is the *Enigma machine* used by the Nazis in World War II. It was considered so secure by the Nazis that they used it to encipher top-secret messages. It used a complex mapping of the 26 letters that changed daily. However, its major flaw was that a letter could never become itself. For example, a "P" would never be encoded as a "P". Turing used detailed information analysis and a few clever guesses to crack the cipher.

So pay attention to cryptography. It can save your life---or destroy it.

Recommended Reading: [Vigenère Cipher (Wikipedia)](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher){:target="_blank"}, [List of Ciphertexts (Wikipedia)](https://en.wikipedia.org/wiki/List_of_ciphertexts:target="_blank"}).

<iframe width="672" height="378" src="https://www.youtube.com/embed/G2_Q9FoD-oQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Symmetric-Key Encryption

In symmetric-key encryption, the sender and the reciever share a *secret key* that allows them to encrypt and decrypt information.
The same key is used to encrypt and decrypt messages. Therefore the key must be kept secret, and if it is revealed then the security of the information is lost. Therefore the key shouldn't be too short and shouldn't be easily attacked.

**AES (Advanced Encryption Standard)** is one example used by the U.S. government.

### Public-Key Encryption

In public-key encryption, the decryption key, `D`, is different from the encryption key, `E`.
`D` is private and difficult to compute, whereas `E` is publicly known. You can encrypt and send a message to someone using their public key `E`. Only they can decrypt it using their private key, `D`. Most encryption used from day to day is this type. Since the security of messages depends on `D` being secret, it should be very diffifult to calculate.

<img src="/assets/img/group-b/lesson-10/publickey.png" alt="" class="img-transparency">

### Some Problems...

Here are two questions. Don't scroll down to the answer before giving it some thought.

For computers, is `1793171x6339149` easy or hard?

Don't consider whether or not you can calculate it by hand, but by whether computers are good at these problems.

For computers, is `Factor 11367178151479` easy or hard?

The answer is that the first question, multiplication, is relatively easy. The best algorithms run in *polynomial* time. The second question, prime factorization, is relatively hard. The best algorithms run in *sub-exponential* time. Sub-exponential time is much worse than polynomial time. Remember, 100<sup>2</sup> = 10000, but 2<sup>100</sup> = 1.27x10<sup>30</sup>.

And the most interesting thing? These two questions are *the same question!*

`1793171x6339149 = 11367178151479`

So here we have a question that's hard to do one way, but easy to do the other. This "one-way" property can be used for encryption. However, it's possible that one-way functions don't exist, and we just haven't found the best algorithms yet. (Those of us who are curious can research the P vs NP problem.)

**Here's the idea: Encrypt messages with a number, then decrypt them with its factorization.**

Recommended Reading: [Public-key cryptography (Wikipedia)](https://en.wikipedia.org/wiki/Public-key_cryptography){:target="_blank"}.

<iframe width="672" height="378" src="https://www.youtube.com/embed/YX40hbAHx3s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## RSA

<img src="/assets/img/group-b/lesson-10/rsa.png" alt="" class="img-transparency">

RSA is an asymmetric public-private key cryptosystem created in 1977. It's named after three MIT students. It's still widely used for secure communication and encryption. The algorithm relies on the difficulty of factoring. If a fast factoring algorithm is found, the security of RSA is compromised! Let's take a look at how it functions.

### RSA Procedure

1. Choose two distinct primes, p and q. These numbers should be *huge*.
    * p = 61, q = 89 (small for example)
2. Compute n = pq.
    * n = 5429
3. Compute totient: (p - 1, q - 1).
    * 60*88 = 5280, could also use LCM(60, 88) = 1320
4. Choose an integer e such that 1 < e < λ(n) and e and n are coprime.
    * e = 349
5. Determine d, such that de = 1 + x*λ(n)
    * 469 * 349 = 163681 = 1 + 31 * 5280, d = 469
6. Release (n, e) as public key, which is used to encrypt messages.
7. Keep d secret, which is used to decrypt messages.

**Public:** (n = 5429, e = 349)

**Private:** d = 469

### RSA Example

**Encryption:**
Bob gives n and e to Alice. Alice turns her message into numbers with an agreed-upon method
(a = 01, b = 02, c = 03… z = 26)
The encoded text = text<sup>e</sup> mod n

**Decryption:**
For Bob to decrypt Alice's message, he’ll do:
text = encoded text<sup>d</sup> mod n
d is his private key, only he can decrypt Alice's message.

<img src="/assets/img/group-b/lesson-10/message.png" alt="" class="img-transparency">

## Summary

The series of two articles has covered:
* Internet protocol such as TCP/IP, used to send packets of information
* Domain Name System (DNS) to assign domain names
* Hypertext Transfer Protocol (HTTP) used to fetch resources of a web page
* The importance of web security
* Vulnerabilities such as phishing and data breaches
* Why HTTPS is better: Transport Layer Security (TLS)
* Introduction to cryptography
* Caesar cipher, Vigenère cipher
* Symmetric-Key Encryption: same secret key
* Public-Key Encryption: separate decryption key and encryption key
* "One-way" functions
* RSA Procedure

Now we know why HTTPS is better: It uses TLS! We are currently on TLS 1.3, which does not use RSA, but uses a similar combination of symmetric-key and public-key cryptography systems. Now your data is safe!

And remember kids... don't trust those HTTP websites.

`20 08 05 05 14 04`

`Tiit Vjgfnfrf cjpies it a ciu ocvjovs.`

`GUVF EBG13 VF NYFB BOIVBHF, CEBONOYL ORPNHFR VG'F NYY HCCREPNFR`

{: style="color:rgb(10,10,10)" }
Hope you enjoyed the series!