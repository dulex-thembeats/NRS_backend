const fs = require('fs');
const path = require('path');

const filesToFix = [
  path.join(__dirname, 'generated', 'prisma', 'index.js'),
  path.join(__dirname, 'generated', 'prisma', 'index.d.ts')
];

for (const file of filesToFix) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace names
    content = content.replace(/ClientApiCredential/g, 'TenantApiCredential');
    content = content.replace(/clientApiCredential/g, 'tenantApiCredential');
    content = content.replace(/ClientApiLog/g, 'TenantApiLog');
    content = content.replace(/clientApiLog/g, 'tenantApiLog');
    
    // In index.d.ts there might be literal 'CLIENT' for roles
    content = content.replace(/'CLIENT'/g, "'TENANT'");
    content = content.replace(/"CLIENT"/g, '"TENANT"');
    
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  } else {
    console.log(`${file} does not exist`);
  }
}
