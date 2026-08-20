import fs from 'fs';
let loginCode = fs.readFileSync('src/components/auth/SecureLogin.tsx', 'utf8');

// The issue is an unbalanced </div> tags!
// I replaced a block earlier and might have deleted or added an extra </div>.
// Looking at:
//           </p>
//        </div>  <--- This closes the Left Panel!
// 
//        <div className="space-y-4"> <--- But this is inside the Left Panel!
//
// The error TS1005: ')' expected, TS1128, etc. are caused by unmatched HTML tags.

loginCode = loginCode.replace(
  / Segurança para negociar\.\n              <\/p>\n           <\/div>\n\n           <div className="space-y-4">/,
  ` Segurança para negociar.
              </p>

           <div className="space-y-4">`
);

fs.writeFileSync('src/components/auth/SecureLogin.tsx', loginCode);
