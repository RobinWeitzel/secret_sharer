### Use case
This will be a website used to store secrets in a secure way in two different physical locations.
For example, a user might want to leave the passwords to their bank accounts with family members in case they are unavailable or incapacitated. However, just printing out the passwords directly poses a significant risk as anyone who finds the paper could access the accounts.
This website splits the secrets into two parts (to be printed on two pieces of paper). One is placed in the families house while the other is kept at the users house. Without both parts the passwords are unsuable.

### High level implementation 
To do that securely the idea is that one paper contains the encrypted passwords while another contains the decrpytion key.
Each paper contains a QR code as well as instructions.
The user scans on QR code which leads them to a website, the website asks the user to scan the second code.
After scanning both codes the user is asked to enter a security code (that is printed on both pages but as text, not a QR code). The security code is then appended to the key and that combined key is used to decrypt the data. 

The website itself is purely client-side and has no backend, all the relevant data is stored in the QR codes.
Each QR code contains the URL and the data as a URL fragment (either decryption key or data). The website detect which one was provided by the first QR code and then requests the second one.

The site should have two functions:
- decrypting secrets (this is reached by scanning the first QR code or you can also click there and be prompted to scan the first code)
- encrypting secrets (here the two QR codes are generated. The user then has the option to print both QR codes. The pages that are printed should also contain user instructions so that people not very knowledgeable about technology still understand what they need to do).

The site needs to work for both mobile and desktop.

### Technical details
The website should use tailwindcss for styling and Typescript, HTML and CSS for the code.
It will be hosted on GitHub pages.
For developing it should be possible to run a local dev server.

For the encryption a symmetric state-of-the-art encryption method should be used.

The security code should be an 8 character string made up of numbers and upper and lower case characters as well as special characters. It must contain all of those. Use browser-native Web Crypto API with proper cryptographic practices (rejection sampling to avoid modulo bias) rather than naive implementations.

Consideration should also be given about the max payload size of URL fragment.
A possible solution could be to first compress the secrets before encrypting them (and then decompress them again after decryption).

For coding follow modern best practices:
- separation of concern and single reposibility
- keep files and methods small and easy to read
- keep thing concise and only as complex as neccecary
- avoido not write comments, the code should be self-documenting

Never run the dev server, just build the project to make sure that works. The user will run the dev server and do the additional verification.