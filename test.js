import fs from 'fs';
const loginCode = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

if (loginCode.includes("investidor@flechabsb.com")) {
    console.log("Investidor ok in code.");
}
if (loginCode.includes("juridico@flechabsb.com")) {
    console.log("Juridico ok in code.");
}

console.log(loginCode.slice(loginCode.indexOf('validCredentials'), loginCode.indexOf('};', loginCode.indexOf('validCredentials')) + 2));
