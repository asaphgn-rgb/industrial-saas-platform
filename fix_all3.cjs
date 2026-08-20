const fs = require('fs');

function fix(file) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Convert anything that looks like accessing properties on 'order' which was inferred as 'never'
    code = code.replace(/order\.quantity_produced/g, '(order as any).quantity_produced');
    code = code.replace(/order\.quantity_planned/g, '(order as any).quantity_planned');
    code = code.replace(/order\.quantity_scrap/g, '(order as any).quantity_scrap');
    
    // Adjust if they use 'produced_quantity' instead (as seen in the recent error)
    code = code.replace(/order\.produced_quantity/g, '(order as any).produced_quantity');
    code = code.replace(/order\.planned_quantity/g, '(order as any).planned_quantity');
    code = code.replace(/order\.scrap_quantity/g, '(order as any).scrap_quantity');
    
    fs.writeFileSync(file, code);
}

fix('src/services/industrial-mes.service.ts');
