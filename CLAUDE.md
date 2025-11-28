### Use case
This will be a website used to store secrets in a secure way in two different physical locations.
For example, a user might want to leave the passwords to their bank accounts with family members in case they are unavailable or incapacitated. However, just printing out the passwords directly poses a significant risk as anyone who finds the paper could access the accounts.
This website splits the secrets into two parts (to be printed on two pieces of paper). One is placed in the families house while the other is kept at the users house. Without both parts the passwords are unsuable.

### High level implementation 
To do that securely the idea is that one paper contains the encrypted passwords while another contains the decrpytion key.
Each paper contains a QR code as well as instructions.
The user scans on QR code which leads them to a website, the website asks the user to scan the second code and once both codes are scanned the site shows the decrypted secrets.

The website itself is purely client-side and has no backend, all the relevant data is stored in the QR codes.
Each QR code contains the URL and the data as a query param (either decryption key or data). The website detect which one was provided by the first QR code and then requests the second one.

The site should have two functions:
- decrypting secrets (this is reached by scanning the first QR code or you can also click there and be prompted to scan the first code)
- encrypting secrets (here the two QR codes are generated. The user then has the option to print both QR codes. The pages that are printed should also contain user instructions so that people not very knowledgeable about technology still understand what they need to do).

The site needs to work for both mobile and desktop.

### Technical details
The website should use tailwindcss for styling and Typescript for the code.
It will be hosted on GitHub pages (under https://robinweitzel.de/secret_sharer).
For developing it should be possible to run a local dev server.

For the encryption a symmetric state-of-the-art encryption method should be used.

Consideration should also be given about the max payload size of query parameters.
A possible solution could be to first compress the secrets before encrypting them (and then decompress them again after decryption).

For coding follow modern best practices:
- separation of concern and single reposibility
- keep files and methods small and easy to read
- keep thing concise and only as complex as neccecary
- avoido not write comments, the code should be self-documenting

Never run the dev server, just build the project to make sure that works. The user will run the dev server and do the additional verification.